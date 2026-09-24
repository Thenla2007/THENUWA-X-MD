const pushname = m.pushName || 'User';
const { cmd } = require('../command');
const config = require('../config');
const path = require('path');
const fs = require('fs');

const audioPath = path.join(__dirname, '../media/goku_owner.mp3');

cmd({
    pattern: "owner",
    alias: ["dev", "dila", "bot"],
    react: "✅",
    desc: "Get owner number",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const ownerNumber = "94783747285";
        const ownerName = "CYBER X THENULA";
        const ownerEmail = config.OWNER_EMAIL || "dilamd@gmail.com";

        const cleanNumber = ownerNumber.replace(/[^0-9]/g, '');

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
N:${ownerName};;;
ORG:THENUWA X MD
TITLE:Founder & Developer
TEL;TYPE=CELL,VOICE;waid=${cleanNumber}:${ownerNumber}
EMAIL:${ownerEmail}
NOTE:Official contact card of THENUWA X MD
END:VCARD
`;

        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

        await conn.sendMessage(from, {
            image: {
                url: 'https://i.ibb.co/N68698yW/5df1e9c651fd.jpg'
            },
            caption: `👋 HELLOW...*${pushname || 'User'}* ❤️ I am owner NOW CYBER X THENULA
            
            ╭┈───────────────•* 
│  ◦ 🕒 *Runtime* :  ${runtime(process.uptime())}
│  ◦ ⚡ *Mode* :  *[${config.MODE}]*
│  ◦ ⚙️ *Prefix* : *[${config.PREFIX}]*
│  ◦ 🤖 *Name Bot* : *THENUVA XMD*
│  ◦ 👤 *Owner* : *Thenula/Dilshan*
│  ◦ 📌 *Version* : *ᴠ.2.0.0*
╰┈───────────────•*
            

> © ⚡POWERED by CYBER THENUVA`,
            contextInfo: {
                mentionedJid: [`${cleanNumber}@s.whatsapp.net`],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363429118791328@newsletter',
                    newsletterName: "THENUWA X MD",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        if (fs.existsSync(audioPath)) {
            await conn.sendMessage(from, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: mek });
        }

    } catch (error) {
        console.error("[ERROR] An error occurred:", error);

        await conn.sendMessage(
            from,
            {
                text: `An error occurred: ${error.message}`
            },
            { quoted: mek }
        );
    }
});
