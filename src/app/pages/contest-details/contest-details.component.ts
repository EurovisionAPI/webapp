import { Component, inject, OnInit } from '@angular/core';
import { ContestTitleComponent } from "../../components/contest-title/contest-title.component";
import { BaseContestComponent } from '../base/base-contest.component';
import { Contest } from '../../models/contest';
import { ActivatedRoute } from '@angular/router';
import { Round } from '../../models/round';
import { AlertComponent } from "../../components/alert/alert.component";
import { ContestantReference } from '../../models/contestant-reference';
import { RoundDetailsComponent } from "../../components/round-details/round-details.component";
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-contest-details',
  imports: [ContestTitleComponent, AlertComponent, RoundDetailsComponent],
  templateUrl: './contest-details.component.html',
  styleUrl: './contest-details.component.css'
})
export class ContestDetailsComponent extends BaseContestComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);

  protected contest: ContestData;

  override async ngOnInit() {
    super.ngOnInit();
    const year = +this.route.snapshot.paramMap.get('year');
    this.contest = await this.getContestData(year);
  }

  private async getContestData(year: number): Promise<ContestData> {
    const contest = await this.contestService.getContest(year);
    const cancelledMessage = this.getCancelledMessage(year);
    const isCancelled = Boolean(cancelledMessage);

    return {
      year: contest.year,
      country: this.getCountryCode(contest),
      city: contest.city,
      dateTime: this.getDateTime(contest.rounds),
      location: this.getLocation(contest),
      slogan: contest.slogan,
      logoUrl: contest.logoUrl,
      isCancelled: isCancelled,
      cancelledMessage: cancelledMessage,
      participants: contest.contestants.length,
      broadcasters: Utils.join(contest.broadcasters),
      presenters: Utils.join(contest.presenters),
      contestants: contest.contestants,
      rounds: isCancelled ? [contest.rounds[0]] : contest.rounds
    };
  }

  private getDateTime(rounds: Round[]): string {
    const dates = rounds.map(round => new Date(round.date)).sort();
    let dateTime = '';

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];

      if (i < dates.length - 1) {
        dateTime += date.getDay() + ' / ';
      } else {
        const round = rounds[i];
        dateTime += date.toLocaleDateString('en-UK', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        if (round.time) {
          const [h, m, _] = rounds[i].time.split(':');
          dateTime += `, ${h}:${m} UTC`;
        }
      }
    }

    return dateTime;
  }

  private getLocation(contest: Contest): string {
    let location: string = '';

    if (contest.arena) {
      location += contest.arena + ", ";
    }

    location += contest.city + ", " + this.countryService.getCountryName(contest.country);

    return location;
  }

  private getCancelledMessage(year: number) {
    return year == 2020 && !this.isJunior
      ? 'Eurovision Song Contest 2020 was cancelled due to the COVID-19 pandemic'
      : null;
  }
}

interface ContestData {
  year: number;
  country: string;
  city: string;
  dateTime: string;
  location: string;
  slogan: string;
  logoUrl: string;
  isCancelled: boolean;
  cancelledMessage: string;
  participants: number;
  broadcasters: string;
  presenters: string;
  contestants: ContestantReference[];
  rounds: Round[];
}
