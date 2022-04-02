import PDFDocument from 'pdfkit';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import Helvetica from '!!raw-loader!pdfkit/js/data/Helvetica.afm'
import { Writable } from 'stream'
import fs from 'fs';
import { Image } from '.';

export const fn = async (jpgs: Image[]): Promise<string> => {
  fs.writeFileSync('data/Helvetica.afm', Helvetica)
  const doc = new PDFDocument({
    autoFirstPage: false,
    pdfVersion: '1.4',
    info: {
      Producer: 'Xerox AltaLink C8045',
      Creator: 'Xerox AltaLink C8045',
      CreationDate: new Date(),
      ModDate: new Date(),
    }
  });

  const dataUriStream = new Writable();
  const chunks: Uint8Array[] = []
  dataUriStream._write = function (chunk: Uint8Array, encoding, done) {
    chunks.push(chunk);
    done();
  };

  const stream = doc.pipe(dataUriStream)

  for (const jpg of jpgs) {
    doc
      .addPage({ margin: 0, size: [jpg.width, jpg.height] })
      .image(jpg.base64, 0, 0, { width: jpg.width, height: jpg.height })
  }

  doc.end()

  return new Promise((resolve) => {
    stream.on('finish', () => {
      resolve(URL.createObjectURL(new Blob(chunks, { type: 'application/pdf' })))
    })
  });
}