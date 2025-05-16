import { Component, inject } from '@angular/core';
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

  year: number;
  contestant: ContestantData;
  lyricsSelectedIndex: number;
  lyricsRender: LyricsRender;
  lyricsSelectedColumns: string[][][];

  override async ngOnInit() {
    super.ngOnInit();
    this.year = +this.route.snapshot.paramMap.get('year');
    const contestantId = +this.route.snapshot.paramMap.get('contestantId');
    const [contest, contestant] = await Promise.all([
      this.contestService.getContest(this.year),
      this.contestService.getContestant(this.year, contestantId)
    ]);

    this.contestant = await this.getContestantData(contest, contestant);

    if (this.contestant.lyrics && this.contestant.lyrics.length > 0) {
      this.selectLyrics(0);
    }
  }

  onLyricsChanged(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedIndex = +selectElement.value;
    this.selectLyrics(selectedIndex);
  }

  private selectLyrics(index: number) {
    this.lyricsSelectedIndex = index;
    this.lyricsRender = this.getLyricsRender(this.lyricsSelectedIndex);
  }

  async getContestantData(contest: Contest, contestant: Contestant): Promise<ContestantData> {
    const rounds = this.getRoundsData(contest, contestant.id);
    const lyrics = contestant.lyrics.filter(lyrics => lyrics.content).map(this.getLyricsData)

    return {
      countryCode: contestant.country,
      countryName: this.countryService.getCountryName(contestant.country),
      artist: contestant.artist,
      song: contestant.song,
      videoUrl: this.sanitizer.bypassSecurityTrustResourceUrl(contestant.videoUrls?.[0]),
      disqualified: rounds.some(round => round.isDisqualified),
      rounds: rounds,
      musicSheet: this.getMusicSheetData(contestant),
      lyrics: lyrics,
      backings: contestant.backings?.join(', '),
      broadcaster: contestant.broadcaster,
      commentators: contestant.commentators?.join(', '),
      composers: contestant.composers?.join(', '),
      conductor: contestant.conductor,
      dancers: contestant.dancers?.join(', '),
      spokesperson: contestant.spokesperson,
      stageDirector: contestant.stageDirector,
      writers: contestant.writers?.join(', ')
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
          points: performance.scores?.reduce((sum, score) => sum + score.points, 0),
          running: performance.running,
          isDisqualified: round.disqualifieds?.includes(contestantId)
        });
      }
    }

    return result;
  }

  private getMusicSheetData(contestant: Contestant): MusicSheetData {
    let result: MusicSheetData = null;

    if (contestant.tone) {
      const noteAndScaleNames = contestant.tone.split(' ');
      const noteName = noteAndScaleNames[0];
      const noteKey = noteName.replace('b', 'Flat').replace('#', 'Sharp');
      const note = ArmorMusicSheetComponent.Notes[noteKey as keyof typeof ArmorMusicSheetComponent.Notes];
      const noteDisplay = noteName.toUpperCase();
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

  private getLyricsData(lyrics: Lyrics): LyricsData {
    return {
      languages: lyrics.languages.join(' & '),
      title: lyrics.title,
      content: lyrics.content
    }
  }

  private getLyricsRender(index: number): LyricsRender {
    const lyrics = this.contestant.lyrics[index];

    return {
      title: lyrics.title ?? this.contestant.song,
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
  disqualified: boolean;
  rounds: RoundData[];
  musicSheet: MusicSheetData;
  lyrics: LyricsData[];
  backings: string;
  broadcaster: string;
  commentators: string;
  composers: string;
  conductor: string;
  dancers: string;
  spokesperson: string;
  stageDirector: string;
  writers: string;
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
  points: number;
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