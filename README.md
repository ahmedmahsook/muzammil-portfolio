# Muzammil — Video Editor & Performance Marketer Portfolio

A cinematic, high-performance portfolio website showcasing video editing, motion design, and commercial creative campaigns.

## Features
- **Cloudinary CDN Streaming**: All 10 video projects stream optimized H.264 MP4 videos directly from Cloudinary edge CDN.
- **Dynamic Poster Thumbnails**: Auto-generated poster thumbnails for instant loading.
- **Responsive Video Lightbox Modal**: Adapts dynamically for vertical 9:16 reels and 16:9 widescreen cinematic films.
- **Centralized Data**: Project titles, categories, tags, and URLs are easily managed in `portfolio/projects-data.js`.
- **Zero-Secret Frontend**: No API keys or credentials exposed in client-side code.

## Quick Start (Run Locally)
1. Ensure Node.js is installed.
2. Run:
   ```bash
   node scripts/serve.js
   ```
3. Open your browser at:
   ```
   http://localhost:3000/
   ```

## Customizing Projects
To update project titles, descriptions, categories, or video URLs, edit:
```
portfolio/projects-data.js
```

## Deployment
Configured for instant zero-config deployment on **Vercel** and **GitHub**:
- Config file: `vercel.json`
- Sensitive files ignored: `.gitignore`
