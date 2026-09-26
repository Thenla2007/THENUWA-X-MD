const { cmd } = require('../command');
const config = require("../config");

// Store structures globally if not defined
global.warnings = global.warnings || {};

// ================= ANTI-BAD WORDS SYSTEM =================
cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  isGroup,
  isAdmins,
  isBotAdmins,
  sender
}) => {
  try {
    if (!body) return;
    const badWords = ["wtf", "mia", "xxx", "fuck", 'sex', "huththa", "pakaya", 'ponnaya', "hutto"];

    // Group ආරක්ෂක පියවර පරීක්ෂාව
    if (!isGroup || isAdmins || !isBotAdmins) return;

    const messageText = body.toLowerCase();
    const containsBadWord = badWords.some(word => messageText.includes(word));

    // config.js එකේ ඇති ANTI_BAD අගය පරීක්ෂා කිරීම
    if (containsBadWord && config.ANTI_BAD === 'true') {
      await conn.sendMessage(from, { delete: m.key });
      await conn.sendMessage(from, { text: "🚫 ⚠️ BAD WORDS NOT ALLOWED ⚠️ 🚫" });
    }
  } catch (error) {
    console.error("Anti-badword error:", error);
  }
});

// ================= ANTI-LINK TOGGLE COMMAND =================
cmd({
  pattern: "antilink",
  alias: ["anti_link"],
  desc: "Toggle Anti-Link protection ON/OFF",
  category: "group",
  filename: __filename
}, async (conn, m, store, {
  from,
  isGroup,
  isAdmins,
  reply
}) => {
  if (!isGroup) return reply("❌ This command can only be used in groups.");
  if (!isAdmins) return reply("❌ Only group admins can toggle Anti-Link.");

  // Config එකේ සහ Global variable එකේ අගය මාරු කිරීම
  if (config.ANTI_LINK === 'true') {
    config.ANTI_LINK = 'false';
  } else {
    config.ANTI_LINK = 'true';
  }

  const status = config.ANTI_LINK === 'true' ? "✅ ENABLED" : "❌ DISABLED";
  return reply(`🛡️ *Anti-Link Protection is now:* ${status}`);
});

// ================= ANTI-LINK ENFORCEMENT =================
cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins
}) => {
  try {
    if (!body) return;
    
    // මූලික ආරක්ෂක පියවර සහ config.js එකේ ANTI_LINK "true" ද කියා පරීක්ෂාව
    if (!isGroup || !isBotAdmins || isAdmins || config.ANTI_LINK !== 'true') return;

    // විවිධ ලින්ක් වර්ග හඳුනාගැනීමට Regex Patterns
    const linkPatterns = [
      /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
      /https?:\/\/(?:api\.whatsapp\.com|wa\.me)\/\S+/gi,
      /wa\.me\/\S+/gi,
      /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
      /https?:\/\/(?:www\.)?\S+\.[a-z]{2,6}\/\S*/gi, 
      /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
      /https?:\/\/(?:whatsapp\.com|channel\.me)\/\S+/gi,
      /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?discord\.com\/\S+/gi
    ];

    const containsLink = linkPatterns.some(pattern => pattern.test(body));
    if (!containsLink) return;

    console.log(`Link detected from ${sender}: ${body}`);

    // ලින්ක් එක සහිත මැසේජ් එක මැකීම
    try {
      await conn.sendMessage(from, { delete: m.key });
    } catch (err) {
      console.error("Failed to delete message:", err);
    }

    // Number එකෙන් සැබෑ ID එක වෙන් කර ගැනීම (Fix: split කරන ක්‍රමය නිවැරදි කිරීම)
    const userJid = sender.includes('@') ? sender.split('@')[0] : sender;

    // Warning ලබා දීමේ කොටස
    global.warnings[sender] = (global.warnings[sender] || 0) + 1;
    const warningCount = global.warnings[sender];

    if (warningCount < 4) {
      await conn.sendMessage(from, {
        text: `*⚠️LINKS ARE NOT ALLOWED⚠️*\n` +
              `*╭────⬡ WARNING ⬡────*\n` +
              `*├▢ USER :* @${userJid}\n` +
              `*├▢ COUNT : ${warningCount} / 3*\n` +
              `*├▢ REASON : LINK SENDING*\n` +
              `*╰────────────────*`,
        mentions: [sender]
      });
    } else {
      // 4 වෙනි වතාවේදී සමූහයෙන් ඉවත් කිරීම (Kick)
      await conn.sendMessage(from, {
        text: `*🚫 @${userJid} HAS BEEN REMOVED - WARN LIMIT EXCEEDED!*`,
        mentions: [sender]
      });
      await conn.groupParticipantsUpdate(from, [sender], "remove");
      delete global.warnings[sender];
    }
  } catch (err) {
    console.error("Anti-link error:", err);
  }
});
