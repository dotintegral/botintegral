import discord from "discord.js";
import { Observable } from "rxjs";

export interface IncomingMessage {
  type: "IncomingMessage";
  content: string;
  user: discord.User;
  channel: discord.TextChannel;
}

export interface PhantomMessage {
  type: "PhantomMessage";
  content: string;
  user: discord.User;
  channel: discord.TextChannel;
}

export interface OutcomingMessage {
  type: "OutcomingMessage";
  content: string;
  channel: discord.TextChannel;
}

export type AnyMessage = IncomingMessage | PhantomMessage | OutcomingMessage;

export interface CommandMessage {
  type: "CommandMessage";
  arguments: string[];
  user: discord.User;
  channel: discord.TextChannel;
}

export interface Command {
  (a: Observable<AnyMessage>): Observable<OutcomingMessage>;
}

export interface Middleware {
  (a: Observable<AnyMessage>): Observable<AnyMessage>;
}
