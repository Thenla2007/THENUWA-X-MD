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

// 📥 Apify හරහා නිවැරදිව බලා සිට බාගත කරන Function එක
async function downloadViaApify(videoUrl, mode = "audio") {
  try {
    // 1. Apify Actor එක Run කිරීම (epctex/youtube-video-downloader භාවිතා කර ඇත)
    const runResponse = await axios.post(
      `https://apify.com{APIFY_TOKEN}`,
      {
        urls: [videoUrl],
        downloadMode: mode,
        videoQuality: "360p"
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const runId = runResponse?.data?.data?.id;
    const defaultDatasetId = runResponse?.data?.data?.defaultDatasetId;
    if (!runId || !defaultDatasetId) return null;

    // 2. Loop එකක් මඟින් Apify Run එක ඉවර වනතුරු උපරිම තත්පර 30ක් බලා සිටීම (Polling)
    let isFinished = false;
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // තත්පර 3ක් නවතී
      const checkStatus = await axios.get(`https://apify.com{runId}?token=${APIFY_TOKEN}`);
      if (checkStatus?.data?.data?.status === "SUCCEEDED") {
        isFinished = true;
        break;
      }
    }

    if (!isFinished) return null;

    // 3. Dataset එකෙන් ලින්ක් එක නිවැරදිව ලබා ගැනීම
    const datasetResponse = await axios.get(
      `https://apify.com{defaultDatasetId}/items?token=${APIFY_TOKEN}`
    );

    const items = datasetResponse?.data;
    if (items && items.length > 0) {
      return items[0].downloadUrl || items[0].url || items[0].fileUrl || null;
    }
    return null;
  } catch (error) {
    console.error("Apify Downloader Error:", error);
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

      reply("⬇️ *Downloading MP3 via Apify Private Server...* ⏳");

      let downloadUrl = await downloadViaApify(video.url, "audio");

      // 🔄 Backup Fallback: Apify හි ගැටලුවක් වුවහොත් Cobalt API භාවිතා කිරීම
      if (!downloadUrl) {
        try {
          const res = await axios.post("https://cobalt.tools", {
            url: video.url,
            downloadMode: "audio",
            audioFormat: "mp3"
          }, { headers: { "Accept": "application/json" } });
          downloadUrl = res?.data?.url;
        } catch (e) {
          console.log("Cobalt Backup Audio Failed.");
        }
      }

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

      reply("⬇️ *Downloading Video via Apify Private Server...* ⏳");

      let downloadUrl = await downloadViaApify(video.url, "video");

      // 🔄 Backup Fallback: Apify හි ගැටලුවක් වුවහොත් Cobalt API භාවිතා කිරීම
      if (!downloadUrl) {
        try {
          const res = await axios.post("https://cobalt.tools", {
            url: video.url,
            videoQuality: "360"
          }, { headers: { "Accept": "application/json" } });
          downloadUrl = res?.data?.url;
        } catch (e) {
          console.log("Cobalt Backup Video Failed.");
        }
      }

      if (!downloadUrl) return reply("❌ *වීඩියෝව බාගත කිරීම අසාර්ථක විය! කරුණාකර නැවත උත්සාහ කරන්න.*");

      await bot.sendMessage(
        from,
        {
          video: { url: downloadUrl },
          mimetype: "video/mp4",
          fileName: `${video.title}.mp4`,
          caption: `🎬 *${video.title}* \n\n> *Successfully Downloaded!* ✅`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("YTMP4 COMMAND ERROR:", e);
      reply("❌ *Error while downloading video!*");
    }
  }
);
