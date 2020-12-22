import { map, mergeMap } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import { from, of } from "rxjs";
import axios from "axios";
import { Command, CommandMessage } from "../types";
import { createOutcommingMessage, isCommand } from "../helpers/command";

import config from "../../config.json";

type QuoteData = Record<string, string>;

// todo cache
const fetchQuotes = () => from(axios.get<QuoteData>(config.data.quotes));

const getQuotes = (msg: CommandMessage, index: string) =>
  pipe(
    fetchQuotes(),
    map((result) => result.data?.[index]),
    map((quote) => {
      const msgCreator = createOutcommingMessage(msg.channel);

      return quote
        ? msgCreator(quote)
        : msgCreator("Quote not found or invalid usage");
    }),
  );

export const quote: Command = (in$) =>
  pipe(
    in$,
    isCommand("quote"),
    mergeMap((msg) => {
      const arg = msg.arguments[0];
      const msgCreator = createOutcommingMessage(msg.channel);

      return arg
        ? getQuotes(msg, arg)
        : of(msgCreator("Quote not found or invalid usage"));
    }),
  );
