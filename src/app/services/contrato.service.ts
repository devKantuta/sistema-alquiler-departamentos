import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contrato } from '../interfaces/contrato';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/contratos/'
  }

  getList(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.myAppUrl}${this.myApiUrl}`)
  }
  getContrato(id:number): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.myAppUrl}${this.myApiUrl}/${id}`)
  }

  save(contrato: Contrato): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}`, contrato)
  }

  update(id:number, contrato:any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl +'/'+ id, contrato); 
  }

  delete(id: number): Observable<any>{
    return this.http.delete(this.myAppUrl + this.myApiUrl +'/'+ id)
  }
  updateEstado(id:number, contrato:any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl +'estado/'+ id, contrato); 
  }
  
  PDFcontrato(id: number): Observable<any>{
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}PDFcontrato/${id}`, {
      responseType: 'blob' as 'json' // Indicar que esperamos un blob (archivo binario)
    });
  }

  ContratosPorVencer(): Observable<any>{
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}ContratosPorVencer`, {
      responseType: 'blob' as 'json' // Indicar que esperamos un blob (archivo binario)
    });
  }

  CuartoSolicitado(): Observable<any>{
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}CuartoSolicitado`, {
      responseType: 'blob' as 'json' // Indicar que esperamos un blob (archivo binario)
    });
  }
}
