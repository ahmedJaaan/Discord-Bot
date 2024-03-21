import { Client, IntentsBitField, messageLink } from "discord.js";
import { randomBytes } from "crypto";
import dotenv from "dotenv";
dotenv.config();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
  ],
});

function playRPS(choice) {
  const choices = ["rock", "paper", "scissors"];

  const randomIndex = Math.floor((randomBytes(1)[0] / 255) * choices.length);
  const botChoice = choices[randomIndex];

  let result;
  if (choice === botChoice) {
    result = "It's a tie!";
  } else if (
    (choice === "rock" && botChoice === "scissors") ||
    (choice === "paper" && botChoice === "rock") ||
    (choice === "scissors" && botChoice === "paper")
  ) {
    result = "You win!";
  } else {
    result = "You lose!";
  }

  return { userChoice: choice, botChoice: botChoice, result: result };
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  const prefix = "$";
  if (msg.content.toLowerCase() === `${prefix}ping`) {
    msg.reply("Pong!");
  } else if (msg.content.toLowerCase() === `${prefix}play game`) {
    msg.reply(
      "Let's play Rock-Paper-Scissors! Type `$rps` followed by your choice: rock, paper, or scissors."
    );
  } else if (msg.content.toLowerCase().startsWith(`${prefix}rps`)) {
    const args = msg.content.toLowerCase().split(" ");
    if (args.length !== 2 || !["rock", "paper", "scissors"].includes(args[1])) {
      msg.reply("Please provide a valid choice: rock, paper, or scissors.");
      return;
    }
    const userChoice = args[1];
    const {
      userChoice: userChoiceResult,
      botChoice,
      result,
    } = playRPS(userChoice);
    msg.reply(
      `You chose ${userChoiceResult}. Bot chose ${botChoice}. ${result}`
    );

    if (result === "You lose!") {
      try {
        const member = await msg.guild.members.fetch(msg.author.id);
        const muteRole = msg.guild.roles.cache.find(
          (role) => role.name === "Muted"
        );
        if (muteRole) {
          await member.roles.add(muteRole);
          member.timeout(30000);
          member.send(
            "You have been muted for 30 seconds for losing the game."
          );
          setTimeout(() => {
            member.roles.remove(muteRole).catch(console.error);
          }, 30000);
        } else {
          console.error("Mute role not found");
        }
      } catch (err) {
        console.error("error in muting player:", err);
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN).catch((e) => {
  console.error("Error logging in", e);
});
