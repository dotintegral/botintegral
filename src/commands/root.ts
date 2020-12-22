import { merge } from "rxjs";
import { Middleware } from "../types";
import { countdown } from "./countdown";
import { echo } from "./echo";
import { quote } from "./quote";
import { channinfo } from "./chaninfo";

export const root: Middleware = (in$) =>
  merge(in$, echo(in$), countdown(in$), quote(in$), channinfo(in$));
