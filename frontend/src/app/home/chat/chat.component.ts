import { Component } from '@angular/core';
import {ChatMessage, ChatService} from "../../shared/services/chat.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  username: string = '';

  constructor(private chatService: ChatService) {
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.chatService.sendMessage(this.newMessage, this.username);
      this.newMessage = '';
    }
  }
}
