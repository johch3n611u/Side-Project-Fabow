import { Component } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseComponent } from './base-component';
import { ShardService } from './services/shard/shard.service';
// import { MessagingService } from './messaging.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent {
    Msg: BehaviorSubject<any>;
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
        this.CheckMsg();
    }

    Msgs = [];
    CheckMsg() {

        this._AngularFireAuth.authState.subscribe(Auth => {
            let IsAdmin = (Auth != undefined && Auth != null);
            let Collection = this._CloudFirestore.collection('Tasks', ref => ref.orderBy('Date'))
                .snapshotChanges().pipe(map((actions: DocumentChangeAction<any>[]) => {
                    return actions.map(a => {
                        const data = a.payload.doc.data() as any;
                        const id = a.payload.doc.id;
                        return { id, ...data };
                    });
                }));
            Collection.subscribe(Tasks => {
                console.log('CheckMsg Work');
                console.log('this.Admin', this.Admin);
                console.log('this.User', this.User);
                console.log('Tasks', Tasks);
                let batch = this._CloudFirestore.firestore.batch();
                Tasks.forEach(Task => {
                    let Change = false;
                    console.log('Task', Task);
                    // if (Task.Remarks != undefined) {
                    //     if ((this.User == Task.Principal || this.Admin)) {
                    //         Task.Remarks.forEach(Remark => {
                    //             if ((Remark.Principal != Task.Principal) && this.Admin) {
                    //                 if (Remark.Informed != true) // 未通知
                    //                 {
                    //                     console.log('this.User', this.User);
                    //                     console.log('Task.Principal', Task.Principal);
                    //                     console.log('Remark.Principal', Remark.Principal);
                    //                     Change = true;
                    //                     let Msg: any = {};
                    //                     Msg.Title = Remark.Principal;
                    //                     Msg.body = Remark.Info;
                    //                     this.Msgs.push(Msg);
                    //                     Remark.Informed = true;
                    //                     // https://stackoverflow.com/questions/56814951/
                    //                     // https://stackoverflow.com/questions/47268241/angularfire2-transactions-and-batch-writes-in-firestore

                    //                     this.NotificationPush(Msg);
                    //                 }
                    //             } else {
                    //                 if (Remark.Informed != true) // 未通知
                    //                 {
                    //                     console.log('this.User', this.User);
                    //                     console.log('Task.Principal', Task.Principal);
                    //                     console.log('Remark.Principal', Remark.Principal);
                    //                     Change = true;
                    //                     let Msg: any = {};
                    //                     Msg.Title = Remark.Principal;
                    //                     Msg.body = Remark.Info;
                    //                     this.Msgs.push(Msg);
                    //                     Remark.Informed = true;
                    //                     // https://stackoverflow.com/questions/56814951/
                    //                     // https://stackoverflow.com/questions/47268241/angularfire2-transactions-and-batch-writes-in-firestore

                    //                     this.NotificationPush(Msg);
                    //                 }
                    //             }
                    //         });
                    //     }
                    // }
                    // if (Change) {
                    //     console.log('Change');
                    //     this._CloudFirestore.doc('Tasks/' + Task.id).update(Task);
                    // }
                });
                if (this.Msgs.length != 0 && !IsAdmin) {
                    console.log('Batch');
                    batch.commit();
                }
            });
        });
    }

    NotificationPush(Msg: any) {
        // ServiceStatus = '❌';
        // ServiceWorkSup = '❌';
        // NotificationStatus = '❌';
        // NotificationSup = '❌';

        let Option = {
            body: Msg.body,
            onclick: function () {
                parent.focus();
                window.focus();
                window.open('https://johch3n611u.github.io/Side-Project-Fabow/tasks');
                this.close();
            }
        };

        if ('Notification' in window) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(Registration => {
                    // https://stackoverflow.com/questions/39418545/chrome-push-notification-how-to-open-url-adress-after-click/39457287
                    Registration.showNotification(Msg.Title, Option);
                });
            } else {
                new Notification(Msg.Title, Option);
            }
        } else {
            alert('\n 請打開通知以接收回報訊息!!\n\n Chrome 請點選 [ 網址列 ] 左側 ⓘ 開啟通知，感謝!!');
        }
    }
}
