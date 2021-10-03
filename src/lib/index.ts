import { fn as pdfToPngs } from './1-pdf-to-pngs'
import { fn as pngToJpg } from './2-png-to-jpg'
import { fn as jpgsToPdf } from './3-jpgs-to-pdf'

export interface Image {
  base64: string,
  width: number,
  height: number,
}

export const process = async (file: File, quality: number = 300): Promise<string> => {
  console.log('Converting PDF to PNGs...')
  const pngs = await pdfToPngs(file, quality);
  console.log('Converting PNGs to JPGs and transforming...')
  const jpgs = await Promise.all(pngs.map(pngToJpg));
  console.log('Converting JPGs to PDF...')
  const pdf = await jpgsToPdf(jpgs);
  return pdf;
}