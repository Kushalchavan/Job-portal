import { Counter } from "prom-client";

export const userRegisteredCounter = new Counter({
  name: "user_registered_total",
  help: "Total users registered",
});

export const jobCreatedCounter = new Counter({
  name: "job_created_total",
  help: "Total jobs created",
});

export const applicationCreatedCounter = new Counter({
  name: "application_created_total",
  help: "Total applications created",
});

export const emailSentCounter = new Counter({
  name: "email_sent_total",
  help: "Total emails sent",
});

export const notificationCreatedCounter = new Counter({
  name: "notification_created_total",
  help: "Total notifications created",
});