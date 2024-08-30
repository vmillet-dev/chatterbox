import { ApiService } from './api.service';
import {anything, deepEqual, instance, mock, verify} from "@johanblumenberg/ts-mockito";
import { HttpClient } from "@angular/common/http";

describe('ApiService', () => {
  let service: ApiService;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = mock(HttpClient);
    service = new ApiService(instance(httpClient));
  });

  it('should call http.get with correct URL', () => {
    // GIVEN
    const endpoint = 'test';

    // WHEN
    service.get(endpoint);

    // THEN
    verify(httpClient.get('/api/test')).once();
  });

  it('should call http.post with correct URL and data', () => {
    // GIVEN
    const endpoint = 'test';
    const data = { key: 'value' };

    // WHEN
    service.post(endpoint, data);

    // THEN
    verify(httpClient.post('/api/test', deepEqual({ key: 'value' }))).once();
  });

  it('should call http.put with correct URL and data', () => {
    // GIVEN
    const endpoint = 'test';
    const data = { key: 'value' };

    // WHEN
    service.put(endpoint, data);

    // THEN
    verify(httpClient.put('/api/test', deepEqual({ key: 'value' }))).once();
  });

  it('should call http.delete with correct URL', () => {
    // GIVEN
    const endpoint = 'test';

    // WHEN
    service.delete(endpoint);

    // THEN
    verify(httpClient.delete('/api/test')).once();
  });

  it('should return HttpHeaders with Authorization header set', () => {
    // GIVEN
    const token = 'test_token';

    // WHEN
    const headers = service.setAuthHeader(token);

    // THEN
    expect(headers.get('Authorization')).toBe(`Bearer test_token`);
  });

  it('should call http.get with correct URL and headers', () => {
    // GIVEN
    const endpoint = 'test';
    const token = 'test_token';

    // WHEN
    service.getWithAuth(endpoint, token);

    // THEN
    verify(httpClient.get('/api/test', anything())).once();
  });
});
