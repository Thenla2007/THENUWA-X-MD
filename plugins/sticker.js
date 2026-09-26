const { cmd } = require('../command')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys')
const sharp = require('sharp')
const fs = require('fs')

cmd({
    pattern: 'sticker',
    alias: ['s', 'stiker', 'stick'],
    react: '🧩',
    desc: 'Convert image to sticker',
    category: 'convert',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    try {

        let quoted = null

        // Reply message detect
        if (m.quoted) {
            quoted = m.quoted
        }

        // Alternative quoted detect
        if (!quoted && mek.quoted) {
            quoted = mek.quoted
        }

        if (!quoted) {
            return reply(
                '❌ *Image එකකට reply කරන්න.*\n\n' +
                '📸 Image එකක් send කරලා ඒකට reply කර\n' +
                '`.sticker` යවන්න.'
            )
        }

        // MIME detect
        const mime =
            quoted.mimetype ||
            quoted.msg?.mimetype ||
            quoted.message?.imageMessage?.mimetype ||
            ''

        console.log('STICKER MIME:', mime)

        if (!mime || !mime.startsWith('image/')) {
            return reply(
                '❌ *Reply කරලා තියෙන්නේ Image එකක් නෙවෙයි.*\n\n' +
                '📸 Image එකකට reply කරලා `.sticker` යවන්න.'
            )
        }

        await reply('⏳ *Sticker එක හදමින්...*')

        let imageMessage = null

        // Different Baileys message structures
        if (quoted.message?.imageMessage) {
            imageMessage = quoted.message.imageMessage
        }

        if (quoted.msg && quoted.msg.mimetype?.startsWith('image/')) {
            imageMessage = quoted.msg
        }

        if (!imageMessage && quoted.imageMessage) {
            imageMessage = quoted.imageMessage
        }

        if (!imageMessage) {
            return reply(
                '❌ Image message එක detect කරගන්න බැරි වුණා.'
            )
        }

        // Download image
        const stream = await downloadContentFromMessage(
            imageMessage,
            'image'
        )

        let buffer = Buffer.from([])

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        if (!buffer.length) {
            return reply(
                '❌ Image එක download කරගන්න බැරි වුණා.'
            )
        }

        // Convert to WebP
        const sticker = await sharp(buffer)
            .resize(512, 512, {
                fit: 'contain',
                background: {
                    r: 0,
                    g: 0,
                    b: 0,
                    alpha: 0
                }
            })
            .webp({
                quality: 90
            })
            .toBuffer()

        // Send sticker
        await conn.sendMessage(
            from,
            {
                sticker: sticker
            },
            {
                quoted: mek
            }
        )

    } catch (error) {

        console.error(
            '================ STICKER ERROR ================'
        )

        console.error(error)

        console.error(
            '================================================'
        )

        return reply(
            '❌ *Sticker Error*\n\n' +
            String(error.message || error)
        )
    }
})
