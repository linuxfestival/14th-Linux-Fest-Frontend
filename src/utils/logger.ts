import chalk from "chalk";

const isProduction = process.env.NODE_ENV === "production";

class Logger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
  }

  private log(
    message: string,
    prefix: string,
    logFunction: (msg: string) => void
  ): void {
    if (!this.isProduction) {
      logFunction(`${prefix} ${message}`);
    }
  }

  public info(message: string): void {
    this.log(message, chalk.bgBlue.white("[INFO]"), console.log);
  }

  public warn(message: string): void {
    this.log(message, chalk.bgYellow.black("[WARN]"), console.warn);
  }

  public error(message: string): void {
    this.log(message, chalk.bgRed.white("[ERROR]"), console.error);
  }

  public debug(message: string): void {
    this.log(message, chalk.bgGreen.white("[DEBUG]"), console.debug);
  }
}

export const logger = new Logger();
