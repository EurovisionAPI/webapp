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
}