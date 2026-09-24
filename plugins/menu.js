const config = require('../config')
const { cmd, commands } = require('../command')

cmd(
{
    pattern: "menu3",
    react: "🛸",
    alias: ["panel", "list", "commands"],
    desc: "Get bot's command list.",
    category: "main",
    use: '.menu3',
    filename: __filename
},

async(
    conn,
    mek,
    m,
    {
        from,
        l,
        quoted,
        body,
        isCmd,
        umarmd,
        args,
        q,
        isGroup,
        sender,
        senderNumber,
        botNumber2,
        botNumber,
        pushname,
        isMe,
        isOwner,
        groupMetadata,
        groupName,
        participants,
        groupAdmins,
        isBotAdmins,
        isAdmins,
        reply
    }
) => {

    try {

        // ─────────────────────────────
        // BOT UPTIME
        // ─────────────────────────────
        const formatUptime = (seconds) => {
            seconds = Number(seconds);

            const d = Math.floor(seconds / (3600 * 24));
            const h = Math.floor((seconds % (3600 * 24)) / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);

            return `${d}d ${h}h ${m}m ${s}s`;
        };

        const uptime = formatUptime(process.uptime());

        // ─────────────────────────────
        // RAM USAGE
        // ─────────────────────────────
        const memory = process.memoryUsage();
        const ram = (memory.rss / 1024 / 1024).toFixed(2);

        // ─────────────────────────────
        // BOT INFO
        // ─────────────────────────────
        const botName = "DILA-MD";
        const ownerName = "Dilshan";
        const botMode = config.MODE || "public";

        // ─────────────────────────────
        // MENU HEADER
        // ─────────────────────────────
        let madeMenu = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃      🛸 *DILA-MD* 🛸
┃━━━━━━━━━━━━━━━━━━━━━━┃
┃ 👋 *HELLO*  : ${pushname}
┃ 🤖 *BOT*    : ${botName}
┃ ⚡ *MODE*   : ${botMode}
┃ 🟢 *STATUS* : ONLINE
┃ ⏱️ *UPTIME* : ${uptime}
┃ 💾 *RAM*    : ${ram} MB
┃ 👨‍💻 *OWNER*  : ${ownerName}
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 *📥 DOWNLOAD COMMANDS* 〕━━━┈
│
│ 📖 *COMMAND:* .play
│ ℹ️ Download Audio from YouTube
│
│ 📖 *COMMAND:* .song
│ ℹ️ Download Song from YouTube
│
│ 📖 *COMMAND:* .apk
│ ℹ️ Download APK from Play Store
│
│ 📖 *COMMAND:* .video
│ ℹ️ Download Video from YouTube
│
│ 📖 *COMMAND:* .fb
│ ℹ️ Download Video from Facebook
│
│ 📖 *COMMAND:* .tk
│ ℹ️ Download Video from TikTok
│
│ 📖 *COMMAND:* .ig
│ ℹ️ Download Video from Instagram
│
│ 📖 *COMMAND:* .gdrive
│ ℹ️ Download Google Drive Files
│
│ 📖 *COMMAND:* .wamod
│ ℹ️ Download WhatsApp MOD APK
│
│ 📖 *COMMAND:* .img
│ ℹ️ Search Images
│
╰━━━━━━━━━━━━━━━━━━━┈

`;

        // ─────────────────────────────
        // AUTO COMMAND LIST
        // ─────────────────────────────
        let categories = {};

        for (let i = 0; i < commands.length; i++) {

            const command = commands[i];

            if (!command.pattern) continue;

            const category = command.category || "misc";

            if (!categories[category]) {
                categories[category] = [];
            }

            let pattern = command.pattern;

            if (typeof pattern === "string") {
                categories[category].push(pattern);
            }
        }

        // ─────────────────────────────
        // CATEGORY MENU
        // ─────────────────────────────
        for (const category in categories) {

            if (category.toLowerCase() === "download") continue;

            madeMenu += `
╭━━━〔 *${category.toUpperCase()}* 〕━━━┈
│
`;

            const uniqueCommands = [
                ...new Set(categories[category])
            ];

            for (const command of uniqueCommands) {
                madeMenu += `│ ✦ .${command}\n`;
            }

            madeMenu += `│
╰━━━━━━━━━━━━━━━━━━━┈

`;
        }

        // ─────────────────────────────
        // FOOTER
        // ─────────────────────────────
        madeMenu += `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃  🛸 *DILA-MD* 🤖
┃━━━━━━━━━━━━━━━━━━━━━━┃
┃ ⚡ Fast • Simple • Powerful
┃ 🟢 Bot is currently Online
┃ 👨‍💻 Created by *Dilshan*
╰━━━━━━━━━━━━━━━━━━━━━━╯
`;

        // ─────────────────────────────
        // SEND MENU
        // ─────────────────────────────
        await conn.sendMessage(
            from,
            {
                text: madeMenu
            },
            {
                quoted: mek
            }
        );

    } catch (e) {

        console.log("Menu3 Error:", e);

        reply(
            `❌ *MENU ERROR*\n\n${e.message}`
        );
    }
});
