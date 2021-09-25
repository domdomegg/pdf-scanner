import PDFDocument from 'pdfkit';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import Helvetica from '!!raw-loader!pdfkit/js/data/Helvetica.afm'
import blobStream from 'blob-stream';
import fs from 'fs';

export const fn = async (jpgs: string[]): Promise<string> => {
  fs.writeFileSync('data/Helvetica.afm', Helvetica)
  const doc = new PDFDocument({ autoFirstPage: false });

  // TODO: Try to get rid of blobstream, maybe like this?
  // https://github.com/bpampuch/pdfmake/blob/0.2/src/browser-extensions/pdfMake.js#L99
  const stream = doc.pipe(blobStream())

  for (const jpg of jpgs) {
    // TODO: handle non a4 pages
    doc
      .addPage({ margin: 0 })
      .image(jpg, 0, 0, { width: 595.28, height: 841.89 })
  }
  
  doc.end()
    
  return new Promise((resolve) => {
    // TODO: can we return a data uri instead?
    stream.on('finish', () => resolve(stream.toBlobURL('application/pdf')))
  });
}