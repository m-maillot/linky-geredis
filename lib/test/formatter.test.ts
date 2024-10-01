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
      end: '2024-09-29T16:00:00.000Z',
      interval_reading: [
        { value: '8000', date: '2024-09-27T01:00:00.000Z' },
        {
          value: '5000',
          date: '2024-09-27T16:00:00.000Z',
        },
        {
          value: '4000',
          date: '2024-09-28T01:00:00.000Z',
        },
        { value: '5000', date: '2024-09-28T16:00:00.000Z' },
        { value: '9000', date: '2024-09-29T01:00:00.000Z' },

        { value: '4000', date: '2024-09-29T16:00:00.000Z' },
      ],
      quality: '',
      start: '2024-09-27T01:00:00.000Z',
      usage_point_id: 'XXXXXXXX',
    });
  });
});
