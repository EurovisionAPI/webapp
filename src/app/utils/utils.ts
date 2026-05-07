export class Utils {
  static getDisplayRoundName(roundName: string): string {
    switch (roundName.toLowerCase()) {
      case 'final':
        return 'Grand Final';
      case 'semifinal':
        return 'Semifinal';
      case 'semifinal1':
        return 'Semifinal 1';
      default:
        return 'Semifinal 2';
    }
  }

  static join(items: string[] | null): string {
    if (!items) return '';

    return items.length > 1
      ? items.slice(0, -1).join(', ') + ' & ' + items.at(-1)
      : items[0];
  }

  static toTitleCase(text: string): string {
    if (text.length > 0) {
      text = text[0].toUpperCase() + text.slice(1).toLowerCase();
    }

    return text;
  }
}