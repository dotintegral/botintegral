import { map } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import { Command } from "../../types";
import { createOutcomingMessage, isCommand } from "../../helpers/command";

export const echo: Command = (in$) =>
  pipe(
    in$,
    isCommand("echo"),
    map((msg) => createOutcomingMessage(msg.channel)(msg.arguments.join(" "))),
  );
