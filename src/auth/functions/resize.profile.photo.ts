import * as path from 'path';
import * as sharp from 'sharp';

export async function resizeImage(file: Express.Multer.File): Promise<string> {
  //    Resize and save the image buffer to a file
  const uploadPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'upload',
    'profile-photos',
  );
  console.log(file);
  await sharp(file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${uploadPath}/${file.filename}`);

  // Return the filename
  return file.filename;
}
