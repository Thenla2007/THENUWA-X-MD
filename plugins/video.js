const { cmd, commands } = require("../command");
const yts = require("yt-search");
const axios = require("axios");
const config = require("../config");

cmd(
  {
    pattern: "video",
    alias: ["playvideo", "ytmp4"],
    react: "🎬",
    desc: "Download YouTube videos using Apify.",
    category: "download",
    filename: __filename,
  },
  async (danuwa, mek, m, { from, quoted, body, args, q, pushname, reply }) => {
    try {
      if (!q) return reply("⚠️ *කරුණාකර වීඩියෝවක නමක් හෝ YouTube ලින්ක් එකක් ඇතුළත් කරන්න!*");

      const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

      // 1. සෙවුම ආරම්භ කරන විට Loading පණිවිඩය යැවීම
      const loadingMsg = await danuwa.sendMessage(targetJid, { 
        text: `⚡ *CYBER THENUWA SEARCHING VIDEO...*` 
      }, { quoted: mek });

      const search = await yts(q);
      if (!search.videos || search.videos.length === 0) {
        return await danuwa.sendMessage(targetJid, { 
          text: "❌ *වීඩියෝව සොයාගත නොහැකි විය!*", 
          edit: loadingMsg.key 
        });
      }
      
      const data = search.videos[0];

      // CYBER X THENULA ස්ටයිල් එකට සකස් කළ විස්තර පත්‍රිකාව
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
      selectedText = `╰───────────────╼\n\n`;
      detailsText += `📢 *Join Our Channel:* https://whatsapp.com\n\n`;
      detailsText += `📥 *DOWNLOADING VIDEO FILE VIA APIFY...* 📥\n`;
      detailsText += `─── ── ─●●●─ ── ───\n\n\n`;

      // සෙවුම් පණිවිඩය වෙනස් කර පින්තූරය සමඟ විස්තර යැවීම
      await danuwa.sendMessage(targetJid, { text: `✅ *Video Found! Processing with Apify...*` }, { edit: loadingMsg.key });
      
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

      // 2. ඔයාගේ Apify API Token එක සහ ලින්ක් එක නිවැරදිව සැකසීම
      const APIFY_TOKEN = "apify_api_o26QUamyP05T5mIlQUZ974yUGLJTed0dScHR";
      const startUrl = "https://apify.com" + APIFY_TOKEN;
      
      // Apify Actor එක ක්‍රියාත්මක කිරීම
      const runActor = await axios.post(startUrl, {
        startUrls: [
          {
            url: data.url
          }
        ]
      });

      const runId = runActor.data.data.id;

      // Actor එක සාර්ථකව රන් වී දත්ත සකස් වන තෙක් තත්පර 15ක් රැඳී සිටීම
      await new Promise(resolve => setTimeout(resolve, 15000));

      // 3. නිමැවුම් දත්ත ගබඩාවෙන් (Dataset) වීඩියෝ ලින්ක් එක ලබා ගැනීම
      const datasetUrl = "https://apify.com" + runId + "/dataset/items?token=" + APIFY_TOKEN;
      const datasetResult = await axios.get(datasetUrl);

      if (!datasetResult.data || datasetResult.data.length === 0) {
        return reply("❌ *Apify හරහා දත්ත ලබා ගැනීමට අපොහොසත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*");
      }

      // Actor එකෙන් ලැබෙන පළමු අයිතමයේ වීඩියෝ සබැඳිය ලබා ගැනීම
      const videoDataItem = datasetResult.data[0];
      const downloadUrl = videoDataItem ? (videoDataItem.videoUrl || videoDataItem.downloadUrl || videoDataItem.fileUrl || videoDataItem.url) : null;

      if (!downloadUrl) {
        return reply("❌ *වීඩියෝ බාගත කිරීමේ සබැඳිය (Direct MP4 Link) සොයාගත නොහැකි විය.*");
      }

      // 4. වට්සැප් එකට වීඩියෝ (MP4) එක සමඟ යන Caption එක
      let videoCaption = `✅ *DOWNLOAD SUCCESS* ✅\n`;
      videoCaption += `╭───────────────────.★*\n`;
      videoCaption += `│  ◦ 👤 *User :* ${pushname || "User"}\n`;
      videoCaption += `│  ◦ 🎬 *Video :* ${data.title}\n`;
      videoCaption += `│  ◦ 🎞 *Status :* Video File Sent\n`;
      videoCaption += `╰───────────────────.★*\n\n`;
      videoCaption += `📢 *Channel:* https://whatsapp.com\n`;
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
