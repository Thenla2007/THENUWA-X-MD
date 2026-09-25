const { cmd } = require('../command');
const { downloadMediaMessage } = require('@whiskeysockets/baileys'); // Baileys ලිබ්‍රරියෙන්ම කෙලින්ම downloadMediaMessage එක ගනිමු
const config = require ('../config')

cmd({
  pattern: 'vv',
  alias: ['viewonce'],
  react: '↩️',
  desc: 'Gets an image/video from viewonce files',
  category: 'utility',
  filename: __filename
}, async (robin, mek, m, { from, quoted, reply, sender }) => {
  try {
    // Validate inputs
    if (!quoted) {
      return reply('❌ Please reply to a view-once message.');
    }

    // View Once මැසේජ් එක ඇතුලේ තියෙන නියම image හෝ video message එක වෙන් කර ගැනීම
    let viewOnceContent = quoted;
    
    if (quoted.viewOnceMessageV2?.message) {
      viewOnceContent = quoted.viewOnceMessageV2.message;
    } else if (quoted.viewOnceMessageV2Extension?.message) {
      viewOnceContent = quoted.viewOnceMessageV2Extension.message;
    } else if (quoted.viewOnceMessage?.message) {
      viewOnceContent = quoted.viewOnceMessage.message;
    }

    // එය image එකක්ද video එකක්ද කියා තහවුරු කර ගැනීම
    const isImage = viewOnceContent.imageMessage ? true : false;
    const isVideo = viewOnceContent.videoMessage ? true : false;

    if (!isImage && !isVideo) {
      return reply('❌ Only view-once image and video replies are supported.');
    }

    // මීඩියා එක ඩවුන්ලෝඩ් කිරීමට නිවැරදි ඔබ්ජෙක්ට් එක සකසා ගැනීම
    const mediaObj = {
      key: quoted.key || m.message?.extendedTextMessage?.contextInfo?.stanzaId,
      message: viewOnceContent
    };

    // Download media using Baileys built-in downloader
    const media = await downloadMediaMessage(
      mediaObj,
      'buffer',
      {},
      {
        logger: console,
        reconnectMode: 'on'
      }
    );

    if (!media) {
      return reply('❌ Failed to download the media. Please try again!');
    }

    // Newsletter context configuration
    const newsletterContext = {
      mentionedJid: [sender],
      forwardingScore: 1000,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: config.NEWSLETTER_JID || '120363292876277898@newsletter',
        newsletterName: config.NEWSLETTER_NAME || "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
        serverMessageId: Math.floor(Math.random() * 1000),
      }
    };

    // Determine media type and mimeType
    const mediaType = isImage ? 'image' : 'video';
    const mimeType = isImage ? viewOnceContent.imageMessage.mimetype : viewOnceContent.videoMessage.mimetype;

    // Resend with newsletter context
    await robin.sendMessage(
      from,
      {
        [mediaType]: media,
        mimetype: mimeType,
        contextInfo: newsletterContext
      },
      { quoted: mek }
    );

    // Add reaction to confirm success
    await robin.sendMessage(from, { react: { text: '✅', key: mek.key } });

  } catch (error) {
    console.error('Media resend error:', error);
    reply(`❌ Error: ${error.message}`);
    
    // Send error to owner if configured
    if (config.ERROR_CHAT) {
      await robin.sendMessage(
        config.ERROR_CHAT, 
        { text: `Error in vv command:\nFrom: ${from}\nError: ${error.stack}` }
      );
    }
  }
});
