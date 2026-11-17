require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const videoPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\650d54a4-8f13-4726-a839-b1de905fe225\\scratch\\videos\\video_02.mov';

async function testSingle() {
  console.log('Testing upload with Master Admin credentials...');
  try {
    const result = await cloudinary.uploader.upload_large(
      videoPath,
      {
        resource_type: 'video',
        folder: 'friend-portfolio/videos',
        public_id: 'sample_video_01',
        chunk_size: 6000000
      }
    );

    console.log('\n--- UPLOAD SUCCESSFUL ---');
    console.log('Public ID:', result.public_id);
    console.log('Delivery URL:', result.secure_url);
    console.log('Format:', result.format);
    console.log('Duration (s):', result.duration);
    console.log('Width:', result.width);
    console.log('Height:', result.height);

    const posterUrl = cloudinary.url(result.public_id, {
      resource_type: 'video',
      format: 'jpg',
      start_offset: '1',
      quality: 'auto',
      fetch_format: 'auto'
    });
    console.log('Poster URL:', posterUrl);
  } catch (error) {
    console.error('Upload failed:', error.message || error);
    process.exit(1);
  }
}

testSingle();

