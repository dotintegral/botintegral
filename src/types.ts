import discord from "discord.js";
import { Observable } from "rxjs";

export interface IncomingMessage {
  type: "IncomingMessage";
  content: string;
  user: discord.User;
  channel: discord.TextChannel;
}

export interface OutcomingMessage {
  type: "OutcomingMessage";
  content: string;
  channel: discord.TextChannel;
}

export interface CommandMessage {
  type: "CommandMessage";
  arguments: string[];
  user: discord.User;
  channel: discord.TextChannel;
}

export interface Command {
  (
    a: Observable<IncomingMessage | OutcomingMessage>,
  ): Observable<OutcomingMessage>;
}

export interface Middleware {
  (a: Observable<IncomingMessage | OutcomingMessage>): Observable<
    OutcomingMessage | IncomingMessage
  >;
}
