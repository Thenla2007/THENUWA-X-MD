const config = require('../config')
const {cmd , commands} = require('../command')
const { fetchJson } = require('../lib/functions')

cmd({
    pattern: "ai",
    alias: ["gpt","bot"], 
    react: "📑",
    desc: "ai chat.",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!q) return reply("කරුණාකර AI එකෙන් ඇසීමට ප්‍රශ්නයක් ඇතුළත් කරන්න. (උදා: .ai hello)")

// ඔබේ පුද්ගලික Zell API Key එක
const apiKey = "tc_FQ9oBLp9KwtYr2eqz1WV8EHRTRGU_";

// ඔබ ඉල්ලූ ආකාරයටම text= parameter එක සමඟ apikey එක සම්බන්ධ කර Request එක යැවීම
let data = await fetchJson(`https://zellapi.autos{encodeURIComponent(q)}&apikey=${apiKey}`)

// API එකෙන් සාර්ථකව result එකක් ආවොත් එය Reply කිරීම
if (data && data.result) {
    return reply(`${data.result}`)
} 
// යම් හෙයකින් Zell API එක වැඩ නොකළහොත් (null ආවොත්) ක්‍රියාත්මක වන විකල්ප ක්‍රමය (Fallback)
else {
    let fallbackData = await fetchJson(`https://onrender.com{encodeURIComponent(q)}`)
    if (fallbackData && fallbackData.answer) {
        return reply(`${fallbackData.answer}`)
    } else {
        return reply("කණගාටුයි, AI සේවාව මේ මොහොතේ කාර්යබහුලයි. පසුව උත්සාහ කරන්න.")
    }
}

}catch(e){
console.log(e)
reply(`Error: ${e.message || e}`)
}
})
