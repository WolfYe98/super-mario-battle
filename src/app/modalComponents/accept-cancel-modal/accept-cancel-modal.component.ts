import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accept-cancel-modal',
  template: `
  <div class="modal-header">
    <h4 class="modal-title">{{title}}</h4>
    <button type="button" class="close btn" (click)="closeModal()" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p>{{ message }}</p>
    <div class="d-flex flex-row align-item-center justify-content-end">
      <input type="button" value="Accept" class=" btn btn-primary m-1" (click)="acceptModal()"/>
      <input type="button" value="Cancel" class="btn btn-danger m-1" (click)="closeModal()"/>
    </div>
  </div>
  `
})
export class AcceptCancelModalComponent {
  @Input() title: string = "";
  @Input() message: string = "";
  constructor(private modal: NgbActiveModal) { }
  closeModal() {
    this.modal.close(false);
  }
  acceptModal() {
    this.modal.close(true);
  }
}
