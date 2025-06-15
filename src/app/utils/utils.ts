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

  static join(items: string[]): string {
    if (!items) return null;

    return items.length > 1
      ? items.slice(0, -1).join(', ') + ' & ' + items.at(-1)
      : items[0];
  }

  static toTitleCase(text: string): string {
    return text
      ? text[0].toUpperCase() + text.substring(1).toLowerCase()
      : null;
  }
}