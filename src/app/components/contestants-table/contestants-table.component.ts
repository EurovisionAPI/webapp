import { Component, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { ContestantReference } from '../../models/contestant-reference';
import { Round } from '../../models/round';
import { QuickGridComponent } from "../quick-grid/quick-grid.component";
import { RouterLink } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { TemplateColumnComponent } from "../quick-grid/template-column.component";
import { GridSort } from '../quick-grid/grid-sort';
import { FlagComponent } from "../flag/flag.component";

@Component({
  selector: 'app-contestants-table',
  imports: [RouterLink, QuickGridComponent, TemplateColumnComponent, FlagComponent],
  templateUrl: './contestants-table.component.html',
  styleUrl: './contestants-table.component.css'
})
export class ContestantsTableComponent implements OnInit {

  readonly MAX_WIDTH_PLACE_COLUMN_SMALL = 470; // px
  readonly MAX_WIDTH_POINTS_COLUMN_SMALL = 500; // px
  readonly MAX_WIDTH_RUNNING_COLUMN_SMALL = 550; // px

  readonly PLACE_SORT = GridSort.byAscending<ContestantData>(c => c.place);
  readonly COUNTRY_SORT = GridSort.byAscending<ContestantData>(c => c.countryName);
  readonly SONG_ARTIST_SORT = GridSort.byAscending<ContestantData>(c => c.song).thenAscending(c => c.artist);
  readonly POINTS_SORT = GridSort.byAscending<ContestantData>(c => c.points);
  readonly RUNNING_SORT = GridSort.byAscending<ContestantData>(c => c.running);

  private readonly countryService = inject(CountryService);

  readonly isCancelled = input.required<boolean>();
  readonly contestants = input.required<ContestantReference[]>();
  readonly round = input.required<Round>();

  readonly contestantsData = signal<ContestantData[]>([]);
  readonly columnPlaceTitle = signal<string>('');
  readonly columnPointsTitle = signal<string>('');
  readonly columnRunningTitle = signal<string>('');

  ngOnInit(): void {
    const contestantsData = this.isCancelled()
      ? this.getContestantsDataCancelled()
      : this.getContestantsData()

    this.contestantsData.set(contestantsData);
    this.onWindowResize();
  }

  @HostListener('window:resize')
  onWindowResize() {
    const width = window.innerWidth;

    this.columnPlaceTitle.set(width > this.MAX_WIDTH_PLACE_COLUMN_SMALL ? 'Place' : '#');
    this.columnPointsTitle.set(width > this.MAX_WIDTH_POINTS_COLUMN_SMALL ? 'Points' : 'Pts');
    this.columnRunningTitle.set(width > this.MAX_WIDTH_RUNNING_COLUMN_SMALL ? 'Running' : 'Run');
  }

  protected hasAttribute(attribute: keyof ContestantData): boolean {
    return this.contestantsData().some(contestant => contestant[attribute]);
  }

  protected getRowLink(contestant: ContestantData): string {
    return `./${contestant.id}`;
  }

  private getContestantsData(): ContestantData[] {
    return this.round().performances.map(performance => {
      const contestant = this.contestants().find(contestant => contestant.id == performance.contestantId)!;

      return {
        id: contestant.id,
        place: performance.place,
        countryCode: contestant.country,
        countryName: this.countryService.getCountryName(contestant.country),
        song: contestant.song,
        artist: contestant.artist,
        running: performance.running,
        points: performance.scores.find(score => score.name === 'total')?.points ?? null,
        isDisqualified: this.round().disqualifieds?.includes(contestant.id)
      }
    });
  }

  private getContestantsDataCancelled(): ContestantData[] {
    return this.contestants().map(contestant => ({
      id: contestant.id,
      place: null,
      countryCode: contestant.country,
      countryName: this.countryService.getCountryName(contestant.country),
      song: contestant.song,
      artist: contestant.artist,
      running: null,
      points: null,
      isDisqualified: false
    }));
  }
}

interface ContestantData {
  id: number;
  place: number | null;
  countryCode: string;
  countryName: string;
  song: string;
  artist: string;
  running: number | null;
  points: number | null;
  isDisqualified: boolean;
}
