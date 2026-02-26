import { inject, Injectable, signal } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  readonly isJunior = signal<boolean>(true);

  private location = inject(Location);

  constructor() {
    this.onUrlChanged(this.location.path());
    this.location.onUrlChange(url => this.onUrlChanged(url));
  }

  private onUrlChanged(url: string) {
    const isJunior = url.includes('junior');
    this.isJunior.set(isJunior);
  }
}
