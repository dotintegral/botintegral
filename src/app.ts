import { pipe } from "ts-pipe-compose";
import { filter } from "rxjs/operators";
import express from "express";
import { OutcomingMessage } from "./types";
import config from "../config.json";
import { mainStream$ } from "./streams";
import { client } from "./client";

import { root as command } from "./middleware/commands/root";
import { reaction } from "./middleware/reaction";
import { initCron } from "./middleware/cron";

client.login(config.discord.token);

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8080, () => {
  console.log(`Running express`);
});

client.on("message", (message) => {
  const { channel, author, content } = message;
  const botId = client.user?.id as string;

  if (channel.type === "text" && botId !== author.id) {
    mainStream$.next({
      type: "IncomingMessage",
      user: author,
      content,
      channel,
    });
  }
});

client.on("ready", () => {
  initCron();
});

const resultStream$ = pipe(
  mainStream$,
  reaction,
  command,
  filter((msg): msg is OutcomingMessage => msg.type === "OutcomingMessage"),
);

resultStream$.subscribe((msg) => {
  const { channel, content } = msg;
  channel.send(content);
});
