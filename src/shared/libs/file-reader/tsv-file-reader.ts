import { createReadStream } from 'node:fs';
import { EventEmitter } from 'node:events';
import { FileReader } from './file-reader.interface.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(private readonly filename: string) {
    super();
  }

  public async read(): Promise<void> {
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(this.filename, {
        encoding: 'utf8',
        highWaterMark: 16384,

      });

      let remainingData = '';
      let nextLinePosition = -1;
      let lineCount = 0;

      readStream.on('data', (chunk: string) => {
        remainingData += chunk.toString();

        while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
          const completeRow = remainingData.slice(0, nextLinePosition + 1);
          remainingData = remainingData.slice(++nextLinePosition);
          lineCount++;

          this.emit('line', completeRow.trim());
        }
      });

      readStream.on('end', () => {
        if (remainingData.trim().length > 0) {
          lineCount++;
          this.emit('line', remainingData.trim());
        }

        this.emit('end', lineCount);
        resolve();
      });

      readStream.on('error', (error) => {
        this.emit('error', error);
        reject(error);
      });
    });
  }
}
