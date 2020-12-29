import { merge, Observable, of } from "rxjs";
import { pipe } from "ts-pipe-compose";
import { filter, map, mergeMap } from "rxjs/operators";
import { option as o } from "fp-ts";
import { Some } from "fp-ts/lib/Option";
import { get } from "../helpers/axios";

import { AnyMessage, IncomingMessage, Middleware } from "../types";
import config from "../../config.json";
import { createPhantomMessage } from "../helpers/command";

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

const react = (in$: Observable<AnyMessage>): Observable<AnyMessage> =>
  pipe(
    in$,
    filter((msg): msg is IncomingMessage => msg.type === "IncomingMessage"),
    mergeMap((msg) =>
      pipe(
        fetchReactions(),
        map((reactionsO) => pipe(reactionsO, matchReaction(msg.content))),
        filter((reactionO): reactionO is Some<ReactionEntity> =>
          o.isSome(reactionO),
        ),
        map((reactionSome) => reactionSome.value.command),
        map(createPhantomMessage(msg.channel, msg.user)),
      ),
    ),
  );

export const reaction: Middleware = (in$) =>
  pipe(
    in$,
    mergeMap((msg) => merge(of(msg), react(of(msg)))),
  );
