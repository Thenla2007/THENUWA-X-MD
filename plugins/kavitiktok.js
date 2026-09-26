const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: 'tiktok',
    alias: ['ttdl', 'tt', 'tiktokdl'],
    desc: 'Download TikTok video without watermark',
    category: 'download',
    react: '⌛',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {

    try {

        // Check URL
        if (!q) {
            return reply('*❌ Please provide a TikTok video link.*');
        }

        if (
            !q.includes('tiktok.com') &&
            !q.includes('vm.tiktok.com') &&
            !q.includes('vt.tiktok.com')
        ) {
            return reply('*❌ Invalid TikTok link.*');
        }

        // API URL
        const apiUrl =
            `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(q)}`;

        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        const data = response.data;

        console.log('TikTok API Response:', JSON.stringify(data, null, 2));

        // Check API response
        if (!data || !data.status || !data.data) {
            return reply('*❌ Failed to fetch TikTok video.*');
        }

        const tikData = data.data;

        const title = tikData.title || 'TikTok Video';
        const like = tikData.like || 0;
        const comment = tikData.comment || 0;
        const share = tikData.share || 0;

        const author = tikData.author || {};
        const nickname =
            author.nickname ||
            author.name ||
            'Unknown';

        // Find video URL safely
        let videoUrl = null;

        if (
            tikData.meta &&
            Array.isArray(tikData.meta.media)
        ) {
            const video = tikData.meta.media.find(
                item =>
                    item &&
                    item.type === 'video' &&
                    (item.org || item.url)
            );

            if (video) {
                videoUrl = video.org || video.url;
            }
        }

        // Alternative API structures
        if (!videoUrl && tikData.video) {
            if (typeof tikData.video === 'string') {
                videoUrl = tikData.video;
            } else {
                videoUrl =
                    tikData.video.url ||
                    tikData.video.noWatermark ||
                    tikData.video.download;
            }
        }

        if (!videoUrl && tikData.url) {
            videoUrl = tikData.url;
        }

        if (!videoUrl) {
            console.error(
                'TikTok video URL not found:',
                JSON.stringify(data, null, 2)
            );

            return reply(
                '*❌ Video URL not found in API response.*'
            );
        }

        // Caption
        const caption =
`╭━━━〔 *𓆩 THENUWA XMD 𓆪* 〕━━━╮

🎬 *TIKTOK DOWNLOADER*

👤 *User:* ${nickname}
❤️ *Likes:* ${like}
💬 *Comments:* ${comment}
🔄 *Shares:* ${share}

╰━━━━━━━━━━━━━━━━━━━━╯`;

        // Send video
        await conn.sendMessage(
            from,
            {
                video: {
                    url: videoUrl
                },
                caption: caption,
                contextInfo: {
                    mentionedJid: m.sender ? [m.sender] : []
                }
            },
            {
                quoted: mek
            }
        );

    } catch (e) {

        console.error(
            'TikTok Downloader Error:',
            e.response?.data || e
        );

        if (e.code === 'ECONNABORTED') {
            return reply(
                '*❌ TikTok API request timed out. Please try again.*'
            );
        }

        if (e.response) {
            return reply(
                `*❌ API Error:* ${e.response.status}`
            );
        }

        return reply(
            `*❌ Error:* ${e.message}`
        );
    }
});
