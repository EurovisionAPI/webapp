import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static readonly API_URL = 'https://eurovisionapi.runasp.net/api/';

  private readonly http = inject(HttpClient);
  private readonly cache = new Cache();

  async get<T>(url: string): Promise<T> {
    let response: any;

    if (this.cache.contains(url)) {
      response = this.cache.load(url);
    } else {
      const requestUrl = ApiService.API_URL + url;
      response = await lastValueFrom(this.http.get(requestUrl));
      this.cache.store(url, response);
    }

    return response as T;
  }
}

class Cache {
  private data: Map<string, any> = new Map<string, any>();

  contains(url: string): boolean {
    return this.data.has(url);
  }

  load(url: string): any {
    return this.data.get(url);
  }

  store(url: string, value: any) {
    this.data.set(url, value);
  }
}
