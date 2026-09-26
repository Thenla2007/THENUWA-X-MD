const { cmd } = require('../command');

cmd({
    pattern: "jid",
    alias: ["getjid", "id"],
    desc: "Get WhatsApp JID",
    category: "main",
    react: "🆔",
    filename: __filename
},
async (conn, mek, m, {
    from,
    quoted,
    mentionedJid,
    reply,
    pushname
}) => {
    try {
        let jid;

        // If message is replied to
        if (quoted) {
            jid = quoted.sender || quoted.participant || quoted.key?.participant;
        }

        // If user is mentioned
        if (!jid && mentionedJid && mentionedJid.length > 0) {
            jid = mentionedJid[0];
        }

        // If no reply/mention, use current chat JID
        if (!jid) {
            jid = from;
        }

        if (!jid) {
            return reply("❌ JID එක හොයාගන්න බැරි වුණා.");
        }

        return conn.sendMessage(
            from,
            {
                text:
`👋 Hi ${pushname}


✅CYBER THENUVA X MD✅
*╭──────────────●●►*
*┋* 🆔 *JID:* ${jid}
*╰──────────────●●►*`,
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
            },
            {
                quoted: mek
            }
        );

    } catch (error) {
        console.error("JID Plugin Error:", error);
        return reply("❌ JID ලබාගැනීමේදී error එකක් ආවා.");
    }
});
