import chalk from "chalk";
import { Command } from "./command.interface.js";

export class HelpCommand implements Command {
  public getName(): string {
    return "--help";
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(
      chalk.blue(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            cli.js --<command> [--arguments]
        Команды:
            --version:
            --help:
            --import <path>:
            --generate <n> <path> <url>
    `)
    );
  }
}
