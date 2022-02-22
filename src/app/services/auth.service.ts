import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthModel } from '../interfaces/auth-model';
import { TokenModel } from '../interfaces/token-model';
import { NotifierService } from './notifier.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //sistematransportesace10@gmail.com
  //#sistemaje18

  readonly _rootURL = 'https://api.mercadolibre.com/';
  readonly _accessToken = {
    "client_id": 3760663880727805,
    "client_secret": "B0ksXKPENtGTm9Aq13gAnI0YKhSYNN9e",
    "grant_type": "client_credentials"
  }

  constructor(private http: HttpClient, private fireAuth: Auth, private router: Router, private notification: NotifierService) { }

  _requestAccessToken(){
    console.log(this._accessToken.client_id);
    return this.http.post<TokenModel>(this._rootURL + 'oauth/token', JSON.stringify(this._accessToken));
  }

  _loginUser(userLogInfo: AuthModel){
    signInWithEmailAndPassword(this.fireAuth, userLogInfo.email, userLogInfo.password)
    .then(() => {
      this.authSuccess()
    }).catch((error: any) => {
      //this.isAuthenticated = false;
      console.log(error);
      this.notification.showNotification('Correo o contraseña incorrectos, intentalo de nuevo', 'Cerrar', 'error');
      //this.authIsLoading = false;
    })
  }

  private authSuccess(){
    this._requestAccessToken().subscribe((credentials => {
      console.log(credentials)
      let token = credentials.access_token
      localStorage.setItem('auth', token)
    }))
    this.router.navigate(['/dashboard/'])
    //this.isAuthenticated = true;
    //this.authChange.next(true);
  }

  _logoutUser(){
    //this.isAuthenticated = false;
    //this.authChange.next(false);
    this.router.navigate(['/']);
    localStorage.clear()
    this.fireAuth.signOut()
  }

}
