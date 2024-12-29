import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pago } from '../interfaces/pago';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/pagos/'
  }
  getList(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.myAppUrl}${this.myApiUrl}`)
  }
  save(pago: Pago): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}`, pago)
  }
  update(id:number, pago:any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl +'/'+ id, pago); 
  }
  delete(id: number): Observable<any>{
    return this.http.delete(this.myAppUrl + this.myApiUrl +'/'+ id)
  }
  PDFpago(id: number): Observable<any>{
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}pagoPDF/${id}`, {
      responseType: 'blob' as 'json' // Indicar que esperamos un blob (archivo binario)
    });
  }
  ReporteDeudas(id:number): Observable<any>{
    return this.http.get(this.myAppUrl + this.myApiUrl +'pdf/'+ id, {
      responseType: 'blob' as 'json' // Indicar que esperamos un blob (archivo binario)
    });
  }
}
