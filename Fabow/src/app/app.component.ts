import { Component } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { compilePipeFromMetadata } from '@angular/compiler';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
    ) {
        // _AngularFirestore.collection('items').valueChanges().subscribe(res => {
        //   console.log('res', res);
        // });
    }


}
