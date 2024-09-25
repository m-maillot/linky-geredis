import { AxiosError } from 'axios';
import { LinkyGeredisAPI } from './LinkyGeredisApi.js';

export type APIResponse = {
  usage_point_id: string;
  start: string;
  end: string;
  quality: string;
  interval_reading: Array<{ value: string; date: string }>;
  reading_type: {
    unit: string;
    measurement_kind: string;
    aggregate: string;
    measuring_period?: string;
  };
};

export class APIError extends Error {
  constructor(public err: AxiosError, public code: string, public response: any) {
    super('Conso API a répondu avec une erreur');
  }

  toString() {
    return (
      `Conso API a répondu avec une erreur\nCode: ${this.code}\nRéponse : ` + JSON.stringify(this.response, null, 4)
    );
  }
}

export type EnergyResponse = APIResponse & {
  reading_type: {
    unit: 'Wh';
    measurement_kind: 'energy';
    aggregate: 'sum';
    measuring_period: 'P1D';
  };
};

export type AveragePowerResponse = APIResponse & {
  reading_type: {
    unit: 'W';
    measurement_kind: 'power';
    aggregate: 'average';
  };
};

export type MaxPowerResponse = APIResponse & {
  reading_type: {
    unit: 'VA';
    measurement_kind: 'power';
    aggregate: 'maximum';
    measuring_period: 'P1D';
  };
};

export class Session {
  private api: LinkyGeredisAPI;

  constructor(private linkyApi: LinkyGeredisAPI) {
    this.api = linkyApi;
  }

  getDailyConsumption(start: string, end: string): Promise<EnergyResponse> {
    return this.api.getDailyConsumption(start, end);
  }

  getMaxPower(start: string, end: string): Promise<MaxPowerResponse> {
    return this.api.getMaxPower(start, end);
  }
}
