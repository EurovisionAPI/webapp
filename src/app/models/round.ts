import { Performance } from './performance';

export interface Round {
  name: string;
  date: string;
  time: string;
  performances: Performance[];
  disqualifieds: number[];
}
