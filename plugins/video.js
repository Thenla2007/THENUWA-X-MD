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

// 📥 Y2Mate Direct Scraper Function (කිසිදා ක්‍රෑෂ් නොවන ස්ථාවර සිස්ටම් එක)
async function y2mateScrape(youtubeUrl, type = "mp4", quality = "360p") {
  try {
    const analyzeRes = await axios.post("https://tomp3.cc", new URLSearchParams({
      query: youtubeUrl,
      vt: "home"
    }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }
    });

    const vidId = analyzeRes.data?.vid;
    const links = analyzeRes.data?.links?.[type];
    if (!vidId || !links) return null;

    // නිවැරදි Quality key එක සොයා ගැනීම (උදා: 'mp3128' හෝ '360p')
    let k = Object.keys(links)[0];
    if (type === "mp4") {
      const match = Object.values(links).find(q => q.q === quality || q.q.includes(quality));
      if (match) k = match.k;
    } else {
      const match = Object.values(links).find(q => q.q === "128kbps" || q.q.includes("128"));
      if (match) k = match.k;
    }

    const convertRes = await axios.post("https://tomp3.cc", new URLSearchParams({
      vid: vidId,
      k: k
    }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }
    });

    return convertRes.data?.dlink || null;
  } catch (e) {
    console.error("Y2Mate Scraping Error:", e);
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

      // 🔄 1. Y2Mate Direct Scraper එක මඟින් උත්සාහ කිරීම
      let downloadUrl = await y2mateScrape(video.url, "mp3");

      // 🔄 2. Backup Fallback: Cobalt API Engine
      if (!downloadUrl) {
        try {
          const res = await axios.post("https://cobalt.tools", {
            url: video.url,
            downloadMode: "audio",
            audioFormat: "mp3"
          }, { headers: { "Accept": "application/json" } });
          downloadUrl = res?.data?.url;
        } catch (e) {
          console.log("Cobalt Backup Failed.");
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

      reply("⬇️ *Downloading Video file...* ⏳");

      // 🔄 1. Y2Mate Direct Scraper එක මඟින් උත්සාහ කිරීම
      let downloadUrl = await y2mateScrape(video.url, "mp4", "360p");

      // 🔄 2. Backup Fallback: Cobalt API Engine
      if (!downloadUrl) {
        try {
          const res = await axios.post("https://cobalt.tools", {
            url: video.url,
            videoQuality: "360"
          }, { headers: { "Accept": "application/json" } });
          downloadUrl = res?.data?.url;
        } catch (e) {
          console.log("Cobalt Backup Failed.");
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
