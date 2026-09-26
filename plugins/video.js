const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

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

      reply("⬇️ *Downloading MP3 file...* ⏳");

      // 🔄 High-stability Backend API Endpoint එක හරහා ඩවුන්ලෝඩ් කිරීම
      const res = await axios.get(`https://vreden.web.id{encodeURIComponent(video.url)}`).catch(() => null);
      const downloadUrl = res?.data?.result?.downloadUrl || res?.data?.url || res?.data?.result?.url;

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

      reply("⬇️ *Downloading Video file...* ⏳");

      // 🔄 High-stability Backend API Endpoint එක හරහා වීඩියෝව බාගත කිරීම
      const res = await axios.get(`https://vreden.web.id{encodeURIComponent(video.url)}`).catch(() => null);
      const downloadUrl = res?.data?.result?.downloadUrl || res?.data?.url || res?.data?.result?.url;

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

// 📱 TikTok Downloader Command
cmd(
  {
    pattern: "tiktok",
    alias: ["tt"],
    desc: "Download TikTok video",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("📱 *කරුණාකර වලංගු TikTok ලින්ක් එකක් ලබා දෙන්න!*");

      reply("⬇️ *Downloading TikTok video... Please wait!* ⏳");

      const res = await axios.get(`https://vreden.web.id{encodeURIComponent(q)}`).catch(() => null);
      const downloadUrl = res?.data?.result?.video || res?.data?.result?.nowatermark || res?.data?.url;

      if (!downloadUrl) return reply("❌ *TikTok වීඩියෝව බාගත කිරීම අසාර්ථක විය!*");

      await bot.sendMessage(
        from,
        { video: { url: downloadUrl }, caption: `> *TikTok Video Downloaded Successfully!* ✅` },
        { quoted: mek }
      );
    } catch (e) {
      console.error("TIKTOK COMMAND ERROR:", e);
      reply("❌ *Error while downloading TikTok video!*");
    }
  }
);
