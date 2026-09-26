const { cmd } = require('../command');
const config = require("../config");

// ================= 1. VIEW SETTINGS MENU =================
cmd({
  pattern: "setting",
  alias: ["settings", "panel"],
  desc: "View Dark Shadow MD Bot Settings Panel",
  category: "owner",
  filename: __filename
}, async (conn, m, store, { from, isGroup, isAdmins, reply, sender }) => {
  try {
    // 🛠️ WhatsApp ID එකෙන් සැබෑ දුරකථන අංකය පමණක් වෙන් කර ගැනීම (උදා: 94783747285)
    const senderNumber = sender.includes('@') ? sender.split('@')[0] : sender;
    
    // 🎯 ඔබ ලබා දුන් නිශ්චිත දුරකථන අංකය පරීක්ෂා කිරීම
    const allowedNumber = "94783747285";
    
    // බොට් අයිතිකරු, ඩිවෙලොපර් හෝ ඔබ ලබා දුන් අංකය දැයි පරීක්ෂා කිරීම
    const isOwner = senderNumber === allowedNumber || senderNumber === config.OWNER_NUMBER || senderNumber === config.DEV;
    
    if (!isOwner) return reply("❌ *මෙම විධානය භාවිතා කළ හැක්කේ බොට් අයිතිකරුට (Owner) පමණි!*");

    // Config අගයන් අනුව ✅ හෝ ❌ ලකුණු සකස් කිරීම
    const status = (val) => val === 'true' || val === true ? "✅ ON" : "❌ OFF";

    let menu = `⚙️ *${config.BOT_NAME} - SETTINGS PANEL* ⚙️\n\n`;
    menu += `👤 *Owner:* ${config.OWNER_NAME}\n`;
    menu += `Mode: 🔓 *${config.MODE}*\n`;
    menu += `Prefix: ⌨️ *[ ${config.PREFIX} ]*\n\n`;
    
    menu += `🛡️ *SECURITY SETTINGS:*\n`;
    menu += `├▢ *Anti-Link:* ${status(config.ANTI_LINK)}  \`(Key: antilink)\`\n`;
    menu += `├▢ *Anti-Bad Words:* ${status(config.ANTI_BAD)}  \`(Key: antibad)\`\n`;
    menu += `└▢ *Anti-Once View:* ${status(config.ANTI_VV)}  \`(Key: antivv)\`\n\n`;

    menu += `🤖 *AUTOMATION SETTINGS:*\n`;
    menu += `├▢ *Auto Status Seen:* ${status(config.AUTO_STATUS_SEEN)}  \`(Key: autostatus)\`\n`;
    menu += `├▢ *Auto Status React:* ${status(config.AUTO_STATUS_REACT)}  \`(Key: statusreact)\`\n`;
    menu += `├▢ *Auto Status Reply:* ${status(config.AUTO_STATUS_REPLY)}  \`(Key: statusreply)\`\n`;
    menu += `├▢ *Auto Chat React:* ${status(config.AUTO_REACT)}  \`(Key: autoreact)\`\n`;
    menu += `├▢ *Auto Voice:* ${status(config.AUTO_VOICE)}  \`(Key: autovoice)\`\n`;
    menu += `├▢ *Auto Sticker:* ${status(config.AUTO_STICKER)}  \`(Key: autosticker)\`\n`;
    menu += `├▢ *Auto Reply:* ${status(config.AUTO_REPLY)}  \`(Key: autoreply)\`\n`;
    menu += `└▢ *Always Online:* ${status(config.ALWAYS_ONLINE)}  \`(Key: online)\`\n\n`;

    menu += `💡 *Settings වෙනස් කරන්නේ කෙසේද?*\n`;
    menu += `යම් Setting එකක් On හෝ Off කිරීමට පහත පරිදි ටයිප් කරන්න:\n`;
    menu += `👉 *${config.PREFIX}set [key] [true/false]*\n\n`;
    menu += `*Example:* _${config.PREFIX}set antilink true_\n`;
    menu += `*Example:* _${config.PREFIX}set antibad false_\n\n`;
    menu += `_${config.DESCRIPTION}_`;

    return reply(menu);
  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});

// ================= 2. CHANGE SETTINGS COMMAND =================
cmd({
  pattern: "set",
  desc: "Change bot settings dynamically",
  category: "owner",
  filename: __filename
}, async (conn, m, store, { from, q, reply, sender }) => {
  try {
    // 🛠️ WhatsApp ID එකෙන් සැබෑ දුරකථන අංකය පමණක් වෙන් කර ගැනීම
    const senderNumber = sender.includes('@') ? sender.split('@')[0] : sender;
    const allowedNumber = "94783747285";
    
    const isOwner = senderNumber === allowedNumber || senderNumber === config.OWNER_NUMBER || senderNumber === config.DEV;
    if (!isOwner) return reply("❌ *මෙම විධානය භාවිතා කළ හැක්කේ බොට් අයිතිකරුට (Owner) පමණි!*");

    if (!q) return reply(`💡 *💡 භාවිතා කරන ආකාරය:*\n${config.PREFIX}set [Key] [true/false]\n\n*Example:* _${config.PREFIX}set antilink true_`);

    const args = q.split(" ");
    if (args.length < 2) return reply("❌ කරුණාකර අගය (true හෝ false) ඇතුළත් කරන්න.");

    const key = args[0].toLowerCase();
    const value = args[1].toLowerCase();

    if (value !== "true" && value !== "false") {
      return reply("❌ අගය සකස් කළ හැක්කේ *true* හෝ *false* ලෙස පමණි.");
    }

    let success = false;
    let settingName = "";

    // Key එක අනුව config.js එකේ අගයන් වෙනස් කිරීම
    switch (key) {
      case "antilink":
        config.ANTI_LINK = value;
        settingName = "Anti-Link Protection";
        success = true;
        break;
      case "antibad":
        config.ANTI_BAD = value;
        settingName = "Anti-Bad Words System";
        success = true;
        break;
      case "antivv":
        config.ANTI_VV = value;
        settingName = "Anti-Once View (VV)";
        success = true;
        break;
      case "autostatus":
        config.AUTO_STATUS_SEEN = value;
        settingName = "Auto Status Seen";
        success = true;
        break;
      case "statusreact":
        config.AUTO_STATUS_REACT = value;
        settingName = "Auto Status React";
        success = true;
        break;
      case "statusreply":
        config.AUTO_STATUS_REPLY = value;
        settingName = "Auto Status Reply";
        success = true;
        break;
      case "autoreact":
        config.AUTO_REACT = value;
        settingName = "Auto Chat React";
        success = true;
        break;
      case "autovoice":
        config.AUTO_VOICE = value;
        settingName = "Auto Voice";
        success = true;
        break;
      case "autosticker":
        config.AUTO_STICKER = value;
        settingName = "Auto Sticker";
        success = true;
        break;
      case "autoreply":
        config.AUTO_REPLY = value;
        settingName = "Auto Text Reply";
        success = true;
        break;
      case "online":
        config.ALWAYS_ONLINE = value;
        settingName = "Always Online Status";
        success = true;
        break;
      default:
        success = false;
    }

    if (success) {
      const displayStatus = value === "true" ? "✅ ON (Enabled)" : "❌ OFF (Disabled)";
      return reply(`⚙️ *SUCCESS:* *${settingName}* සාර්ථකව ${displayStatus} කරන ලදී.`);
    } else {
      return reply("❌ වැරදි Key එකක්. නිවැරදි Key එක බලාගැනීමට **.setting** ටයිප් කරන්න.");
    }

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
