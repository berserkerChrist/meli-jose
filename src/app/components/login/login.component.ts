import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  readonly _avatarUrl = 'https://avatars.dicebear.com/api/adventurer/'
  seed = Math.random();
  isLoading!: boolean;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  _getAvatar(){
    return this._avatarUrl + this.seed + '.svg'
  }

  _onLogin(form: NgForm){
    this.auth._loginUser({
      email: form.value.email,
      password: form.value.password
    })
    /*
    console.log(this.isLoading)
    this.auth._loginUser({
      email: form.value.email,
      password: form.value.password
    }) */
  }
}
