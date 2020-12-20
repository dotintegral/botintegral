import { filter, map } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import { Command } from "../types";
import { isCommand } from "./helpers";

export const echo: Command = (in$) =>
  pipe(
    in$,
    isCommand("echo"),
    map((msg) => ({
      type: "OutcomingMessage",
      content: msg.arguments.join(" "),
      channel: msg.channel,
    })),
  );
