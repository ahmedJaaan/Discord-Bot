import { REST, Routes, ApplicationCommandOptionType } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const commands = [
  {
    name: "rps",
    description: "Play Rock-Paper-Scissors with the bot",
  },
  {
    name: "genreply",
    description: "Generate a reply from the bot",
    options: [
      {
        name: "prompt",
        type: ApplicationCommandOptionType.String,
        description: "The prompt to generate a reply for",
        required: true,
      },
    ],
  },
];

//else if (msg.content.toLowerCase() === `${prefix}play game`) {
// msg.reply(
//   "Let's play Rock-Paper-Scissors! Type `$rps` followed by your choice: rock, paper, or scissors."
// );

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID),
      {
        body: commands,
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
