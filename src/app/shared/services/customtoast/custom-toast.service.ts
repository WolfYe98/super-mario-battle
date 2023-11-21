import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CustomToastService {

  constructor(private toast: ToastrService) { }
  showSuccessToast(options: ToastOptions) {
    this.toast.success(options.message, options.title);
  }
  showErrorToast(options: ToastOptions) {
    this.toast.error(options.message, options.title);
  }
  showWarningToast(options: ToastOptions) {
    this.toast.warning(options.message, options.title);
  }
}
type ToastOptions = {
  title: string,
  message: string
}