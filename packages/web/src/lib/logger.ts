import { Logger } from "@codeleap/common";

export const logger = new Logger({
  Environment: {
    IsDev: true,
  },
  Sentry: {
    enable: false,
  },
  Logger: {
    Level: "debug",
  },
});
