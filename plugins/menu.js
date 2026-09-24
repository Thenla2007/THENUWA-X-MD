const config = require('../config')
const {cmd , commands} = require('../command')
const os = require("os")
const {runtime} = require('../lib/functions')

cmd({
    pattern: "menu2",
    react: "👾",
    desc: "get cmd list",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let menu = {
main: '',
download: '',
group: '',
owner: '',
convert: '',
search: ''
};

for (let i = 0; i < commands.length; i++) {
if (commands[i].pattern && !commands[i].dontAddCommandList) {
menu[commands[i].category] += `*┋* .${commands[i].pattern}\n`;
 }
}

let madeMenu = `👋 HELLOW...*${pushname || 'User'}*

╭┈───────────────•* 
│   🕒 *Runtime* :  ${runtime(process.uptime())}
│  ◦ ⚡ *mode* :  *[${config.MODE}]*
│  ◦ ⚙️ *prefix* : *[${config.PREFIX}]*
│  ◦ 💾 *Ram use* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
│  ◦ 🤖 *Name Bot* : *THENUVA XMD*
│  ◦ 👤 *creater* : *Thenula/Dilshan*
│  ◦ 📌 *version* : *ᴠ.2.0.0*
│  ◦ 📜 *Menu Cmd* : *menu list*
╰┈───────────────•*


*╭───────────────❒⁠⁠⁠⁠*
*│* *_https://github.com/SILENTLOVER40/SILENT-SOBX-MD_*
*┕───────────────❒*

*╭───────────────❒⁠⁠⁠⁠*
*│* *❂ᴅᴏᴡɴʟᴏᴀᴅ ᴄᴏᴍᴍᴀɴᴅs❂*
*┕───────────────❒*
*╭──────────●●►*
${menu.download || '*┋* No Commands Available\n'}*╰──────────●●►*

*╭───────────────❒⁠⁠⁠⁠*
*│* *❂ᴍᴀɪɴ ᴄᴏᴍᴍᴀɴᴅs❂*
*┕───────────────❒*
*╭──────────●●►*
${menu.main || '*┋* No Commands Available\n'}*╰──────────●●►*

*╭───────────────❒⁠⁠⁠⁠*
*│* *❂ɢʀᴏᴜᴘ ᴄᴏᴍᴍᴀɴᴅs❂*
*┕───────────────❒*
*╭──────────●●►*
${menu.group || '*┋* No Commands Available\n'}*╰──────────●●►*

*╭───────────────❒⁠⁠⁠⁠*
*│* *❂ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅs❂*
*┕───────────────❒*
*╭──────────●●►*
${menu.owner || '*┋* No Commands Available\n'}*╰──────────●●►*

*╭───────────────❒⁠⁠⁠⁠*
*│* *❂<b>💥 CONVERT 💥</b> ᴄᴏᴍᴍᴀɴᴅs❂*
*┕───────────────❒*
*╭──────────●●►*
${menu.convert || '*┋* No Commands Available\n'}*╰──────────●●►*

*╭─────────────────❒⁠⁠⁠⁠*
*│* *❂s<b>💥 EARCH 💥</b> ᴄᴏᴍᴍᴀɴᴅs❂*
*┕─────────────────❒*
*╭──────────●●►*
${menu.search || '*┋* No Commands Available\n'}*╰──────────●●►*

*❒⁠⁠⁠⁠▭▬▭▬▭▬▭▬▭▬▭▬▭▬▭❒*⁠⁠⁠⁠

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ sɪ<b>💥 𝗟𝗢𝗩𝗘𝗥 💥</b>⁴³²*

╰━❁ ═══ ❃•⇆•❃ ═══ ❁━╯
`

await conn.sendMessage(from,{image:{url:config.ALIVE_IMG},caption:madeMenu},{quoted:mek})

}catch(e){
console.log(e)
reply(`${e}`)
}
})
