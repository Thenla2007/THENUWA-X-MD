const config = require('../config')
const { cmd, commands } = require('../command')
const { GoogleGenAI } = require('@google/genai')

// ඔයා දුන්න API Key එක මෙතනට ඇතුළත් කරලා තියෙන්නේ
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6K-worhtp7MvuQrWqdy-JmYEpSU_TRuMUa8wx4FIZXAJQ" })

cmd({
    pattern: "ai",
    alias: ["bot", "ask", "thenuva"],
    react: "🧠",
    desc: "Ask anything from CYBER THENUVA AI",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, reply }) => {
    try {
        if (!q) return reply("⚠️ කරුණාකර ප්‍රශ්නයක් හෝ යමක් ඇතුළත් කරන්න! (උදා: .ai hello)")

        // AI එකෙන් පිළිතුර ලබා ගැනීම
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: q,
        })

        let aiReply = `👋 *Hello, ${pushname}!*❤️ welcome to AI ASSISTANT...


🧠 *CYBER THENUVA AI ANSWER* 🧠


📝 *Your Question:* ${q}

💬 *Answer:*
────────────────────────
${response.text}
────────────────────────


> *⚡ Powered By CYBER THENUVA AI*`

        // Newsletter Forward එකක් විදිහට මැසේජ් එක යැවීම
        await conn.sendMessage(from, {
            text: aiReply,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID || '120363403804248705@newsletter',
                    newsletterName: 'CYBER XMD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek })

    } catch (e) {
        console.log(e)
        reply(`❌ Error: ${e.message}`)
    }
})
