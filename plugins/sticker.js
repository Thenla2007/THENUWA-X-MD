const { cmd } = require('../command');
const config = require("../config");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
  pattern: "sticker",
  alias: ["s", "wm"],
  desc: "Convert image or video/gif to a high-quality WhatsApp sticker",
  category: "convert",
  filename: __filename
}, async (conn, m, store, {
  from,
  reply,
  quoted,
  isGroup
}) => {
  try {
    // 1. Quoted හෝ ප්‍රධාන මැසේජ් එකෙන් මීඩියා වර්ගය (Mime Type) නිවැරදිව ලබා ගැනීම
    let mimeType = "";
    let msgType = "";

    if (quoted) {
      mimeType = quoted.mime || "";
      msgType = quoted.type || "";
    } else if (m.message) {
      // ප්‍රධාන මැසේජ් එකේ වර්ගය සෙවීම
      const types = Object.keys(m.message);
      msgType = types.find(t => t.includes('Message')) || "";
      mimeType = m.message[msgType]?.mime || "";
    }

    // බාහිරින් mime type එක හරියටම ආවේ නැත්නම් msgType එකෙන් force check කිරීම
    const isImage = /image/g.test(mimeType) || msgType === 'imageMessage';
    const isVideo = /video/g.test(mimeType) || msgType === 'videoMessage';

    if (!isImage && !isVideo) {
      return reply("❌ අලංගු Format එකක්! ස්ටිකර් සෑදිය හැක්කේ Images, Videos හෝ GIFs වලින් පමණි.");
    }

    // 2. වීඩියෝ එකක් නම් තත්පර 10 සීමාව බැලීම
    const seconds = quoted?.seconds || m.message?.videoMessage?.seconds || 0;
    if (isVideo && seconds > 10) {
      return reply("⚠️ වීඩියෝ ස්ටිකර් සඳහා වීඩියෝවේ ධාවන කාලය *තත්පර 10 කට වඩා අඩු* විය යුතුය.");
    }

    // Processing මැසේජ් එකක් යැවීම
    await conn.sendMessage(from, { text: "⏳ *ස්ටිකරය සකසමින් පවතී, කරුණාකර රැඳී සිටින්න...*" }, { quoted: m });

    // 3. මීඩියා එක ඩවුන්ලෝඩ් කිරීම
    const mediaBuffer = await (quoted ? quoted.download() : m.download());
    if (!mediaBuffer) return reply("❌ මීඩියා ෆයිල් එක බාගත කිරීමට (Download) නොහැකි විය. නැවත උත්සාහ කරන්න.");

    // 4. ස්ටිකර් එක නිර්මාණය කිරීම
    const sticker = new Sticker(mediaBuffer, {
      pack: 'DARK SHADOW-MD 🛡️', 
      author: 'DARK SHADOW 👤',     
      type: StickerTypes.FULL,    
      categories: ['🤩', '🎉'],
      id: m.key.id,
      quality: 70                 
    });

    const stickerBuffer = await sticker.toBuffer();

    // 5. ස්ටිකරය යැවීම
    await conn.sendMessage(from, { 
      sticker: stickerBuffer 
    }, { quoted: m });

  } catch (error) {
    console.error("Sticker Plugin Error:", error);
    return reply("❌ ස්ටිකරය සෑදීමේදී දෝෂයක් ඇති විය: " + error.message);
  }
});
