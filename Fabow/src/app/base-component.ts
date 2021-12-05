import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import * as moment from 'moment'

export class BaseComponent {

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
        public _CloudFirestore: AngularFirestore,
        public _RealtimeDatabase: AngularFireDatabase,
    ) {

    }

    Email = "";
    Password = "";
    DisplayName = "";
    Admin = false;

    VerifyLogin() {
        console.log('document.cookie', document.cookie);
        this.DisplayName = this.GetCookie('DisplayName');
        return this.GetCookie('DisplayName');
        // this._AngularFireAuth.authState.subscribe(res => {
        //     console.log('VerifyLogin', res);
        // });
    }

    ReturnPage() {
        history.go(-1);
    }

    SendResetEmail() {
        return this._AngularFireAuth.sendPasswordResetEmail(this.Email)
            .then((result) => {
                window.alert("寄送成功請查詢郵件!!!");
                this._Router.navigate(['users']);
            }).catch((error) => {
                window.alert(error.message)
            });
    }

    Login() {
        return this._AngularFireAuth.signInWithEmailAndPassword(this.Email, this.Password)
            .then((result) => {
                console.log('result', result);
                document.cookie = 'DisplayName=' + result.user.displayName;
                this.Email = "";
                this.Password = "";
                this.DisplayName = "";
                this.Admin = true;
            }).catch((error) => {
                window.alert(error.message);
            })
    }

    Logout() {
        this._AngularFireAuth.signOut().then(() => {
            this._Router.navigate(['tasks']);
        });
    }

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

    GetCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    GetUsers() {
        let _Responce: AngularFireList<any> = this._RealtimeDatabase.list('Users');
        return _Responce.snapshotChanges().
            pipe(
                map(changes =>
                    changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
                )
            );
    }

    Users = [];
    CheckAdmin() {
        if (this.VerifyLogin() != undefined) {
            this.Admin = true;
        }
        this.GetUsers()
            .subscribe(res => {
                console.log('GetUsers', res);
                this.Users = res;
            });
    }

    GetNowDateString() {
        return moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS')
    }
}