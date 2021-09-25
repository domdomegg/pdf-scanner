import createMuPdf from "mupdf-js";

export const fn = async (file: File): Promise<string[]> => {
  // Initialise mupdf and convert to Uint8Array
  const mupdf = await createMuPdf();
  const buf = await file.arrayBuffer();
  const arrayBuf = new Uint8Array(buf);
  const doc = mupdf.load(arrayBuf);

  // TODO: figure out which resolution to use
  const resolution = 150;
  const num_pages = mupdf.countPages(doc);

  // Convert it to an array of PNGs
  const pngs = [];
  for(var i = 1; i <= num_pages ; i++){
    const png = mupdf.drawPageAsPNG(doc, i, resolution);
    pngs.push(png);
  }
  return pngs;
}