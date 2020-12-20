import { merge, Observable } from "rxjs";
import { IncomingMessage, OutcomingMessage } from "../types";
import { countdown } from "./countdown";
import { echo } from "./echo";

export interface RootCommand {
  (a: Observable<IncomingMessage | OutcomingMessage>): Observable<
    OutcomingMessage | IncomingMessage
  >;
}

export const root: RootCommand = (in$) => merge(in$, echo(in$), countdown(in$));
