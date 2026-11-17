require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function verify() {
  try {
    console.log('Testing Cloudinary configuration for cloud:', process.env.CLOUDINARY_CLOUD_NAME);
    const result = await cloudinary.api.ping();
    console.log('Cloudinary Ping Result:', result);
    console.log('API Credentials verified successfully with active permissions!');
  } catch (error) {
    console.error('Cloudinary Verification Failed:', error.message);
    if (error.error) console.error(error.error);
    process.exit(1);
  }
}

verify();

