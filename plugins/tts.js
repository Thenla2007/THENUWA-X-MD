const { cmd } = require('../command')
const fetch = require('node-fetch')

cmd({
pattern: "tts",
alias: ["say", "speak"],
react: "🎙️",
desc: "Convert text to voice",
category: "main",
filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

```
try {

    if (!q) {
        return reply("❌ Please enter some text.\n\nExample:\n.tts හායි කොහොමද")
    }

    // Google TTS URL
    const url =
        "https://translate.google.com/translate_tts" +
        "?ie=UTF-8" +
        "&client=tw-ob" +
        "&tl=si" +
        "&q=" + encodeURIComponent(q)

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    })

    if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`)
    }

    // Google returns audio, NOT JSON
    const audioBuffer = await response.buffer()

    if (!audioBuffer || audioBuffer.length < 1000) {
        throw new Error("Empty audio response")
    }

    await conn.sendMessage(
        from,
        {
            audio: audioBuffer,
            mimetype: "audio/mpeg",
            ptt: true
        },
        {
            quoted: mek
        }
    )

} catch (error) {

    console.error("TTS ERROR:", error)

    return reply(
        "❌ TTS Error\n\n" +
        "Voice generate කරන්න බැරි වුණා.\n" +
        "ටිකකින් නැවත උත්සාහ කරන්න."
    )
}
```

})
