import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})

export class PexelsService {
  private apiUrl = 'https://api.pexels.com/v1/search';
  private apiKey = environment.pexelsApiKey;

  constructor(private http: HttpClient) { }

  searchImages(query: string, page: number = 1, perPage: number = 10): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.apiKey
    });

    const params = {
      query: query,
      page: page.toString(),
      per_page: perPage.toString()
    };

    return this.http.get(this.apiUrl, { headers, params });
  }
}
