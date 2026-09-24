const config = require('../config');
const { cmd } = require('../command');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { runtime } = require('../lib/functions'); // runtime error එක මඟහැරීමට එකතු කරන ලදි

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
        // pushname එක parameter එකක් විදිහට function එක ඇතුළේදීම සකසා ගැනීම
        const pushname = m.pushName || 'User';
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

        // Contact VCard එක යැවීම
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

        // ඔයා එවපු අලුත් real image එක සහ විස්තර යැවීම
        await conn.sendMessage(from, {
            image: {
                url: 'https://i.ibb.co/7JWk0d08/11625411f042.jpg' // ඔයා එවපු Logo Image එකට යාවත්කාලීන කරන ලදි
            },
            caption: `👋 HELLOW...*${pushname}* ❤️ I am owner NOW CYBER X THENULA
            
✅CYBER THENULA X MD✅
╭┈───────────────•* 
│  ◦ 🕒 *Runtime* :  ${runtime(process.uptime())}
│  ◦ ⚡ *Mode* :  *[${config.MODE}]*
│  ◦ ⚙️ *Prefix* : *[${config.PREFIX}]*
│  ◦ 🤖 *Name Bot* : *THENUWA XMD*
│  ◦ 👤 *Owner* : *Thenula/Dilshan*
│  ◦ 📌 *Version* : *ᴠ.2.0.0*
╰┈───────────────•*
            

> © ⚡POWERED by CYBER THENUVA`,
            contextInfo: {
                mentionedJid: [`${cleanNumber}@s.whatsapp.net`, m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363403804248705@newsletter',
                    newsletterName: "THENUWA X MD",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Audio ෆයිල් එකක් තිබේ නම් එය ප්ලේ කිරීම
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
