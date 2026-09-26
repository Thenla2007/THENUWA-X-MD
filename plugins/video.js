const { cmd } = require("../command");
const { ytmp3, ytmp4, tiktok } = require("sadaslk-dlcore");
const yts = require("yt-search");

// 🎥 යූටියුබ් වීඩියෝ තොරතුරු සෙවීමේ පහසුකම
async function getYoutube(query) {
  try {
    const isUrl = /(youtube\.com|youtu\.be)/i.test(query);
    if (isUrl) {
      // ලින්ක් එකකින් ID එක වෙන් කර ගැනීම (Short and long URLs)
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
        `👀 *Views:* ${video.views ? video.views.toLocaleString() : '0'}\n` +
        `🔗 *Link:* ${video.url}`;

      // වීඩියෝවේ පෝස්ටරය සහ විස්තර යැවීම
      await bot.sendMessage(
        from,
        {
          image: { url: video.thumbnail || "https://files.catbox.moe/jgnhg4.jpg" },
          caption,
        },
        { quoted: mek }
      );

      reply("⬇️ *Downloading MP3 file...* ⏳");

      const data = await ytmp3(video.url).catch(e => {
        console.error("ytmp3 core error:", e);
        return null;
      });

      if (!data || !data.url) return reply("❌ *සින්දුව බාගත කිරීම (Download) අසාර්ථක විය! API එකේ ගැටලුවකි.*");

      // ඕඩියෝ එක WhatsApp වෙත යැවීම
      await bot.sendMessage(
        from,
        {
          audio: { url: data.url },
          mimetype: "audio/mpeg",
        },
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
        `👀 *Views:* ${video.views ? video.views.toLocaleString() : '0'}\n` +
        `📅 *Uploaded:* ${video.ago || 'Recent'}\n` +
        `🔗 *Link:* ${video.url}`;

      // වීඩියෝ පෝස්ටරය යැවීම
      await bot.sendMessage(
        from,
        {
          image: { url: video.thumbnail || "https://files.catbox.moe/jgnhg4.jpg" },
          caption,
        },
        { quoted: mek }
      );

      reply("⬇️ *Downloading Video file...* ⏳");

      const data = await ytmp4(video.url, {
        format: "mp4",
        videoQuality: "360",
      }).catch(e => {
        console.error("ytmp4 core error:", e);
        return null;
      });

      if (!data || !data.url) return reply("❌ *වීඩියෝව බාගත කිරීම (Download) අසාර්ථක විය! API එකේ ගැටලුවකි.*");

      // වීඩියෝව WhatsApp වෙත යැවීම
      await bot.sendMessage(
        from,
        {
          video: { url: data.url },
          mimetype: "video/mp4",
          fileName: data.filename || `${video.title}.mp4`,
          caption: `🎬 *${video.title}* \n\n> *Successfully Downloaded!* ✅`,
          gifPlayback: false,
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

      const data = await tiktok(q).catch(e => {
        console.error("tiktok core error:", e);
        return null;
      });

      if (!data || !data.no_watermark)
        return reply("❌ *TikTok වීඩියෝව බාගත කිරීම අසාර්ථක විය! ලින්ක් එක පෞද්ගලික (Private) එකක් විය හැක.*");

      const caption =
        `📱 *${data.title || "TikTok Video"}*\n\n` +
        `👤 *Author:* ${data.author || "Unknown"}\n` +
        `⏱ *Duration:* ${data.runtime || '0'}s`;

      // TikTok වීඩියෝව යැවීම
      await bot.sendMessage(
        from,
        {
          video: { url: data.no_watermark },
          caption: caption + `\n\n> *Successfully Downloaded!* ✅`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("TIKTOK COMMAND ERROR:", e);
      reply("❌ *Error while downloading TikTok video!*");
    }
  }
);
