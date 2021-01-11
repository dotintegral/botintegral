import axios from "axios";
import discord from "discord.js";
import nodeCron from "node-cron";
import { client } from "../client";
import { config } from "../config";
import { createPhantomMessage } from "../helpers/command";
import { mainStream$ } from "../streams";

interface CronEntry {
  pattern: string;
  channelId: string;
  command: string;
}

const onChannelMatch = (cronEntry: CronEntry) => (channel: discord.Channel) => {
  nodeCron.schedule(cronEntry.pattern, () => {
    mainStream$.next(
      createPhantomMessage(
        channel as discord.TextChannel,
        client.user as discord.User,
      )(cronEntry.command),
    );
  });
};

export const initCron = () => {
  axios
    .get<CronEntry[]>(config.data.crontab)
    .then((response) => response.data)
    .then((cronTab) => {
      cronTab.forEach((cronEntry) => {
        if (nodeCron.validate(cronEntry.pattern)) {
          client.channels
            .fetch(cronEntry.channelId)
            .then(onChannelMatch(cronEntry));
        }
      });
    });
};
