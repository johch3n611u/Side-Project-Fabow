import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import * as moment from 'moment';
import { ShardService } from "./services/shard/shard.service";
import { LoginInfo, UserInfo } from "./model/shard-model";
export class BaseComponent {

    LoginInfo = new LoginInfo;

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
        public _ActivatedRoute: ActivatedRoute,
        public _CloudFirestore: AngularFirestore,
        public _RealtimeDatabase: AngularFireDatabase,
        public _ShardService: ShardService,
    ) {
        this._ShardService.SharedLoginInfo.subscribe(res => {
            this.LoginInfo = res;
        });
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

    // 取得發訊任務清單
    GetNotificationTasks() {
        let _Responce: AngularFireList<any> = this._RealtimeDatabase.list('NotificationTasks');
        return _Responce.snapshotChanges().
            pipe(
                map(changes =>
                    changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
                )
            );
    }

    // 增加發訊任務
    AddNotificationTask(Task, TempRemark) {

        let Sender = '管理員';
        if (Task.Principal != TempRemark.Principal) {
            Sender = Task.Principal;
        }

        this._RealtimeDatabase.list('/NotificationTasks/').push(

            { Sender: Sender, Title: TempRemark.Principal, body: TempRemark.Info }
        )
            .then((result) => {

            })
            .catch((result) => {

            });
    }

    CheckMsg() {
        // 發送訊息並刪除
        let Subscribe = this.GetNotificationTasks().subscribe(Tasks => {

            Subscribe.unsubscribe();

            setTimeout(() => {

            }, 5000);

            console.log('GetNotificationTasks', this.GetNowDateString());

            Tasks.forEach(Task => {

                if (Task.Sender == '管理員' && this.LoginInfo.Admin) {

                    this._RealtimeDatabase.object('/NotificationTasks/' + Task.key).remove()
                        .then((result) => {
                            this.PushNotification(Task);
                        })
                        .catch((result) => {
                        });
                }

                if (Task.Sender == this.LoginInfo.Account) {

                    this._RealtimeDatabase.object('/NotificationTasks/' + Task.key).remove()
                        .then((result) => {
                            this.PushNotification(Task);
                        })
                        .catch((result) => {
                        });
                }

            });

        });
    }

    // 推播

    PushNotification(Message: any) {
        let Option = {
            body: Message.body,
            onclick: function () {
                parent.focus();
                window.focus();
                window.open('https://johch3n611u.github.io/Side-Project-Fabow/tasks');
                this.close();
            }
        };

        if ('Notification' in window) {
            if ('serviceWorker' in navigator) {
                let SWorker = false;
                navigator.serviceWorker.ready.then(Registration => {
                    // https://stackoverflow.com/questions/39418545/chrome-push-notification-how-to-open-url-adress-after-click/39457287
                    Registration.showNotification(Message.Title, Option);
                    SWorker = true;
                });
                if (!SWorker) {
                    new Notification(Message.Title, Option);
                }
            } else {
                new Notification(Message.Title, Option);
            }

        } else {
            alert('\n 請打開通知以接收回報訊息!!\n\n Chrome 請點選 [ 網址列 ] 左側 ⓘ 開啟通知，感謝!!');
        }
    }

}