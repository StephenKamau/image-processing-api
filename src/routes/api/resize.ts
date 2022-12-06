import express, { Request, Response } from 'express';
import path from 'path';
import sharp from 'sharp';
import * as fs from 'fs';
const resize = express.Router();

// BASE file directory for the assets
const BASE_URL: string = path.join(__dirname, '../../../', 'assets');

const errorMsg: string =
  'The following error occured processing your image. Remedy and try again: Error:';

resize.get('/', (req: Request, res: Response) => {
  const filename: string = (req.query.filename ?? null) as string;
  const width: string = (req.query.width ?? null) as string;
  const height: string = (req.query.height ?? null) as string;
  if (filename != null) {
    if (
      fs.existsSync(
        path.join(BASE_URL, 'thumb', `${filename}_thumb_${width}_${height}.jpg`)
      )
    ) {
      res.sendFile(
        path.join(BASE_URL, 'thumb', `${filename}_thumb_${width}_${height}.jpg`)
      );
    } else {
      generateThumb(filename, parseInt(width), parseInt(height))
        .catch((error) => {
          console.error(error);
          res.send('Error: Input file is missing');
        })
        .finally(() => {
          res.sendFile(
            path.join(
              BASE_URL,
              'thumb',
              `${filename}_thumb_${width}_${height}.jpg`
            )
          );
        });
    }
  } else {
    res.send(`${errorMsg} Input file is missing`);
  }
});

const generateThumb = async (
  filename: string,
  width: number,
  height: number
): Promise<unknown> => {
  return await new Promise((resolve, reject) => {
    resolve(
      sharp(path.join(BASE_URL, 'full', `${filename}.jpg`))
        .resize(width, height, {
          // fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .toFormat('jpeg')
        .toFile(
          path.join(
            BASE_URL,
            'thumb',
            `${filename}_thumb_${width}_${height}.jpg`
          )
        )
    );
  });
};

export { resize, generateThumb };
