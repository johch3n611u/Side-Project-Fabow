import { Component } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MessagingService } from './messaging.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    Msg: BehaviorSubject<any>;

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
        // public _MessagingService: MessagingService,
    ) {
        // this._MessagingService.RequestPermission();
        // this._MessagingService.ReceiveMessage();
        // this.Msg = this._MessagingService.currentMessage;
    }
}
