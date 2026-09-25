const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "tts",
    alias: ["text2speech", "say"],
    react: "🗣️",
    desc: "🔊 𝗖𝗼𝗻𝘃𝗲𝗿𝘁 𝗧𝗲𝘅𝘁 𝘁𝗼 𝗦𝗽𝗲𝗲𝗰𝗵",
    category: "📁 𝗨𝘁𝗶𝗹𝗶𝘁𝗶𝗲𝘀",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        // Debug: log the input to see if q is being passed correctly.
        console.log("Received input:", q);
        
        if (!q || q.trim().length === 0) {
            // Fallback: if reply isn't working, use conn.sendMessage directly.
            const errorMsg = "❌ *𝙋𝙡𝙚𝙖𝙨𝙚 𝙥𝙧𝙤𝙫𝙞𝙙𝙚 𝙩𝙚𝙭𝙩 𝙩𝙤 𝙘𝙤𝙣𝙫𝙚𝙧𝙩 𝙞𝙣𝙩𝙤 𝙨𝙥𝙚𝙚𝙘𝙝!* ❌";
            if (typeof reply === 'function') {
                return reply(errorMsg);
            } else {
                return conn.sendMessage(from, { text: errorMsg }, { quoted: mek });
            }
        }
        
        const voice = "Bianca"; // You can customize this
        const res = await fetch(`https://apis.davidcyriltech.my.id/tts?text=${encodeURIComponent(q)}&voice=${voice}`);
        const data = await res.json();
        
        if (!data.success) return reply("❌ *𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙜𝙚𝙣𝙚𝙧𝙖𝙩𝙚 𝙏𝙏𝙎.* ❌");
        
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363403804248705@newsletter',
                newsletterName: "THENUWA XMD",
                serverMessageId: 143,
            },
        };
        
        await conn.sendMessage(
            from, 
            { 
                audio: { url: data.audioUrl }, 
                mimetype: "audio/mpeg", 
                fileName: "TTS-Output.mp3", 
                caption: "✅ *𝗧𝗲𝘅𝘁 𝗰𝗼𝗻𝘃𝗲𝗿𝘁𝗲𝗱 𝘁𝗼 𝘀𝗽𝗲𝗲𝗰𝗵 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!* ✅\n🔰 *𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 THENUWA XMD* ⚡",
                contextInfo: newsletterContext
            },
            { quoted: mek }
        );
        
    } catch (e) {
        console.error(e);
        reply("❌ *𝘼𝙣 𝙚𝙧𝙧𝙤𝙧 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙 𝙬𝙝𝙞𝙡𝙚 𝙜𝙚𝙣𝙚𝙧𝙖𝙩𝙞𝙣𝙜 𝙏𝙏𝙎.* ❌");
    }
});
