const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');

// Newsletter context config
const newsletterContext = {
    mentionedJid: [],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363403804248705@newsletter',
        newsletterName: 'THENUWA XMD',
        serverMessageId: 143
    }
};


// ==================== PLAY ====================

cmd({
    pattern: 'play',
    alias: ['ytsong', 'song'],
    react: '🎵',
    desc: 'Download audio from YouTube',
    category: 'download',
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {

    if (!q) {
        return reply('*❌ Please provide a song title or YouTube URL*');
    }

    try {
        const search = await yts(q);
        const video = search.videos[0];

        if (!video) {
            return reply('*❌ No results found*');
        }

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╔═══〘 🎧 𝙈𝙋𝟑 𝘿𝙇 〙═══╗

⫸ 🎵 *Title:* ${video.title}
⫸ 👤 *Channel:* ${video.author.name}
⫸ ⏱️ *Duration:* ${video.timestamp}
⫸ 👁️ *Views:* ${video.views.toLocaleString()} views

╚══ ⸨ THENUWA XMD ⸩ ═══╝
`.trim();

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });


        // Correct API URL
        const api =
            `https://itzpire.com/download/youtube/v2?url=${encodeURIComponent(video.url)}`;

        const res = await fetch(api);
        const json = await res.json();

        if (
            !json.status ||
            json.status !== 'success' ||
            !json.data ||
            !json.data.downloadUrl
        ) {
            return reply('*❌ Failed to get audio download link*');
        }

        const title = json.data.title || video.title;
        const safeTitle = title.replace(/[\\/:*?"<>|]/g, '');

        // Send MP3 as audio
        await conn.sendMessage(from, {
            audio: { url: json.data.downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${safeTitle}.mp3`,
            ptt: false,
            contextInfo: messageContext
        }, { quoted: mek });


        // Send MP3 as document
        await conn.sendMessage(from, {
            document: { url: json.data.downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${safeTitle}.mp3`,
            caption: '*📁 THENUWA XMD*',
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error('Audio Error:', err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});


// ==================== YTMP3 ====================

cmd({
    pattern: 'ytmp3',
    alias: ['yturlmp3'],
    react: '🎧',
    desc: 'Download audio from a YouTube URL',
    category: 'download',
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {

    if (!q) {
        return reply('*❌ Please provide a YouTube video URL*');
    }

    // Accept youtube.com and youtu.be links
    if (
        !q.includes('youtube.com/') &&
        !q.includes('youtu.be/')
    ) {
        return reply('*❌ Please provide a valid YouTube video URL*');
    }

    try {

        // Correct API URL
        const api =
            `https://itzpire.com/download/youtube/v2?url=${encodeURIComponent(q)}`;

        const res = await fetch(api);
        const data = await res.json();

        if (
            !data.status ||
            data.status !== 'success' ||
            !data.data ||
            !data.data.downloadUrl
        ) {
            return reply('*❌ Failed to retrieve MP3 link*');
        }

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const title = data.data.title || 'YouTube Audio';
        const safeTitle = title.replace(/[\\/:*?"<>|]/g, '');

        const infoMsg = `
╔═━「 🎧 𝙔𝙏𝙈𝙋𝟑 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 」━═╗

⫸ 📌 *Title:* ${title}
⫸ 📁 *Format:* MP3
⫸ 🛰️ *Source:* YouTube

╚═━「 THENUWA XMD 」━═╝
`.trim();

        // Send thumbnail if available
        if (data.data.image) {
            await conn.sendMessage(from, {
                image: { url: data.data.image },
                caption: infoMsg,
                contextInfo: messageContext
            }, { quoted: mek });
        } else {
            await reply(infoMsg);
        }


        // Send audio
        await conn.sendMessage(from, {
            audio: { url: data.data.downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${safeTitle}.mp3`,
            ptt: false,
            contextInfo: messageContext
        }, { quoted: mek });


        // Send document
        await conn.sendMessage(from, {
            document: { url: data.data.downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${safeTitle}.mp3`,
            caption: '*📁 THENUWA XMD*',
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error('YTMP3 Error:', err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});


// ==================== YOUTUBE SEARCH ====================

cmd({
    pattern: 'yts',
    alias: ['ytsearch'],
    react: '🎧',
    desc: 'Search YouTube for a video',
    category: 'search',
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {

    if (!q) {
        return reply('*❌ Please provide a song title or keywords for search*');
    }

    try {

        const search = await yts(q);
        const video = search.videos[0];

        if (!video) {
            return reply('*❌ No results found*');
        }

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╔═━「 🔍 𝙔𝙏 𝙎𝙀𝘼𝙍𝘾𝙃 」━═╗

⫸ 📌 *Title:* ${video.title}
⫸ 👤 *Channel:* ${video.author.name}
⫸ ⏱️ *Duration:* ${video.timestamp}
⫸ 👁️ *Views:* ${video.views.toLocaleString()}
⫸ 🔗 *Link:* ${video.url}

╚═━「 💡 THENUWA XMD 」━═╝
`.trim();

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error('YTB Search Error:', err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});
