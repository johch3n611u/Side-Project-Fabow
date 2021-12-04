import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent extends BaseComponent implements OnInit {

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
    ) {
        super(_AngularFireAuth, _Router);
    }

    Email = "";
    Password = "";

    ngOnInit(): void {
    }

    Login() {
        return this._AngularFireAuth.signInWithEmailAndPassword(this.Email, this.Password)
            .then((result) => {
                console.log('result', result);
                localStorage.setItem('Email', this.Email);
                localStorage.setItem('DisplayName', result.user.displayName);
                localStorage.setItem('Uid', result.user.uid);
                this._Router.navigate(['undone-tasks']);
            }).catch((error) => {
                window.alert(error.message);
            })
    }

}
