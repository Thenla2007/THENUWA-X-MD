const { cmd } = require('../command')
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

        // Check replied message
        if (!quoted) {
            return reply(
                '❌ *Image එකකට reply කරන්න.*\n\n' +
                '📸 Image එකක් send කරලා ඒකට reply කර\n' +
                '`.sticker` යවන්න.'
            )
        }

        console.log('STICKER QUOTED:', {
            mimetype: quoted.mimetype,
            type: quoted.type,
            mtype: quoted.mtype
        })

        // Check image
        const mime =
            quoted.mimetype ||
            quoted.msg?.mimetype ||
            ''

        if (!mime.startsWith('image/')) {
            return reply(
                '❌ *Reply කරලා තියෙන්නේ Image එකක් නෙවෙයි.*\n\n' +
                '📸 Image එකකට reply කරලා `.sticker` යවන්න.'
            )
        }

        await reply('⏳ *Sticker එක හදමින්...*')

        // Download quoted image
        const buffer = await quoted.download()

        if (!buffer) {
            return reply(
                '❌ *Image එක download කරගන්න බැරි වුණා.*'
            )
        }

        // Convert image → WebP
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
            String(error.message || error)
        )
    }
})
