import {
  Component,
  Output,
  ElementRef,
  OnInit,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css'],
})
export class MessageEditComponent implements OnInit {
  currentSender: string = '101';
  subject: string;
  msgText: string;
  @Output() addMessageEvent = new EventEmitter<Message>();
  @ViewChild('subject', { static: false }) subjectInput: ElementRef;
  @ViewChild('msg', { static: false }) messageInput: ElementRef;
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  onSendMessage(e) {
    e.preventDefault();
    this.subject = this.subjectInput.nativeElement.value;
    this.msgText = this.messageInput.nativeElement.value;

    let newMessage: Message = new Message(
      "0",
      this.subject,
      this.msgText,
      this.currentSender
    );
    // this.addMessageEvent.emit(newMessage);
    this.messageService.addMessage(newMessage);

    this.onClear();
  }

  onClear() {
    this.subjectInput.nativeElement.value = '';
    this.messageInput.nativeElement.value = '';
  }
}
