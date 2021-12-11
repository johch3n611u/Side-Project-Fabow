import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
// import * as firebase from 'firebase';
import firebase from '@firebase/app';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.css']
})
export class TasksComponent extends BaseComponent implements OnInit {
    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
        public _ActivatedRoute: ActivatedRoute,
        public _CloudFirestore: AngularFirestore,
        public _RealtimeDatabase: AngularFireDatabase,
    ) {
        super(_AngularFireAuth, _Router, _ActivatedRoute, _CloudFirestore, _RealtimeDatabase);
    }
    Tasks: any = [];
    TasksActive = "進行中";
    ServiceStatus = '❌';
    ServiceWorkSup = '❌';
    NotificationStatus = '❌';
    NotificationSup = '❌';
    RememberMe = false;
    ngOnInit(): void {
        this.GetUsers().subscribe(resUser => {
            console.log('GetUsers Work');
            this.Users = resUser;
            this.RememberMe = Boolean(localStorage.getItem('RememberMe'));
            this.Name = localStorage.getItem('Name');
            this.Password = localStorage.getItem('Password');
            if (this.RememberMe) {
                this.FakeLogin();
            }
            this.GetTasks();
        });
        this.NotificationInit();
    }
    NotificationInit() {
        // https://ithelp.ithome.com.tw/articles/10196486
        // https://cythilya.github.io/2017/07/09/notification/
        // https://blog.no2don.com/2018/01/javascript.html
        if ('Notification' in window) {
            // 如果 window 有支援推播
            this.NotificationSup = '✔';
            let Noti: any = Notification;
            this.NotificationStatus = Noti.permission;
            let NotiPNot = Noti.permission === 'default' || Noti.permission === 'undefined' || Noti.permission === 'denied';
            if (NotiPNot) {
                // 要求授權
                Notification.requestPermission(res => {
                    // 在這裡可針對使用者的授權做處理
                    // permission 可為「granted」（同意）、「denied」（拒絕）和「default」（未授權）
                    if (NotiPNot) {
                        alert('\n 請打開通知以接收回報訊息!!\n\n Chrome 請點選 [ 網址列 ] 左側 ⓘ 開啟通知，感謝!!');
                    } else if (Noti.permission === 'granted') {
                        // 使用者同意授權
                        this.ServiceWorkInit();
                    }
                });
            } else {
                this.ServiceWorkInit();
            }
        }
    }
    ServiceWorkInit() {
        let NotifyConfig = {
            body: '\\ ^o^ / 歡迎使用 Fabow !!', // 設定內容
            onclick: function () {
                parent.focus();
                window.focus(); //just in case, older browsers
                this.close();
            },
            // icon: '../../../assets/icons/icon-128x128.png', // 設定 icon
        };
        let FirstTime = localStorage.getItem('FirstTime');
        if ('serviceWorker' in navigator) {
            this.ServiceWorkSup = "✔";
            navigator.serviceWorker.ready
                .then(res => {
                    this.ServiceStatus = "✔";
                    if (FirstTime != null) {
                        res.showNotification('Hi 您好!', NotifyConfig).then((notificationEvent: any) => {
                            localStorage.setItem('FirstTime', 'true');
                            let notification = notificationEvent.notification;
                            setTimeout(() => notification.close(), 3000);
                        });
                    }
                });
            if (FirstTime != null) {
                if (this.ServiceStatus != "✔") {
                    let notification = new Notification('Hi 您好!', NotifyConfig); // 建立通知
                    localStorage.setItem('FirstTime', 'true');
                    setTimeout(notification.close.bind(notification), 3000);
                }
            }

        } else {
            if (FirstTime != null) {
                let notification = new Notification('Hi 您好!', NotifyConfig); // 建立通知
                localStorage.setItem('FirstTime', 'true');
                setTimeout(notification.close.bind(notification), 3000);
            }
        }
    }
    NotificationPush(Msg: any) {
        // ServiceStatus = '❌';
        // ServiceWorkSup = '❌';
        // NotificationStatus = '❌';
        // NotificationSup = '❌';
        if (this.NotificationSup == "✔") {
            if (this.ServiceWorkSup == "✔") {
                navigator.serviceWorker.ready.then(Registration => {
                    Registration.showNotification(Msg.Title, { body: Msg.body })
                });
            } else {
                new Notification(Msg.Title, { body: Msg.body });
            }
        } else {
            alert('\n 請打開通知以接收回報訊息!!\n\n Chrome 請點選 [ 網址列 ] 左側 ⓘ 開啟通知，感謝!!');
        }
    }
    Name = "";
    Principal = "";
    DoneTasks = [];
    UndoneTasks = [];
    Msgs = [];
    GetTasks() {
        this.DoneTasks = [];
        this.UndoneTasks = [];
        let IsUser = (this.User != '' && this.User != undefined && this.User != null);
        this._AngularFireAuth.authState.subscribe(Auth => {
            console.log('GetAuth Work');
            let IsAdmin = (Auth != undefined && Auth != null);
            if (IsUser || IsAdmin) {
                let Collection = this._CloudFirestore.collection('Tasks', ref => ref.orderBy('Date'))
                    .snapshotChanges().pipe(map((actions: DocumentChangeAction<any>[]) => {
                        return actions.map(a => {
                            const data = a.payload.doc.data() as any;
                            const id = a.payload.doc.id;
                            return { id, ...data };
                        });
                    }));
                Collection.subscribe(resCol => {
                    console.log('GetTasks Work');
                    this.DoneTasks = [];
                    this.UndoneTasks = [];
                    this.Tasks = resCol;
                    this.Tasks.forEach(element => {
                        if (element.id == this.RemarkBtnOpenedId) {
                            element.RemarkBtn = true;
                        } else {
                            element.RemarkBtn = false;
                        }
                        if (element.IsClosed) {
                            this.DoneTasks.push(element);
                        } else {
                            this.UndoneTasks.push(element);
                        }
                    });

                    if (IsAdmin) {
                        this.Admin = true;
                    } else {
                        this.Principal = this.User;
                        let Temp1 = [];
                        this.DoneTasks.forEach(res => {
                            if (res.Principal == this.User) {
                                Temp1.push(res);
                            }
                        });
                        this.DoneTasks = Temp1;
                        let Temp2 = [];
                        this.UndoneTasks.forEach(res => {
                            if (res.Principal == this.User) {
                                Temp2.push(res);
                            }
                        });
                        this.UndoneTasks = Temp2;
                    }

                    let batch = this._CloudFirestore.firestore.batch();
                    resCol.forEach(Task => {
                        let Change = false;
                        if (Task.Remarks != undefined && (this.User == Task.Principal || this.Admin)) {
                            Task.Remarks.forEach(Remark => {
                                if ((Remark.Principal != Task.Principal) || this.Admin) {
                                    if (Remark.Informed != true) // 未通知
                                    {
                                        Change = true;
                                        let Msg: any = {};
                                        Msg.Title = Remark.Principal;
                                        Msg.body = Remark.Info;
                                        this.Msgs.push(Msg);
                                        Remark.Informed = true;
                                        // https://stackoverflow.com/questions/56814951/
                                        // https://stackoverflow.com/questions/47268241/angularfire2-transactions-and-batch-writes-in-firestore

                                        this.NotificationPush(Msg);
                                    }
                                }
                            });
                        }
                        if (Change) {
                            console.log('Change');
                            this._CloudFirestore.doc('Tasks/' + Task.id).update(Task);
                        }
                    });
                    if (this.Msgs.length != 0) {
                        console.log('Batch');
                        batch.commit();
                    }
                });
            }
        });
    }

    FakeLogout() {
        localStorage.removeItem('RememberMe');
        localStorage.removeItem('Name');
        localStorage.removeItem('Password');
        this.User = '';
        this.Admin = false;
        this.RememberMe = false;
        this.Name = '';
        this.Password = '';
        this.Logout();
        this.GetTasks();
    }

    FakeLogin() {
        this.User = "";
        this.Users.forEach(element => {
            if (element.Name == this.Name && element.Password == this.Password) {
                this.User = this.Name;
                document.cookie = 'DisplayName=' + this.User;
                localStorage.setItem('RememberMe', this.RememberMe.toString());
                if (this.RememberMe) {
                    localStorage.setItem('Password', this.Password);
                    localStorage.setItem('Name', this.Name);
                }
            }
        });
        if (this.User == "") {
            // alert('請確定帳號與密碼，或聯絡管理員');
            this.Email = this.Name;
            this.Login();
        } else {
            this.GetTasks();
        }
    }

    FilterTasks(Status) {
        this.TasksActive = Status;
    }

    CloseTask(id) {
        if (confirm('確定要結案嗎 ? 復原需要調整線上資料庫')) {
            let Collection = this._CloudFirestore.doc('Tasks/' + id).update({
                Date: this.GetNowDateString(),
                IsClosed: true,
            });
        }
    }

    RemarkBtnOpenedId = "";
    Remark = "";
    TaskAddMessage(Task) {
        this.RemarkBtnOpenedId = Task.id;
        if (Task.Remarks == undefined) {
            Task.Remarks = [];
        }
        let Remark: any = {};
        Remark.Date = this.GetNowDateString();
        Remark.Principal = this.Principal;
        Remark.Info = this.Remark;
        Remark.Informed = false;
        Task.Remarks.push(Remark);
        let Collection = this._CloudFirestore.doc('Tasks/' + Task.id).update({
            Remarks: Task.Remarks,
        }).then(res => {
            Task.RemarkBtn = true;
            this.Remark = "";
        });
    }
}
