import { Subject } from "rxjs";
import { IncomingMessage, PhantomMessage } from "./types";

export const mainStream$ = new Subject<IncomingMessage | PhantomMessage>();
