import { filter, map, tap } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import { Command } from "../types";
import { createOutcommingMessage, isCommand } from "./helpers";

export const echo: Command = (in$) =>
  pipe(
    in$,
    isCommand("echo"),
    map((msg) => createOutcommingMessage(msg.channel)(msg.arguments.join(" "))),
  );
