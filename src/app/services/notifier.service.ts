import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from "../components/shared/snackbar/snackbar.component";

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snack: MatSnackBar){}

  showNotification(message: string, actionMsg: string, panelClass:string){
    this.snack.openFromComponent(SnackbarComponent, {
      data: {
        message: message,
        btnText: actionMsg
      },
      duration: 5000,
      panelClass: panelClass
    })
  }

}
