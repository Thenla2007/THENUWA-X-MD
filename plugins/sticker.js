const { cmd } = require('../command')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const sharp = require('sharp')

cmd({
    pattern: 'sticker',
    alias: ['s', 'stiker', 'stick'],
    react: '🧩',
    desc: 'Convert image to sticker',
    category: 'convert',
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {

    try {

        // Reply message එක check කිරීම
        if (!quoted) {
            return reply(
                '🧩 *STICKER*\n\n' +
                '📸 Image එකකට reply කරලා\n' +
                '`.sticker` කියලා send කරන්න.'
            )
        }

        const mime =
            quoted.mimetype ||
            quoted.msg?.mimetype ||
            ''

        // Image only
        if (!mime.startsWith('image/')) {
            return reply(
                '❌ *Image එකකට reply කරන්න.*\n\n' +
                '📸 Image → Reply → `.sticker`'
            )
        }

        await reply('⏳ *Sticker එක හදමින්...*')

        // Download image
        const buffer = await downloadMediaMessage(
            quoted,
            'buffer',
            {},
            {
                logger: undefined,
                reuploadRequest: conn.updateMediaMessage
            }
        )

        if (!buffer) {
            return reply('❌ Image එක download කරගන්න බැරි වුණා.')
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

        console.error('STICKER ERROR:', error)

        return reply(
            '❌ *Sticker Error*\n\n' +
            error.message
        )
    }
})
