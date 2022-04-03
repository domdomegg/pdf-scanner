import createMuPdf from "mupdf-js";

export const fn = async (file: File, onStatusMessageUpdate: (msg: string) => void, quality: number): Promise<string[]> => {
  onStatusMessageUpdate('Opening PDF...')

  // Initialise mupdf and convert to Uint8Array
  const mupdf = await createMuPdf();
  const buf = await file.arrayBuffer();
  const arrayBuf = new Uint8Array(buf);
  const doc = mupdf.load(arrayBuf);

  const resolution = quality;
  const num_pages = mupdf.countPages(doc);

  onStatusMessageUpdate('Flattening PDF, 0/' + num_pages + ' pages complete...')

  // Convert it to an array of PNGs
  const pngs = [];
  for (var i = 1; i <= num_pages; i++) {
    // Add little delay to encourage loading message to render
    await new Promise((resolve) => setTimeout(resolve, 10))

    const png = mupdf.drawPageAsPNG(doc, i, resolution);
    pngs.push(png);
    onStatusMessageUpdate('Flattening PDF, ' + i + '/' + num_pages + ' pages complete...')
  }
  return pngs;
}