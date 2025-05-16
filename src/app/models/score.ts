export interface Score {
  name: string;
  points: number;
  votes: Record<string, number>;
}
