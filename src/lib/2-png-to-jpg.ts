import Jimp from 'jimp/es';
import { Image } from '.';

export const fn = async (png: string): Promise<Image> => {
  const image = await Jimp.read(png);
  const originalSize = { width: image.getWidth(), height: image.getHeight() }

  const [white, black, ...specks] = await Promise.all([
    await Jimp.read('/white.jpg'),
    await Jimp.read('/black.jpg'),
    await Jimp.read('/speck_1.jpg'),
    await Jimp.read('/speck_2.jpg'),
    await Jimp.read('/speck_3.jpg'),
    await Jimp.read('/speck_4.jpg'),
    await Jimp.read('/speck_5.jpg'),
    await Jimp.read('/speck_6.jpg'),
    await Jimp.read('/speck_7.jpg'),
    await Jimp.read('/speck_8.jpg'),
  ]);
  white.resize(originalSize.width, originalSize.height)
  black.resize(originalSize.width, originalSize.height)

  image.greyscale();
  const speck_count = Math.floor(Math.random()*specks.length);
  const speck_offset = Math.floor(Math.random()*specks.length);
  for(let i = 0; i < speck_count; i++){
    let x = Math.random()*originalSize.width;
    let y = Math.random()*originalSize.height;
    image.composite(specks[(i + speck_offset) % specks.length], x, y, {
      mode: Jimp.BLEND_MULTIPLY,
      opacityDest: 1,
      opacitySource: 0.9,
    })
  }
  image.composite(black, 0, 0, {
    mode: Jimp.BLEND_ADD,
    opacityDest: 1,
    opacitySource: 1,
  })
  image.composite(white, 0, 0, {
    mode: Jimp.BLEND_MULTIPLY,
    opacityDest: 1,
    opacitySource: 0.1,
  })
  image.contrast(0.08)

  image.background(0xaaaaaaff)
  image.rotate((Math.random() * 2) - 1);
  image.contain(originalSize.width, originalSize.height);

  return { base64: await image.getBase64Async(Jimp.MIME_JPEG), width: image.getWidth(), height: image.getHeight() };
}