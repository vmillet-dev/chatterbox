import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from "sockjs-client";

export interface ChatMessage {
  content: string;
  sender: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: Client;
  private messageSubject = new BehaviorSubject<ChatMessage[]>([]);

  messages$ = this.messageSubject.asObservable();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('api/ws'),
      onConnect: () => {
        console.log('Connected to WebSocket');
        this.stompClient.subscribe('/topic/public', (message) => {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          const currentMessages = this.messageSubject.value;
          this.messageSubject.next([...currentMessages, chatMessage]);
        });
      },
    });

    this.stompClient.activate();
  }

  sendMessage(message: string, sender: string) {
    this.stompClient.publish({
      destination: '/api/chat.sendMessage',
      body: JSON.stringify({ content: message, sender: sender })
    });
  }
}
