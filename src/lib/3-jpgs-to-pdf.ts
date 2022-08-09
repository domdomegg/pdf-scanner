import PDFDocument from 'pdfkit';
import { Image } from '.';

export const fn = async (jpgs: Image[], onStatusMessageUpdate: (msg: string) => void): Promise<string> => {
  onStatusMessageUpdate('Creating metadata...')

  const doc = new PDFDocument({
    autoFirstPage: false,
    pdfVersion: '1.4',
    info: {
      Producer: 'Xerox AltaLink C8045',
      Creator: 'Xerox AltaLink C8045',
      CreationDate: new Date(),
      ModDate: new Date(),
    },
    // Explicitly specify no default font so none is loaded, as we don't need it
    font: '',
  });


  const chunks: Uint8Array[] = []
  doc.on('data', (a) => {
    chunks.push(a)
  })

  jpgs.forEach((jpg, i) => {
    onStatusMessageUpdate('Combining scans, ' + i + '/' + jpgs.length + ' pages complete...')
    doc
      .addPage({ margin: 0, size: [jpg.width, jpg.height] })
      .image(jpg.base64, 0, 0, { width: jpg.width, height: jpg.height })
  })

  const p = new Promise<string>((resolve) => {
    doc.on('end', () => {
      resolve(URL.createObjectURL(new Blob(chunks, { type: 'application/pdf' })))
    })
  });
  doc.end()

  onStatusMessageUpdate('Rendering PDF...')

  return p;
}