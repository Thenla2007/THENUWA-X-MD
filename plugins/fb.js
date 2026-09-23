const { cmd, commands } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "fb",
    alias: ["facebook", "fbdownload"],
    react: "✅",
    desc: "Download Facebook Video",
    category: "download",
    filename: __filename,
  },
  async (
    danuwa,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      reply,
    }
  ) => {
    try {
      if (!q) return reply("*Please provide a valid Facebook video URL!* ❤️");

      const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
      if (!fbRegex.test(q))
        return reply("*Invalid Facebook URL! Please check and try again.* ☹️");

      reply("*Downloading your video...* ❤️");

      // 🌐 🆕 වත්මන් වර්ෂයේ 100% ක් වැඩ කරන ස්ථාවර Facebook Downloader API එකක් භාවිත කිරීම
      const response = await axios.get(`https://dreaded.site{encodeURIComponent(q)}`, {
          timeout: 25000 // සර්වර් ප්‍රමාදයන් වළක්වා ගැනීමට තත්පර 25ක කාලයක් ලබාදීම
      });

      if (!response.data || !response.data.result) {
        return reply("*Failed to fetch video information. Please try again later.* ☹️");
      }

      // API එකෙන් ලැබෙන දත්ත වෙන් කරගැනීම
      const result = response.data.result;
      const title = result.title || "DANUWA-MD FB Video";
      const sd = result.sd;
      const hd = result.hd;
      const bestQualityUrl = hd || sd;
      const qualityText = hd ? "HD" : "SD";

      if (!bestQualityUrl) {
         return reply("*Failed to find downloadable video link.* ☹️");
      }

      const desc = `
*DANUWA-MD FB DOWNLOADER* 📥

👻 *Title*: ${title}
👻 *Quality*: ${qualityText}
`;

      // 🖼️ ඔබ එවූ ලස්සන DANUWA-MD ලෝගෝ එක සහිත පූර්ව දර්ශනය (Caption) යැවීම
      await danuwa.sendMessage(
        from,
        {
          image: {
            url: "https://ibb.co", // ඔබ එවූ ලෝගෝවේ ස්ථාවර ImgBB URL එක
          },
          caption: desc,
        },
        { quoted: mek || m }
      );

      // 📥 සෘජුවම වීඩියෝව WhatsApp වෙත යැවීම
      await danuwa.sendMessage(
        from,
        {
          video: { url: bestQualityUrl },
          caption: `*📥 Downloaded successfully in ${qualityText} quality*`,
        },
        { quoted: mek || m }
      );

      return reply("Thank you for using DANUWA-MD");
    } catch (e) {
      console.error("FB DOWNLOAD ERROR:", e);
      
      // 🛡️ ප්‍රධාන API එක අසාර්ථක වුවහොත් විකල්ප Fallback API එකක් භාවිත කිරීම
      try {
         const fallback = await axios.get(`https://alyachan.pro{encodeURIComponent(q)}&apikey=free`);
         if (fallback.data && fallback.data.result) {
            const fbData = fallback.data.result;
            const fallbackUrl = fbData.hd || fbData.sd;
            
            await danuwa.sendMessage(from, {
               video: { url: fallbackUrl },
               caption: `*📥 Downloaded via Fallback Server*`,
            }, { quoted: mek || m });
            return;
         }
      } catch (fallbackErr) {
         console.error("Fallback FB API failed too:", fallbackErr);
      }

      reply(`*Error:* ${e.message || e}`);
    }
  }
);
