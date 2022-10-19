import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../contact.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css'],
})
export class ContactDetailComponent implements OnInit {
  @Input() contact: Contact;
  id: string;
  constructor(
    private contactServcie: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.contact = this.contactServcie.getContact(this.id);
    });
  }

  onDelete() {
    this.contactServcie.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
  }
}
