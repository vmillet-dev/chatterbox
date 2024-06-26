import { TestBed } from '@angular/core/testing';

import { ChatService } from './chat.service';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";

describe('MessageService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ChatService
      ]
    });
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    jest.mock('@stomp/stompjs');
    expect(service).toBeTruthy();
  });
});
