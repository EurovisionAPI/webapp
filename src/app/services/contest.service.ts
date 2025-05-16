import { inject, Injectable } from '@angular/core';
import { RouteService } from './route.service';
import { ApiService } from './api.service';
import { ContestReference } from '../models/contest-reference';
import { Contest } from '../models/contest';
import { Contestant } from '../models/contestant';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  private readonly routeService = inject(RouteService);
  private readonly api = inject(ApiService);

  getAllContests(): Promise<ContestReference[]> {
    return this.api.get<ContestReference[]>(this.getContestsUrl());
  }

  getContest(year: number): Promise<Contest> {
    return this.api.get<Contest>(`${this.getContestsUrl()}/${year}`);
  }

  getContestant(year: number, contestantId: number): Promise<Contestant> {
    const url = `${this.getContestsUrl()}/${year}/contestants/${contestantId}`
    return this.api.get<Contestant>(url);
  }

  private getContestsUrl(): string {
    const isJunior = this.routeService.isJunior();

    return isJunior ? 'junior/contests' : 'contests';
  }
}
