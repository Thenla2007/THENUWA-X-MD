const { cmd, commands } = require("../command");
const yts = require("yt-search");
const axios = require("axios");
const config = require("../config");

cmd(
  {
    pattern: "video",
    alias: ["playvideo", "ytmp4"],
    react: "🎬",
    desc: "Download YouTube videos as MP4 and Document format.",
    category: "download",
    filename: __filename,
  },
  async (danuwa, mek, m, { from, quoted, body, args, q, pushname, reply }) => {
    try {
      if (!q) return reply("⚠️ *කරුණාකර වීඩියෝවක නමක් හෝ YouTube ලින්ක් එකක් ඇතුළත් කරන්න!*");

      const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

      // 1. දත්ත ලබා ගන්නා තෙක් 'Loading' පණිවිඩය යැවීම
      const loadingMsg = await danuwa.sendMessage(targetJid, { 
        text: `⚡ *CYBER THENUWA SEARCHING VIDEO...*` 
      }, { quoted: mek });

      const search = await yts(q);
      if (!search.videos || search.videos.length === 0) {
        return await danuwa.sendMessage(targetJid, { 
          text: "❌ *වීඩියෝව සොයාගත නොහැකි විය! කරුණාකර නම නැවත පරීක්ෂා කරන්න.*", 
          edit: loadingMsg.key 
        });
      }
      
      const data = search.videos[0];

      // CYBER X THENULA ස්ටයිල් එකට සකස් කළ විස්තර පත්‍රිකාව (Image Caption)
      let detailsText = `👋 HELLOW ${pushname || "User"} ❤️ Welcome to\n`;
      detailsText += `CYBER X THENULA\n\n`;
      detailsText += `✅CYBER THENUWA X MD✅\n`;
      detailsText += `╭───────────────────.★*\n`;
      detailsText += `│  ◦ 📝 *Title :* ${data.title}\n`;
      detailsText += `│  ◦ ⏱️ *Duration :* ${data.timestamp}\n`;
      detailsText += `│  ◦ 📅 *Uploaded :* ${data.ago}\n`;
      detailsText += `│  ◦ 👀 *Views :* ${data.views.toLocaleString()}\n`;
      detailsText += `│  ◦ 🔗 *Url :* ${data.url}\n`;
      detailsText += `╰───────────────────.★*\n\n`;
      detailsText += `╭───────────────╼\n`;
      detailsText += `│👨‍💻 CYBER-TEAM 🥷\n`;
      detailsText += `╰───────────────╼\n\n`;
      detailsText += `📥 *DOWNLOADING VIDEO FILE* 📥\n`;
      detailsText += `─── ── ─●●●─ ── ───\n\n\n`; // යට කැපීම වැළැක්වීමේ Padding

      // සෙවුම් පණිවිඩය වෙනස් කර පින්තූරය සමඟ විස්තර යැවීම
      await danuwa.sendMessage(targetJid, { text: `✅ *Video Found! Processing...*` }, { edit: loadingMsg.key });
      
      await danuwa.sendMessage(
        targetJid,
        { image: { url: data.thumbnail }, caption: detailsText },
        { quoted: mek }
      );

      // 2. Apify Direct Download Link එක
      const downloadUrl = "https://apify.com";

      // 3. වට්සැප් එකට වීඩියෝ (MP4) එක සමඟ යන Caption එක
      let videoCaption = `✅ *DOWNLOAD SUCCESS* ✅\n`;
      videoCaption += `╭───────────────────.★*\n`;
      videoCaption += `│  ◦ 👤 *User :* ${pushname || "User"}\n`;
      videoCaption += `│  ◦ 🎬 *Video :* ${data.title}\n`;
      videoCaption += `│  ◦ 🎞 *Status :* Video File Sent\n`;
      videoCaption += `╰───────────────────.★*\n\n`;
      videoCaption += `> *©⚡ POWERED by CYBER THENUWA* 🚀\n\n\n`; // යට කැපීම වැළැක්වීමේ Padding

      await danuwa.sendMessage(
        targetJid,
        {
          video: { url: downloadUrl },
          mimetype: "video/mp4",
          caption: videoCaption,
        },
        { quoted: mek }
      );

      // 4. වට්සැප් එකට ෆයිල් එකක් (Document/MP3) ලෙස යැවීමේ Caption එක
      let docCaption = `✅ *DOCUMENT SUCCESS* ✅\n`;
      docCaption += `╭───────────────────.★*\n`;
      docCaption += `│  ◦ 👤 *User :* ${pushname || "User"}\n`;
      docCaption += `│  ◦ 🎶 *Audio :* ${data.title}\n`;
      docCaption += `│  ◦ 🎞 *Status :* Audio Document Sent\n`;
      docCaption += `╰───────────────────.★*\n\n`;
      docCaption += `> *©⚡ POWERED by CYBER THENUWA* 🚀\n\n\n`; // යට කැපීම වැළැක්වීමේ Padding

      await danuwa.sendMessage(
        targetJid,
        {
          document: { url: downloadUrl },
          mimetype: "audio/mpeg",
          fileName: `${data.title}.mp3`,
          caption: docCaption,
        },
        { quoted: mek }
      );

    } catch (error) {
      console.log(error);
      reply(`❌ *Error:* ${error.message || error} 😞`);
    }
  }
);
