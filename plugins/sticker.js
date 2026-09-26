const config = require('../config');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { cmd } = require('../command');
const { getRandom } = require('../lib/functions');
const fs = require('fs');

let imgmsg = '';

if (config.LANG === 'SI') {
    imgmsg = '❌ ඡායාරූපයකට reply කරලා .sticker යවන්න!';
} else {
    imgmsg = '❌ REPLY TO A PHOTO FOR STICKER!';
}

let descg = '';

if (config.LANG === 'SI') {
    descg = 'Reply කරන photo එක sticker එකක් බවට convert කරයි.';
} else {
    descg = 'Converts your replied photo to sticker.';
}

cmd({
    pattern: 'sticker',
    react: '🤹‍♀️',
    alias: ['s', 'stic'],
    desc: descg,
    category: 'convert',
    use: '.sticker',
    filename: __filename
},

async (conn, mek, m, {
    from,
    reply,
    q,
    pushname
}) => {

    let tempFile = null;

    try {

        /*
         * --------------------------------
         * CHECK REPLIED MESSAGE
         * --------------------------------
         */

        const quoted = m.quoted;

        let imageBuffer = null;

        // 1. Reply කරපු message එක තියෙනවා නම්
        if (quoted) {

            const mime =
                quoted.mimetype ||
                quoted.msg?.mimetype ||
                quoted.message?.imageMessage?.mimetype ||
                '';

            console.log('STICKER QUOTED MIME:', mime);
            console.log('STICKER QUOTED TYPE:', quoted.type);
            console.log('STICKER QUOTED MTYPE:', quoted.mtype);

            /*
             * Type එක imageMessage නොවුනත්
             * download() තියෙනවා නම් download කරන්න.
             */

            if (typeof quoted.download === 'function') {

                try {

                    imageBuffer = await quoted.download();

                } catch (err) {

                    console.log(
                        'Quoted download failed:',
                        err.message
                    );

                }
            }
        }

        /*
         * --------------------------------
         * IF CURRENT MESSAGE IS IMAGE
         * --------------------------------
         */

        if (!imageBuffer) {

            const currentType =
                m.type ||
                m.mtype ||
                m.messageType ||
                '';

            const currentMime =
                m.mimetype ||
                m.msg?.mimetype ||
                '';

            if (
                currentType === 'imageMessage' ||
                currentMime.startsWith('image/')
            ) {

                if (typeof m.download === 'function') {

                    imageBuffer = await m.download();

                }
            }
        }

        /*
         * --------------------------------
         * IMAGE NOT FOUND
         * --------------------------------
         */

        if (
            !imageBuffer ||
            !Buffer.isBuffer(imageBuffer) ||
            imageBuffer.length === 0
        ) {

            return reply(imgmsg);

        }

        /*
         * --------------------------------
         * CREATE TEMP JPG
         * --------------------------------
         */

        tempFile = getRandom('.jpg');

        await fs.promises.writeFile(
            tempFile,
            imageBuffer
        );

        /*
         * --------------------------------
         * CREATE STICKER
         * --------------------------------
         */

        const sticker = new Sticker(tempFile, {

            pack: 'THENUWA X MD',

            author: pushname || 'THENUWA X MD',

            type:
                String(q || '').includes('--crop') ||
                String(q || '').includes('-c')
                    ? StickerTypes.CROPPED
                    : StickerTypes.FULL,

            categories: [
                '🤩',
                '🔥'
            ],

            id: 'thenuwa-x-md',

            quality: 85,

            background: 'transparent'

        });

        const buffer = await sticker.toBuffer();

        /*
         * --------------------------------
         * SEND STICKER
         * --------------------------------
         */

        await conn.sendMessage(
            from,
            {
                sticker: buffer
            },
            {
                quoted: mek,

                contextInfo: {

                    mentionedJid: [
                        mek.sender || from
                    ],

                    forwardingScore: 999,

                    isForwarded: true,

                    forwardedNewsletterMessageInfo: {

                        newsletterJid:
                            '120363403804248705@newsletter',

                        newsletterName:
                            'CYBER XMD',

                        serverMessageId: 143

                    }

                }

            }
        );

        /*
         * --------------------------------
         * DELETE TEMP FILE
         * --------------------------------
         */

        try {

            await fs.promises.unlink(tempFile);

        } catch (e) {}

        tempFile = null;

    } catch (e) {

        console.error(
            '========== STICKER ERROR =========='
        );

        console.error(e);

        console.error(
            '==================================='
        );

        if (tempFile) {

            try {

                await fs.promises.unlink(tempFile);

            } catch (err) {}

        }

        return reply(
            '❌ Sticker හදන්න බැරි වුණා!\n\n' +
            'Error: ' +
            (e.message || e)
        );

    }

});
