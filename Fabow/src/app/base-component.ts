import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

export class BaseComponent {

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
    ) {

    }

    DisplayName = "";

    VerifyLogin() {
        this._AngularFireAuth.authState.subscribe(res => {
            console.log('VerifyLogin', res);
            if (res == null) {
                this._Router.navigate(['login']);
            } else {
                localStorage.setItem('DisplayName', res.displayName);
                this.DisplayName = res.displayName;
                localStorage.setItem('Uid', res.uid);
            }
        });
    }

    ReturnPage() {
        history.go(-1);
    }

    SendResetEmail() {
        let Email = localStorage.getItem('Email');
        return this._AngularFireAuth.sendPasswordResetEmail(Email)
            .then((result) => {
                window.alert("寄送成功請查詢郵件!!!");
                this._Router.navigate(['login']);
            }).catch((error) => {
                window.alert(error.message)
            });

        // this._AngularFireAuth.
    }

    Logout() {
        this._AngularFireAuth.signOut().then(() => {
            localStorage.removeItem('Email');
            localStorage.removeItem('DisplayName');
            localStorage.removeItem('Uid');
            this._Router.navigate(['login']);
        });
    }
}