import { BlendMode, Jimp } from 'jimp';
import { Image } from '.';

export const fn = async (pngs: string[], onStatusMessageUpdate: (msg: string) => void): Promise<Image[]> => {
  onStatusMessageUpdate('Applying filters, 0/' + pngs.length + ' pages complete...')
  let pagesComplete = 0;
  return Promise.all(pngs.map((p) => pngToJpg(p).then((r) => {
    pagesComplete++;
    onStatusMessageUpdate('Applying filters, ' + pagesComplete + '/' + pngs.length + ' pages complete...')
    return r;
  })));
}

let imageResourcesPromise: Promise<Awaited<ReturnType<typeof Jimp.read>>[]> | null = null;
const getImageResources = async () => {
  if (imageResourcesPromise === null) {
    imageResourcesPromise = Promise.all([
      Jimp.read('black.jpg'),
      Jimp.read('speck_1.jpg'),
      Jimp.read('speck_2.jpg'),
      Jimp.read('speck_3.jpg'),
      Jimp.read('speck_4.jpg'),
      Jimp.read('speck_5.jpg'),
      Jimp.read('speck_6.jpg'),
      Jimp.read('speck_7.jpg'),
      Jimp.read('speck_8.jpg'),
    ]);
  }

  const [black, ...specks] = await imageResourcesPromise
  return { black, specks }
}

export const pngToJpg = async (png: string): Promise<Image> => {
  // Load bitmap resources
  const image = await Jimp.read(png);
  const originalSize = { width: image.bitmap.width, height: image.bitmap.height }
  const { black, specks } = await getImageResources();
  
  image.greyscale();
  
  // Add random white dots (to break up text/lines etc. on white backgrounds)
  // This masking avoids putting it over large solid blocks, which looks very strange
  const mask = image.clone()
  mask
    .scan(0, 0, mask.bitmap.width, mask.bitmap.height, (x, y, idx) => {
      const value = mask.bitmap.data[idx] < 240 ? 0 : 255;
      
      mask.bitmap.data[idx] = value;
      mask.bitmap.data[idx + 1] = value;
      mask.bitmap.data[idx + 2] = value;
    })
    .blur(1)

    const maskClone = mask.clone();
    
    // This is a 3.5x more efficient version of:
    // .convolution({
    //   kernel: [
    //     [1, 1, 1],
    //     [1, 1, 1],
    //     [1, 1, 1],
    //   ],
    //   edgeHandling: Edge.EXTEND
    // });
    mask.scan(0, 0, mask.bitmap.width, mask.bitmap.height, (x, y, idx) => {
      let sum = 0;
    
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const neighborIdx = idx
            + ((x + dx >= 0 && x + dx <= mask.bitmap.width - 1) ? dx * 4 : 0)
            + ((y + dy >= 0 && y + dy <= mask.bitmap.height - 1) ? dy * 4 * mask.bitmap.width : 0)
          sum += maskClone.bitmap.data[neighborIdx];
        }
      }

      const newValue = Math.min(255, sum);
    
      mask.bitmap.data[idx] = newValue;
      mask.bitmap.data[idx + 1] = newValue;
      mask.bitmap.data[idx + 2] = newValue;
    });

  black.resize({ w: originalSize.width, h: originalSize.height })
  black.mask({ src: mask, x: 0, y: 0 })
  image.composite(black, 0, 0, {
    mode: BlendMode.ADD,
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
      mode: BlendMode.MULTIPLY,
      opacityDest: 1,
      opacitySource: 0.9,
    })
  }
  image.contrast(0.08)
  
  // Rotation and border
  image.background = 0xffffffff;
  image.rotate((Math.random() * 1.5) - 0.75);
  image.contain({ w: originalSize.width, h: originalSize.height });
  
  // Noise
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const skew = Math.floor(Math.random() * 20) - 10
    image.bitmap.data[idx] = Math.min(Math.max(image.bitmap.data[idx] + skew, 0), 255);
    image.bitmap.data[idx + 1] = Math.min(Math.max(image.bitmap.data[idx + 1] + skew, 0), 255);
    image.bitmap.data[idx + 2] = Math.min(Math.max(image.bitmap.data[idx + 2] + skew, 0), 255);
  })
  
  return {
    base64: await image.getBase64("image/jpeg"),
    width: image.bitmap.width, 
    height: image.bitmap.height
  };
}