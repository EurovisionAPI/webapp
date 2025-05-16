import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private readonly api = inject(ApiService);

  private countries: Record<string, string>;

  async init() {
    this.countries = await this.api.get<Record<string, string>>('countries');
  }

  getCountryName(countryCode: string): string {
    return this.countries[countryCode];
  }
}
