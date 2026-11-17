require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const videoPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\650d54a4-8f13-4726-a839-b1de905fe225\\scratch\\videos\\video_02.mov';

function uploadLargePromise(filePath, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(filePath, options, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

async function test() {
  try {
    const res = await uploadLargePromise(videoPath, {
      resource_type: 'video',
      folder: 'friend-portfolio/videos',
      public_id: 'test_video_sample',
      chunk_size: 6000000
    });
    console.log('UPLOAD RESULT:');
    console.log('Public ID:', res.public_id);
    console.log('Secure URL:', res.secure_url);
    console.log('Format:', res.format);
    console.log('Duration:', res.duration);
    console.log('Bytes:', res.bytes);

    const posterUrl = cloudinary.url(res.public_id, {
      resource_type: 'video',
      format: 'jpg',
      start_offset: '1'
    });
    console.log('Poster URL:', posterUrl);
  } catch (e) {
    console.error('Error:', e);
  }
}

test();

