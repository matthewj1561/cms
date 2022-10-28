import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  private subscription: Subscription;
  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.subscription = this.contactService.contactChangedEvent.subscribe((cons: Contact[]) => {
      this.contacts = cons;
    });
    this.contacts = this.contactService.getContacts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

  }
}
