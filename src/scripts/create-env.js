// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const entries = Object.entries(process.env).filter(([key]) =>
  key.startsWith("BOT_"),
);

const contents = entries
  .map(([key, value]) => `${key.replace(/^BOT_/, "")}=${value}`)
  .join("\n");

console.log("saving the following envs");
console.log(contents);

fs.writeFileSync("./.env", contents, "utf-8");
