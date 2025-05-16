import { ContestReference } from "./contest-reference";
import { ContestantReference } from "./contestant-reference";
import { Round } from "./round";

export interface Contest extends ContestReference {
  slogan: string;
  logoUrl: string;
  voting: string;
  presenters: string[];
  broadcasters: string[];
  contestants: ContestantReference[];
  rounds: Round[];
}
