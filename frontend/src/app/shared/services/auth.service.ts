import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {RegisterDto} from "../dto/register.dto";
import {LoginDto} from "../dto/login.dto";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {LocalStorageService} from "./local-storage.service";

export interface User {
  token: string;
  email: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private apiService: ApiService, private localStorage: LocalStorageService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public registerUser(registerDto: RegisterDto): Observable<any> {
    return this.apiService.post("auth/register", registerDto);
  }

  public loginUser(loginDto: LoginDto): Observable<any> {
    return this.apiService.post<User>("auth/login", loginDto)
      .pipe(
        tap(user => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  public logout(): void {
    this.localStorage.removeData('currentUser');
    this.currentUserSubject.next(null);
  }

  public getToken(): string | null {
    return this.currentUserSubject.value?.token ?? null;
  }

  public isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    const storedUser = this.localStorage.getData('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}
