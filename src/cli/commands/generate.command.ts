import axios from 'axios';
import { MockData } from '../../types/mock-server-data-types.js';
import { Command } from './command.interface.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.js';
import { appendFile } from 'node:fs/promises';

export class GenerateCommand implements Command {
  private initialData!: MockData;

  private async loadMockData(url: string): Promise<MockData> {
    try {
      const response = await axios.get<MockData>(url);
      return response.data;
    } catch (error: unknown) {
      console.error('Error loading mock data:');
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new Error(`Не удалось загрузить данные с ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    for (let i = 0; i < offerCount; i++) {
      await appendFile(filepath, `${tsvOfferGenerator.generate()}\n`, {
        encoding: 'utf8',
      });
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {

    const [count, filePath, url] = parameters;

    if (!count || !filePath || !url) {
      console.error('Missing parameters');
      throw new Error(
        'Не все параметры указаны. Использование: --generate <n> <filepath> <url>'
      );
    }

    const offerCount = Number.parseInt(count, 10);

    if (isNaN(offerCount) || offerCount <= 0) {
      console.error(`Invalid offer count: ${count}`);
      throw new Error(`Неверное количество предложений: ${count}`);
    }

    try {
      this.initialData = await this.loadMockData(url);
      await this.write(filePath, offerCount);
      console.info(`File ${filePath} was created!`);
    } catch (error: unknown) {
      console.error('Error in GenerateCommand:');
      console.error('Can\'t generate data');
      if (error instanceof Error) {
        console.error(error.message);
        console.error(error.stack);
      }
      throw error;
    }
  }
}
