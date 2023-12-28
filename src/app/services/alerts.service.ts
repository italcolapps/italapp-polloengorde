import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    private _toast: ToastController,
    private _alert: AlertController) { }

  async presentAlert(message:string,title:string=message){
    const alert = await this._alert.create({
      header:title,
      message:message,
      buttons:["Ok"]
    });
    await alert.present();
  }

  async show(options: SweetAlertOptions) {
    return await Swal.fire(options);
  }

  async showConfirmation(): Promise<boolean> {
    const result = await Swal.fire({
        title: '¡Atención!',
        text: '¿Deseas continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'No, cancelar'
    });
    if (result.isConfirmed) {
        Swal.fire('¡Hecho!', 'Has elegido continuar.', 'success');
        return true;  // Retornamos true cuando el usuario confirma
    } else if (result.isDismissed) {
        Swal.fire('Cancelado', 'Has elegido no continuar.', 'error');
        return false;  // Retornamos false cuando el usuario cancela
    }
    return false; // Por default, asumimos que el usuario no confirmó
  }

  async success(message: string, title: string = 'Success') {
    return await Swal.fire({
      title: title,
      text: message,
      icon: 'success'
    });
  }

  async warning(message: string, title: string) {
    return await Swal.fire({
      title: title,
      text: message,
      icon: 'error'
    });
  }



  async presentToast(position: 'top' | 'middle' | 'bottom',message:string,type: 'info'|'error'|'warning'|'success') {

    let colorMessage = {info:"primary",error:"danger",warning:"warning",success:"success"};

    const toast = await this._toast.create({
      message: message,
      duration: 10000,
      position: position,
      color: colorMessage[type],
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }

}
