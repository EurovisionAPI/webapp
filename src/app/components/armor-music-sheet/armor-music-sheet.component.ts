import { Component, Input, OnInit } from '@angular/core';
import { StringBuilder } from '../../utils/string-builder';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

enum Notes { CFlat, C, CSharp, DFlat, D, DSharp, EFlat, E, ESharp, FFlat, F, FSharp, GFlat, G, GSharp, AFlat, A, ASharp, BFlat, B, BSharp };
enum Scales { Major, Minor };

@Component({
  selector: 'app-armor-music-sheet',
  imports: [],
  templateUrl: './armor-music-sheet.component.html',
  styleUrl: './armor-music-sheet.component.css'
})
export class ArmorMusicSheetComponent implements OnInit {

  static readonly Notes = Notes;
  static readonly Scales = Scales;

  // Fonts
  private readonly MUSIC_FONT = "Polihymnia";

  // Tempo
  private readonly TEMPO_POSITION_Y = 10;
  private readonly TEMPO_SIZE = 15;

  // Staff
  protected readonly STAFF_WIDTH = 110;
  private readonly STAFF_LINES = 5;
  private readonly STAFF_LINE_SPACE = 6;
  private readonly STAFF_POSITION_Y = this.TEMPO_POSITION_Y + 15;
  private readonly STAFF_ITEM_SIZE = 30;

  // Figures
  private readonly MARGIN_KEY = 3;
  private readonly ALTERATION_SPACE = 8;
  private readonly MARGIN_ALTERATIONS = 20;
  private readonly ACCORD_NOTES_LENGTH = 3;
  private readonly MARGIN_ACCORD = 10;
  private readonly C_NOTE_POSITION_Y = this.STAFF_POSITION_Y + this.STAFF_LINE_SPACE * this.STAFF_LINES;
  private readonly OVERLINE_WIDTH = 15.75;

  // Alterations
  private readonly SHARP_POSITIONS = [0, 1.5, -0.5, 1, 2.5, 0.5, 2]; // F C G D A E B
  private readonly SHARPS_ORDER = [
    Notes.C, Notes.G, Notes.D, Notes.A, Notes.E, Notes.B, Notes.FSharp, Notes.CSharp
  ];

  private readonly FLAT_POSITIONS = [2, 0.5, 2.5, 1, 3, 1.5, 3.5]; // B E A D G C F
  private readonly FLATS_ORDER = [
    Notes.C, Notes.F, Notes.BFlat, Notes.EFlat, Notes.AFlat, Notes.DFlat, Notes.GFlat, Notes.CFlat
  ];

  private readonly FIFTH_CIRCLE = new Map<Notes, Notes>([
    // minor  Major
    // 0
    [Notes.A, Notes.C],
    // 1
    [Notes.E, Notes.G],
    [Notes.D, Notes.F],
    // 2
    [Notes.G, Notes.BFlat],
    [Notes.B, Notes.D],
    // 3
    [Notes.C, Notes.EFlat],
    [Notes.FSharp, Notes.A],
    // 4
    [Notes.F, Notes.AFlat],
    [Notes.CSharp, Notes.E],
    // 5
    [Notes.BFlat, Notes.DFlat],
    [Notes.GSharp, Notes.B],
    // 6
    [Notes.DSharp, Notes.FSharp],
    [Notes.EFlat, Notes.GFlat],
    // 7
    [Notes.AFlat, Notes.CFlat],
    [Notes.ASharp, Notes.CSharp],
  ]);

  @Input() note: Notes;
  @Input() scale: Scales;
  @Input() tempo: number;

  private positionX: number = 0;
  protected html: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const htmlBuilder = new StringBuilder();
    this.drawTempo(htmlBuilder, this.tempo);
    this.drawStaff(htmlBuilder);
    this.drawArmor(htmlBuilder);
    this.drawAccord(htmlBuilder);

    this.html = this.sanitizer.bypassSecurityTrustHtml(htmlBuilder.toString());
  }

  private drawTempo(builder: StringBuilder, tempo: number) {
    if (tempo) {
      builder.appendLine(this.drawMusicText(0, this.TEMPO_POSITION_Y, this.TEMPO_SIZE, "qj"));
      builder.appendLine(this.drawText(11, this.TEMPO_POSITION_Y + 1, this.TEMPO_SIZE - 4, "Open Sans", `= ${tempo}`));
    }
  }

  private drawStaff(stringBuilder: StringBuilder) {
    let y: number = this.STAFF_POSITION_Y;

    for (let i = 0; i < this.STAFF_LINES; i++) {
      stringBuilder.appendLine(this.drawLine(0, y, this.STAFF_WIDTH, y));
      y += this.STAFF_LINE_SPACE;
    }

    this.positionX += this.MARGIN_KEY;
    const positionY = this.STAFF_POSITION_Y + 16;
    stringBuilder.appendLine(this.drawSheet(this.positionX, positionY, "Gj"));
  }

  private drawArmor(builder: StringBuilder) {
    let note = this.note;

    // Find relative major
    if (this.scale == Scales.Minor) {
      if (this.FIFTH_CIRCLE.has(note)) {
        note = this.FIFTH_CIRCLE.get(note);
      } else {
        throw new Error("Not exist scale");
      }
    }

    let alteration: string;
    let alterationPositions: number[];
    let alterationCount = this.SHARPS_ORDER.indexOf(note);

    if (alterationCount >= 0) // Sharp
    {
      alteration = "Xj";
      alterationPositions = this.SHARP_POSITIONS;
    }
    else {
      alterationCount = this.FLATS_ORDER.indexOf(note);

      if (alterationCount >= 0) { // Flat
        alteration = "bj";
        alterationPositions = this.FLAT_POSITIONS;
      }
      else
        throw new Error("Not exist scale");
    }

    this.positionX += this.MARGIN_ALTERATIONS;

    for (let i = 0; i < alterationCount; i++) {
      const y = Math.floor(this.STAFF_POSITION_Y + alterationPositions[i] * this.STAFF_LINE_SPACE);

      builder.appendLine(this.drawSheet(this.positionX, y, alteration));
      this.positionX += this.ALTERATION_SPACE;
    }
  }

  private drawAccord(builder: StringBuilder) {
    const startNote: number = Math.floor(this.note / 3); // flat + nature + sharp
    let positionY: number = this.C_NOTE_POSITION_Y - (this.STAFF_LINE_SPACE / 2) * startNote;
    this.positionX += this.MARGIN_ACCORD;

    for (let i = 0; i < this.ACCORD_NOTES_LENGTH; i++) {
      const note: string = this.drawSheet(this.positionX, positionY, "wj");
      builder.appendLine(note);
      positionY -= this.STAFF_LINE_SPACE;
    }

    // If start note is C then we must draw the overline.
    if (startNote == 0) {
      const overline = this.drawLine(this.positionX, this.C_NOTE_POSITION_Y, this.positionX + this.OVERLINE_WIDTH, this.C_NOTE_POSITION_Y);
      builder.appendLine(overline);
    }
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number): string {
    return `<line x1=\"${x1}\" y1=\"${y1}\" x2=\"${x2}\" y2=\"${y2}\" style=\"fill:none;stroke:rgb(0,0,0);stroke-width:0.5\"></line>`;
  }

  private drawText(x: number, y: number, fontSize: number, fontFamily: string, innerHtml: string): string {
    return `<text x=\"${x}\" y=\"${y}\" style=\"fill:rgb(0,0,0); font-size:${fontSize}px; font-family: ${fontFamily};\">${innerHtml}</text>`;
  }

  private drawMusicText(x: number, y: number, fontSize: number, innerHtml: string): string {
    return this.drawText(x, y, fontSize, this.MUSIC_FONT, innerHtml);
  }

  private drawSheet(x: number, y: number, innerHtml: string): string {
    return this.drawText(x, y, this.STAFF_ITEM_SIZE, this.MUSIC_FONT, innerHtml);
  }
}
