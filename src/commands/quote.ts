import { map, mergeMap } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import { either as e } from "fp-ts";
import { Command } from "../types";
import { createOutcomingMessage, isCommand } from "../helpers/command";

import config from "../../config.json";
import { get } from "../helpers/axios";

interface QuoteData extends Record<string, string> {}

// todo cache
const fetchQuotes = () => get<QuoteData>(config.data.quotes);

const randomKey = <T>(data: Record<string, T>): string => {
  const keys = Object.keys(data);
  const random = Math.floor(Math.random() * keys.length);
  const key = keys[random];

  return key;
};

const randomItem = <T>(data: Record<string, T>): T => data[randomKey(data)];

const pickQuote = (index?: string) => (
  quotes: QuoteData,
): string | undefined => {
  if (index) {
    return quotes[index] || undefined;
  }

  return randomItem(quotes);
};

const getQuote = (index?: string) =>
  pipe(
    fetchQuotes(),
    map((quotesM) =>
      pipe(
        quotesM,
        e.fromOption(() => "Quotes not available"),
        e.map(pickQuote(index)),
        e.chain((quote) =>
          !quote ? e.left("This quote does not exist") : e.right(quote),
        ),
      ),
    ),
  );

export const quote: Command = (in$) =>
  pipe(
    in$,
    isCommand("quote"),
    mergeMap((msg) => {
      const index = msg.arguments[0] || undefined;
      const msgCreator = createOutcomingMessage(msg.channel);

      return pipe(
        index,
        getQuote,
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
