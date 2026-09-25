const { cmd } = require('../command');
const fetch = require('node-fetch');
const config = require ('../config')

cmd({
    pattern: "tts",
    alias: ["text2speech", "say"],
    react: "🗣️",
    desc: "🔊 𝗖𝗼𝗻𝘃𝗲𝗿𝘁 𝗧𝗲𝘅𝘁 𝘁𝗼 𝗦𝗽𝗲𝗲𝗰𝗵",
    category: "📁 𝗨𝘁𝗶𝗹𝗶𝘁𝗶𝗲𝘀",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender, pushname }) => { // 1. මෙතනට pushname එකතු කළා
    try {
        // Debug: log the input to see if q is being passed correctly.
        console.log("Received input:", q);
        
        if (!q || q.trim().length === 0) {
            // Fallback: if reply isn't working, use conn.sendMessage directly.
            const errorMsg = "❌ *𝙋𝙡𝙚𝙖𝙨𝙚 𝙥𝙧𝙤𝙫𝙞𝙙𝙚 𝙩𝙚𝙭𝙩 𝙩ο 𝙘𝙤𝙣𝙫𝙚𝙧𝙩 𝙞𝙣𝙩𝙤 𝙨𝙥𝙚𝙚𝙘𝙝!* ❌";
            if (typeof reply === 'function') {
                return reply(errorMsg);
            } else {
                return conn.sendMessage(from, { text: errorMsg }, { quoted: mek });
            }
        }
        
        const voice = "Bianca"; // You can customize this
        const res = await fetch(`https://google.com{encodeURIComponent(q)}&voice=${voice}`);
        const data = await res.json();
        
        if (!data.success) return reply("❌ *𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙜𝙚𝙣𝙚𝙧𝙖𝙩𝙚 𝙏𝙏𝙎.* ❌");
        
        // Newsletter context configuration
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.NEWSLETTER_JID || '120363403804248705@newsletter',
                newsletterName: config.NEWSLETTER_NAME || "THENUVA XMD",
                serverMessageId: Math.floor(Math.random() * 1000),
            },
        };
        
        // pushname is not defined error එක විසඳීමට ආරක්ෂිත ක්‍රමයක් (Safe check for pushName)
        let finalPushName = 'User';
        if (typeof pushname !== 'undefined' && pushname) {
            finalPushName = pushname;
        } else if (m && m.pushName) {
            finalPushName = m.pushName;
        } else if (mek && mek.pushName) {
            finalPushName = mek.pushName;
        }

        // Caption format
        const captionText = `👋 HELLOW...*${finalPushName}*❤️ welcome to CYBER THENUVA...\n\n*╭──────────●●►*\n*┋ CYBER XMD ❯❯*\n*┋ 👤 REQUEST BY: ${finalPushName}*\n*╰──────────●●►*\n> ⚡*POWERED BY CYBER THENUVA*`;
        
        await conn.sendMessage(
            from, 
            { 
                audio: { url: data.audioUrl }, 
                mimetype: "audio/mpeg", 
                fileName: "TTS-Output.mp3", 
                caption: captionText, // මෙතනට අලුත් කැප්ෂන් එක දැම්මා
                contextInfo: newsletterContext
            },
            { quoted: mek }
        );
        
    } catch (e) {
        console.error(e);
        reply("❌ *𝘼𝙣 𝙚𝙧𝙧ο𝙧 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙 𝙬𝙝𝙞𝙡ε 𝙜𝙚𝙣𝙚𝙧𝙖𝙩𝙞𝙣𝙜 𝙏𝙏𝙎.* ❌");
    }
});
