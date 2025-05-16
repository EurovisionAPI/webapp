import { Score } from "./score";

export interface Performance {
  contestantId: number;
  running: number;
  place: number;
  scores: Score[];
}
