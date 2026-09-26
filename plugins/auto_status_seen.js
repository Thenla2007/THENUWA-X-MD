const { cmd } = require('../command');
const config = require("../config");

// WhatsApp Status (Stories) අලුතින් වැටෙන විට එය හඳුනාගෙන ක්‍රියාත්මක වන කොටස
cmd({
  on: "status"
}, async (conn, m, store, { from, sender }) => {
  try {
    // 1. AUTO STATUS SEEN: පැනලයෙන් මෙය ON කර ඇත්නම් පමණක් Status එක බලයි (Mark Read)
    if (config.AUTO_STATUS_SEEN === 'true' || config.AUTO_STATUS_SEEN === true) {
      await conn.readMessages([m.key]);
      console.log(`👁️ Status Seen: ${sender.split('@')[0]}`);
      
      // 2. AUTO STATUS REACT: පැනලයෙන් මෙය ON කර ඇත්නම් අහඹු ලෙස ඉමෝජි එකක් දමයි
      if (config.AUTO_STATUS_REACT === 'true' || config.AUTO_STATUS_REACT === true) {
        const emojis = ['💝', '💖', '💗', '❤️‍🩹', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '🔥', '✨', '💯'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        await conn.sendMessage(from, {
          react: {
            text: randomEmoji,
            key: m.key
          }
        }, { statusForward: true });
      }

      // 3. AUTO STATUS REPLY: පැනලයෙන් මෙය ON කර ඇත්නම් Inbox එකට reply එකක් යවයි
      if (config.AUTO_STATUS_REPLY === 'true' || config.AUTO_STATUS_REPLY === true) {
        // config.js එකේ සකසා ඇති මැසේජ් එක ලබා ගැනීම (නැතහොත් default මැසේජ් එකක්)
        const replyMsg = config.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY DARK-SHADOW -MD 🤍*";
        
        await conn.sendMessage(sender, {
          text: replyMsg
        }, { quoted: m });
      }
    }
  } catch (error) {
    console.error("❌ Auto Status Error:", error);
  }
});
