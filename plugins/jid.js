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
    pushname,
    reply
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

        // CYBER X THENULA ස්ටයිල් එකට සකස් කළ JID විස්තර පත්‍රිකාව
        let jidText = `👋 HELLOW ${pushname || "User"} ❤️ Welcome to\n`;
        jidText += `CYBER X THENULA\n\n`;
        jidText += `✅CYBER THENULA X MD✅\n`;
        jidText += `╭───────────────────.★*\n`;
        jidText += `│  ◦ 👤 *User :* ${pushname || "User"}\n`;
        jidText += `│  ◦ 🆔 *WhatsApp JID :*\n`;
        jidText += `│  ◦ \`\${jid}\`\n`;
        jidText += `╰───────────────────.★*\n\n`;
        jidText += `╭───────────────╼\n`;
        jidText += `│👨‍💻 CYBER-TEAM 🥷\n`;
        jidText += `╰───────────────╼\n\n`;
        jidText += `> *©⚡ POWERED by CYBER THENUVA* 🚀\n\n\n`; // යට කැපීම වැළැක්වීමේ Padding

        return reply(jidText);

    } catch (error) {
        console.error("JID Plugin Error:", error);
        return reply("❌ JID ලබාගැනීමේදී error එකක් ආවා.");
    }
});
