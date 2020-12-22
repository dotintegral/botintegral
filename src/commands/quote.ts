import { map, mergeMap } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import { from, of } from "rxjs";
import axios from "axios";
import { either as e } from "fp-ts";
import { Command, CommandMessage } from "../types";
import { createOutcommingMessage, isCommand } from "../helpers/command";

import config from "../../config.json";
import { get } from "../helpers/axios";

interface QuoteData extends Record<string, string> {}

// todo cache
const fetchQuotes = () => get<QuoteData>(config.data.quotes);

const getQuotes = (msg: CommandMessage, index: string) =>
  pipe(
    fetchQuotes(),
    map((quotesM) =>
      pipe(
        quotesM,
        e.fromOption(() => "Quotes not available"),
        e.map((x) => x[index]),
        e.chain((quote) =>
          !quote ? e.left("This quote does not exist") : e.right(quote),
        ),
      ),
    ),
  );

export const quote: Command = (in$) =>
  pipe(
    in$,
    isCommand("q"),
    mergeMap((msg) => {
      const arg = msg.arguments[0];
      const msgCreator = createOutcommingMessage(msg.channel);

      const result$ = arg
        ? getQuotes(msg, arg)
        : of(e.left("Invalid argument"));

      return pipe(
        result$,
        map((resultE) =>
          pipe(
            resultE,
            e.getOrElse((err) => err),
            msgCreator,
          ),
        ),
      );
    }),
  );
