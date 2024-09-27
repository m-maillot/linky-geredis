import axios from 'axios';
import ora from 'ora';
import qs from 'qs';
import { APIError, type AveragePowerResponse, type EnergyResponse, type MaxPowerResponse } from '../lib/index.js';
import type { ConsommationsJournaliere2, GeredisApiResponse, PointDaccessResponse } from './GeredisApiResponse.js';

type AuthenticationReturn = { code: string; libelle: string };

type BearerResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string;
  refresh_token: string;
};

enum MeasureType {
  MAX_PROWER = 4,
  CONSUMPTION = 2,
}

export class LinkyGeredisAPI {
  private API_HOST = 'https://espace-client.linkygeredis.fr';
  private user = '';
  private password = '';

  constructor(private puser: string, private ppassword: string) {
    this.user = puser;
    this.password = ppassword;
  }

  async getLoadCurve(start: string, end: string): Promise<AveragePowerResponse> {
    const bearer = await this.generateBearer();
    const accessPointId = await this.getPointAccesServicesClientId(bearer);
    const measure = await this.getMeasures(bearer, accessPointId, start, end, MeasureType.CONSUMPTION);
    const convertDate = (date: string, heure: string): string => {
      const dateSplit = date.split('/');
      return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]} ${heure}:00`;
    };
    return {
      reading_type: { aggregate: 'average', measurement_kind: 'power', unit: 'W' },
      end: measure.periodesActivite[0].dateDebut,
      interval_reading: measure.periodesActivite[0].blocFournisseur.postesHorosaisonnier[0].consommationsJournalieres
        .map((item) =>
          item.consommation
            ? {
                value: `${item.consommation ?? ''}`,
                date: convertDate(item.date, '04:00'),
              }
            : undefined
        )
        .filter((item) => item !== undefined)
        .concat(
          measure.periodesActivite[0].blocFournisseur.postesHorosaisonnier[1].consommationsJournalieres
            .map((item) =>
              item.consommation
                ? {
                    value: `${item.consommation ?? ''}`,
                    date: convertDate(item.date, '12:00'),
                  }
                : undefined
            )
            .filter((item) => item !== undefined)
        ),
      quality: '',
      start: measure.periodesActivite[0].dateFin ?? start,
      usage_point_id: measure.referencePds,
    };
  }

  async getDailyConsumption(start: string, end: string): Promise<EnergyResponse> {
    const bearer = await this.generateBearer();
    const accessPointId = await this.getPointAccesServicesClientId(bearer);
    const measure = await this.getMeasures(bearer, accessPointId, start, end, MeasureType.CONSUMPTION);
    const convertDate = (date: string): string => {
      const dateSplit = date.split('/');
      return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
    };
    const mergeConso = (
      consoHP: ConsommationsJournaliere2[],
      consoHC: ConsommationsJournaliere2[]
    ): Array<{
      value: string;
      date: string;
    }> => {
      return consoHC
        .map((item) => {
          const hp = consoHP.find((hp) => hp.date === item.date);
          if (hp && hp.consommation && item.consommation) {
            return {
              date: convertDate(item.date),
              value: `${item.consommation + hp.consommation}`,
            };
          }
          return undefined;
        })
        .filter((item) => item !== undefined);
    };
    return {
      end: measure.periodesActivite[0].dateDebut,
      interval_reading: mergeConso(
        measure.periodesActivite[0].blocFournisseur.postesHorosaisonnier[1].consommationsJournalieres,
        measure.periodesActivite[0].blocFournisseur.postesHorosaisonnier[0].consommationsJournalieres
      ),
      quality: '',
      reading_type: { aggregate: 'sum', measurement_kind: 'energy', measuring_period: 'P1D', unit: 'Wh' },
      start: measure.periodesActivite[0].dateFin ?? start,
      usage_point_id: measure.referencePds,
    };
  }

  async getMaxPower(start: string, end: string): Promise<MaxPowerResponse> {
    const bearer = await this.generateBearer();
    const accessPointId = await this.getPointAccesServicesClientId(bearer);
    const measure = await this.getMeasures(bearer, accessPointId, start, end, MeasureType.MAX_PROWER);
    const convertDate = (date: string, heure: string): string => {
      const dateSplit = date.split('/');
      return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]} ${heure}:00`;
    };
    return {
      end: measure.periodesActivite[0].dateDebut,
      interval_reading: measure.periodesActivite[0].puissancesMaximales.puissancesJournalieres.map((item) => ({
        value: `${item.puissanceMaximale}`,
        date: convertDate(item.dateMesure, item.heure),
      })),
      quality: '',
      reading_type: { aggregate: 'maximum', measurement_kind: 'power', measuring_period: 'P1D', unit: 'VA' },
      start: measure.periodesActivite[0].dateFin ?? start,
      usage_point_id: measure.referencePds,
    };
  }

  async generateBearer(): Promise<string> {
    const cookie = await this.extractCookie();
    ora().info(`Cookie retrieved`);
    const code = await this.getCode(cookie);
    ora().info(`Code retrieved`);
    const bearer = await this.getBearer(code);
    ora().info(`Bearer retrieved`);
    return bearer;
  }

  private async extractCookie(): Promise<string> {
    const cookieUrl = `${this.API_HOST}/application/auth/externe/authentification`;

    return await axios
      .post<AuthenticationReturn>(
        cookieUrl,
        qs.stringify({
          username: this.user,
          password: this.password,
          client_id: 'aelGRD',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
        }
      )
      .then((res) => {
        if (res.status === 200 && res.data.libelle === 'valide') {
          const cookies =
            res.headers['set-cookie'] && res.headers['set-cookie'].length > 0
              ? res.headers['set-cookie'][0].split(';')
              : [];
          const cookie = cookies.find((cookie) => cookie.startsWith('cookieOauth'));
          if (cookie) {
            return cookie;
          }
        }
        throw new Error(`Wrong response from authentication : ${JSON.stringify(res)}`);
      })
      .catch((err) => {
        if (err.response) {
          throw new APIError(err, err.response.status, err.response.data);
        }
        if (err.request) {
          throw new Error(`Aucune réponse\nRequête : ` + JSON.stringify(err.request, null, 4));
        }
        throw new Error(`Impossible d'appeler\nErreur : ${err.message}`);
      });
  }

  private async getCode(cookie: string): Promise<string> {
    try {
      const response = await axios.get(`${this.API_HOST}/application/auth/authorize-internet`, {
        params: {
          redirect_uri: 'https://espace-client.linkygeredis.fr/autorisation-callback.html',
          response_type: 'code',
          code_challenge: 'TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84',
          code_challenge_method: 'S256',
          client_id: 'aelGRD',
        },
        headers: {
          Cookie: cookie,
        },
        maxRedirects: 0,
        validateStatus: (status) => status === 303,
      });

      const locationHeader = response.headers['location'];
      const urlParams = new URLSearchParams(locationHeader.split('?')[1]);
      const code = urlParams.get('code');
      if (code) {
        return code;
      }
      throw new Error(`Code absent du header`);
    } catch (err) {
      throw new Error(`Impossible de récupérer le code\nErreur : ${err}`);
    }
  }

  private async getBearer(code: string): Promise<string> {
    try {
      const response = await axios.post<BearerResponse>(
        `${this.API_HOST}/application/auth/tokenUtilisateurInternet`,
        qs.stringify({
          code: code,
          redirect_uri: 'https://espace-client.linkygeredis.fr/autorisation-callback.html',
          grant_type: 'authorization_code',
          code_verifier: 3,
          client_id: 'aelGRD',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
        }
      );

      return response.data.access_token;
    } catch (err) {
      throw new Error(`Impossible de récupérer le bearer\nErreur : ${err}`);
    }
  }

  async getPointAccesServicesClientId(bearer: string): Promise<string> {
    const data = await axios<PointDaccessResponse>({
      method: 'GET',
      url: 'https://espace-client.linkygeredis.fr/application/rest/produits/pointsAccesServicesClient',
      params: {
        expand: 'pointDeService(espaceDeLivraison)',
      },
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
    });
    return data.data[0].id;
  }

  async getMeasures(
    bearer: string,
    accessPointId: string,
    start: string,
    end: string,
    type: MeasureType
  ): Promise<GeredisApiResponse> {
    const measure = await axios<GeredisApiResponse>({
      method: 'POST',
      url: `${this.API_HOST}/application/rest/interfaces/aelgrd/historiqueDeMesure`,
      headers: {
        Authorization: `Bearer ${bearer}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      data: {
        groupesDeGrandeurs: [
          {
            codeGroupeGrandeur: {
              code: `${type}`,
            },
            typeObjet: 'produit.GroupeGrandeur',
          },
        ],
        typeObjet: 'DonneesHistoriqueMesureRepresentation',
        dateDebut: end,
        pointAccesServicesClient: {
          id: accessPointId,
          typeObjet: 'produit.PointAccesServicesClient',
        },
        dateFin: start,
      },
    });
    return measure.data;
  }
}
