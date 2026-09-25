const { cmd } = require('../command');
const fetch = require('node-fetch');
const config = require ('../config')

cmd({
    pattern: "tts",
    alias: ["text2speech", "say"],
    react: "🗣️",
    desc: "🔊 𝗖𝗼𝗻𝘃𝗲𝗿𝘁 𝗧𝗲𝘅𝘁 𝘁𝗼 𝗦𝗽𝗲𝗲𝗰𝗵 𝘃𝗶𝗮 𝗔𝗽𝗶𝗳𝘆",
    category: "📁 𝗨𝘁𝗶𝗹𝗶𝘁𝗶𝗲𝘀",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender, pushname }) => {
    try {
        if (!q || q.trim().length === 0) {
            return reply("❌ *𝙋𝙡𝙚𝙖𝙨𝙚 𝙥𝙧ο𝙫𝙞𝙙𝙚 还原𝙚𝙭𝙩 还原ο 𝙘ο𝙣𝙫𝙚𝙧还原!*");
        }

        // 🔑 1. ඔබේ Apify API Token එක මෙතන තනි උද්ධෘත ලකුණු (' ') ඇතුළට දාන්න
        const APIFY_TOKEN = "apify_api_o26QUamyP05T5mIlQUZ974yUGLJTed0dScHR"; 
        
        // 🔄 2. Apify Actor එකට අවශ්‍ය Input දත්ත සැකසීම (Screenshot එකට අනුව)
        const inputBody = {
            "text": q,
            "voice": "en-AU-WilliamNeural" // Screenshot එකේ තිබූ උසස් AI Voice එක
        };

        // 3. Apify Actor එක සක්‍රියව Run කිරීම (Synchronous request)
        const res = await fetch(`https://api.apify.com/v2/actor-runs/f6hO8ONjEYN9ZnPo8?token=apify_api_o26QUamyP05T5mIlQUZ974yUGLJTed0dScHR{APIFY_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputBody)
        });
        
        const runData = await res.json();
        
        if (!runData.data || !runData.data.id) {
            return reply("❌ *𝙁𝙖𝙞𝙡𝙚𝙙 还原ο 𝙨还原𝙖𝙧还原 𝘼𝙥𝙞𝙛𝙮 𝘼𝙘还原ο𝙧.*");
        }

        // 4. Output Dataset එකෙන් කෙලින්ම බාගත කරගත හැකි දත්ත ලබා ගැනීම
        const runId = runData.data.id;
        const datasetRes = await fetch(`https://apify.com{runId}/dataset/items?token=${APIFY_TOKEN}`);
        const datasetItems = await datasetRes.json();
        
        // 5. Screenshot එකේ ඇති 'access_url' කියන Key එකෙන් සැබෑ Audio ලින්ක් එක වෙන් කර ගැනීම
        const audioUrl = datasetItems[0]?.access_url || datasetItems[0]?.audioUrl || datasetItems[0]?.audio; 

        if (!audioUrl) {
            return reply("❌ *𝘼𝙪𝙙𝙞ο 𝙐𝙍𝙇 𝙣ο𝙩 𝙛ο𝙪𝙣𝙙 𝙞𝙣 𝙙𝙖𝙩𝙖𝙨𝙚𝙩.*");
        }

        // Safe pushName check
        let finalPushName = pushname || m.pushName || 'User';
        const captionText = `👋 HELLOW...*${finalPushName}*❤️ welcome to CYBER THENUVA...\n\n*╭──────────●●►*\n*┋ CYBER XMD ❯❯*\n*┋ 👤 REQUEST BY: ${finalPushName}*\n*╰──────────●●►*\n> ⚡*POWERED BY CYBER THENUVA*`;
        
        // 6. සකස් වූ හඬ පටය (Audio (.mp3)) WhatsApp වෙත යැවීම
        await conn.sendMessage(from, { 
            audio: { url: audioUrl }, 
            mimetype: "audio/mpeg", 
            fileName: "Apify-TTS.mp3", 
            caption: captionText 
        }, { quoted: mek });
        
    } catch (e) {
        console.error(e);
        reply(`❌ *𝘼𝙣 𝙚𝙧𝙧ο𝙧 𝙤𝙘𝙘𝙪𝙧还原𝙚𝙙:* ${e.message}`);
    }
});
