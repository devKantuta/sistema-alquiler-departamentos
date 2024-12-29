import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inquilino } from '../interfaces/inquilino';

@Injectable({
  providedIn: 'root'
})
export class InquilinoService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/inquilinos/'
  }

  getList(): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>(`${this.myAppUrl}${this.myApiUrl}`)
  }

  save(inquilino: Inquilino): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}`, inquilino)
  }

  update(id:number, inquilino:any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl +'/'+ id, inquilino); 
  }

  delete(id: number): Observable<any>{
    return this.http.delete(this.myAppUrl + this.myApiUrl +'/'+ id)
  }
}

