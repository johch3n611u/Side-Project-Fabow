import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';

@Component({
    selector: 'app-user-register',
    templateUrl: './user-register.component.html',
    styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent extends BaseComponent implements OnInit {

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
    ) {
        super(_AngularFireAuth, _Router);
    }

    ngOnInit(): void {
        this.DisplayName = "";
    }

    Email = "";
    Password = "";

    Register() {
        return this._AngularFireAuth.createUserWithEmailAndPassword(this.Email, this.Password)
            .then((result) => {
                window.alert("成功註冊!!!");
                console.log(result.user)
                result.user.updateProfile({ displayName: this.DisplayName });
                this._Router.navigate(['undone-tasks']);
            }).catch((error) => {
                window.alert(error.message)
            })
    }

}
