import { map, mergeMap } from "rxjs/operators";
import { pipe } from "ts-pipe-compose";
import { either as e } from "fp-ts";
import { Command } from "../../types";
import { createOutcomingMessage, isCommand } from "../../helpers/command";

import config from "../../../config.json";
import { get } from "../../helpers/axios";

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

interface QuoteIndex {
  index: string;
  quote: string;
}

const pickQuote = (index?: string) => (
  quotes: QuoteData,
): QuoteIndex | undefined => {
  if (index) {
    const quote = quotes[index];

    if (quote) {
      return {
        index,
        quote,
      };
    }
    return undefined;
  }

  const key = randomKey(quotes);

  return {
    index: key,
    quote: quotes[key],
  };
};

const getQuote = (index?: string) =>
  pipe(
    fetchQuotes(),
    map((quotesM) =>
      pipe(
        quotesM,
        e.fromOption(() => "Quotes not available"),
        e.map(pickQuote(index)),
        e.chain((quoteIndex) =>
          !quoteIndex
            ? e.left("This quote does not exist")
            : e.right(`Quote #${quoteIndex.index} \n> ${quoteIndex.quote}`),
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
