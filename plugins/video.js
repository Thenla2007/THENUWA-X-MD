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

      let downloadUrl = null;

      // 🔄 API 1: Cobalt Engine API (High Speed)
      try {
        const res = await axios.post("https://cobalt.tools", {
          url: video.url,
          downloadMode: "audio",
          audioFormat: "mp3"
        }, {
          headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
        downloadUrl = res?.data?.url;
      } catch (e) {
        console.log("Cobalt Audio API Failed, trying backup...");
      }

      // 🔄 API 2: Backup YTDL API
      if (!downloadUrl) {
        try {
          const res = await axios.get(`https://giftedtech.my.id{encodeURIComponent(video.url)}`);
          downloadUrl = res?.data?.result?.download_url || res?.data?.url;
        } catch (e) {
          console.log("Backup Audio API Failed too.");
        }
      }

      if (!downloadUrl) return reply("❌ *සින්දුව බාගත කිරීම අසාර්ථක විය! සර්වර් සියල්ලම කාර්යබහුලයි. කරුණාකර නැවත උත්සාහ කරන්න.*");

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

      let downloadUrl = null;

      // 🔄 API 1: Cobalt Video Engine (No-Watermark Direct Link)
      try {
        const res = await axios.post("https://cobalt.tools", {
          url: video.url,
          videoQuality: "360"
        }, {
          headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
        downloadUrl = res?.data?.url;
      } catch (e) {
        console.log("Cobalt Video API Failed, trying backup...");
      }

      // 🔄 API 2: Backup YTDL Video API
      if (!downloadUrl) {
        try {
          const res = await axios.get(`https://giftedtech.my.id{encodeURIComponent(video.url)}`);
          downloadUrl = res?.data?.result?.download_url || res?.data?.url;
        } catch (e) {
          console.log("Backup Video API Failed too.");
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

      let downloadUrl = null;

      // 🔄 API 1: Cobalt TikTok Downloader
      try {
        const res = await axios.post("https://cobalt.tools", {
          url: q
        }, {
          headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
        downloadUrl = res?.data?.url;
      } catch (e) {
        console.log("Cobalt TikTok API Failed, trying backup...");
      }

      // 🔄 API 2: Backup TikTok API
      if (!downloadUrl) {
        try {
          const res = await axios.get(`https://giftedtech.my.id{encodeURIComponent(q)}`);
          downloadUrl = res?.data?.result?.video_hd || res?.data?.result?.video;
        } catch (e) {
          console.log("Backup TikTok API Failed.");
        }
      }

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
