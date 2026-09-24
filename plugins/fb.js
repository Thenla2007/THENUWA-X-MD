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
        text: `⏳ *Fetching data from Facebook... Please wait.*` 
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
      
      // වීඩියෝ විස්තරය ලස්සනට සකස් කිරීම
      let detailsText = `╔════════════════════════╗\n`;
      detailsText += `   *📥CYBER THENUVA FB DOWNLOADER📥* \n`;
      detailsText += `╚════════════════════════╝\n\n`;
      detailsText += `📝 *Title:* ${title || "Facebook Video"}\n`;
      detailsText += `🌐 *URL:* ${q}\n\n`;
      detailsText += `✨ *Available Qualities:* ${hd ? "✅ HD [High]" : ""} ${sd ? "✅ SD [Standard]" : ""}\n\n`;
      detailsText += `> *Sending the best quality video file...* 🚀`;

      // විස්තර පණිවිඩය යාවත්කාලීන කිරීම (ලෝඩින් මැසේජ් එක වෙනුවට)
      await danuwa.sendMessage(targetJid, { 
        text: detailsText,
        edit: loadingMsg.key
      });

      // 4. තත්ත්වයෙන් උසස්ම වීඩියෝ ලින්ක් එක තෝරා ගැනීම
      const downloadUrl = hd || sd;
      const finalQuality = hd ? "HD Quality" : "SD Quality";

      // 5. වීඩියෝ ෆයිල් එක සෘජුවම WhatsApp වෙත අප්ලෝඩ් කිරීම
      await danuwa.sendMessage(
        targetJid,
        {
          video: { url: downloadUrl },
          caption: `*✨ Successfuly Downloaded!* \n🖼️ *Quality:* ${finalQuality}\n\n> *©⚡ POWERED by CYBER THENUVA* 🚀`,
        },
        { quoted: mek }
      );

    } catch (error) {
      console.error("FB Downloader Error:", error);
      reply(`❌ *Error occurred:* ${error.message || error}`);
    }
  }
);
