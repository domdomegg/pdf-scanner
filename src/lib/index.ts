import { fn as pdfToPngs } from './1-pdf-to-pngs'
import { fn as pngsToJpgs } from './2-png-to-jpg'
import { fn as jpgsToPdf } from './3-jpgs-to-pdf'

export interface Image {
  base64: string,
  width: number,
  height: number,
}

/**
 * Given a PDF, handles converting it to a 'scanned' PDF file
 * @param file The input PDF file
 * @param onStatusMessageUpdate Callback function that is called with a string describing the current progress
 * @param quality The quality, in DPI, to scan the file in
 * @returns Blob URL for the 'scanned' PDF file
 */
export const process = async (
  file: File,
  onStatusMessageUpdate: (msg: string) => void = () => { },
  quality: number = 150
): Promise<string> => {
  const pngs = await pdfToPngs(file, onStatusMessageUpdate, quality);
  const jpgs = await pngsToJpgs(pngs, onStatusMessageUpdate)
  const pdf = await jpgsToPdf(jpgs, onStatusMessageUpdate);
  return pdf;
}