import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import * as moment from 'moment';
import { ShardService } from "./services/shard/shard.service";


export class BaseComponent {

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
        public _ActivatedRoute: ActivatedRoute,
        public _CloudFirestore: AngularFirestore,
        public _RealtimeDatabase: AngularFireDatabase,
        public _ShardService: ShardService,
    ) {

    }

    // 返回上一頁
    ReturnPage() {
        history.go(-1);
    }

    // 重新註冊帳號
    SendResetEmail() {
        let Email = '';
        return this._AngularFireAuth.sendPasswordResetEmail(Email)
            .then((result) => {
                window.alert("寄送成功請查詢郵件!!!");
                this._Router.navigate(['users']);
            }).catch((error) => {
                window.alert(error.message)
            });
    }

    // Firebase 驗證登出
    Logout() {
        this._AngularFireAuth.signOut().then(() => { });
        this._Router.navigateByUrl('/users');
    }

    // 註冊 Firebase 授權帳號
    Register() {
        let Email = '';
        let Password = '';
        let DisplayName = '';
        return this._AngularFireAuth.createUserWithEmailAndPassword(Email, Password)
            .then((result) => {
                window.alert("成功註冊!!!");
                // 更新顯示名稱
                result.user.updateProfile({ displayName: DisplayName });
                this._Router.navigate(['undone-tasks']);
            }).catch((error) => {
                window.alert(error.message)
            })
    }

    // 取得 Cookie
    GetCookie(Key) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${Key}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // 取得使用人清單
    GetUsers() {
        let _Responce: AngularFireList<any> = this._RealtimeDatabase.list('Users');
        return _Responce.snapshotChanges().
            pipe(
                map(changes =>
                    changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
                )
            );
    }

    // 取得現在日期
    GetNowDateString() {
        return moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS')
    }

    // 轉換
    TranslationPermission(key) {
        switch (key) {
            case true:
                key = '✔';
                break;
            case false:
                key = '❌';
                break;
            case undefined:
                key = '❌';
                break;
            case 'granted': // 同意
                key = '✔';
                break;
            case 'denied': // 拒絕
                key = '❌';
                break;
            case 'default': // 未授權
                key = '❌';
                break;
            default:
                break;
        }
        return key;
    }

    // Firebase 驗證
    FirebaseAuth() {
        this._AngularFireAuth.authState.subscribe(auth => {
            if (auth == undefined || auth == null || auth == undefined) {
                this._Router.navigateByUrl('/tasks');
            }
        });
    }
}