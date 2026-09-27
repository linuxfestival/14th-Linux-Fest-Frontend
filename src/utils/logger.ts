class Logger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = import.meta.env.PROD;
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
    this.log(message, "[INFO]", console.log);
  }

  public warn(message: string): void {
    this.log(message, "[WARN]", console.warn);
  }

  public error(message: string): void {
    this.log(message, "[ERROR]", console.error);
  }

  public debug(message: string): void {
    this.log(message, "[DEBUG]", console.debug);
  }
}

export const logger = new Logger();
