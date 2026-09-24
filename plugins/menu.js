const config = require('../config');
const { cmd, commands } = require('../command');

// ==========================================
// 1. ප්‍රධාන MENU விධානය (.menu2 ගැසූ විට)
// ==========================================
cmd({
    pattern: "menu2",
    react: "👾",
    desc: "get cmd list",
    category: "main",
    filename: __filename
},
async(conn, mek, m, { from, pushname, reply }) => {
    try {
        let madeMenu = `*╭─────────────────❒⁠⁠⁠⁠*

*⇆ ʜɪɪ ᴍʏ ᴅᴇᴀʀ ғʀɪᴇɴᴅ ⇆*

     *${pushname}*

*┕─────────────────❒*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━
   *ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ sɪʟᴇɴᴛ-sᴏʙx-ᴍᴅ ᴄᴀᴛᴇɢᴏʀʏ ʟɪsᴛ*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━

*ᴄʀᴇᴀᴛᴇᴅ ʙʏ sɪʟᴇɴᴛ ʟᴏᴠᴇʀ⁴³²👨🏻‍💻*

> ඔබට අවශ්‍ය Category එකෙහි අංකය පමණක් Reply කරන්න. 👇

*╭───────────────❒⁠⁠⁠⁠*
*│ [1] ❂ ᴍᴀɪɴ ᴄᴏᴍᴍᴀɴᴅs ❂*
*│ [2] ❂ ᴅᴏᴡɴload ᴄᴏᴍᴍᴀɴᴅs ❂*
*│ [3] ❂ ɢʀᴏᴜᴘ ᴄᴏᴍᴍᴀɴᴅs ❂*
*│ [4] ❂ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅs ❂*
*│ [5] ❂ ᴄᴏɴᴠᴇʀᴛ ᴄᴏᴍᴍᴀɴᴅs ❂*
*│ [6] ❂ sᴇᴀʀᴄʜ ᴄᴏᴍᴍᴀɴᴅs ❂*
*┕───────────────❒*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ sɪʟᴇɴᴛ_ʟᴏᴠᴇʀ⁴³²*
`;

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: madeMenu }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// ==========================================
// 2. තිත නැතුව අංකය විතරක් රිප්ලයි කළ විට වැඩ කරන කොටස
// ==========================================
cmd({
    on: "text",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, body }) => {
    try {
        if (!body || m.isBot) return; // බොට් කෙනෙක් රිප්ලයි කළොත් නවත්වන්න

        const input = body.trim();
        let menuSection = "";
        let targetCategory = "";
        let categoryTitle = "";

        // යූසර් එවන අංකය අනුව Category එක වෙන් කර ගැනීම
        if (input === "1") { targetCategory = "main"; categoryTitle = "ᴍᴀɪɴ ᴄᴏᴍᴍᴀɴᴅs"; }
        else if (input === "2") { targetCategory = "download"; categoryTitle = "ᴅᴏᴡɴload ᴄᴏᴍᴍᴀɴᴅs"; }
        else if (input === "3") { targetCategory = "group"; categoryTitle = "ɢʀᴏᴜᴘ ᴄᴏᴍᴍᴀɴᴅs"; }
        else if (input === "4") { targetCategory = "owner"; categoryTitle = "ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅs"; }
        else if (input === "5") { targetCategory = "convert"; categoryTitle = "ᴄᴏɴᴠᴇʀᴛ ᴄᴏᴍᴍᴀɴᴅs"; }
        else if (input === "6") { targetCategory = "search"; categoryTitle = "sᴇᴀʀᴄʜ ᴄᴏᴍᴍᴀɴᴅs"; }
        else { return; } // 1-6 අතර නොවන වෙනත් මැසේජ් එකක් නම් ක්‍රියාවලිය නවත්වන්න

        // තෝරාගත් category එකට අදාළ විධාන පමණක් dynamic ලෙස loop එකකින් එකතු කර ගැනීම
        let foundCommands = "";
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].pattern && !commands[i].dontAddCommandList && commands[i].category === targetCategory) {
                foundCommands += `*┋* .${commands[i].pattern}\n`;
            }
        }

        if (!foundCommands) {
            foundCommands = `*┋* මෙම Category එක යටතේ දැනට විධාන කිසිවක් නැත.\n`;
        }

        // යවන සුබ මෙනු මැසේජ් එක ලස්සනට Format කිරීම
        let replyMenu = `*╭───────────────❒⁠⁠⁠⁠*
*│* *❂ ${categoryTitle} ❂*
*┕───────────────❒*
*╭──────────●●►*
${foundCommands}*╰──────────●●►*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ sɪʟᴇɴᴛ_ʟᴏᴠᴇʀ⁴³²*`;

        // එම මැසේජ් එක යූසර්ට රිප්ලයි කිරීම
        return await conn.sendMessage(from, { text: replyMenu }, { quoted: mek });

    } catch (e) {
        console.error("Number Reply Menu Error:", e);
    }
});
