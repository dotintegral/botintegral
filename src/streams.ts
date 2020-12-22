import { Subject } from "rxjs";
import { IncomingMessage } from "./types";

export const mainStream$ = new Subject<IncomingMessage>();
