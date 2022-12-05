import express from 'express';
import path, { resolve } from 'path';
import sharp from 'sharp';
import * as fs from 'fs';
const resize = express.Router();

//BASE file directory for the assets
const BASE_URL: string = path.join(__dirname, '../../../', 'assets');

const errorMsg: string =
  'The following error occured processing your image. Remedy and try again: Error:';

resize.get('/', (req, res) => {
  let filename: string = <string>req.query.filename ?? null;
  let width: string = <string>req.query.width ?? null;
  let height: string = <string>req.query.height ?? null;
  if (filename) {
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
  return new Promise((resolve, reject) => {
    resolve(
      sharp(path.join(BASE_URL, 'full', `${filename}.jpg`))
        .resize(width, height, {
          // fit: sharp.fit.inside,
          withoutEnlargement: true,
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
