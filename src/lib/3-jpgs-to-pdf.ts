import PDFDocument from 'pdfkit';
import { Writable } from 'stream'
import { Image } from '.';

export const fn = async (jpgs: Image[], onStatusMessageUpdate: (msg: string) => void): Promise<string> => {
  onStatusMessageUpdate('Creating metadata...')

  // fs.writeFileSync('data/Helvetica.afm', Helvetica)
  const doc = new PDFDocument({
    // @ts-ignore: waiting on https://github.com/DefinitelyTyped/DefinitelyTyped/pull/59675
    font: '',
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

  jpgs.forEach((jpg, i) => {
    onStatusMessageUpdate('Combining scans, ' + i + '/' + jpgs.length + ' pages complete...')
    doc
      .addPage({ margin: 0, size: [jpg.width, jpg.height] })
      .image(jpg.base64, 0, 0, { width: jpg.width, height: jpg.height })
  })

  doc.end()

  onStatusMessageUpdate('Rendering PDF...')

  return new Promise((resolve) => {
    stream.on('finish', () => {
      resolve(URL.createObjectURL(new Blob(chunks, { type: 'application/pdf' })))
    })
  });
}