import { pipe } from "ts-pipe-compose";
import { filter, tap } from "rxjs/operators";
import { OutcomingMessage } from "./types";
import config from "../config.json";
import { root as rootCommand } from "./commands/root";
import { mainStream$ } from "./streams";
import { reaction } from "./reaction";
import { client } from "./client";

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

const resultStream$ = pipe(
  mainStream$,
  reaction,
  rootCommand,
  filter((msg): msg is OutcomingMessage => msg.type === "OutcomingMessage"),
);

resultStream$.subscribe((msg) => {
  const { channel, content } = msg;
  channel.send(content);
});
