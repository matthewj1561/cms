import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('1', 'Cheese', 'I really like Cheese', 'Jonathon James'),
    new Message('1', 'Cheese', 'I really like Cheese', 'Jonathon James'),
    new Message('1', 'Cheese', 'I really like Cheese', 'Jonathon James'),
  ];
  constructor() {}

  ngOnInit(): void {}

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
