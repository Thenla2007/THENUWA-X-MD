const { cmd, commands } = require("../command");
const getFbVideoInfo = require("@xaviabot/fb-downloader");

cmd(
  {
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    react: "📥",
    desc: "Download Facebook Videos in HD/SD quality effortlessly.",
    category: "download",
    filename: __filename,
  },
  async (danuwa, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
      // JID එක නිවැරදිව ලබා ගැනීම
      const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

      // 1. ලින්ක් එක ලබා දී ඇත්දැයි සහ එය නිවැරදිදැයි පරීක්ෂා කිරීම
      if (!q) {
        return reply("⚠️ *කරුණාකර වලංගු Facebook වීඩියෝ ලින්ක් එකක් ඇතුළත් කරන්න!* \n_Example: .fb https://facebook.com..._");
      }

      const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
      if (!fbRegex.test(q)) {
        return reply("❌ *වැරදි ලින්ක් එකක්! කරුණාකර නැවත පරීක්ෂා කර උත්සාහ කරන්න.*");
      }

      // 2. දත්ත ලබා ගන්නා තෙක් 'Loading' පණිවිඩය යැවීම
      const loadingMsg = await danuwa.sendMessage(targetJid, { 
        text: `⚡ *CYBER THENUVA FETCHING DATA...*` 
      }, { quoted: mek });

      // 3. API මඟින් වීඩියෝ තොරතුරු ලබා ගැනීම
      const videoData = await getFbVideoInfo(q);
      if (!videoData || (!videoData.sd && !videoData.hd)) {
        return await danuwa.sendMessage(targetJid, { 
          text: "❌ *වීඩියෝව බාගත කිරීමට නොහැකි විය. මෙය පුද්ගලික (Private) වීඩියෝවක් හෝ කැඩුණු ලින්ක් එකක් විය හැක.*", 
          edit: loadingMsg.key 
        });
      }

      const { title, sd, hd } = videoData;
      
      //Alive ස්ටයිල් එකට වීඩියෝ විස්තරය ලස්සනට සකස් කිරීම
      let detailsText = `╭━━━〔 *CYBER-THENUVA-MD* 〕━━━┈⊷\n`;
      detailsText += `┃\n`;
      detailsText += `┃ 📥 *𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥* 📥\n`;
      detailsText += `┃\n`;
      detailsText += `┃ 📝 *𝗧𝗶𝘁𝗹𝗲:* ${title || "Facebook Video"}\n`;
      detailsText += `┃ 🌐 *𝗨𝗥𝗟:* ${q}\n`;
      detailsText += `┃ ✨ *𝗤𝘂𝗮𝗹𝗶𝘁𝗶𝗲𝘀:* ${hd ? "✅ HD [High]" : ""} ${sd ? "✅ SD [Standard]" : ""}\n`;
      detailsText += `┃\n`;
      detailsText += `┃ > ® 📥 DOWNLOADING VIDEO FILE 📥 ⏳\n`;
      detailsText += `╰━━━━━━━━━━━━━━━━━━━━━━┈⊷`;

      // විස්තර පණිවිඩය යාවත්කාලීන කිරීම (ලෝඩින් මැසේජ් එක වෙනුවට)
      await danuwa.sendMessage(targetJid, { 
        text: detailsText,
        edit: loadingMsg.key
      });

      // 4. තත්ත්වයෙන් උසස්ම වීඩියෝ ලින්ක් එක තෝරා ගැනීම
      const downloadUrl = hd || sd;
      const finalQuality = hd ? "HD Quality (High)" : "SD Quality (Standard)";

      // 5. වීඩියෝ ෆයිල් එක සෘජුවම WhatsApp වෙත අප්ලෝඩ් කිරීම
      let videoCaption = `╭━━━〔 *DOWNLOAD SUCCESS* 〕━━━┈⊷\n`;
      videoCaption += `┃\n`;
      videoCaption += `┃ ✨ *𝗦𝘁𝗮𝘁𝘂𝘀:* Successfully Downloaded!\n`;
      videoCaption += `┃ 🖼️ *𝗤𝘂𝗮𝗹𝗶𝘁𝘆:* ${finalQuality}\n`;
      videoCaption += `┃\n`;
      videoCaption += `┃  *©⚡ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗯𝘆 𝗖𝗬𝗕𝗘𝗥 𝗧𝗛𝗘𝗡𝗨𝗩𝗔* 🚀\n`;
      videoCaption += `╰━━━━━━━━━━━━━━━━━━━━━━┈⊷`;

      await danuwa.sendMessage(
        targetJid,
        {
          video: { url: downloadUrl },
          caption: videoCaption,
        },
        { quoted: mek }
      );

    } catch (error) {
      console.error("FB Downloader Error:", error);
      reply(`❌ *Error occurred:* ${error.message || error}`);
    }
  }
);
