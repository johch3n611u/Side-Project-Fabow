import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
@Component({
    selector: 'app-edit-task',
    templateUrl: './edit-task.component.html',
    styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent extends BaseComponent implements OnInit {

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
    ) {
        super(_AngularFireAuth, _Router);
        this.Date = new Date();
    }

    Date;
    Principal = "";
    Task = "";

    ngOnInit(): void {
    }

}
