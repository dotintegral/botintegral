import { pipe } from "ts-pipe-compose";
import { filter } from "rxjs/operators";
import { OutcomingMessage } from "./types";
import { mainStream$ } from "./streams";
import { client } from "./client";

import { root as command } from "./middleware/commands/root";
import { reaction } from "./middleware/reaction";
import { initCron } from "./middleware/cron";

import { config } from "./config";

client.login(config.discord.token);

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
