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
async (conn, mek, m, { from, q, reply, sender, pushname }) => {
    try {
        if (!q || q.trim().length === 0) {
            return reply("❌ *𝙋𝙡𝙚𝙖𝙨𝙚 𝙥𝙧𝙤𝙫𝙞𝙙𝙚 𝙩𝙚𝙭𝙩 𝙩ο 𝙘ο𝙣𝙫𝙚𝙧𝙩!*");
        }

        // 🔑 ඔයා Manage Tokens එකෙන් කොපි කරගත්තු සැබෑ Apify Token එක මෙතනට දාන්න
        const APIFY_TOKEN = "apify_api_LsjMq2ZMIZwjwYcil41rzj9mMOr1jF4lfp5R"; 
        
        let audioUrl = null;

        // ─── 1. පියවර: APIFY හරහා හඬ ජනනය කිරීමට උත්සාහ කිරීම ───
        if (APIFY_TOKEN && !APIFY_TOKEN.includes("ඔයාගේ_APIFY_TOKEN")) {
            try {
                console.log("Trying Apify TTS...");
                const inputBody = {
                    "text": q,
                    "voice": "en-AU-WilliamNeural"
                };

                const res = await fetch(`https://apify.com{APIFY_TOKEN.trim()}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inputBody),
                    timeout: 7000 // තත්පර 7ක් ඇතුළත රෙස්පොන්ස් එකක් නැත්නම් කැන්සල් කිරීම
                });
                
                const runData = await res.json();
                
                if (runData && runData.data && runData.data.id) {
                    const runId = runData.data.id;
                    // Actor එකට Audio එක හදලා ඉවර වෙන්න තත්පර 2.5ක් පොඩ්ඩක් ඉවසමු
                    await new Promise(resolve => setTimeout(resolve, 2500));
                    
                    const datasetRes = await fetch(`https://apify.com{runId}/dataset/items?token=${APIFY_TOKEN.trim()}`);
                    const datasetItems = await datasetRes.json();
                    
                    // ඩේටාසෙට් එක ඇතුලෙන් Audio ලින්ක් එක වෙන් කර ගැනීම
                    if (Array.isArray(datasetItems) && datasetItems.length > 0) {
                        audioUrl = datasetItems[0].access_url || datasetItems[0].audioUrl || datasetItems[0].audio;
                    } else {
                        audioUrl = datasetItems?.access_url || datasetItems?.audioUrl || datasetItems?.audio;
                    }
                }
            } catch (apifyError) {
                console.error("Apify failed, switching to backup TTS:", apifyError.message);
            }
        }

        // ─── 2. පියවර: Apify ෆේල් වුණොත් ඔටෝමැටිකලි GOOGLE TTS එකට මාරු වීම ───
        if (!audioUrl) {
            console.log("Apify failed or token empty. Using Google Backup TTS...");
            audioUrl = `https://google.com{encodeURIComponent(q)}`;
        }

        // ආරක්ෂිතව pushName එක චෙක් කිරීම
        let finalPushName = pushname || m.pushName || 'User';
        const captionText = `👋 HELLOW...*${finalPushName}*❤️ welcome to CYBER THENUVA...\n\n*╭──────────●●►*\n*┋ CYBER XMD ❯❯*\n*┋ 👤 REQUEST BY: ${finalPushName}*\n*╰──────────●●►*\n> ⚡*POWERED BY CYBER THENUVA*`;
        
        // හඬ පටය WhatsApp වෙත යැවීම
        await conn.sendMessage(from, { 
            audio: { url: audioUrl }, 
            mimetype: "audio/mpeg", 
            fileName: "TTS-Output.mp3", 
            caption: captionText 
        }, { quoted: mek });
        
    } catch (e) {
        console.error(e);
        reply(`❌ *𝘼𝙣 𝙚𝙧𝙧ο𝙧 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙:* ${e.message}`);
    }
});
