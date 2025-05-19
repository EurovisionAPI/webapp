import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ContestReference } from '../../models/contest-reference';
import { RouteService } from '../../services/route.service';
import { ContestService } from '../../services/contest.service';
import { CountryService } from '../../services/country.service';

@Component({
  template: ''
})
export abstract class BaseContestComponent implements OnInit {

  protected readonly routeService = inject(RouteService);
  protected readonly contestService = inject(ContestService);
  protected readonly countryService = inject(CountryService);

  protected isJunior = false;

  constructor() {
    effect(() => {
      this.isJunior = this.routeService.isJunior();
    })
  }

  ngOnInit(): void {
    
  }

  protected getCountryCode(contest: ContestReference) {
    return contest.intendedCountry ?? contest.country;
  }
}
function effort(arg0: () => void) {
  throw new Error('Function not implemented.');
}

