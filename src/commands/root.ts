import { merge, of } from "rxjs";
import { pipe } from "ts-pipe-compose";
import { mergeMap } from "rxjs/operators";
import { Middleware } from "../types";
import { countdown } from "./countdown";
import { echo } from "./echo";
import { quote } from "./quote";
import { channinfo } from "./chaninfo";

export const root: Middleware = (in$) =>
  pipe(
    in$,
    mergeMap((msg) =>
      merge(
        of(msg),
        echo(of(msg)),
        countdown(of(msg)),
        quote(of(msg)),
        channinfo(of(msg)),
      ),
    ),
  );
