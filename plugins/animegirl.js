const config = require('../config')
const axios = require('axios');
const { cmd, commands } = require('../command');

// පොදු contextInfo Object එකක් (හැම image එකකටම يටින් View Channel වැටීමට)
const channelContext = {
    mentionedJid: [], 
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: config.NEWSLETTER_ID || "120363403804248705@newsletter",
        newsletterName: config.NEWSLETTER_NAME || "CYBER XMD",
        serverMessageId: 143
    }
};

// ඔබේ නිල Apify API Token එක
const apifyToken = "apify_api_o26QUamyP05T5mIlQUZ974yUGLJTed0dScHR";

// Apify හරහා Pinterest එකෙන් Image එකක් ගන්නා පොදු Function එකක්
async function fetchPinterestAnime(keyword) {
    // සඟල වරහන් දෝෂය මෙතැනින් සම්පූර්ණයෙන්ම නිවැරදි කර ඇත
    const runUrl = `https://apify.com{apifyToken}`;
    const input = {
        "searchKeywords": keyword,
        "maxPins": 15
    };
    const runResponse = await axios.post(runUrl, input);
    const datasetId = runResponse.data.data.defaultDatasetId;
    
    // Scrape වන තෙක් තත්පර 6ක් රැඳී සිටීම
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    const datasetUrl = `https://apify.com{datasetId}/items?token=${apifyToken}`;
    const result = await axios.get(datasetUrl);
    if (result.data && result.data.length > 0) {
        const randomPin = result.data[Math.floor(Math.random() * result.data.length)];
        return randomPin.images?.orig?.url || randomPin.imageUrl || randomPin.image;
    }
    return null;
}

cmd({
    pattern: "anime",
    desc: "anime the bot",
    category: "main",
    react: "⛱️",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let dec = `👋 HELLOW...*${pushname || 'User'}* ❤️ Welcome to CYBER X THENULA...

✅CYBER THENUWA X MD✅
*╭──────────●●►*
*┋ 👤 HEY ${pushname.toUpperCase()}*
*┋ ⛩️ ANIME PHOTOS MENU*
*┋ 📢 CHANNEL: ${config.NEWSLETTER_NAME || 'CYBER XMD'}*
*┋ 🆔 ID: ${config.NEWSLETTER_ID || '120363403804248705@newsletter'}*
*╰──────────●●►*

> ⚡*POWERED BY CYBER THENUVA*`

const currentContext = { ...channelContext, mentionedJid: [sender] };

await conn.sendMessage(from, { image: { url: `https://ibb.co` }, caption: dec, contextInfo: currentContext }, { quoted: mek });
await conn.sendMessage(from, { image: { url: `https://telegra.ph` }, caption: dec, contextInfo: currentContext }, { quoted: mek });
await conn.sendMessage(from, { image: { url: `https://telegra.ph` }, caption: dec, contextInfo: currentContext }, { quoted: mek });
await conn.sendMessage(from, { image: { url: `https://telegra.ph` }, caption: dec, contextInfo: currentContext }, { quoted: mek });
await conn.sendMessage(from, { image: { url: `https://telegra.ph` }, caption: dec, contextInfo: currentContext }, { quoted: mek });
await conn.sendMessage(from, { image: { url: `https://telegra.ph` }, caption: dec, contextInfo: currentContext }, { quoted: mek });
await conn.sendMessage(from, { image: { url: `https://telegra.ph` }, caption: dec, contextInfo: currentContext }, { quoted: mek });
await conn.sendMessage(from, { image: { url: `https://telegra.ph` }, caption: dec, contextInfo: currentContext }, { quoted: mek });

}catch(e){
console.log(e)
reply(`${e}`)
}
});

cmd({
    pattern: "animegirl",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "👧",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const apiUrl = `https://waifu.pics`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        await conn.sendMessage(from, { image: { url: data.url }, caption: '👸 *SILENT-SOBX-MD RANDOM ANIME GIRL IMAGES* 👸\n\n\n *🧬©SILENT-SOBX-MD BY SILENTLOVER432*' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
    }
});

cmd({
    pattern: "animegirl1",
    desc: "Fetch a random anime image from Pinterest using Apify.",
    category: "fun",
    react: "👧",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const imageUrl = await fetchPinterestAnime("anime girl icon aesthetic hd");
        if (!imageUrl) return reply("කණගාටුයි, පින්තූර කිසිවක් හමු වුණේ නැත.");

        const currentContext = { ...channelContext, mentionedJid: [sender] };
        await conn.sendMessage(from, { 
            image: { url: imageUrl }, 
            caption: `👸 *CYBER XMD RANDOM PINTEREST ANIME 1* 👸\n\n> *POWERED BY CYBER THENUVA*`,
            contextInfo: currentContext 
        }, { quoted: mek });
    } catch (e) {
        reply(`*Error Fetching Pinterest Anime 1*: ${e.message}`);
    }
});

cmd({
    pattern: "animegirl2",
    desc: "Fetch a random anime image from Pinterest using Apify.",
    category: "fun",
    react: "👧",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const imageUrl = await fetchPinterestAnime("anime waifu cute loli hd");
        if (!imageUrl) return reply("කණගාටුයි, පින්තූර කිසිවක් හමු වුණේ නැත.");

        const currentContext = { ...channelContext, mentionedJid: [sender] };
        await conn.sendMessage(from, { 
            image: { url: imageUrl }, 
            caption: `👸 *CYBER XMD RANDOM PINTEREST ANIME 2* 👸\n\n> *POWERED BY CYBER THENUVA*`,
            contextInfo: currentContext 
        }, { quoted: mek });
    } catch (e) {
        reply(`*Error Fetching Pinterest Anime 2*: ${e.message}`);
    }
});

cmd({
    pattern: "animegirl3",
    desc: "Fetch a random anime image from Pinterest using Apify.",
    category: "fun",
    react: "👧",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const imageUrl = await fetchPinterestAnime("anime girl dark aesthetic wallpaper");
        if (!imageUrl) return reply("කණගාටුයි, පින්තූර කිසිවක් හමු වුණේ නැත.");

        const currentContext = { ...channelContext, mentionedJid: [sender] };
        await conn.sendMessage(from, { 
            image: { url: imageUrl }, 
            caption: `👸 *CYBER XMD RANDOM PINTEREST ANIME 3* 👸\n\n> *POWERED BY CYBER THENUVA*`,
            contextInfo: currentContext 
        }, { quoted: mek });
    } catch (e) {
        reply(`*Error Fetching Pinterest Anime 3*: ${e.message}`);
    }
});

cmd({
    pattern: "animegirl4",
    desc: "Fetch a random anime image from Pinterest using Apify.",
    category: "fun",
    react: "👧",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const imageUrl = await fetchPinterestAnime("anime girl cool gaming pfp");
        if (!imageUrl) return reply("කණගාටුයි, පින්තූර කිසිවක් හමු වුණේ නැත.");

        const currentContext = { ...channelContext, mentionedJid: [sender] };
        await conn.sendMessage(from, { 
            image: { url: imageUrl }, 
            caption: `👸 *CYBER XMD RANDOM PINTEREST ANIME 4* 👸\n\n> *POWERED BY CYBER THENUVA*`,
            contextInfo: currentContext 
        }, { quoted: mek });
    } catch (e) {
        reply(`*Error Fetching Pinterest Anime 4*: ${e.message}`);
    }
});

cmd({
    pattern: "animegirl5",
    desc: "Fetch a random anime image from Pinterest using Apify.",
    category: "fun",
    react: "👧",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const imageUrl = await fetchPinterestAnime("anime girl fanart high quality");
        if (!imageUrl) return reply("කණගාටුයි, පින්තූර කිසිවක් හමු වුණේ නැත.");

        const currentContext = { ...channelContext, mentionedJid: [sender] };
        await conn.sendMessage(from, { 
            image: { url: imageUrl }, 
            caption: `👸 *CYBER XMD RANDOM PINTEREST ANIME 5* 👸\n\n> *POWERED BY CYBER THENUVA*`,
            contextInfo: currentContext 
        }, { quoted: mek });
    } catch (e) {
        reply(`*Error Fetching Pinterest Anime 5*: ${e.message}`);
    }
});

cmd({
    pattern: "loli",
    alias: ["lolii"],
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🐱",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const apiUrl = `https://waifu.pics`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        await conn.sendMessage(from, { image: { url: data.url }, caption: '👸 *SILENT-SOBX-MD RANDOM ANIME GIRL IMAGES* 👸\n\n\n *🧬©SILENT-SOBX-MD BY SILENTLOVER432*' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
    }
});
