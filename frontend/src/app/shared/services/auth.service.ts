import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {RegisterDto} from "../dto/register.dto";
import {LoginDto} from "../dto/login.dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService) { }

  public registerUser(registerDto: RegisterDto): Observable<any> {
    return this.apiService.post("auth/register", registerDto);
  }

  public loginUser(loginDto: LoginDto): Observable<any> {
    return this.apiService.post("auth/login", loginDto);
  }
}
