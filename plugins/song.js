const { cmd, commands } = require("../command");
const yts = require("yt-search");
const { ytmp3 } = require("@vreden/youtube_scraper");

cmd(
  {
    pattern: "song",
    alias: ["play", "music", "ytmp3"],
    react: "🎶",
    desc: "Download YouTube songs as MP3 audio/document.",
    category: "download",
    filename: __filename,
  },
  async (danuwa, mek, m, { from, quoted, body, args, q, pushname, reply }) => {
    try {
      // 1. පරිශීලකයා නමක් හෝ ලින්ක් එකක් ලබා දී ඇත්දැයි බැලීම
      if (!q) return reply("⚠️ *කරුණාකර සින්දුවක නමක් හෝ YouTube ලින්ක් එකක් ඇතුළත් කරන්න!*");

      // JID එක සදහා ආරක්ෂිතව String එකක් ලබා ගැනීම
      const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

      // 2. දත්ත ලබා ගන්නා තෙක් 'Loading' පණිවිඩය යැවීම
      const loadingMsg = await danuwa.sendMessage(targetJid, { 
        text: `⚡ *CYBER THENUVA SEARCHING SONG...*` 
      }, { quoted: mek });

      const search = await yts(q);
      if (!search.videos || search.videos.length === 0) {
        return await danuwa.sendMessage(targetJid, { 
          text: "❌ *සින්දුව සොයාගත නොහැකි විය! කරුණාකර නම නැවත පරීක්ෂා කරන්න.*", 
          edit: loadingMsg.key 
        });
      }
      
      const data = search.videos[0];
      const url = data.url;

      // CYBER X THENULA ස්ටයිල් එකට සකස් කළ විස්තර පත්‍රිකාව (Image Caption)
      let detailsText = `👋 HELLOW ${pushname || "User"} ❤️ Welcome to\n`;
      detailsText += `CYBER X THENULA\n\n`;
      detailsText += `✅CYBER THENULA X MD✅\n`;
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
      detailsText += `📥 *DOWNLOADING AUDIO FILE* 📥\n`;
      detailsText += `─── ── ─●●●─ ── ───\n\n\n`; // යට කැපීම වැළැක්වීමේ Padding

      // විස්තර පණිවිඩය වෙනස් කිරීම සහ පින්තූරය සමඟ යැවීම
      await danuwa.sendMessage(targetJid, { text: `✅ *Song Found! Processing...*` }, { edit: loadingMsg.key });
      
      await danuwa.sendMessage(
        targetJid,
        { image: { url: data.thumbnail }, caption: detailsText },
        { quoted: mek }
      );

      // 3. කාලය පරීක්ෂා කිරීම (විනාඩි 30 සීමාව)
      let durationParts = data.timestamp.split(":").map(Number);
      let totalSeconds =
        durationParts.length === 3
          ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]
          : durationParts[0] * 60 + durationParts[1];

      if (totalSeconds > 1800) {
        return reply("⏳ *කණගාටුයි, විනාඩි 30 කට වඩා දිගු ශ්‍රව්‍ය ගොනු සඳහා සහය නොදක්වයි.*");
      }

      // 4. යූටියුබ් වෙතින් සින්දුව ඩවුන්ලෝඩ් කර ගැනීම
      const quality = "192";
      const songData = await ytmp3(url, quality);

      if (!songData || !songData.download || !songData.download.url) {
        return reply("❌ *බාගත කිරීමේ ලින්ක් එක ලබා ගැනීමට නොහැකි විය. පසුව නැවත උත්සාහ කරන්න.*");
      }

      // 5. වට්සැප් එකට Audio එකක් ලෙස යැවීම
      await danuwa.sendMessage(
        targetJid,
        {
          audio: { url: songData.download.url },
          mimetype: "audio/mp4",
        },
        { quoted: mek }
      );

      // 6. වට්සැප් එකට Document එක සමඟ යන Caption එක
      let docCaption = `✅ *DOWNLOAD SUCCESS* ✅\n`;
      docCaption += `╭───────────────────.★*\n`;
      docCaption += `│  ◦ 👤 *User :* ${pushname || "User"}\n`;
      docCaption += `│  ◦ 🎶 *Song :* ${data.title}\n`;
      docCaption += `│  ◦ 🎞 *Status :* Audio Document Sent\n`;
      docCaption += `╰───────────────────.★*\n\n`;
      docCaption += `*©⚡ POWERED by CYBER THENUVA* 🚀\n\n\n`; // යට කැපීම වැළැක්වීමේ Padding

      // වට්සැප් එකට Document එකක් ලෙස සෘජුවම යැවීම
      await danuwa.sendMessage(
        targetJid,
        {
          document: { url: songData.download.url },
          mimetype: "audio/mpeg",
          fileName: `${data.title}.mp3`,
          caption: docCaption,
        },
        { quoted: mek }
      );

    } catch (e) {
      console.log(e);
      reply(`❌ *Error:* ${e.message || e} 😞`);
    }
  }
);
