import { prisma } from "../config/prisma";
import { eventEmitter } from "../events/eventEmitter";
import { EVENTS } from "../events/events.contants";

eventEmitter.on(EVENTS.APPLICATION_CREATED, async ({ userId, jobTitle }) => {
  await prisma.notification.create({
    data: {
      userId,
      type: "APPLICATION_CREATED",
      message: `Your application for the position of ${jobTitle} has been received. We will review it and get back to you soon!`,
    },
  });
});
