import { fn as pdfToPngs } from './1-pdf-to-pngs'
import { fn as pngToJpg } from './2-png-to-jpg'
import { fn as jpgsToPdf } from './3-jpgs-to-pdf'

export const process = async (file: File): Promise<string> => {
  console.log('Converting PDF to PNGs...')
  const pngs = await pdfToPngs(file);
  console.log('Converting PNGs to JPGs and transforming...')
  const jpgs = await Promise.all(pngs.map(pngToJpg));
  console.log('Converting JPGs to PDF...')
  const pdf = await jpgsToPdf(jpgs);
  return pdf;
}