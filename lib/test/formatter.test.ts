import { describe, expect, test } from 'vitest';
import { formatLoadCurve } from '../formatter.js';
import measure1 from './data/api_response_consumption_short.json';
import type { GeredisApiResponse } from '../GeredisApiResponse.js';

describe('test du formatteur', () => {
  test('load curve sur une courte période', () => {
    const data: GeredisApiResponse = measure1;
    const result = formatLoadCurve(data);
    expect(result).toStrictEqual({
      reading_type: { aggregate: 'average', measurement_kind: 'power', unit: 'W' },
      end: '2024-09-29',
      interval_reading: [
        { value: '8000', date: '2024-09-27 04:00:00' },
        {
          value: '5000',
          date: '2024-09-27 12:00:00',
        },
        {
          value: '4000',
          date: '2024-09-28 04:00:00',
        },
        { value: '5000', date: '2024-09-28 12:00:00' },
        { value: '9000', date: '2024-09-29 04:00:00' },

        { value: '4000', date: '2024-09-29 12:00:00' },
      ],
      quality: '',
      start: '2024-09-27',
      usage_point_id: 'XXXXXXXX',
    });
  });
});
