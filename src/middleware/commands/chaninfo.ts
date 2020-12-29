import { map } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import { Command } from "../../types";
import { createOutcomingMessage, isCommand } from "../../helpers/command";

export const channinfo: Command = (in$) =>
  pipe(
    in$,
    isCommand("channinfo"),
    map(({ channel }) => {
      const msgCreator = createOutcomingMessage(channel);

      return msgCreator(`channel: ${channel.name} / channelId: ${channel.id}
server: ${channel.guild.name} / serverId: ${channel.guild.id}`);
    }),
  );
