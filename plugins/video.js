const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

const APIFY_TOKEN = "apify_api_Ch0IOvo9qabGqAt4RaSnmhYJuFXKbk0soR3M";

// 🎥 යූටියුබ් වීඩියෝ තොරතුරු සෙවීමේ පහසුකම
async function getYoutube(query) {
  try {
    const isUrl = /(youtube\.com|youtu\.be)/i.test(query);
    if (isUrl) {
      let id;
      if (query.includes("v=")) {
        id = query.split("v=")?.split("&")[0];
      } else {
        id = query.split("/").pop()?.split("?")[0];
      }
      if (!id) return null;
      const info = await yts({ videoId: id });
      return info;
    }
    const search = await yts(query);
    if (!search || !search.videos || !search.videos.length) return null;
    return search.videos[0];
  } catch (err) {
    console.error("GetYoutube Function Error:", err);
    return null;
  }
}

// 📥 Apify andryerica/all-video-downloader හරහා බාගත කිරීමේ පද්ධතිය
async function downloadViaAllVideoDownloader(targetUrl) {
  try {
    // 1. Apify Actor එක නිවැරදි API URL එක සහ Input එක සමඟින් Run කිරීම
    const runResponse = await axios.post(
      `https://apify.com{APIFY_TOKEN}`,
      {
        "url": targetUrl
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const runId = runResponse?.data?.data?.id;
    const defaultDatasetId = runResponse?.data?.data?.defaultDatasetId;
    if (!runId || !defaultDatasetId) return null;

    // 2. වීඩියෝව සර්වර් එක ඇතුළත සකස් කර නිම වන තෙක් උපරිම තත්පර 30ක් Polling ක්‍රමයට බලා සිටීම
    let isFinished = false;
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // තත්පර 3ක් නවතී
      const checkStatus = await axios.get(`https://apify.com{runId}?token=${APIFY_TOKEN}`);
      const status = checkStatus?.data?.data?.status;
      
      if (status === "SUCCEEDED") {
        isFinished = true;
        break;
      } else if (status === "FAILED" || status === "ABORTED") {
        break;
      }
    }

    if (!isFinished) return null;

    // 3. Dataset එකෙන් වීඩියෝවේ නිවැරදි Download Link එක ලබා ගැනීම
    const datasetResponse = await axios.get(
      `https://apify.com{defaultDatasetId}/items?token=${APIFY_TOKEN}`
    );

    const items = datasetResponse?.data;
    if (Array.isArray(items) && items.length > 0) {
      const data = items[0];
      // Actor එකෙන් ලැබෙන විවිධ දත්ත ව්‍යුහයන් අනුව වීඩියෝ ලින්ක් එක වෙන් කර ගැනීම
      return data.downloadUrl || data.url || data.videoUrl || data.mediaUrl || null;
    }
    return null;
  } catch (error) {
    console.error("All Video Downloader Actor Error:", error);
    return null;
  }
}

// 🎵 YTMP3 (Song) Downloader Command
cmd(
  {
    pattern: "ytmp3",
    alias: ["yta", "song"],
    desc: "Download YouTube MP3 by name or link",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("🎵 *කරුණාකර සින්දුවේ නම හෝ YouTube ලින්ක් එකක් ලබා දෙන්න!*");

      reply("🔎 *Searching YouTube... Please wait!*");
      const video = await getYoutube(q);
      if (!video) return reply("❌ *කිසිදු ප්‍රතිඵලයක් හමු නොවීය!*");

      const caption =
        `🎵 *${video.title}*\n\n` +
        `👤 *Channel:* ${video.author?.name || 'Unknown'}\n` +
        `⏱ *Duration:* ${video.timestamp}\n` +
        `🔗 *Link:* ${video.url}`;

      await bot.sendMessage(
        from,
        { image: { url: video.thumbnail || "https://catbox.moe" }, caption },
        { quoted: mek }
      );

      reply("⬇️ *Downloading MP3 via All-Video Private Server...* ⏳");

      let downloadUrl = await downloadViaAllVideoDownloader(video.url);

      if (!downloadUrl) return reply("❌ *සින්දුව බාගත කිරීම අසාර්ථක විය! කරුණාකර නැවත උත්සාහ කරන්න.*");

      await bot.sendMessage(
        from,
        { audio: { url: downloadUrl }, mimetype: "audio/mpeg" },
        { quoted: mek }
      );
    } catch (e) {
      console.error("YTMP3 COMMAND ERROR:", e);
      reply("❌ *Error while downloading MP3!*");
    }
  }
);

// 🎬 YTMP4 (Video) Downloader Command
cmd(
  {
    pattern: "ytmp4",
    alias: ["ytv", "video"],
    desc: "Download YouTube MP4 by name or link",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("🎬 *කරුණාකර වීඩියෝවේ නම හෝ YouTube ලින්ක් එකක් ලබා දෙන්න!*");

      reply("🔎 *Searching YouTube... Please wait!*");
      const video = await getYoutube(q);
      if (!video) return reply("❌ *කිසිදු ප්‍රතිඵලයක් හමු නොවීය!*");

      const caption =
        `🎬 *${video.title}*\n\n` +
        `👤 *Channel:* ${video.author?.name || 'Unknown'}\n` +
        `⏱ *Duration:* ${video.timestamp}\n` +
        `🔗 *Link:* ${video.url}`;

      await bot.sendMessage(
        from,
        { image: { url: video.thumbnail || "https://catbox.moe" }, caption },
        { quoted: mek }
      );

      reply("⬇️ *Downloading Video via All-Video Private Server...* ⏳");

      let downloadUrl = await downloadViaAllVideoDownloader(video.url);

      if (!downloadUrl) return reply("❌ *වීඩියෝව බාගත කිරීම අසාර්ථක විය! කරුණාකර නැවත උත්සාහ කරන්න.*");

      await bot.sendMessage(
        from,
        {
          video: { url: downloadUrl },
          mimetype: "video/mp4",
          fileName: `${video.title}.mp4`,
          caption: `🎬 *${video.title}* \n\n> *Successfully Downloaded via Apify!* ✅`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("YTMP4 COMMAND ERROR:", e);
      reply("❌ *Error while downloading video!*");
    }
  }
);
