import { Component, computed, input, signal } from '@angular/core';
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
export class RoundDetailsComponent {

  contestants = input.required<ContestantReference[]>();
  round = input.required<Round>();
  isCancelled = input.required<boolean>();

  protected ToggleOptions = ToggleOptions;
  protected toggleOptionSelected = signal(ToggleOptions.Ranking);

  protected roundName = computed(() => Utils.getDisplayRoundName(this.round().name));
  protected hasScore = computed(() => this.round().performances?.at(0).scores.length > 0);

  protected changeToggleOption(value: number) {
    this.toggleOptionSelected.set(value);
  }
}

enum ToggleOptions {
  Ranking,
  Score
}