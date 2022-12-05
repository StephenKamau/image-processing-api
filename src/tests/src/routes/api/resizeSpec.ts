import sharp from 'sharp';
import supertest from 'supertest';
import app from '../../../..';
import * as fs from 'fs';
import path from 'path';
import { generateThumb } from '../../../../routes/api/resize';

const request = supertest(app);
describe('Test endpoint response', () => {
  it('gets the api/images endpoint', async () => {
    const res = await request.get('/api/images');
    expect(res.status).toBe(200);
  });
});

describe('Image transform function should resolve or reject', () => {
  it('Expect transform to not throw error', async () => {
    const res = await request.get('/api/images?filename=');
    expect(res.text).toEqual(
      'The following error occured processing your image. Remedy and try again: Error: Input file is missing'
    );
  });

  it('Expect transform to throw specific error', async () => {
    const res = await request.get(
      '/api/images?filename=invalidfile&width=200&height=200'
    );
    expect(res.text).toEqual('Error: Input file is missing');
  });
  it('Expect transform to generate thumb', async () => {
    const BASE_URL: string = path.join(__dirname, '../../../', 'assets');
    const filename: string = 'fjord';
    const width: number = 200;
    const height: number = 200;
    if (
      fs.existsSync(
        path.join(BASE_URL, 'thumb', `${filename}_thumb_${width}_${height}.jpg`)
      )
    ) {
      fs.unlinkSync(
        path.join(BASE_URL, 'thumb', `${filename}_thumb_${width}_${height}.jpg`)
      );
    }
    generateThumb(filename, width, height).finally(() => {
      expect(
        fs.existsSync(
          path.join(
            BASE_URL,
            'thumb',
            `${filename}_thumb_${width}_${height}.jpg`
          )
        )
      ).toBeTrue();
    });
  });
});
