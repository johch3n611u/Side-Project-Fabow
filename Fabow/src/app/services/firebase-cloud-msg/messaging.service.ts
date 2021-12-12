import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class MessagingService {

    currentMessage = new BehaviorSubject(null);
    constructor(private angularFireMessaging: AngularFireMessaging) {
        this.angularFireMessaging.messages.subscribe(
            (_messaging: any) => {
                _messaging.onMessage = _messaging.onMessage.bind(_messaging);
                _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
            }
        )
    }
    // 取得權限
    RequestPermission() {
        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                console.log(token);
            },
            (err) => {
                console.error('無法取得權限', err);
            }
        );
    }
    // 接收訊息
    ReceiveMessage() {
        this.angularFireMessaging.messages.subscribe(
            (payload) => {
                console.log("收到新消息", payload);
                this.currentMessage.next(payload);
            })
    }
}
