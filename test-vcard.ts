import { prisma } from './lib/prisma';
import sharp from 'sharp';

async function generate() {
  const user = await prisma.user.findFirst({ where: { name: '福井 豪' }});
  if (!user || !user.photo_url) return console.log('no user or photo');

  const res = await fetch(user.photo_url);
  const arrayBuffer = await res.arrayBuffer();
  console.log('Original size:', arrayBuffer.byteLength, 'bytes');
  
  const inputBuffer = Buffer.from(arrayBuffer);
  const processedBuffer = await sharp(inputBuffer)
    .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
    
  console.log('Processed size:', processedBuffer.byteLength, 'bytes');
  
  const base64 = processedBuffer.toString('base64');
  console.log('Base64 length:', base64.length);
}
generate();
