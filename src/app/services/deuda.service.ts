import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Deuda } from '../interfaces/deuda';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/deudas/'
  }

  getList(): Observable<Deuda[]> {
    return this.http.get<Deuda[]>(`${this.myAppUrl}${this.myApiUrl}`)
  }
  getListporContrato(id: number): Observable<Deuda[]> {
    return this.http.get<Deuda[]>(`${this.myAppUrl}${this.myApiUrl}porContrato/${id}`)
  }

  save(deuda: Deuda): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}`, deuda)
  }

  update(id:number, deuda:any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl +'/'+ id, deuda); 
  }

  delete(id: number): Observable<any>{
    return this.http.delete(this.myAppUrl + this.myApiUrl +'/'+ id)
  }

  VerPdf(id: number): Observable<any>{
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}pdf/${id}`, {
      responseType: 'blob' as 'json' // Indicar que esperamos un blob (archivo binario)
    });
  }

  updateEstado(id:number, dueda:any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl +'estado/'+ id, dueda); 
  }

  RangoDeudaPDF(fechas: any): Observable<any>{
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}RangoDeudaPDF`, fechas, {
      responseType: 'blob' as 'json' // Indicar que esperamos un blob (archivo binario)
    });
  }

  
}
