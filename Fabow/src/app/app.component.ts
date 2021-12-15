import { AppInitInfo, Task } from 'src/app/model/shard-model';
import { Component } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseComponent } from './base-component';
import { LoginInfo } from './model/shard-model';
import { ShardService } from './services/shard/shard.service';
// import { MessagingService } from './messaging.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent {

    LoginInfo = new LoginInfo;

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
        public _ActivatedRoute: ActivatedRoute,
        public _CloudFirestore: AngularFirestore,
        public _RealtimeDatabase: AngularFireDatabase,
        public _ShardService: ShardService,
        // public _MessagingService: MessagingService,
    ) {
        super(
            _AngularFireAuth,
            _Router,
            _ActivatedRoute,
            _CloudFirestore,
            _RealtimeDatabase,
            _ShardService,
        );
        // this._MessagingService.RequestPermission();
        // this._MessagingService.ReceiveMessage();
        // this.Msg = this._MessagingService.currentMessage;
        this.NotificationInit();
        this.SetNotifications();
        this._ShardService.SharedLoginInfo.subscribe(res => { console.log('AppComponent SharedLoginInfo Work'); this.LoginInfo = res; });
    }

    // 推播設定
    SetNotifications() {
        console.log('AppComponent SetNotifications Work');
        let Messages = [];
        this._ShardService.SharedTasks.subscribe(Tasks => {
            console.log('CheckMsg');
            let batch = this._CloudFirestore.firestore.batch();
            Tasks.forEach(Task => {
                let Change = false;
                // console.log('Task', Task);
                if (Task.Remarks != undefined) {
                    if ((this.LoginInfo.Account == Task.Principal || this.LoginInfo.Admin)) {
                        Task.Remarks.forEach(Remark => {
                            if ((Remark.Principal != Task.Principal)) {

                                // https://stackoverflow.com/questions/56814951/
                                // https://stackoverflow.com/questions/47268241/angularfire2-transactions-and-batch-writes-in-firestore

                                if (Remark.Informed != true) // 未通知
                                {
                                    // 給使用者的推播
                                    console.log('給使用者的推播');
                                    // console.log('this.LoginInfo.Account', this.LoginInfo.Account);
                                    // console.log('Task.Principal', Task.Principal);
                                    // console.log('Remark.Principal', Remark.Principal);
                                    Change = true;
                                    let Msg: any = {};
                                    Msg.Title = Remark.Principal;
                                    Msg.body = Remark.Info;
                                    Remark.Informed = true;

                                    this.PushNotification(Msg);
                                }
                            } else if (this.LoginInfo.Admin) {
                                if (Remark.Informed != true) // 未通知
                                {
                                    // 給管理員的推播
                                    console.log('給管理員的推播');
                                    // console.log('this.LoginInfo.Account', this.LoginInfo.Account);
                                    // console.log('Task.Principal', Task.Principal);
                                    // console.log('Remark.Principal', Remark.Principal);
                                    Change = true;
                                    let Msg: any = {};
                                    Msg.Title = Remark.Principal;
                                    Msg.body = Remark.Info;
                                    Remark.Informed = true;

                                    this.PushNotification(Msg);
                                }
                            }
                        });
                    }
                }
                if (Change) {
                    console.log('Change');
                    this._CloudFirestore.doc('Tasks/' + Task.id).update(Task);
                }
            });
            if (Messages.length != 0 && !this.LoginInfo.Admin) {
                console.log('Batch');
                batch.commit();
            }
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

    AppInitInfo = new AppInitInfo;
    // 初始化推播
    NotificationInit() {

        console.log('AppComponent NotificationInit');

        // https://ithelp.ithome.com.tw/articles/10196486
        // https://cythilya.github.io/2017/07/09/notification/
        // https://blog.no2don.com/2018/01/javascript.html
        if ('Notification' in window) {
            // 如果 window 有支援推播
            this.AppInitInfo.NotificationSup = true;
            let Noti: any = Notification;
            this.AppInitInfo.NotificationStatus = Noti.permission;
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
        this._ShardService.SetSharedAppInitInfo(this.AppInitInfo);
    }

    // 初始化 ServiceWork
    ServiceWorkInit() {

        console.log('AppComponent ServiceWorkInit');

        let NotifyConfig = {
            body: '\\ ^o^ / 歡迎使用 Fabow !!', // 設定內容
            onclick: function () {
                parent.focus();
                window.focus();
                window.open('https://johch3n611u.github.io/Side-Project-Fabow/tasks');
                this.close();
            },
            // icon: '../../../assets/icons/icon-128x128.png', // 設定 icon
        };
        let FirstTime = localStorage.getItem('FirstTime');
        if ('serviceWorker' in navigator) {
            this.AppInitInfo.ServiceWorkSup = true;
            navigator.serviceWorker.ready
                .then(res => {
                    this.AppInitInfo.ServiceStatus = true;
                    if (FirstTime != null) {
                        res.showNotification('Hi 您好!', NotifyConfig).then((notificationEvent: any) => {
                            localStorage.setItem('FirstTime', 'true');
                            let notification = notificationEvent.notification;
                            setTimeout(() => notification.close(), 3000);
                        });
                    }
                });
            if (FirstTime != null) {
                if (this.AppInitInfo.ServiceStatus != true) {
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
}
