import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RouteService } from './services/route.service';
import { LoadingComponent } from "./components/loading/loading.component";
import { CountryService } from './services/country.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  static readonly SENIOR_ROUTE = '';
  static readonly JUNIOR_ROUTE = 'junior';

  private readonly routeService = inject(RouteService);
  private readonly countryService = inject(CountryService);

  readonly isLoading = signal(true);
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

  async ngOnInit(): Promise<void> {
    await this.countryService.init();
    this.isLoading.set(false);
  }

  private getContestsRoute(baseRoute: string) {
    return baseRoute + '/contests';
  }
}
