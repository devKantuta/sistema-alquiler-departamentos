import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tiempoanticipo } from '../interfaces/tiempoanticipo';

@Injectable({
  providedIn: 'root'
})
export class TiempoAnticipoService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/tiempoanticipos/'
  }

  getLista(): Observable<Tiempoanticipo[]> {
    return this.http.get<Tiempoanticipo[]>(`${this.myAppUrl}${this.myApiUrl}`)
  }

}
