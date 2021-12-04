import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';

@Component({
    selector: 'app-done-tasks',
    templateUrl: './done-tasks.component.html',
    styleUrls: ['./done-tasks.component.css']
})
export class DoneTasksComponent extends BaseComponent implements OnInit {

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
    ) {
        super(_AngularFireAuth, _Router);
    }

    ngOnInit(): void {
    }

}
