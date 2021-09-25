import Jimp from 'jimp/es';
export const fn = async (png: string): Promise<string> => {
  const image = await Jimp.read(png);

  // TODO: maybe just add a margin?
  image.resize(1240, 1754);
  
  // TODO: Do transformations
  image.blur(1);
  
  return image.getBase64Async(Jimp.MIME_JPEG);
}