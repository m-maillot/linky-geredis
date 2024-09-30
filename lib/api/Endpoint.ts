import type { GeredisApiResponse, PointDaccessResponse } from '../GeredisApiResponse.js';
import axios from 'axios';

export enum MeasureType {
  MAX_POWER = 4,
  CONSUMPTION = 2,
}

export interface Endpoint {
  getPointAccesServicesClientId(bearer: string): Promise<string>;

  getMeasures(
    bearer: string,
    accessPointId: string,
    start: string,
    end: string,
    type: MeasureType
  ): Promise<GeredisApiResponse>;
}

export class EndpointApi implements Endpoint {
  private API_HOST = 'https://espace-client.linkygeredis.fr';

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
