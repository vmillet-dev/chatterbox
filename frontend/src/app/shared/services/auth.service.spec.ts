import {deepEqual, instance, mock, verify} from "@johanblumenberg/ts-mockito";
import {ApiService} from "./api.service";
import {AuthService} from "./auth.service";
import {RegisterDto} from "../dto/register.dto";
import {LoginDto} from "../dto/login.dto";

describe('AuthService', () => {
  let service: AuthService;
  let apiService: ApiService;

  beforeEach(() => {
    apiService = mock(ApiService)
    service = new AuthService(instance(apiService));
  });

  it('should call apiService.post with correct parameters when register', () => {
    // GIVEN
    const registerDto: RegisterDto = { email: 'mail@toto.fr', username: 'testuser', password: 'password123' };

    // WHEN
    service.registerUser(registerDto);

    // THEN
    verify(apiService.post(
      'auth/register',
      deepEqual({ email:"mail@toto.fr", username:"testuser", password:"password123"}))
    ).once();
  });

  it('should call apiService.post with correct parameters when login', () => {
    // GIVEN
    const loginDto: LoginDto = { usernameOrEmail: 'testuser', password: 'password123'};

    // WHEN
    service.loginUser(loginDto);

    // THEN
    verify(apiService.post(
      'auth/login',
      deepEqual({ usernameOrEmail: "testuser", password: "password123" }))
    ).once();
  });
});
