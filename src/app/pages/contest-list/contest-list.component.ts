import { Component, computed, signal, untracked } from '@angular/core';
import { BaseContestComponent } from '../base/base-contest.component';
import { RouterLink } from '@angular/router';
import { ContestTitleComponent } from "../../components/contest-title/contest-title.component";

@Component({
  selector: 'app-contest-list',
  imports: [RouterLink, ContestTitleComponent],
  templateUrl: './contest-list.component.html',
  styleUrl: './contest-list.component.css'
})
export class ContestListComponent extends BaseContestComponent {

  private allContests = signal<ContestData[]>([]);
  private contestOrder = signal(Order.Ascending);
  private query = signal<string | null>(null);
  private filteredContests = computed<ContestData[]>(() => this.filterContests());

  protected orderArrow = computed(() => this.contestOrder() === Order.Ascending ? 'up' : 'down');
  protected contests = computed(() => this.getFilteredContests());

  constructor() {
    super();
    this.loadContests();
  }

  private async loadContests() {
    const contests = await this.contestService.getAllContests();
    const contestsData: ContestData[] = contests.map(contest => {
      const countryCode = this.getCountryCode(contest);

      return {
        year: contest.year,
        countryCode: countryCode,
        countryName: this.countryService.getCountryName(countryCode),
        city: contest.city
      }
    });

    this.allContests.set(contestsData);
  }

  onInputSearchChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }

  toggleSort() {
    this.contestOrder.update(
      current => current === Order.Ascending ? Order.Descending : Order.Ascending
    );
  }

  private getFilteredContests(): ContestData[] {
    const filtered = this.filteredContests();
    const sorted = [...filtered].sort((a, b) =>
      this.contestOrder() === Order.Ascending ? a.year - b.year : b.year - a.year
    );

    return sorted;
  }

  private filterContests(): ContestData[] {
    const query = this.query()?.trim().toLowerCase();
    let filtered = this.allContests();

    if (query) {
      filtered = filtered.filter(c =>
        c.countryName.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query) ||
        c.year.toString().includes(query)
      );
    }

    return filtered;
  }
}

enum Order { Ascending, Descending }

interface ContestData {
  year: number;
  countryCode: string;
  countryName: string;
  city: string;
}
