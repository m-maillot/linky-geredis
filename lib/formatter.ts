import type { ConsommationsJournaliere, GeredisApiResponse, PostesHorosaisonnier } from './GeredisApiResponse.js';
import type { AveragePowerResponse } from './index.js';
import dayjs from 'dayjs';

const formatDate = (date: string) => {
  const dateSplit = date.split('/');
  return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
};

const mapConso = (
  { consommation, date }: ConsommationsJournaliere,
  hour: string
):
  | {
      date: dayjs.Dayjs;
      value: string;
    }
  | undefined => {
  if (consommation === undefined || consommation === null) {
    return undefined;
  }
  return {
    date: dayjs(`${formatDate(date)} ${hour}`),
    value: `${consommation * 1000}`,
  };
};

const mapPoste = (poste: PostesHorosaisonnier) => {
  return poste.consommationsJournalieres.map((item) =>
    mapConso(item, poste.etiquette.mnemo === 'HC' ? '03:00:00' : '18:00:00')
  );
};

export const formatLoadCurve = (measure: GeredisApiResponse): AveragePowerResponse => {
  const periods = measure.periodesActivite.length > 0 ? measure.periodesActivite[0] : null;
  if (periods === null || periods.blocFournisseur === null) {
    throw new Error('Aucune période trouvée pour la période');
  }
  const interval_reading = periods.blocFournisseur.postesHorosaisonnier
    .flatMap(mapPoste)
    .filter((item) => item !== undefined)
    .sort((a, b) => (a.date.isBefore(b.date) ? -1 : 1))
    .map((item) => ({
      value: item.value,
      date: item.date.toISOString(),
    }));
  return {
    reading_type: { aggregate: 'average', measurement_kind: 'power', unit: 'W' },
    end: interval_reading[interval_reading.length - 1].date,
    interval_reading,
    quality: '',
    start: interval_reading[0].date,
    usage_point_id: measure.referencePds,
  };
};
