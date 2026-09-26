const { cmd } = require("../command");
const { getep } = require("darksadasyt-anime");

cmd(
  {
    pattern: "animedetails",
    react: "🎭",
    desc: "Get Anime Details and Episodes",
    category: "anime",
    filename: __filename,
  },

  async (robin, mek, m, { from, q, sender, reply }) => {
    try {
      if (!q) {
        return reply("*Please provide an anime link.* 🎭");
      }

      const contextInfo = {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363292876277898@newsletter",
          newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
          serverMessageId: 143
        }
      };

      const data = await getep(q);

      // IMPORTANT: See actual API response
      console.log(
        "================ ANIME API RESPONSE ================"
      );
      console.log(JSON.stringify(data, null, 2));
      console.log(
        "======================================================"
      );

      if (!data) {
        return reply(
          "❌ Anime API එකෙන් response එකක් ලැබුණේ නැහැ."
        );
      }

      /*
       * Try different possible response structures
       */

      const result =
        data.result ||
        data.data ||
        data.anime ||
        data.info ||
        data;

      let episodes =
        data.results ||
        data.episodes ||
        data.episode ||
        result.episodes ||
        [];

      if (!Array.isArray(episodes)) {
        episodes = [];
      }

      /*
       * Get values from different possible field names
       */

      const title =
        result.title ||
        result.name ||
        result.animeName ||
        result.anime_name ||
        "Unknown";

      const date =
        result.date ||
        result.releaseDate ||
        result.release_date ||
        result.year ||
        "Unknown";

      const imdb =
        result.imdb ||
        result.rating ||
        result.score ||
        "N/A";

      const totalEpisodes =
        result.epishodes ||
        result.episodes ||
        result.totalEpisodes ||
        result.total_episodes ||
        episodes.length ||
        "N/A";

      const image =
        result.image ||
        result.img ||
        result.thumbnail ||
        result.poster ||
        "N/A";

      let detailsMessage =
        `🎬 *ANIME DETAILS* 🎬\n\n` +
        `📌 *Title:* ${title}\n` +
        `📅 *Release Date:* ${date}\n` +
        `⭐ *IMDb Rating:* ${imdb}\n` +
        `🎥 *Total Episodes:* ${totalEpisodes}\n` +
        `🖼️ *Image:* ${image}\n\n`;

      detailsMessage += `🎬 *EPISODES* 🎬\n\n`;

      if (episodes.length === 0) {

        detailsMessage +=
          "❌ Episode list එකක් හම්බ වුණේ නැහැ.\n\n" +
          "🔍 API response එක console එකේ check කරන්න.";

      } else {

        episodes.forEach((episode, index) => {

          if (typeof episode === "string") {

            detailsMessage +=
              `📺 *Episode ${index + 1}*\n` +
              `🔗 ${episode}\n\n`;

          } else {

            const epNumber =
              episode.episode ||
              episode.ep ||
              episode.number ||
              index + 1;

            const epUrl =
              episode.url ||
              episode.link ||
              episode.href ||
              episode.download ||
              "N/A";

            detailsMessage +=
              `📺 *Episode ${epNumber}*\n` +
              `🔗 ${epUrl}\n\n`;
          }
        });
      }

      await robin.sendMessage(
        from,
        {
          text: detailsMessage,
          contextInfo: contextInfo
        },
        {
          quoted: mek
        }
      );

    } catch (e) {

      console.error(
        "❌ ANIME DETAILS ERROR:",
        e
      );

      return reply(
        `❌ *Anime Details Error*\n\n${e.message || "Unknown error"}`
      );
    }
  }
);
