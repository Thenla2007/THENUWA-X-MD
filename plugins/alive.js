const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    alias: ["status", "runtime", "uptime"],
    desc: "Check uptime and system status",
    category: "main",
    react: "👨🏻‍💻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Generate system status message
        const status = `👋 HELLOW...*${pushname || 'User'}* ❤️ I am ALIVE NOW CYBER X THENUVA


✅CYBER THENULA X MD✅
╭┈───────────────•* 
│  ◦ 🕒 *Runtime* :  ${runtime(process.uptime())}
│  ◦ ⚡ *mode* :  *[${config.MODE}]*
│  ◦ ⚙️ *prefix* : *[${config.PREFIX}]*
│  ◦ 💾 *Ram use* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
│  ◦ 🤖 *Name Bot* : *THENUVA XMD*
│  ◦ 👤 *creater* : *Thenula/Dilshan*
│  ◦ 📌 *version* : *ᴠ.2.0.0*
│  ◦ 📜 *Menu Cmd* : *menu list*
╰┈───────────────•*


> © ⚡POWERED by CYBER THENUVA`;

        // Send the status message with an image
        await conn.sendMessage(from, { 
            image: { url: `https://files.catbox.moe/jgnhg4.jpg` },  // Image URL
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420387793916@newsletter',
                    newsletterName: 'THENUVA XMD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
