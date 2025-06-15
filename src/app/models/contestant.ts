import { ContestantReference } from "./contestant-reference";
import { Lyrics } from "./lyrics";

export interface Contestant extends ContestantReference {
  videoUrls: string[];
  lyrics: Lyrics[];
  bpm: number;
  tone: string;
  
  artistPeople: string[];
  backings: string[];
  dancers: string[];
  stageDirector: string;

  composers: string[];
  conductor: string;
  lyricists: string[];
  writers: string[];

  broadcaster: string;
  commentators: string[];
  jury: string[];
  spokesperson: string; 
}
