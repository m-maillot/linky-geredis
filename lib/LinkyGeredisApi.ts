import { type AveragePowerResponse, type EnergyResponse, type MaxPowerResponse } from './index.js';
import type { ConsommationsJournaliere } from './GeredisApiResponse.js';
import type { Authentication } from './api/Authentication.js';
import { AuthenticationChallenger } from './api/Authentication.js';
import { type Endpoint, EndpointApi, MeasureType } from './api/Endpoint.js';
import { formatLoadCurve } from './formatter.js';
import dayjs from 'dayjs';

export const buildLinkyGeredisApi = (user: string, password: string) => {
  return new AuthenticationChallenger(user, password);
};

export class LinkyGeredisAPI {
  private tokenGenerator: Authentication;
  private endpoint: Endpoint;

  constructor(private generator: Authentication) {
    this.tokenGenerator = generator;
    this.endpoint = new EndpointApi();
  }

  async getLoadCurve(start: string, end: string): Promise<AveragePowerResponse> {
    const bearer = await this.tokenGenerator.generateBearer();
    const accessPointId = await this.endpoint.getPointAccesServicesClientId(bearer);
    const endDate = dayjs();
    const startDate = endDate.add(-1, 'day').set('h', 22).set('m', 1).set('s', 0);
    const measure = await this.endpoint.getMeasures(
      bearer,
      accessPointId,
      startDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
      endDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
      MeasureType.CONSUMPTION
    );
    const result = formatLoadCurve(measure);
    return {
      ...result,
      interval_reading: result.interval_reading.filter(({ date }) => {
        const d = dayjs(date);
        return d.isAfter(dayjs(`${start}T00:00:00`)) && d.isBefore(dayjs(`${end}T00:00:00`));
      }),
    };
  }

  async getDailyConsumption(start: string, end: string): Promise<EnergyResponse> {
    const bearer = await this.tokenGenerator.generateBearer();
    const accessPointId = await this.endpoint.getPointAccesServicesClientId(bearer);
    const measure = await this.endpoint.getMeasures(bearer, accessPointId, start, end, MeasureType.CONSUMPTION);
    const convertDate = (date: string): string => {
      const dateSplit = date.split('/');
      return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
    };
    const mergeConso = (
      consoHP: ConsommationsJournaliere[],
      consoHC: ConsommationsJournaliere[]
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
              value: `${(item.consommation + hp.consommation) * 1000}`,
            };
          }
          return undefined;
        })
        .filter((item) => item !== undefined);
    };
    return {
      end: measure.periodesActivite[0].dateDebut,
      interval_reading: mergeConso(
        measure.periodesActivite[0].blocFournisseur?.postesHorosaisonnier[1].consommationsJournalieres ?? [],
        measure.periodesActivite[0].blocFournisseur?.postesHorosaisonnier[0].consommationsJournalieres ?? []
      ),
      quality: '',
      reading_type: { aggregate: 'sum', measurement_kind: 'energy', measuring_period: 'P1D', unit: 'Wh' },
      start: measure.periodesActivite[0].dateFin ?? start,
      usage_point_id: measure.referencePds,
    };
  }

  async getMaxPower(start: string, end: string): Promise<MaxPowerResponse> {
    const bearer = await this.tokenGenerator.generateBearer();
    const accessPointId = await this.endpoint.getPointAccesServicesClientId(bearer);
    const measure = await this.endpoint.getMeasures(bearer, accessPointId, start, end, MeasureType.MAX_POWER);
    const convertDate = (date: string, heure: string): string => {
      const dateSplit = date.split('/');
      return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]} ${heure}:00`;
    };
    return {
      end: measure.periodesActivite[0].dateDebut,
      interval_reading:
        measure.periodesActivite[0].puissancesMaximales?.puissancesJournalieres.map((item) => ({
          value: `${item.puissanceMaximale}`,
          date: convertDate(item.dateMesure, item.heure),
        })) ?? [],
      quality: '',
      reading_type: { aggregate: 'maximum', measurement_kind: 'power', measuring_period: 'P1D', unit: 'VA' },
      start: measure.periodesActivite[0].dateFin ?? start,
      usage_point_id: measure.referencePds,
    };
  }
}
