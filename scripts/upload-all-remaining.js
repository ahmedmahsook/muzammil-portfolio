require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const videosDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\650d54a4-8f13-4726-a839-b1de905fe225\\scratch\\videos';
const resultsPath = path.join(__dirname, 'cloudinary-uploaded-assets.json');

// List of the remaining 9 videos to upload
const remainingVideos = [
  { file: 'video_01.mov', publicId: 'project_video_01', originalName: 'copy_2A36AE79-1EC1-4DE9-BC06-A3320F9DCD55 2.MOV' },
  { file: 'video_03.mov', publicId: 'project_video_03', originalName: 'copy_94ECC773-8C96-4102-A4C1-B512909F047A 2.MOV' },
  { file: 'video_04.mov', publicId: 'project_video_04', originalName: 'copy_360AFFB9-8E99-427C-88F5-80B05AAA625F 2.MOV' },
  { file: 'video_05.mov', publicId: 'project_video_05', originalName: 'copy_434E54A6-9CC7-4CB6-A5ED-FFB45DAFDF91.MOV' },
  { file: 'video_06.mov', publicId: 'project_video_06', originalName: 'copy_610F6533-912D-492F-B5FF-6179EF63D70E 2.MOV' },
  { file: 'video_07.mov', publicId: 'project_video_07', originalName: 'copy_57731C73-624E-4186-899C-A08FC890FD2D 2.MOV' },
  { file: 'video_08.mov', publicId: 'project_video_08', originalName: 'copy_E15C3E90-E2CD-4718-BA9B-A32B5091F4A4 2.MOV' },
  { file: 'video_09.mov', publicId: 'project_video_09', originalName: 'copy_E57738B3-D0C9-4951-8608-9B8A0D3D5C40 2.MOV' },
  { file: 'video_10.mov', publicId: 'project_video_10', originalName: 'copy_EB3B1628-98D3-48A9-B660-1A2CAC8CC5D4 2.MOV' }
];

function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function uploadLargePromise(filePath, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(filePath, options, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

async function run() {
  console.log('=== STEP 1: VERIFYING FILES & CHECKING FOR DUPLICATES ===');
  const hashes = new Map();
  for (const item of remainingVideos) {
    const p = path.join(videosDir, item.file);
    if (!fs.existsSync(p)) {
      console.error(`Missing file: ${item.file}`);
      process.exit(1);
    }
    const stat = fs.statSync(p);
    const hash = getFileHash(p);
    if (hashes.has(hash)) {
      console.error(`DUPLICATE DETECTED: ${item.file} has exact same content as ${hashes.get(hash)}!`);
      process.exit(1);
    }
    hashes.set(hash, item.file);
    console.log(`Verified: ${item.file} | Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB | SHA256: ${hash.slice(0, 12)}...`);
  }
  console.log('All 9 video files are verified unique and non-duplicate.\n');

  console.log('=== STEP 2: UPLOADING TO CLOUDINARY ===');
  const uploadedResults = fs.existsSync(resultsPath)
    ? JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
    : [];

  // Add the test video already uploaded
  const existingMap = new Map(uploadedResults.map(r => [r.file, r]));
  if (!existingMap.has('video_02.mov')) {
    uploadedResults.push({
      file: 'video_02.mov',
      originalName: 'copy_73F3B354-5AE1-470F-8723-848A508E54CD.MOV',
      publicId: 'friend-portfolio/videos/test_video_sample',
      videoDeliveryUrl: 'https://res.cloudinary.com/driapshxj/video/upload/v1794840561/friend-portfolio/videos/test_video_sample.mp4',
      thumbnailUrl: 'https://res.cloudinary.com/driapshxj/video/upload/so_1/v1794840561/friend-portfolio/videos/test_video_sample.jpg',
      duration: 24.12,
      format: 'mp4',
      status: 'uploaded'
    });
    existingMap.set('video_02.mov', uploadedResults[uploadedResults.length - 1]);
  }

  for (let i = 0; i < remainingVideos.length; i++) {
    const item = remainingVideos[i];
    if (existingMap.has(item.file)) {
      console.log(`Already uploaded (${i + 1}/${remainingVideos.length}): ${item.file}`);
      continue;
    }

    const filePath = path.join(videosDir, item.file);
    console.log(`\n[${i + 1}/${remainingVideos.length}] Uploading ${item.file} (${item.originalName})...`);

    try {
      const res = await uploadLargePromise(filePath, {
        resource_type: 'video',
        folder: 'friend-portfolio/videos',
        public_id: item.publicId,
        chunk_size: 6000000
      });

      const videoUrl = res.secure_url.replace(/\.[^/.]+$/, '.mp4');
      const thumbUrl = cloudinary.url(res.public_id, {
        resource_type: 'video',
        format: 'jpg',
        start_offset: '1',
        quality: 'auto',
        fetch_format: 'auto'
      });

      const entry = {
        file: item.file,
        originalName: item.originalName,
        publicId: res.public_id,
        videoDeliveryUrl: videoUrl,
        thumbnailUrl: thumbUrl,
        duration: res.duration,
        format: 'mp4',
        status: 'uploaded'
      };

      console.log(`SUCCESS: ${item.file} -> ${videoUrl}`);
      console.log(`Thumbnail: ${thumbUrl}`);

      uploadedResults.push(entry);
      existingMap.set(item.file, entry);
      fs.writeFileSync(resultsPath, JSON.stringify(uploadedResults, null, 2));
    } catch (err) {
      console.error(`Upload error for ${item.file}:`, err.message || err);
      process.exit(1);
    }
  }

  console.log('\n=== ALL UPLOADS COMPLETED SUCCESSFULLY ===');
}

run();

