import dotenv from "dotenv";

dotenv.config();

const entries = Object.entries(process.env).filter(
  ([key]) => !key.startsWith("npm_"),
);

const env = Object.fromEntries(entries);

console.log({ env });

export const config = {
  bot: {
    commandPrefix: process.env.COMMAND_PREFIX || "",
  },
  discord: {
    token: process.env.DISCORD_TOKEN || "",
  },
  data: {
    quotes: process.env.DATA_QUOTES || "",
    reactions: process.env.DATA_REACTIONS || "",
    crontab: process.env.DATA_CRONTAB || "",
  },
};
