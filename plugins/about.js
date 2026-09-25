const config = require('../config')
const {cmd , commands} = require('../command')

cmd({
    pattern: "about",
    react: "👑",
    desc: "get owner dec",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let madeMenu = `✨ *CYBER THENUVA INFO* ✨

👋 *Hello, ${pushname}!* 🌟 welcomee to info...

⭐ *DEVELOPER DETAILS*
────────────────────────
👨‍💻 *Developer:* CYBER THENUVA
🔞 *Age:* 19 Years Old
🙈 *Location:* Personal Hai 😁
🤖 *Status:* Simple WhatsApp Bot Developer
────────────────────────

💡 *Thank you for using my bot!*... 


> *⚡ Powered By CYBER THENUVA*`

await conn.sendMessage(from, {
    image: { url: config.ALIVE_IMG },
    caption: madeMenu,
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: config.NEWSLETTER_JID || '120363403804248705@newsletter',
            newsletterName: 'CYBER XMD',
            serverMessageId: 143
        }
    }
}, { quoted: mek })

}catch(e){
console.log(e)
reply(`${e}`)
}
})
