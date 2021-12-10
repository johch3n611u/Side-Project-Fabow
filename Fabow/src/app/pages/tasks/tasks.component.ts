import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

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
    NotificationStatus = '❌';
    ServiceStatus = '❌';
    ServiceWorkSup = '❌';
    NotificationSup = '❌';
    ngOnInit(): void {

        this.NotificationInit();
        this.CheckAdmin();
        this.GetTasks();
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
                        alert('\n 請打開通知以接收最新訊息!!\n\n Chrome 請點選 [ 網址列 ] 左側 ⓘ 開啟通知，感謝!!');
                    } else if (Noti.permission === 'granted') {
                        // 使用者同意授權
                        this.ServiceWorkInit();
                    }
                });
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

    Name = "";
    Principal = "";
    DoneTasks = [];
    UndoneTasks = [];

    GetTasks() {

        console.log('this.Admin', this.Admin);
        console.log('this.User', this.User);

        this.Admin = true;

        if (this.User != "" || this.Admin) {

            let Collection = this._CloudFirestore.collection('Tasks', ref => ref.orderBy('Date'))
                .snapshotChanges().pipe(map((actions: DocumentChangeAction<any>[]) => {
                    // console.log('actions', actions);
                    return actions.map(a => {
                        const data = a.payload.doc.data() as any;
                        const id = a.payload.doc.id;
                        // console.log('a', a);
                        // console.log('data', data);
                        return { id, ...data };
                    });
                }));

            Collection.subscribe(res => {
                this.DoneTasks = [];
                this.UndoneTasks = [];
                // console.log('res', res);
                this.Tasks = res;
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

                if (!this.Admin) {
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

                // console.log('this.Tasks', this.Tasks);
            });
        }
    }

    FakeLogin() {

        this.User = "";

        // console.log('this.Name', this.Name);
        // console.log('this.Password', this.Password);

        this.Users.forEach(element => {
            if (element.Name == this.Name && element.Password == this.Password) {
                this.User = this.Name;
                document.cookie = 'DisplayName=' + this.User;
            }
        });
        // console.log('this.User', this.User);
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
            // console.log('CloseTask', id);
            let Collection = this._CloudFirestore.doc('Tasks/' + id).update({
                Date: this.GetNowDateString(),
                IsClosed: true,
            });
        }
    }

    RemarkBtnOpenedId = "";
    Remark = "";
    TaskAddMessage(Task) {
        // console.log('Task', Task);

        this.RemarkBtnOpenedId = Task.id;

        if (Task.Remarks == undefined) {
            Task.Remarks = [];
        }

        let Remark: any = {};

        Remark.Date = this.GetNowDateString();
        Remark.Principal = this.Principal;
        Remark.Info = this.Remark;

        Task.Remarks.push(Remark);

        let Collection = this._CloudFirestore.doc('Tasks/' + Task.id).update({
            Remarks: Task.Remarks,
        }).then(res => {
            Task.RemarkBtn = true;
            this.Remark = "";
        });
    }
}
