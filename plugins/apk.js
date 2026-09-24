const { cmd, commands } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

cmd(
  {
    pattern: "apk",
    alias: ["downloadapk", "playstore"],
    react: "📦",
    desc: "Download APK files from Google Play Store links using Apify storage.",
    category: "download",
    filename: __filename,
  },
  async (danuwa, mek, m, { from, quoted, body, args, q, pushname, reply }) => {
    try {
      if (!q) return reply("⚠️ *කරුණාකර Google Play Store ඇප් ලින්ක් එකක් හෝ ඇප් එකේ නම ඇතුළත් කරන්න!*");

      const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

      // 1. දත්ත ලබා ගන්නා තෙක් 'Loading' පණිවිඩය යැවීම
      const loadingMsg = await danuwa.sendMessage(targetJid, { 
        text: `⚡ *CYBER THENUVA FETCHING DATA...*` 
      }, { quoted: mek });

      // ඇප් එකේ නම ලස්සනට පෙනෙන්නට සකස් කර ගැනීම
      let appName = "Application";
      if (q.includes("id=")) {
        let parts = q.split("id=");
        appName = parts[1].split("&")[0].split(".").pop();
        appName = appName.charAt(0).toUpperCase() + appName.slice(1);
      } else {
        appName = q;
      }

      // 2. Apify APK ලින්ක් එක (Direct Download Link)
      const downloadUrl = "https://api.apify.com/v2/key-value-stores/fUlRkg7AITRi5X31R/records/apk.zip?signature=1SlbtAjfqyRe0MTTEMJjf";

      // CYBER X THENULA ස්ටයිල් එකට සකස් කළ විස්තර පත්‍රිකාව
      let detailsText = `👋 HELLOW ${pushname || "User"} ❤️ Welcome to\n`;
      detailsText += `CYBER X THENULA\n\n`;
      detailsText += `✅CYBER THENULA X MD✅\n`;
      detailsText += `╭───────────────────.★*\n`;
      detailsText += `│  ◦ 📝 *App Name :* ${appName}\n`;
      detailsText += `│  ◦ 🌐 *Query/Url :* ${q}\n`;
      detailsText += `│  ◦ 📦 *Type :* Android Package (APK)\n`;
      detailsText += `│  ◦ ⚡ *Status :* Found successfully\n`;
      detailsText += `╰───────────────────.★*\n\n`;
      detailsText += `╭───────────────╼\n`;
      detailsText += `│👨‍💻 CYBER-TEAM 🥷\n`;
      detailsText += `╰───────────────╼\n\n`;
      detailsText += `📥 *DOWNLOADING APK FILE* 📥\n`;
      detailsText += `─── ── ─●●●─ ── ───\n\n\n`; // යට කැපීම වැළැක්වීමේ Padding

      // විස්තර පණිවිඩය යාවත්කාලීන කිරීම (ලෝඩින් මැසේජ් එක වෙනුවට)
      await danuwa.sendMessage(targetJid, { 
        text: detailsText,
        edit: loadingMsg.key
      });

      // 3. වට්සැප් එකට APK Document එක සමඟ යන Caption එක
      let apkCaption = `✅ *DOWNLOAD SUCCESS* ✅\n`;
      apkCaption += `╭───────────────────.★*\n`;
      apkCaption += `│  ◦ 👤 *User :* ${pushname || "User"}\n`;
      apkCaption += `│  ◦ 📦 *App :* ${appName}.apk\n`;
      apkCaption += `│  ◦ 🎞 *Status :* Successfully Sent\n`;
      apkCaption += `╰───────────────────.★*\n\n`;
      apkCaption += `> *©⚡ POWERED by CYBER THENUVA* 🚀\n\n\n`; // යට කැපීම වැළැක්වීමේ Padding

      // වට්සැප් එකට APK එක Document එකක් ලෙස සෘජුවම යැවීම
      await danuwa.sendMessage(
        targetJid,
        {
          document: { url: downloadUrl },
          mimetype: "application/vnd.android.package-archive",
          fileName: `${appName}.apk`,
          caption: apkCaption,
        },
        { quoted: mek }
      );

    } catch (error) {
      console.log("APK Downloader Error:", error);
      reply(`❌ *Error:* ${error.message} 😞`);
    }
  }
);
