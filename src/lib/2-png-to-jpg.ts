import Jimp from 'jimp/es';
import { Image } from '.';

export const fn = async (pngs: string[], onStatusMessageUpdate: (msg: string) => void): Promise<Image[]> => {
  onStatusMessageUpdate('Processing filters, 0/' + pngs.length + ' pages complete...')
  let pagesComplete = 0;
  return Promise.all(pngs.map((p) => pngToJpg(p).then((r) => {
    pagesComplete++;
    onStatusMessageUpdate('Processing filters, ' + pagesComplete + '/' + pngs.length + ' pages complete...')
    return r;
  })));
}


export const pngToJpg = async (png: string): Promise<Image> => {
  // Load bitmap resources
  const image = await Jimp.read(png);
  const originalSize = { width: image.getWidth(), height: image.getHeight() }
  const [black, ...specks] = await Promise.all([
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

  // image.color([ { apply: 'saturate' as any, params: [-30] }])
  image.greyscale();

  // Add random white dots (to break up text/lines etc. on white backgrounds)
  const mask = image.clone()
  mask
    .grayscale()
    .scanQuiet(0, 0, mask.bitmap.width, mask.bitmap.height, (x, y, idx) => {
      const value = mask.bitmap.data[idx] < 240 ? 0 : 255;

      mask.bitmap.data[idx] = value;
      mask.bitmap.data[idx + 1] = value;
      mask.bitmap.data[idx + 2] = value;
    })
    .convolution([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      // @ts-ignore
    ], Jimp.EDGE_EXTEND);
  black.resize(originalSize.width, originalSize.height)
  black.mask(mask, 0, 0)
  image.composite(black, 0, 0, {
    mode: Jimp.BLEND_ADD,
    opacityDest: 1,
    opacitySource: 1,
  })

  // Add random black specks
  const speck_count = Math.floor(Math.random() * specks.length);
  const speck_offset = Math.floor(Math.random() * specks.length);
  for (let i = 0; i < speck_count; i++) {
    let x = Math.random() * originalSize.width;
    let y = Math.random() * originalSize.height;
    image.composite(specks[(i + speck_offset) % specks.length], x, y, {
      mode: Jimp.BLEND_MULTIPLY,
      opacityDest: 1,
      opacitySource: 0.9,
    })
  }
  image.contrast(0.08)

  // Rotation and border
  image.background(0xffffffff)
  image.rotate((Math.random() * 1.5) - 0.75);
  image.contain(originalSize.width, originalSize.height);

  // Noise
  image.scanQuiet(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const skew = Math.floor(Math.random() * 20) - 10
    image.bitmap.data[idx] = Math.min(Math.max(image.bitmap.data[idx] + skew, 0), 255);
    image.bitmap.data[idx + 1] = Math.min(Math.max(image.bitmap.data[idx + 1] + skew, 0), 255);
    image.bitmap.data[idx + 2] = Math.min(Math.max(image.bitmap.data[idx + 2] + skew, 0), 255);
  })

  return { base64: await image.getBase64Async(Jimp.MIME_JPEG), width: image.getWidth(), height: image.getHeight() };
}