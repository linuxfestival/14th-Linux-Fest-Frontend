class Logger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = import.meta.env.PROD;
  }

  private log(
    message: string,
    prefix: string,
    style: string,
    logFunction: typeof console.log
  ): void {
    if (!this.isProduction) {
      logFunction(`%c${prefix}%c ${message}`, style, "");
    }
  }

  public info(message: string): void {
    this.log(message, "[INFO]", "background: #2563eb; color: white", console.log);
  }

  public warn(message: string): void {
    this.log(message, "[WARN]", "background: #eab308; color: black", console.warn);
  }

  public error(message: string): void {
    this.log(message, "[ERROR]", "background: #dc2626; color: white", console.error);
  }

  public debug(message: string): void {
    this.log(message, "[DEBUG]", "background: #16a34a; color: white", console.debug);
  }
}

export const logger = new Logger();
