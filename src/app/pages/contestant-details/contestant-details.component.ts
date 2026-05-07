import { Component, computed, inject, signal } from '@angular/core';
import { BaseContestComponent } from '../base/base-contest.component';
import { ActivatedRoute } from '@angular/router';
import { HeartFlagComponent } from "../../components/heart-flag/heart-flag.component";
import { Lyrics } from '../../models/lyrics';
import { Contest } from '../../models/contest';
import { Contestant } from '../../models/contestant';
import { Utils } from '../../utils/utils';
import { ArmorMusicSheetComponent } from "../../components/armor-music-sheet/armor-music-sheet.component";
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contestant-details',
  imports: [HeartFlagComponent, ArmorMusicSheetComponent],
  templateUrl: './contestant-details.component.html',
  styleUrl: './contestant-details.component.css'
})
export class ContestantDetailsComponent extends BaseContestComponent {

  private readonly LYRICS_COLUMNS = 2;

  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly lyricsRender = signal<LyricsRender | null>(null);
  protected readonly lyricsSelectedColumns = signal<string[][][]>([]);
  protected readonly contestant = signal<ContestantData | null>(null);
  protected readonly lyricsSelectedIndex = signal(0);

  protected readonly year = computed(() => Number(this.route.snapshot.paramMap.get('year')));
  protected readonly contestTitle = computed(() => {
    const country = this.contestant()?.countryName ?? '';
    const junior = this.isJunior() ? 'Junior ' : '';

    return `${junior}Eurovision ${this.year()} ${country}`;
  });

  constructor() {
    super();
    this.loadContestant();
  }

  async loadContestant() {
    const contestantId = Number(this.route.snapshot.paramMap.get('contestantId'));
    const [contest, contestant] = await Promise.all([
      this.contestService.getContest(this.year()),
      this.contestService.getContestant(this.year(), contestantId)
    ]);

    const constentData = await this.getContestantData(contest, contestant);
    this.contestant.set(constentData);

    if (constentData && constentData.lyrics && constentData.lyrics.length > 0) {
      this.selectLyrics(0);
    }
  }

  onLyricsChanged(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedIndex = +selectElement.value;
    this.selectLyrics(selectedIndex);
  }

  private selectLyrics(index: number) {
    this.lyricsSelectedIndex.set(index);
    this.lyricsRender.set(this.getLyricsRender(this.lyricsSelectedIndex()));
  }

  async getContestantData(contest: Contest, contestant: Contestant): Promise<ContestantData> {
    const rounds = this.getRoundsData(contest, contestant.id);
    const lyrics = this.getAllLyricsData(contestant.lyrics);

    return {
      countryCode: contestant.country,
      countryName: this.countryService.getCountryName(contestant.country),
      artist: contestant.artist,
      song: contestant.song,
      videoUrl: this.sanitizer.bypassSecurityTrustResourceUrl(contestant.videoUrls?.[0]),
      lyrics: lyrics,
      musicSheet: this.getMusicSheetData(contestant),

      artistPeople: Utils.join(contestant.artistPeople),
      backings: Utils.join(contestant.backings),
      dancers: Utils.join(contestant.dancers),
      stageDirector: contestant.stageDirector ?? '',

      composers: Utils.join(contestant.composers),
      conductor: contestant.conductor ?? '',
      lyricists: Utils.join(contestant.lyricists),
      writers: Utils.join(contestant.writers),

      broadcaster: contestant.broadcaster,
      commentators: Utils.join(contestant.commentators),
      jury: Utils.join(contestant.jury),
      spokesperson: contestant.spokesperson ?? '',

      disqualified: rounds.some(round => round.isDisqualified),
      rounds: rounds
    }
  }

  private getRoundsData(contest: Contest, contestantId: number): RoundData[] {
    const result: RoundData[] = [];

    for (const round of contest.rounds) {
      const performance = round.performances?.find(p => p.contestantId === contestantId);

      if (performance) {
        result.push({
          name: Utils.getDisplayRoundName(round.name),
          place: performance.place,
          contestantsCount: round.performances.length,
          points: performance.scores.find(score => score.name === 'total')?.points ?? null,
          running: performance.running,
          isDisqualified: round.disqualifieds?.includes(contestantId)
        });
      }
    }

    return result;
  }

  private getMusicSheetData(contestant: Contestant): MusicSheetData | null {
    let result: MusicSheetData | null = null;

    if (contestant.tone) {
      const noteAndScaleNames = contestant.tone.split(' ');
      const noteName = noteAndScaleNames[0];
      const noteKey = noteName.replace('b', 'Flat').replace('#', 'Sharp');
      const note = ArmorMusicSheetComponent.Notes[noteKey as keyof typeof ArmorMusicSheetComponent.Notes];
      const noteDisplay = noteName.replace('b', '♭');
      const scaleName = noteAndScaleNames[1];
      let scale, scaleDisplay;

      if (scaleName.toLowerCase() === "major") {
        scale = ArmorMusicSheetComponent.Scales.Major;
        scaleDisplay = '';
      } else {
        scale = ArmorMusicSheetComponent.Scales.Minor;
        scaleDisplay = 'm';
      }

      result = {
        bpm: contestant.bpm,
        tone: `${noteDisplay}${scaleDisplay}`,
        note,
        scale
      }
    }

    return result;
  }

  private getAllLyricsData(lyrics: Lyrics[]): LyricsData[] {
    return lyrics.filter(lyrics => lyrics.content)
      .sort((l1, l2) => {
        const isL1Original = l1.type === 0;
        const isL2Original = l2.type === 0;

        // Step 1: Original lyrics (with type 0) come first
        if (isL1Original && !isL2Original) return -1;
        if (!isL1Original && isL2Original) return 1;

        // Step 2: If both are originals, sort by presence of displayedLanguages
        if (isL1Original && isL2Original) {
          const l1HasDisplayed = l1.displayedLanguages;
          const l2HasDisplayed = l2.displayedLanguages;

          if (l1HasDisplayed && !l2HasDisplayed) return 1;
          if (!l1HasDisplayed && l2HasDisplayed) return -1;
          return 0; // Both have or both don't have it
        }

        // Step 3: For other types, sort alphabetically
        return l1.languages.toString().localeCompare(l2.languages.toString());
      })
      .map(this.getLyricsData);
  }

  private getLyricsData(lyrics: Lyrics): LyricsData {
    const languages = lyrics.displayedLanguages ?? lyrics.languages;
    const languagesTitlecase = languages.map(Utils.toTitleCase);

    return {
      languages: Utils.join(languagesTitlecase),
      title: lyrics.title,
      content: lyrics.content
    }
  }

  private getLyricsRender(index: number): LyricsRender | null {
    const contestant = this.contestant();

    if (!contestant)
      return null;

    const lyrics = contestant.lyrics[index];

    return {
      title: contestant.lyrics[index].title ?? contestant.song,
      contentColumns: this.getLyricsColumns(lyrics.content)
    };
  }

  // Columns / Paragraphs
  private getLyricsColumns(lyrics: string): SafeHtml[][] {
    const columns: SafeHtml[][] = Array.from({ length: this.LYRICS_COLUMNS }, () => []);
    const paragraphs: string[][] = lyrics.split('\n\n')
      .map(paragraph => paragraph.split('\n'));

    const totalLines = paragraphs.reduce((sum, p) => sum + p.length + 1, 0); // +1 by line breaks between paragraphs
    const linesPerColumn = Math.ceil(totalLines / columns.length);
    let columnIndex = 0, linesCount = 0;

    for (const paragraph of paragraphs) {
      const paragraphLines = paragraph.length + 1; // +1 by line breaks between paragraphs
      const halfParagraphLines = paragraphLines / 2;
      // If the remaining space is less than half the paragraph,
      // it's better to assign the paragraph to the next column,
      // as it's closer to the second column than to the first.
      const wouldOverflow = halfParagraphLines + linesCount > linesPerColumn;

      if (wouldOverflow) {
        columnIndex = Math.min(columnIndex + 1, columns.length - 1);
        linesCount = 0;
      }

      const paragraphHtml = paragraph.join('<br />');
      const safeParagraph = this.sanitizer.bypassSecurityTrustHtml(paragraphHtml);
      columns[columnIndex].push(safeParagraph);
      linesCount += paragraphLines;
    }

    return columns;
  }
}

interface ContestantData {
  countryCode: string;
  countryName: string;
  artist: string;
  song: string;
  videoUrl: SafeResourceUrl;
  lyrics: LyricsData[];
  musicSheet: MusicSheetData | null;

  artistPeople: string;
  backings: string;
  dancers: string;
  stageDirector: string;

  composers: string;
  conductor: string;
  lyricists: string;
  writers: string;

  broadcaster: string;
  commentators: string;
  jury: string;
  spokesperson: string;

  disqualified: boolean;
  rounds: RoundData[];
}

interface MusicSheetData {
  bpm: number;
  tone: string;
  note: number,
  scale: number
}

interface RoundData {
  name: string;
  place: number;
  contestantsCount: number;
  points: number | null;
  running: number;
  isDisqualified: boolean;
}

interface LyricsData {
  languages: string;
  title: string;
  content: string;
}

interface LyricsRender {
  title: string;
  contentColumns: SafeHtml[][];
}