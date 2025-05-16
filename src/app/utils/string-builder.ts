export class StringBuilder {
  private lines: string[];

  constructor() {
    this.lines = [];
  }

  append(text: string) {
    if (this.lines.length == 0) {
      this.lines.push(text);
    } else {
      const lastIndex = this.lines.length - 1;
      this.lines[lastIndex] += text;
    }
  }

  appendLine(text: string) {
    this.lines.push(text);
  }

  toString(): string {
    return this.lines.join('\n');
  }
}