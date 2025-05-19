import { Component, OnInit, signal } from '@angular/core';
import { BaseContestComponent } from '../base/base-contest.component';
import { RouterLink } from '@angular/router';
import { ContestTitleComponent } from "../../components/contest-title/contest-title.component";

@Component({
  selector: 'app-contest-list',
  imports: [RouterLink, ContestTitleComponent],
  templateUrl: './contest-list.component.html',
  styleUrl: './contest-list.component.css'
})
export class ContestListComponent extends BaseContestComponent implements OnInit {

  allContests: ContestData[] = [];
  contests: ContestData[] = [];
  contestOrder: Order = Order.Ascending;
  orderArrow: string;

  override async ngOnInit() {
    super.ngOnInit();
    this.allContests = await this.getContestsData();
    this.search(null);
    console.log('Es junior: ', this.isJunior)
  }

  onInputSearchChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value;

    this.search(query);
  }

  toggleSort() {
    this.contestOrder = this.contestOrder == Order.Ascending
      ? Order.Descending
      : Order.Ascending;

    this.sortContests();
  }

  private search(query: string) {
    query = query?.trim();
    let filtered = this.allContests;

    if (query) {
      filtered = this.allContests.filter(c =>
        c.countryName.toLowerCase().includes(query)
        || c.city.toLowerCase().includes(query)
        || c.year.toString().includes(query)
      );
    }

    this.contests = filtered;
    this.sortContests();
  }

  private sortContests() {
    if (this.contestOrder == Order.Ascending) {
      this.contests = this.contests.sort((a, b) => a.year - b.year);
      this.orderArrow = "up";
    } else {
      this.contests = this.contests.sort((a, b) => b.year - a.year);
      this.orderArrow = "down";
    }
  }

  private async getContestsData(): Promise<ContestData[]> {
    const contests = await this.contestService.getAllContests();

    return contests.map(contest => {
      const countryCode = this.getCountryCode(contest);

      return {
        year: contest.year,
        countryCode: countryCode,
        countryName: this.countryService.getCountryName(countryCode),
        city: contest.city
      }
    });
  }
}

enum Order { Ascending, Descending }

interface ContestData {
  year: number;
  countryCode: string;
  countryName: string;
  city: string;
}