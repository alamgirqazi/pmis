import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-upload-attachments',
  templateUrl: './upload-attachments.component.html',
  styleUrls: ['./upload-attachments.component.css']
})
export class UploadAttachmentsComponent implements OnInit {
  constructor() {}
  @Input() attachments = [
    { id: 1, url: 'abc' },
    { id: 1, url: 'abc' },
    { id: 1, url: 'abc' },
    { id: 1, url: 'abc' },
    { id: 1, url: 'abc' }
  ];

  ngOnInit() {}
}
