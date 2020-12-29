import discord from "discord.js";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import {
  AnyMessage,
  CommandMessage,
  IncomingMessage,
  OutcomingMessage,
  PhantomMessage,
} from "../types";

import config from "../../config.json";

export const isCommand = (commandName: string) => (
  in$: Observable<AnyMessage>,
): Observable<CommandMessage> =>
  pipe(
    in$,
    filter(
      (msg): msg is IncomingMessage | PhantomMessage =>
        msg.type === "IncomingMessage" || msg.type === "PhantomMessage",
    ),
    filter((msg) =>
      msg.content.startsWith(`${config.bot.commandPrefix}${commandName}`),
    ),
    map(
      ({ user, channel, content }): CommandMessage => {
        const [command, ...args] = content.split(" ");

        return {
          type: "CommandMessage",
          user,
          channel,
          arguments: args,
        };
      },
    ),
  );

export const createOutcomingMessage = (channel: discord.TextChannel) => (
  message: string,
): OutcomingMessage => ({
  type: "OutcomingMessage",
  content: message,
  channel,
});

export const createIncomingMessage = (
  channel: discord.TextChannel,
  user: discord.User,
) => (message: string): IncomingMessage => ({
  type: "IncomingMessage",
  content: message,
  user,
  channel,
});

export const createPhantomMessage = (
  channel: discord.TextChannel,
  user: discord.User,
) => (message: string): PhantomMessage => ({
  type: "PhantomMessage",
  content: message,
  user,
  channel,
});
