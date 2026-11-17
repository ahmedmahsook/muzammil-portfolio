const https = require('https');
const fs = require('fs');

const assets = JSON.parse(fs.readFileSync('d:\\downloads\\my-portfolio (1)\\scripts\\cloudinary-uploaded-assets.json', 'utf8'));

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ status: res.statusCode, contentType: res.headers['content-type'], size: res.headers['content-length'] });
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function verifyAll() {
  console.log(`Verifying ${assets.length} assets...`);
  for (let i = 0; i < assets.length; i++) {
    const a = assets[i];
    const vCheck = await checkUrl(a.videoDeliveryUrl);
    const tCheck = await checkUrl(a.thumbnailUrl);
    console.log(`[${i+1}/${assets.length}] ${a.file} (${a.duration ? a.duration.toFixed(1) + 's' : 'N/A'}):`);
    console.log(`   Video: HTTP ${vCheck.status} | Content-Type: ${vCheck.contentType}`);
    console.log(`   Thumb: HTTP ${tCheck.status} | Content-Type: ${tCheck.contentType}`);
  }
}

verifyAll();

