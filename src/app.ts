import { Subject } from "rxjs";
import discord from "discord.js";
import { pipe } from "ts-pipe-compose";
import { filter } from "rxjs/operators";
import { IncomingMessage, OutcomingMessage } from "./types";
import config from "../config.json";
import { root as rootCommand } from "./commands/root";

const client = new discord.Client();

const mainStream$ = new Subject<IncomingMessage>();

client.login(config.discord.token);

client.on("message", (message) => {
  const { channel } = message;
  if (channel.type === "text") {
    mainStream$.next({
      type: "IncomingMessage",
      content: message.content,
      user: message.author,
      channel,
    });
  }
});

const resultStream$ = pipe(
  mainStream$,
  rootCommand,
  filter((msg): msg is OutcomingMessage => msg.type === "OutcomingMessage"),
);

resultStream$.subscribe((msg) => {
  if (msg.type === "OutcomingMessage") {
    const { channel, content } = msg;
    console.log(`>> #${channel.name}: ${content}`);
    channel.send(content);
  }
});
