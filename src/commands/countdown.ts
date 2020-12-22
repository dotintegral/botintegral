import { merge, of } from "rxjs";

import { range } from "ramda";
import { delay, filter, mergeMap } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import { Command } from "../types";
import { createOutcomingMessage, isCommand } from "../helpers/command";

export const countdown: Command = (in$) =>
  pipe(
    in$,
    isCommand("countdown"),
    filter((msg) => {
      const val = parseInt(msg.arguments[0] || "", 10);

      return !!val && val > 0 && val < 11;
    }),
    mergeMap((msg) => {
      const send = createOutcomingMessage(msg.channel);
      const max = parseInt(msg.arguments[0], 10);
      const steps = range(0, max + 1);

      const messages = steps.map((i) => {
        const stepMessage =
          i < max ? `${max - i}` : `<@!${msg.user.id}> countdown ended!`;

        return pipe(stepMessage, send, (c) => of(c), delay(i * 1000));
      });

      return merge(...messages);
    }),
  );
