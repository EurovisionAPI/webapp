import { Component, HostListener, Input, OnInit } from '@angular/core';
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

  @Input() isCancelled: boolean;
  @Input() contestants: ContestantReference[];
  @Input() round: Round;

  contestantsData: ContestantData[];
  columnPlaceTitle: string;
  columnPointsTitle: string;
  columnRunningTitle: string;

  constructor(private countryService: CountryService) { }

  ngOnInit(): void {
    this.contestantsData = this.isCancelled
      ? this.getContestantsDataCancelled()
      : this.getContestantsData();

    this.onWindowResize();
  }

  @HostListener('window:resize')
  onWindowResize() {
    const width = window.innerWidth;

    this.columnPlaceTitle = width > this.MAX_WIDTH_PLACE_COLUMN_SMALL ? 'Place' : '#';
    this.columnPointsTitle = width > this.MAX_WIDTH_POINTS_COLUMN_SMALL ? 'Points' : 'Pts';
    this.columnRunningTitle = width > this.MAX_WIDTH_RUNNING_COLUMN_SMALL ? 'Running' : 'Run';
  }

  protected hasAttribute(attribute: string): boolean {
    return this.contestantsData.some(contestant => contestant[attribute]);
  }

  protected getRowLink(contestant: ContestantData): string {
    return `./${contestant.id}`;
  }

  private getContestantsData(): ContestantData[] {
    return this.round.performances.map(performance => {
      const contestant = this.contestants[performance.contestantId];

      return {
        id: contestant.id,
        place: performance.place,
        countryCode: contestant.country,
        countryName: this.countryService.getCountryName(contestant.country),
        song: contestant.song,
        artist: contestant.artist,
        running: performance.running,
        points: performance.scores?.reduce((sum, s) => sum + s.points, 0),
        isDisqualified: this.round.disqualifieds?.includes(contestant.id)
      }
    });
  }

  private getContestantsDataCancelled(): ContestantData[] {
    return this.contestants.map(contestant => ({
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
  place: number;
  countryCode: string;
  countryName: string;
  song: string;
  artist: string;
  running: number;
  points: number;
  isDisqualified: boolean;
}
