import { Component, Input, OnInit } from '@angular/core';
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
  @Input() contestants: ContestantReference[];
  @Input() performances: Performance[];

  types: string[];
  typeIndexSelected: number = 0;
  countries: string[];
  performancesData: PerformancesData[];

  constructor(private countryService: CountryService) { }

  ngOnInit(): void {
    console.log(this.performances);

    const firstPerformance = this.performances[0];
    this.types = firstPerformance.scores.map(score => score.name);
    this.countries = Object.keys(firstPerformance.scores[0].votes);

    this.getPerformancesData();

    console.log(this.countries);
  }

  changeType(value: number) {
    this.typeIndexSelected = value;
    this.getPerformancesData();
  }

  private getPerformancesData(): void {
    this.performancesData = this.performances.map(performance => {
      const contestant = this.contestants[performance.contestantId];
      const score = performance.scores[this.typeIndexSelected];

      return {
        countryCode: contestant.country,
        countryName: this.countryService.getCountryName(contestant.country),
        points: score.points,
        votes: this.countries.map(country => contestant.country != country ? score.votes[country] : -1)
      }
    }).sort((a, b) => b.points - a.points);
  }
}

interface PerformancesData {
  countryCode: string;
  countryName: string;
  points: number;
  votes: number[];
}
