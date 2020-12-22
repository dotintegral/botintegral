import discord from "discord.js";

import { merge, Observable } from "rxjs";
import { pipe } from "ts-pipe-compose";
import { filter, map, mergeMap } from "rxjs/operators";
import { option as o } from "fp-ts";
import { Some } from "fp-ts/lib/Option";
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

const matchReaction = (message: string) => (
  reactionsO: o.Option<ReactionData>,
) =>
  pipe(
    reactionsO,
    o.mapNullable((reactions) =>
      reactions.find((r) => RegExp(r.regex, "gi").test(message)),
    ),
  );

const react = (
  in$: Observable<IncomingMessage | OutcomingMessage>,
): Observable<IncomingMessage | OutcomingMessage> =>
  pipe(
    in$,
    mergeMap((msg) =>
      pipe(
        fetchReactions(),
        map((reactionsO) => pipe(reactionsO, matchReaction(msg.content))),
        filter((reactionO): reactionO is Some<ReactionEntity> =>
          o.isSome(reactionO),
        ),
        map((reactionSome) => reactionSome.value.command),
        map(createIncomingMessage(msg.channel, client.user as discord.User)),
      ),
    ),
  );

export const reaction: Middleware = (in$) => merge(in$, react(in$));
