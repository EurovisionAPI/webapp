import { Component, Input, OnInit } from '@angular/core';
import { ContestantReference } from '../../models/contestant-reference';
import { Round } from '../../models/round';
import { SwitchComponent } from "../switch/switch.component";
import { ContestantsTableComponent } from "../contestants-table/contestants-table.component";
import { ScoreBoardComponent } from "../score-board/score-board.component";
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-round-details',
  imports: [SwitchComponent, ContestantsTableComponent, ScoreBoardComponent],
  templateUrl: './round-details.component.html',
  styleUrl: './round-details.component.css'
})
export class RoundDetailsComponent implements OnInit {

  @Input() isCancelled: boolean;
  @Input() contestants: ContestantReference[];
  @Input() round: Round;

  roundName: string;
  hasScore: boolean;
  ToggleOptions = ToggleOptions;
  toggleOptionSelected = ToggleOptions.Ranking;

  ngOnInit(): void {
    this.roundName = Utils.getDisplayRoundName(this.round.name);
    this.hasScore = this.round.performances?.at(0).scores.length > 0;
  }

  protected changeToggleOption(value: number) {
    this.toggleOptionSelected = value;
  }
}

enum ToggleOptions {
  Ranking,
  Score
}