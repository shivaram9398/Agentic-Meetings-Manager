import pino from "pino";

const isDevelopment = ["dev", "qa"].includes(process.env.NODE_ENV ?? "");

export const logger = pino({
  level: isDevelopment ? "debug" : "info",

  base: {
    service: "agentic-meetings-manager",
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  ...(isDevelopment && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
});
