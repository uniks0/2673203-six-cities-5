import { EventEmitter } from 'node:events';

export interface FileReader extends EventEmitter {
  read(): Promise<void>;

  on(event: 'line', listener: (line: string) => void): this;
  on(event: 'end', listener: (count: number) => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
}
