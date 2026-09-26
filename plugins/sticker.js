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
  mime,
  isGroup
}) => {
  try {
    // 1. මැසේජ් එක හෝ Quoted මැසේජ් එක පරීක්ෂා කිරීම (Image/Video ද කියා)
    if (!m.message && !quoted) return reply("⚠️ කරුණාකර ඡායාරූපයකට (Image) හෝ වීඩියෝවකට (Video/GIF) `.sticker` ලෙස *Reply* කරන්න.");
    
    // Mime Type එක නිවැරදිව හඳුනා ගැනීම
    const targetMime = mime || quoted?.mime || '';
    
    if (!/image|video|gif/g.test(targetMime)) {
      return reply("❌ අලංගු Format එකක්! ස්ටිකර් සෑදිය හැක්කේ Images, Videos හෝ GIFs වලින් පමණි.");
    }

    // 2. වීඩියෝ එකක් නම් තත්පර 10කට වඩා අඩුදැයි බැලීම (WhatsApp සීමාවන් නිසා)
    if (/video/g.test(targetMime) && (quoted?.seconds || m.message?.videoMessage?.seconds) > 10) {
      return reply("⚠️ වීඩියෝ ස්ටිකර් සඳහා වීඩියෝවේ ධාවන කාලය *තත්පර 10 කට වඩා අඩු* විය යුතුය.");
    }

    // Processing මැසේජ් එකක් යැවීම
    await conn.sendMessage(from, { text: "⏳ *ස්ටිකරය සකසමින් පවතී, කරුණාකර රැඳී සිටින්න...*" }, { quoted: m });

    // 3. මීඩියා ෆයිල් එක ඩවුන්ලෝඩ් කර ගැනීම
    const mediaBuffer = await (quoted ? quoted.download() : m.download());
    if (!mediaBuffer) return reply("❌ මීඩියා ෆයිල් එක බාගත කිරීමට (Download) නොහැකි විය. නැවත උත්සාහ කරන්න.");

    // 4. ස්ටිකර් එක නිර්මාණය කිරීම සහ Pack/Author විස්තර ඇතුළත් කිරීම
    // (ඔයාගේ බොට්ගේ නම වන DENETH-MD හෝ QUEEN ELISA-MD මෙතනට දාන්න පුළුවන්)
    const sticker = new Sticker(mediaBuffer, {
      pack: 'DARK SHADOW-MD 🛡️', // Pack Name
      author: 'DARK SHADOW 👤',     // Author Name
      type: StickerTypes.FULL,    // Sticker Type: FULL හෝ CROPPED
      categories: ['🤩', '🎉'],
      id: m.key.id,
      quality: 70                 // High Quality Output
    });

    const stickerBuffer = await sticker.toBuffer();

    // 5. සාර්ථකව නිම වූ ස්ටිකරය සමූහයට හෝ චැට් එකට යැවීම
    await conn.sendMessage(from, { 
      sticker: stickerBuffer 
    }, { quoted: m });

  } catch (error) {
    console.error("Sticker Plugin Error:", error);
    return reply("❌ ස්ටිකරය සෑදීමේදී දෝෂයක් ඇති විය: " + error.message);
  }
});
