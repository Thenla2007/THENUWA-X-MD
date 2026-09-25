const { cmd, commands } = require("../command");
const yts = require("yt-search");
const axios = require("axios");
const config = require("../config");

cmd(
  {
    pattern: "video",
    alias: ["playvideo", "ytmp4"],
    react: "🎬",
    desc: "Download YouTube videos as MP4 format.",
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

      // CYBER X THENULA ස්ටයිල් එකට සකස් කළ விස්තර පත්‍රිකාව (Image Caption)
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
      detailsText += `📢 *Join Our Channel:* https://whatsapp.com\n\n`;
      detailsText += `📥 *DOWNLOADING VIDEO FILE* 📥\n`;
      detailsText += `─── ── ─●●●─ ── ───\n\n\n`; 

      // සෙවුම් පණිවිඩය වෙනස් කර පින්තූරය සමඟ විස්තර යැවීම
      await danuwa.sendMessage(targetJid, { text: `✅ *Video Found! Processing...*` }, { edit: loadingMsg.key });
      
      await danuwa.sendMessage(
        targetJid,
        { 
          image: { url: data.thumbnail }, 
          caption: detailsText,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363403804248705@newsletter', 
                newsletterName: 'THENUWA XMD', 
                serverMessageId: -1
            }
          }
        },
        { quoted: mek }
      );

      // 2. සැබෑ YouTube ඩවුන්ලෝඩ් API එකක් මඟින් ලින්ක් එක ලබා ගැනීම
      const apiResponse = await axios.get(`https://dreaded.site{encodeURIComponent(data.url)}`);
      
      if (!apiResponse.data || !apiResponse.data.result || !apiResponse.data.result.downloadUrl) {
          return reply("❌ *වීඩියෝව බාගත කිරීමේ සබැඳිය (Download Link) ලබා ගැනීමට නොහැකි විය. කරුණාකර පසුව උත්සාහ කරන්න.*");
      }
      
      const downloadUrl = apiResponse.data.result.downloadUrl;

      // 3. වට්සැප් එකට වීඩියෝ (MP4) එක සමඟ යන Caption එක
      let videoCaption = `✅ *DOWNLOAD SUCCESS* ✅\n`;
      videoCaption += `╭───────────────────.★*\n`;
      videoCaption += `│  ◦ 👤 *User :* ${pushname || "User"}\n`;
      videoCaption += `│  ◦ 🎬 *Video :* ${data.title}\n`;
      videoCaption += `│  ◦ 🎞 *Status :* Video File Sent\n`;
      videoCaption += `╰───────────────────.★*\n\n`;
      videoCaption += `📢 *Channel:* https://whatsapp.com\n\n`;
      videoCaption += `> *©⚡ POWERED by CYBER THENUVA* 🚀\n\n\n`; 

      await danuwa.sendMessage(
        targetJid,
        {
          video: { url: downloadUrl },
          mimetype: "video/mp4",
          caption: videoCaption,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363403804248705@newsletter',
                newsletterName: 'THENUWA XMD',
                serverMessageId: -1
            }
          }
        },
        { quoted: mek }
      );

    } catch (error) {
      console.log(error);
      reply(`❌ *Error:* ${error.message || error} 😞`);
    }
  }
);
