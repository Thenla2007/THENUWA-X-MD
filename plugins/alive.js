const config = require('../config')
const { cmd, commands } = require('../command')
const os = require("os")
const { runtime } = require('../lib/functions')

cmd({
    pattern: "alive",
    react: "🟢",
    desc: "Check bot online status",
    category: "main",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
try {

let aliveMessage = `🟢 *ALIVE NOW* 🟢

👋 HELLOW...*${pushname || 'User'}* ❤️ Welcome to CYBER X THENULA

✅ *CYBER THENULA X MD IS ONLINE* ✅

╭┈───────────────•* 
│  ◦ 🕒 *Runtime* :  ${runtime(process.uptime())}
│  ◦ ⚡ *Mode* :  *[${config.MODE}]*
│  ◦ ⚙️ *Prefix* : *[${config.PREFIX}]*
│  ◦ 🤖 *Name Bot* : *THENUVA XMD*
│  ◦ 👤 *Creator* : *Thenula/Dilshan*
│  ◦ 📌 *Version* : *ᴠ.2.0.0*
╰┈───────────────•*

> *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗖𝗬𝗕𝗘𝗥 𝗫 𝗠𝗗⁴³²*`;

// Image එක සහ Newsletter Forwarding එක සමඟ සෙන්ඩ් කිරීම
await conn.sendMessage(
    from,
    {
        image: { url: `https://ibb.co` },
        caption: aliveMessage,
        contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363420387793916@newsletter',
                newsletterName: 'THENUVA XMD',
                serverMessageId: 143
            }
        }
    },
    { quoted: mek }
);

} catch (e) {
    console.log(e);
    reply(`${e}`);
}
});
