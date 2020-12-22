import discord from "discord.js";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import { CommandMessage, IncomingMessage, OutcomingMessage } from "../types";

import config from "../../config.json";

export const isCommand = (commandName: string) => (
  in$: Observable<IncomingMessage | OutcomingMessage>,
): Observable<CommandMessage> =>
  pipe(
    in$,
    filter((msg): msg is IncomingMessage => msg.type === "IncomingMessage"),
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

export const createOutcommingMessage = (channel: discord.TextChannel) => (
  message: string,
): OutcomingMessage => ({
  type: "OutcomingMessage",
  content: message,
  channel,
});
