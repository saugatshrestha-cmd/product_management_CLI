type ParsedArgs = {
    [key: string]: string | number;
  };
  
  export class ArgumentParser {
    private args: string[];
  
    constructor(args: string[]) {
      this.args = args;
    }
  
    parse(): ParsedArgs {
      const parsed: ParsedArgs = {};
      for (let i = 0; i < this.args.length; i++) {
        if (this.args[i].startsWith('--')) {
          const key = this.args[i].substring(2);
          const value = this.args[i + 1];
          parsed[key] = isNaN(Number(value)) ? value : Number(value);
          i++;
        }
      }
      return parsed;
    }
  }
  