const { cmd } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "ms"],
    desc: "බොට්ගේ වේගය (Speed) පරීක්ෂා කිරීම.",
    category: "main",
    filename: __filename
},
async (conn, mek, from, options) => {
    try {
        // 'from' අගය String එකක් බවට ස්ථිර කර ගැනීම (Error එක මඟහරවා ගැනීමට)
        const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

        const startTime = Date.now();
        
        // මුලින්ම පණිවිඩය යැවීම
        const pingMsg = await conn.sendMessage(targetJid, { text: '*Testing Speed... ⏳*' }, { quoted: mek });
        
        const endTime = Date.now();
        const pingTime = endTime - startTime;

        // Newsletter සහ Context Info සහිතව පණිවිඩය Edit කිරීම
        await conn.sendMessage(targetJid, { 
            text: `*THENUWA X MD SPEED* 🚀\n\n⚡ *Ping:* \`\${pingTime} ms\`\n📶 *Status:* \`Excellent\`\n\n📢 *Join Our Channel:* https://whatsapp.com`,
            edit: pingMsg.key,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363403804248705@newsletter', // ඔයාගේ Channel ID එක මෙතනට දාන්න
                    newsletterName: 'THENUWA XMD', // ඔයාගේ Channel එකේ නම මෙතනට දාන්න
                    serverMessageId: -1
                }
            }
        });

    } catch (e) {
        console.log("Ping Command Error: ", e);
    }
});
