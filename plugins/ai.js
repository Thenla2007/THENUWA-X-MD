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

// ඔබේ API Key එක මෙහි ඇතුළත් කර ඇත
const apiKey = "tc_FQ9oBLp9KwtYr2eqz1WV8EHRTRGU_";

// ක්‍රමය 1: ඔබේ පුද්ගලික Zell API Key එක සමඟින් Request එක යැවීම
let data = await fetchJson(`https://zellapi.autos{encodeURIComponent(q)}&apikey=${apiKey}`)

if (data && data.result) {
    return reply(`${data.result}`)
} 
// සපයා ඇති API එකෙන් response එකක් නොලැබුණහොත් ක්‍රියාත්මක වන Fallback API එක
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
