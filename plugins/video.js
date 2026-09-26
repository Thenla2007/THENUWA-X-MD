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
        id = query.split("v=")[1]?.split("&")[0];
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

// 📥 Apify streamers/youtube-video-downloader හරහා බාගත කිරීම
async function downloadViaApify(videoUrl, format = "mp4", quality = "360p") {
  try {
    // 1. Apify Console එකේ තියෙන සෙටින්ග්ස් වලට අනුව Actor එක Run කිරීම
    const runResponse = await axios.post(
      `https://apify.com{APIFY_TOKEN}`,
      {
        "videos": [videoUrl],
        "downloadToApifyStorage": true,
        "preferredQuality": quality,
        "preferredFormat": format,
        "nameFileWith": "Title"
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const runId = runResponse?.data?.data?.id;
    const defaultDatasetId = runResponse?.data?.data?.defaultDatasetId;
    if (!runId || !defaultDatasetId) return null;

    // 2. Actor එක වැඩ කරලා ඉවර වනතුරු උපරිම තත්පර 45ක් Polling ක්‍රමයට බලා සිටීම
    let isFinished = false;
    for (let i = 0; i < 15; i++) {
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

    // 3. Dataset එකෙන් Output එක ලබා ගැනීම
    const datasetResponse = await axios.get(
      `https://apify.com{defaultDatasetId}/items?token=${APIFY_TOKEN}`
    );

    const items = datasetResponse?.data;
    if (items && items.length > 0) {
      // Actor එකෙන් ලැබෙන බාගත කිරීමේ ලින්ක් එක වෙන් කර ගැනීම
      return items[0].downloadUrl || items[0].fileUrl || items[0].url || null;
    }
    return null;
  } catch (error) {
    console.error("Apify Streamers Downloader Error:", error);
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

      reply("⬇️ *Downloading MP3 via Apify Private Storage...* ⏳");

      // Apify එකෙන් mp3/audio විදියට ඉල්ලීම
      let downloadUrl = await downloadViaApify(video.url, "mp3", "128kbps");

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

      reply("⬇️ *Downloading Video via Apify Private Storage...* ⏳");

      // Apify එකෙන් mp4/360p විදියට ඉල්ලීම (ලොකු ෆයිල් වට්ස්ඇප් යවන්න බැරි නිසා 360p දමා ඇත)
      let downloadUrl = await downloadViaApify(video.url, "mp4", "360p");

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
