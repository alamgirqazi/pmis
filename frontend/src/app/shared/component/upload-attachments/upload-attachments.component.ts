import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';

import { AuthService } from '../../../../sdk/services/core/auth.service';
import { Baseconfig } from '../../../../sdk/base.config';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap';
import { ProjectsApi } from './../../../../sdk/services/custom/projects.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ToasterService } from 'angular2-toaster';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'shared-upload-attachments',
  templateUrl: './upload-attachments.component.html',
  styleUrls: ['./upload-attachments.component.css']
})
export class UploadAttachmentsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private projectsApi: ProjectsApi,
    private slimScroll: SlimLoadingBarService,
    private modalService: BsModalService,
    private toasterService: ToasterService
  ) {
    this.toasterService = toasterService;
  }
  @Input() attachments = [];
  @Input() displayattachments = [];
  query = '';
  attachmentsToDisplay = [];
  file = null;
  modalRef: BsModalRef;
  @Input() fileType = 'projects';
  @Input() formData;
  @Input() title;
  @Output() output: EventEmitter<any> = new EventEmitter();
  selectedAttachment = null;
  user_name;
  fileItem = null;
  user_id;
  ngOnInit() {
    const { name, id } = this.authService.getAccessTokenInfo();
    this.user_name = name;
    this.user_id = id;

    if (this.displayattachments.length > 0) {
      this.attachmentsToDisplay = JSON.parse(
        JSON.stringify(this.displayattachments)
      );
    } else {
      this.attachmentsToDisplay = JSON.parse(JSON.stringify(this.attachments));
    }
    if (this.attachmentsToDisplay) {
      for (const iterator of this.attachmentsToDisplay) {
        if (iterator) {
          iterator.url = `${Baseconfig.getPath()}/${
            iterator.filePath
          }attachment-${iterator.id}.${iterator.extension}`;
        }
      }
    }
  }
  downloadFile(item) {
    window.open(item.url, '_blank');
  }

  deleteFile(template: TemplateRef<any>, item) {
    this.selectedAttachment = item;
    this.modalRef = this.modalService.show(template, { class: 'modal-xs' });

    // const fileURL = URL.createObjectURL(res);
    // window.open(fileURL, '_blank');
  }
  onFileChange(e) {
    const file = e.target.files[0];
    this.file = file;
    this.fileItem = {};
    this.fileItem.file = file;
    this.fileItem.extension = file.name.split('.').pop();
    this.fileItem.user_name = this.user_name;
    this.fileItem.user_id = this.user_id;
    this.fileItem.file_type = this.fileType;
    this.fileItem.id = uuid();
  }
  decline() {
    this.modalRef.hide();
  }
  confirmDelete() {
    const attachments = this.attachments.filter(x => {
      return x.id !== this.selectedAttachment.id;
    });

    const data_to_save = {
      attachments: attachments
    };

    // we need to give it right id

    this.projectsApi
      .updateAttachments(
        this.formData._id,
        this.selectedAttachment.file_type,
        data_to_save
      )
      // .updateAttachments(this.formData._id, this.fileType, data_to_save)
      .subscribe(
        async response => {
          console.log('response->', response);
          this.modalRef.hide();
          this.removeFromView();
          this.output.emit(null);
          this.toasterService.pop('success', 'Deleted Successfully');

          this.slimScroll.complete();
        },
        error => {
          console.log('error', error);
          // this.modalRef.hide();
          this.toasterService.pop('error', 'There are some error deleting');
          this.slimScroll.complete();
        }
      );
  }

  removeFromView() {
    if (this.attachments.length) {
      this.attachments = this.attachments.filter(x => {
        return x.id !== this.selectedAttachment.id;
      });
    }
    if (this.attachmentsToDisplay.length) {
      this.attachmentsToDisplay = this.attachmentsToDisplay.filter(x => {
        return x.id !== this.selectedAttachment.id;
      });
    }
  }
  uploadFile() {
    if (this.fileItem) {
      this.projectsApi
        .uploadAttachment(
          this.formData.project_id,
          this.file,
          this.fileItem,
          this.attachments,
          this.formData
        )
        .subscribe(
          async response => {
            console.log('response', response);
            this.output.emit(null);
            const filePath = `images/attachments/${this.formData.project_id}/`;
            this.fileItem['date'] = Date.now();
            this.fileItem['filePath'] = filePath;
            this.fileItem['url'] = `${Baseconfig.getPath()}/${
              this.fileItem.filePath
            }attachment-${this.fileItem.id}.${this.fileItem.extension}`;
            if (!this.attachments) {
              this.attachments = [];
            }
            if (!this.attachmentsToDisplay) {
              this.attachmentsToDisplay = [];
            }
            this.attachments.push(this.fileItem);
            this.attachmentsToDisplay.push(this.fileItem);
            this.slimScroll.complete();
            this.fileItem = {};
            this.file = null;
            this.toasterService.pop('success', 'Added Successfully');
          },
          error => {
            console.log('error', error);
            this.toasterService.pop('error', 'There are some error adding');

            this.slimScroll.complete();
          }
        );
    }
  }
}
