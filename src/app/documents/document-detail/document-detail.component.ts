import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css'],
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  id: string;
  nativeWindow: any;
  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private winRef: WindRefService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nativeWindow = this.winRef.getNativeWindow();
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.document = this.documentService.getdocument(this.id);
    });
  }
  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }
  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }
}
