const { cmd } = require('../command');
const { happymod } = require('api-qasim');

cmd({
    pattern: "happymod",
    alias: ["hmod"],
    react: "📲",
    desc: "🔍 Search and download APKs from HappyMod",
    category: "📁 Download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ *Please provide a search query!* ❌\nExample: .happymod WhatsApp");

        const searchResults = await happymod(q);
        if (!searchResults?.data?.length) return reply("❌ *No results found for your query.* ❌");

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        let apkList = "*📲 Available Mods:*\n\n";
        searchResults.data.forEach((item, index) => {
            apkList += `*${index + 1}.* ${item.title} (⭐ ${item.rating || 'N/A'})\n`;
        });
        apkList += "\n◄❪ Reply with number to get download link ❫►\n🔰 *Powered by THENUWA XMD*";

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

        const sentMsg = await conn.sendMessage(
            from,
            { 
                text: apkList,
                contextInfo: newsletterContext
            },
            { quoted: mek }
        );

        // Store search results in temporary storage
        conn.happymod = conn.happymod || {};
        conn.happymod[sender] = {
            results: searchResults.data,
            timestamp: Date.now(),
            messageId: sentMsg.key.id
        };

        // Handle user reply
        conn.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message?.extendedTextMessage || 
                msg.key.remoteJid !== from || 
                msg.message.extendedTextMessage.contextInfo.stanzaId !== sentMsg.key.id) return;

            try {
                const selectedNumber = parseInt(msg.message.extendedTextMessage.text.trim());
                if (isNaN(selectedNumber)) {
                    return conn.sendMessage(from, { text: "❌ *Please enter a valid number!*" }, { quoted: msg });
                }

                const selectedIndex = selectedNumber - 1;
                if (selectedIndex < 0 || selectedIndex >= searchResults.data.length) {
                    return conn.sendMessage(from, { text: "❌ *Invalid selection number!*" }, { quoted: msg });
                }

                const selectedMod = searchResults.data[selectedIndex];
                const modInfo = `
*🔰 HappyMod Download 🔰*

*📌 Title:* ${selectedMod.title}
*⭐ Rating:* ${selectedMod.rating || 'N/A'}
*📦 Version:* ${selectedMod.version || 'Unknown'}

*🔗 Download Link:* ${selectedMod.link}

🔰 *Powered by THENULWA XMD*`;

                await conn.sendMessage(from, { 
                    text: modInfo,
                    contextInfo: newsletterContext
                }, { quoted: msg });

                // Clear stored data
                delete conn.happymod?.[sender];

            } catch (e) {
                console.error(e);
                conn.sendMessage(from, { text: "❌ *Error fetching mod details:* " + e.message }, { quoted: msg });
            }
        });

        // Auto-clear after 3 minutes
        setTimeout(() => {
            delete conn.happymod?.[sender];
        }, 180 * 1000);

    } catch (e) {
        console.error(e);
        reply("❌ *Error searching HappyMod:* " + e.message);
    }
});
