import { ContestantReference } from "./contestant-reference";
import { Lyrics } from "./lyrics";

export interface Contestant extends ContestantReference {
  videoUrls: string[];
  lyrics: Lyrics[];
  bpm: number;
  tone: string;

  artistPeople: string[];
  backings: string[] | null;
  dancers: string[] | null;
  stageDirector: string | null;

  composers: string[] | null;
  conductor: string | null;
  lyricists: string[] | null;
  writers: string[] | null;

  broadcaster: string;
  commentators: string[];
  jury: string[];
  spokesperson: string;
}
