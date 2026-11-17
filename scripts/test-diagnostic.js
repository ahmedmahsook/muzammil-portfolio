require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function testUploads() {
  console.log('Testing image upload first...');
  try {
    const imgRes = await cloudinary.uploader.upload(
      'd:\\downloads\\my-portfolio (1)\\portfolio\\images\\portrait.png',
      {
        folder: 'friend-portfolio/test',
        resource_type: 'image'
      }
    );
    console.log('Image upload SUCCESS:', imgRes.secure_url);
  } catch (err) {
    console.error('Image upload FAILED:', err);
  }

  console.log('\nTesting simple video upload (without eager)...');
  try {
    const vidRes = await cloudinary.uploader.upload(
      'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\650d54a4-8f13-4726-a839-b1de905fe225\\scratch\\videos\\test_video.mov',
      {
        folder: 'friend-portfolio/videos',
        resource_type: 'video'
      }
    );
    console.log('Video upload SUCCESS:', vidRes.secure_url);
  } catch (err) {
    console.error('Video upload FAILED:', err);
  }
}

testUploads();

