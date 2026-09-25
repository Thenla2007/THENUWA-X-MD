const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');
const path = require('path'); 

// Configure newsletter context
const newsletterContext = {
mentionedJid: [],
forwardingScore: 1000,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: '120363292876277898@newsletter',
newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
serverMessageId: 143,
}
}; 

// Utility: Send error reply helper
function sendError(reply, message) {
return reply(`*❌ ${message}*`);
} 

// Helper Function: Trigger Apify Actor and Extract Direct Download URL
async function downloadFromApify(videoUrl) {
const apiToken = 'apify_api_o26QUamyP05T5mIlQUZ974yUGLJTed0dScHR'; 

// 1. Trigger the YouTube Downloader Actor run via POST request
const runUrl = `https://api.apify.com/v2/acts/streamers~youtube-video-downloader/runs?token=${apiToken}`;

const runResponse = await fetch(runUrl, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
sources: [{ url: videoUrl }],
downloadMode: "save-best-progressive",
preferredQuality: "1080p",
preferredFormat: "mp4"
})
});

const runData = await runResponse.json();
if (!runData.data || !runData.data.defaultDatasetId) {
throw new Error("Failed to start YouTube downloader task.");
}

const datasetId = runData.data.defaultDatasetId;
const runId = runData.data.id;

// 2. Wait for the Actor run to complete successfully
let isFinished = false;
const checkUrl = `https://api.apify.com/v2/actor-runs/${runId}?token=${apiToken}`;

for (let i = 0; i < 30; i++) { // Poll for up to 60 seconds
const checkResponse = await fetch(checkUrl);
const checkData = await checkResponse.json();
if (checkData.data && checkData.data.status === 'SUCCEEDED') {
    isFinished = true;
    break;
} else if (checkData.data && ['FAILED', 'ABORTED', 'TIMED-OUT'].includes(checkData.data.status)) {
    throw new Error(`Downloader task failed with status: ${checkData.data.status}`);
}

await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before next check

}

if (!isFinished) {
throw new Error("Downloader task timed out.");
}

// 3. Fetch the results from the dataset items endpoint
const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiToken}`;
const datasetResponse = await fetch(datasetUrl);
const items = await datasetResponse.json();

if (!items || items.length === 0 || !items[0].downloadedFileUrl) {
throw new Error("Video file was not found in the download store.");
}

// Return the extracted metadata and the secure direct .mp4 link
return {
title: items[0].fileKey || "YouTube Video",
video_url: items[0].downloadedFileUrl,
thumbnail: items[0].audioOnlyUrl || "[https://i.ibb.co/video-placeholder.png](https://i.ibb.co/video-placeholder.png)", // Fallback if no thumb
video_quality: "1080p",
audi_quality: "High"
};

} 

// VIDEO COMMAND - accepts a prompt (title or URL)
cmd({
pattern: "video",
alias: ['ytdl', 'youtube'],
react: "🎥",
desc: "Download video from YouTube by prompt or URL",
category: "download",
filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
try {
if (!q) return sendError(reply, "Please provide a video title or YouTube URL"); 

let videoUrl = q;

// Search if query is not a direct link
if (!q.includes('youtu')) {
    const search = await yts(q);
    const video = search.videos[0];
    if (!video) return sendError(reply, "No results found");
    videoUrl = video.url;
}

await reply("*⏳ Processing your request via Apify Cloud... Please wait.*");

const result = await downloadFromApify(videoUrl);

const messageContext = {
    ...newsletterContext,
    mentionedJid: [sender]
};

const infoMsg = `

╭════════════⊷❍
│
│ *🎥 Video Downloader*
│──────────────────────
│ 📌 Title: 
𝑟𝑒𝑠𝑢𝑙𝑡.𝑡𝑖𝑡𝑙𝑒

𝑄𝑢𝑎𝑙𝑖𝑡𝑦

∶

{result.video_quality}
│ 🎧 Audio Quality: ${result.audi_quality}
╰──────────●●►
*📥 Downloaded via HANS BYTE MD*`.trim(); 

// Send thumbnail details
await conn.sendMessage(from, {
    image: { url: result.thumbnail },
    caption: infoMsg,
    contextInfo: messageContext
}, { quoted: mek });

// Send video directly to chat
await conn.sendMessage(from, {
    video: { url: result.video_url },
    mimetype: 'video/mp4',
    caption: "*🎥 HANS BYTE MD*",
    contextInfo: messageContext
}, { quoted: mek });

// Send as a downloadable document
await conn.sendMessage(from, {
    document: { url: result.video_url },
    mimetype: 'video/mp4',
    fileName: `${result.title}.mp4`,
    caption: "*📁 HANS BYTE MD*",
    contextInfo: messageContext
}, { quoted: mek });

} catch (error) {
console.error('Video Error:', error);
return sendError(reply, error.message);
}

}); 

// YTMP4 COMMAND - only accepts direct YouTube URL
cmd({
pattern: "ytmp4",
alias: ['youtube', 'ytvid'],
react: "🎧",
desc: "Download video from YouTube URL",
category: "download",
filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
if (!q || (!q.includes("youtube.com/watch") && !q.includes("youtu.be"))) {
return sendError(reply, "Please provide a valid YouTube video URL");
} 

try {
await reply("*⏳ Fetching video payload from Apify Cloud... Please wait.*");
const result = await downloadFromApify(q);

const messageContext = {
    ...newsletterContext,
    mentionedJid: [sender]
};

const infoMsg = `

╭════════════⊷❍
│
│ *🎥 YT Video Downloader*
│──────────────────────
│ 📌 Title: 
𝑟𝑒𝑠𝑢𝑙𝑡.𝑡𝑖𝑡𝑙𝑒

𝑄𝑢𝑎𝑙𝑖𝑡𝑦

∶

{result.video_quality}
│ 🎧 Audio Quality: ${result.audi_quality}
╰──────────●●►
*📥 Powered by HANS BYTE MD*`.trim(); 

await conn.sendMessage(from, {
    image: { url: result.thumbnail },
    caption: infoMsg,
    contextInfo: messageContext
}, { quoted: mek });

// Send video
await conn.sendMessage(from, {
    video: { url: result.video_url },
    mimetype: 'video/mp4',
    caption: "*🎥 HANS BYTE MD*",
    contextInfo: messageContext
}, { quoted: mek });

// Send as document
await conn.sendMessage(from, {
    document: { url: result.video_url },
    mimetype: 'video/mp4',
    fileName: `${result.title}.mp4`,
    caption: "*📁 HANS BYTE MD*",
    contextInfo: messageContext
}, { quoted: mek });

} catch (err) {
console.error("YTMP4 Error:", err);
return sendError(reply, err.message);
}

});
