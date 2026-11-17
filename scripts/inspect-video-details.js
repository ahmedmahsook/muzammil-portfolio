require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const publicIds = [
  'friend-portfolio/videos/test_video_sample',
  'friend-portfolio/videos/project_video_01',
  'friend-portfolio/videos/project_video_03',
  'friend-portfolio/videos/project_video_04',
  'friend-portfolio/videos/project_video_05',
  'friend-portfolio/videos/project_video_06',
  'friend-portfolio/videos/project_video_07',
  'friend-portfolio/videos/project_video_08',
  'friend-portfolio/videos/project_video_09',
  'friend-portfolio/videos/project_video_10'
];

async function inspectVideos() {
  for (const id of publicIds) {
    try {
      const res = await cloudinary.api.resource(id, { resource_type: 'video', image_metadata: true });
      console.log(`\nID: ${id}`);
      console.log(`Resolution: ${res.width}x${res.height} (${res.width > res.height ? 'Landscape 16:9' : 'Vertical 9:16'})`);
      console.log(`Duration: ${res.duration.toFixed(1)}s | FPS: ${res.frame_rate} | Codec: ${res.video ? res.video.codec : 'N/A'}`);
    } catch (e) {
      console.error(`Error for ${id}:`, e.message);
    }
  }
}

inspectVideos();

