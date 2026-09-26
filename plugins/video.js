const { cmd } = require('../command')
const fetch = require('node-fetch')

cmd({
    pattern: 'dl',
    alias: ['download', 'video'],
    react: '⬇️',
    desc: 'Download video from URL',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) {
            return reply(
                '❌ *URL එකක් දෙන්න.*\n\n' +
                'Example:\n' +
                '.dl https://www.youtube.com/watch?v=xxxx'
            )
        }

        const token = process.env.APIFY_TOKEN

        if (!token) {
            return reply(
                '❌ APIFY_TOKEN GitHub Secret එක හම්බ වුණේ නැහැ.'
            )
        }

        await reply('⏳ *Video එක process කරමින්...*')

        const apiUrl =
            'https://api.apify.com/v2/actors/' +
            'andryerica~all-video-downloader/' +
            'run-sync-get-dataset-items?token=' +
            encodeURIComponent(token)

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: q,
                max_formats: 5
            })
        })

        if (!response.ok) {
            const errorText = await response.text()

            console.log('APIFY ERROR:', errorText)

            return reply(
                '❌ *Apify Error*\n\n' +
                'Video එක ලබාගන්න බැරි වුණා.'
            )
        }

        const data = await response.json()

        console.log(
            'APIFY RESULT:',
            JSON.stringify(data, null, 2)
        )

        const items = Array.isArray(data)
            ? data
            : (data.items || data.data || [])

        if (!items.length) {
            return reply(
                '❌ Video result එකක් හම්බ වුණේ නැහැ.'
            )
        }

        const result = items[0]

        const formats = result.formats || []

        if (!formats.length) {
            return reply(
                '❌ Download format එකක් හම්බ වුණේ නැහැ.'
            )
        }

        // MP4 video එකක් මුලින් තෝරන්න
        const format =
            formats.find(f =>
                f.url &&
                (
                    f.ext === 'mp4' ||
                    String(f.mime_type || '').includes('video/mp4')
                )
            ) ||
            formats.find(f => f.url)

        if (!format || !format.url) {
            return reply(
                '❌ Direct video URL එකක් හම්බ වුණේ නැහැ.'
            )
        }

        const title =
            result.title ||
            'CYBER THENUWA X MD'

        await reply(
            '📥 *Downloading video...*\n\n' +
            '🎬 ' + title
        )

        const videoResponse = await fetch(format.url)

        if (!videoResponse.ok) {
            return reply(
                '❌ Video file එක download කරන්න බැරි වුණා.'
            )
        }

        const videoBuffer = await videoResponse.buffer()

        await conn.sendMessage(
            from,
            {
                video: videoBuffer,
                mimetype: 'video/mp4',
                caption:
                    '🎬 *' + title + '*\n\n' +
                    '⚡ Powered by CYBER THENUWA X MD'
            },
            {
                quoted: mek
            }
        )

    } catch (error) {

        console.error('DL ERROR:', error)

        return reply(
            '❌ *Download Error*\n\n' +
            error.message
        )
    }
})
