import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

interface DataObject {
  data: any[];
}

export class FileService {
  private filePath: string;

  constructor(filename: string) {
    this.filePath = path.join(__dirname, '..', '..', 'data', filename);

    if (!existsSync(this.filePath)) {
      this.save({ data: [] });
    }
  }

  load(): any[] {
    const fileContent = readFileSync(this.filePath, 'utf-8');
    if (!fileContent.trim()) {
      this.save({ data: [] });
      return [];
    }

    const parsed: DataObject = JSON.parse(fileContent);
    return parsed.data;
  }

  save(data: DataObject): void {
    writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }
}
