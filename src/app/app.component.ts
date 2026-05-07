import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RouteService } from './services/route.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  static readonly SENIOR_ROUTE = '';
  static readonly JUNIOR_ROUTE = 'junior';

  private readonly routeService = inject(RouteService);

  readonly currentRoute = signal<string>('');
  readonly linkTitle = signal<string>('');
  readonly linkRoute = signal<string>('');

  constructor() {
    effect(() => {
      const isJunior = this.routeService.isJunior();

      if (isJunior) {
        this.currentRoute.set(this.getContestsRoute(AppComponent.JUNIOR_ROUTE));
        this.linkTitle.set('Senior');
        this.linkRoute.set(this.getContestsRoute(AppComponent.SENIOR_ROUTE));
      } else {
        this.currentRoute.set(this.getContestsRoute(AppComponent.SENIOR_ROUTE));
        this.linkTitle.set('Junior');
        this.linkRoute.set(this.getContestsRoute(AppComponent.JUNIOR_ROUTE));
      }
    });
  }

  private getContestsRoute(baseRoute: string) {
    return baseRoute + '/contests';
  }
}
