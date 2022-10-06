import { EventEmitter, Output, Component, OnInit } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'How to Cook', 'Good file', 'fake.com', null),
    new Document(
      '1',
      'Eating Snails: An Autobiography',
      'Decent file',
      'null.com',
      null
    ),
    new Document(
      '1',
      'Twinkle Twinkle Little Bat',
      'Nice file',
      'unreal.com',
      null
    ),
    new Document(
      '1',
      'Unsavory Tech Tips',
      'Awesome file',
      'invalid.com',
      null
    ),
  ];
  constructor() {}

  ngOnInit(): void {}

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
