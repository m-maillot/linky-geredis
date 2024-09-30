import type { GeredisApiResponse } from './GeredisApiResponse.js';
import type { AveragePowerResponse } from './index.js';

export const formatLoadCurve = (measure: GeredisApiResponse): AveragePowerResponse => {
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
              value: `${item.consommation * 1000}`,
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
                  value: `${item.consommation * 1000}`,
                  date: convertDate(item.date, '12:00'),
                }
              : undefined
          )
          .filter((item) => item !== undefined)
      ),
    quality: '',
    start: measure.periodesActivite[0].dateFin ?? '',
    usage_point_id: measure.referencePds,
  };
};
