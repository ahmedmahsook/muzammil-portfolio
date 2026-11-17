require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const videosDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\650d54a4-8f13-4726-a839-b1de905fe225\\scratch\\videos';
const resultsPath = path.join(__dirname, 'cloudinary-assets.json');

const videoList = [
  { file: 'video_01.mov', title: 'Cinematic Fashion & Lifestyle Reel', category: 'Brand Film' },
  { file: 'video_02.mov', title: 'Urban Rhythm & Dynamic Cut', category: 'Social Reel' },
  { file: 'video_03.mov', title: 'High-Impact Performance Creative', category: 'Commercial' },
  { file: 'video_04.mov', title: 'Visual Narrative & Color Grade', category: 'Brand Film' },
  { file: 'video_05.mov', title: 'Dynamic Promo & Sound Design', category: 'Promo' },
  { file: 'video_06.mov', title: 'Creative Storytelling & Pacing', category: 'Visual Storytelling' },
  { file: 'video_07.mov', title: 'Luxury Editorial & Macro Cut', category: 'Editorial' },
  { file: 'video_08.mov', title: 'Motion Graphic Showcase', category: 'Motion Design' },
  { file: 'video_09.mov', title: 'Product Launch & Showcase', category: 'Product Spot' },
  { file: 'video_10.mov', title: 'Cinematic Travel & Atmosphere', category: 'Travel & Lifestyle' }
];

async function uploadSingle(item) {
  const filePath = path.join(videosDir, item.file);
  console.log(`Starting upload for: ${item.file} (${item.title})...`);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      {
        resource_type: 'video',
        folder: 'friend-portfolio/videos',
        chunk_size: 6000000,
        eager: [
          { format: 'mp4', video_codec: 'h264' }
        ],
        eager_async: false
      },
      (error, result) => {
        if (error) {
          console.error(`Upload error for ${item.file}:`, error);
          return reject(error);
        }
        console.log(`[UPLOADED] ${item.file} -> ${result.secure_url}`);
        
        // Generate poster thumbnail URL
        const posterUrl = cloudinary.url(result.public_id, {
          resource_type: 'video',
          format: 'jpg',
          start_offset: '1',
          quality: 'auto',
          fetch_format: 'auto'
        });

        resolve({
          file: item.file,
          title: item.title,
          category: item.category,
          public_id: result.public_id,
          video_url: result.secure_url,
          poster_url: posterUrl,
          duration: result.duration,
          width: result.width,
          height: result.height,
          format: result.format
        });
      }
    );
  });
}

async function run() {
  const uploadedResults = fs.existsSync(resultsPath) 
    ? JSON.parse(fs.readFileSync(resultsPath, 'utf8')) 
    : [];

  const existingMap = new Map(uploadedResults.map(r => [r.file, r]));

  for (let i = 0; i < videoList.length; i++) {
    const item = videoList[i];
    if (existingMap.has(item.file)) {
      console.log(`Already uploaded (${i+1}/${videoList.length}): ${item.file}`);
      continue;
    }

    console.log(`\n--- Uploading [${i+1}/${videoList.length}]: ${item.file} ---`);
    try {
      const res = await uploadSingle(item);
      uploadedResults.push(res);
      existingMap.set(item.file, res);
      // Save progress incrementally
      fs.writeFileSync(resultsPath, JSON.stringify(uploadedResults, null, 2));
    } catch (err) {
      console.error(`Failed to upload ${item.file}. Stopping for inspection.`);
      break;
    }
  }

  console.log(`\nDone! Total uploaded: ${uploadedResults.length}/${videoList.length}`);
}

run();

