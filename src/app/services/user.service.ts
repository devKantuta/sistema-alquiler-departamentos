import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myAppUrl: string;
  private myApiUrl: string;
  isLoginPage: boolean = false;

  constructor(private http: HttpClient,private router: Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/users';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/login' || event.url === '/signIn' || event.url === '/') {
          this.isLoginPage = true;
        } else {
          this.isLoginPage = false;
        }
      }
    });
   }

   signIn(user: User): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, user);
   }

   login(user: User): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/login`, user)
   }
}
