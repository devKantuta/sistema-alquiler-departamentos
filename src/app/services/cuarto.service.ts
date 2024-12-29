import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cuarto } from '../interfaces/cuarto';

@Injectable({
  providedIn: 'root'
})
export class CuartoService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/cuartos/'
  }

  getCuartos(): Observable<Cuarto[]> {
    return this.http.get<Cuarto[]>(`${this.myAppUrl}${this.myApiUrl}`)
  }

  saveCuarto(cuarto: Cuarto): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}`, cuarto)
  }

  updateCuarto(id:number, cuarto:any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl +'/'+ id, cuarto); 
  }

  deleteCuarto(id: number): Observable<any>{
    return this.http.delete(this.myAppUrl + this.myApiUrl +'/'+ id)
  }

  updateEstado(id:number, cuarto:any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl +'estado/'+ id, cuarto); 
  }
}

