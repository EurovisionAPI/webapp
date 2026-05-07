import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FlagComponent } from "../flag/flag.component";
import { Performance } from '../../models/performance';
import { SwitchComponent } from "../switch/switch.component";
import { CountryService } from '../../services/country.service';
import { ContestantReference } from '../../models/contestant-reference';

@Component({
  selector: 'app-score-board',
  imports: [FlagComponent, SwitchComponent],
  templateUrl: './score-board.component.html',
  styleUrl: './score-board.component.css'
})
export class ScoreBoardComponent implements OnInit {
  readonly contestants = input.required<ContestantReference[]>();
  readonly performances = input.required<Performance[]>();

  private readonly countryService = inject(CountryService);

  readonly types = signal<string[]>([]);
  readonly typeIndexSelected = signal(0);
  readonly countries = signal<string[]>([]);
  readonly performancesData = signal<PerformancesData[]>([]);

  ngOnInit(): void {
    const firstPerformance = this.performances()[0];
    this.types.set(firstPerformance.scores.map(score => score.name));
    this.countries.set(Object.keys(firstPerformance.scores[0].votes));

    this.getPerformancesData();
  }

  changeType(value: number) {
    this.typeIndexSelected.set(value);
    this.getPerformancesData();
  }

  private getPerformancesData(): void {
    const performancesData = this.performances().map(performance => {
      const contestant = this.contestants()[performance.contestantId];
      const score = performance.scores[this.typeIndexSelected()];

      return {
        countryCode: contestant.country,
        countryName: this.countryService.getCountryName(contestant.country),
        points: score.points,
        votes: this.countries().map(country => contestant.country != country ? score.votes[country] : -1)
      }
    }).sort((a, b) => b.points - a.points);

    this.performancesData.set(performancesData);
  }
}

interface PerformancesData {
  countryCode: string;
  countryName: string;
  points: number;
  votes: number[];
}
