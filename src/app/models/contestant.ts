import { ContestantReference } from "./contestant-reference";
import { Lyrics } from "./lyrics";

export interface Contestant extends ContestantReference {
  lyrics: Lyrics[];
  videoUrls: string[];
  tone: string;
  bpm: number;
  backings: string[];
  broadcaster: string;
  commentators: string[];
  composers: string[];
  conductor: string;
  dancers: string[];
  spokesperson: string;
  stageDirector: string;
  writers: string[];
}
