import { Routes } from '@angular/router';
import { ContestListComponent } from './pages/contest-list/contest-list.component';
import { ContestDetailsComponent } from './pages/contest-details/contest-details.component';
import { ContestantDetailsComponent } from './pages/contestant-details/contestant-details.component';

const commonRoutes: Routes = [
  { path: 'contests', component: ContestListComponent },
  { path: 'contests/:year', component: ContestDetailsComponent },
  { path: 'contests/:year/:contestantId', component: ContestantDetailsComponent },
]

export const routes: Routes = [
  { path: '', redirectTo: 'contests', pathMatch: 'full' },
  { path: '', children: commonRoutes },
  { path: 'junior', children: commonRoutes }
];
