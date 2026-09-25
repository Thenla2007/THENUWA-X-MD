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
            return reply("❌ *𝙋𝙡𝙚𝙖𝙨ε 𝙥𝙧ο𝙫𝙞𝙙𝙚 𝙩𝙚𝙭𝙩 𝙩ο 𝙘ο𝙣𝙫𝙚𝙧𝙩!*");
        }

        // 🔑 ඔයා Manage Tokens එකෙන් ගත්තු සැබෑ Apify Token එක විතරක් මෙතනට දාන්න (apfy_api_...)
        const APIFY_TOKEN = "apify_api_LsjMq2ZMIZwjwYcil41rzj9mMOr1jF4lfp5R"; 
        
        let audioUrl = null;

        // ─── 1. පියවර: APIFY හරහා හඬ ජනනය කිරීම (නිවැරදි කරන ලද URL එක) ───
        if (APIFY_TOKEN && !APIFY_TOKEN.includes("ඔයාගේ_APIFY_TOKEN") && APIFY_TOKEN.trim() !== "") {
            try {
                console.log("Attempting Apify TTS...");
                const inputBody = {
                    "text": q,
                    "voice": "en-AU-WilliamNeural"
                };

                // මෙතන URL එක සම්පූර්ණයෙන්ම නිවැරදි කළා
                const res = await fetch(`https://apify.com{APIFY_TOKEN.trim()}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inputBody)
                });
                
                const runData = await res.json();
                
                if (runData && runData.data && runData.data.id) {
                    const runId = runData.data.id;
                    
                    // සර්වර් එකට වැඩේ කරන්න තත්පර 4ක් ඉඩ දෙමු
                    await new Promise(resolve => setTimeout(resolve, 4000));
                    
                    const datasetRes = await fetch(`https://apify.com{runId}/dataset/items?token=${APIFY_TOKEN.trim()}`);
                    
                    if (datasetRes.ok) {
                        const datasetItems = await datasetRes.json();
                        // ආරක්ෂිතව Array දත්ත පරික්ෂාව
                        if (Array.isArray(datasetItems) && datasetItems.length > 0) {
                            audioUrl = datasetItems[0].access_url || datasetItems[0].audioUrl || datasetItems[0].audio;
                        } else if (datasetItems) {
                            audioUrl = datasetItems.access_url || datasetItems.audioUrl || datasetItems.audio;
                        }
                    }
                }
            } catch (apifyError) {
                console.error("Apify error:", apifyError.message);
            }
        }

        // ─── 2. පියවර: Apify ෆේල් වුණොත් කිසිදා බ්ලොක් නොවන වෙනත් නොමිලේ API එකකට මාරු වීම ───
        if (!audioUrl) {
            console.log("Apify failed/empty. Using Network-Safe Backup TTS...");
            // සර්වර්ස් මඟින් බ්ලොක් නොකරන ස්ථාවර විකල්ප API එන්ඩ්පොයින්ට් එකක්
            audioUrl = `https://sandipbaruah.in{encodeURIComponent(q)}`;
        }

        // pushName ආරක්ෂිතව ලබා ගැනීම
        let finalPushName = pushname || m.pushName || 'User';
        const captionText = `👋 HELLOW...*${finalPushName}*❤️ welcome to CYBER THENUVA...\n\n*╭──────────●●►*\n*┋ CYBER XMD ❯❯*\n*┋ 👤 REQUEST BY: ${finalPushName}*\n*╰──────────●●►*\n> ⚡*POWERED BY CYBER THENUVA*`;
        
        // WhatsApp වෙත Audio එක සාර්ථකව යැවීම
        await conn.sendMessage(from, { 
            audio: { url: audioUrl }, 
            mimetype: "audio/mpeg", 
            fileName: "TTS-Output.mp3", 
            caption: captionText 
        }, { quoted: mek });
        
    } catch (e) {
        console.error(e);
        reply(`❌ *𝘼𝙣 𝙚𝙧𝙧𝙤𝙧 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙:* ${e.message}`);
    }
});
