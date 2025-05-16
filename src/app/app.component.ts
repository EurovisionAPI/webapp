import { Component, effect } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RouteService } from './services/route.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly SENIOR_ROUTE = '';
  readonly JUNIOR_ROUTE = 'junior';

  currentRoute: string;
  linkTitle: string;
  linkRoute: string;

  constructor(private routeService: RouteService) {
    effect(() => {
      const isJunior = this.routeService.isJunior();

      if (isJunior) {
        this.currentRoute = this.getContestsRoute(this.JUNIOR_ROUTE);
        this.linkTitle = 'Senior';
        this.linkRoute = this.getContestsRoute(this.SENIOR_ROUTE);
      } else {
        this.currentRoute = this.getContestsRoute(this.SENIOR_ROUTE);
        this.linkTitle = 'Junior';
        this.linkRoute = this.getContestsRoute(this.JUNIOR_ROUTE);
      }
    });
  }

  private getContestsRoute(baseRoute: string) {
    return baseRoute + '/contests';
  }
}
