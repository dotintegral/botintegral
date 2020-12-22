import discord from "discord.js";

import { merge, Observable } from "rxjs";
import { pipe } from "ts-pipe-compose";
import { filter, map, mergeMap } from "rxjs/operators";
import { option as o } from "fp-ts";
import { get } from "./helpers/axios";

import { IncomingMessage, Middleware, OutcomingMessage } from "./types";
import config from "../config.json";
import { createIncomingMessage } from "./helpers/command";
import { client } from "./client";

interface ReactionEntity {
  regex: string;
  command: string;
}

type ReactionData = ReactionEntity[];

const fetchReactions = () => get<ReactionData>(config.data.reactions);

const react = (
  in$: Observable<IncomingMessage | OutcomingMessage>,
): Observable<IncomingMessage | OutcomingMessage> =>
  pipe(
    in$,
    mergeMap((msg) =>
      pipe(
        fetchReactions(),
        map((reactionsO) =>
          pipe(
            reactionsO,
            o.mapNullable((reactions) =>
              reactions.find((r) => r.regex === msg.content),
            ),
          ),
        ),
        filter((reactionO) => o.isSome(reactionO)),
        map((reactionSome) =>
          createIncomingMessage(
            msg.channel,
            client.user as discord.User,
          )(
            pipe(
              reactionSome,
              o.fold(
                () => "",
                ({ command }) => command,
              ),
            ),
          ),
        ),
      ),
    ),
  );

export const reaction: Middleware = (in$) => merge(in$, react(in$));
