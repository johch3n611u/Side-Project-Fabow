import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';

@Component({
    selector: 'app-edit-task',
    templateUrl: './edit-task.component.html',
    styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent extends BaseComponent implements OnInit {
    Title = "";
    Date = this.GetNowDateString();
    Principal = "";
    Task = "";
    Name = "";
    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
        public _ActivatedRoute: ActivatedRoute,
        public _RealtimeDatabase: AngularFireDatabase,
        public _CloudFirestore: AngularFirestore,
    ) {
        super(_AngularFireAuth, _Router, _ActivatedRoute, _CloudFirestore, _RealtimeDatabase);
        this.GetUsers().subscribe(resUser => {
            this.Users = resUser;
        });
    }
    ngOnInit(): void {
        this.GetName();
    }
    GetName() {
        this._ActivatedRoute.queryParams.subscribe((queryParams) => {
            this.Name = queryParams['Name'];
            if (this.Name == undefined) {
                this.Title = '新增';
            } else {
                this.Title = '編輯';
                let Collection = this._CloudFirestore.doc('Tasks/' + this.Name).valueChanges();
                Collection.subscribe((res: any) => {
                    this.Principal = res.Principal;
                    this.Task = res.Task;
                })
            }
        });
    }

    EditTask() {

        if (this.Principal != null && this.Principal != '' && this.Principal != undefined) {

            if (this.Title == '新增') {
                let Collection = this._CloudFirestore.collection('Tasks').add(
                    {
                        Date: this.GetNowDateString(),
                        IsClosed: false,
                        Principal: this.Principal,
                        Task: this.Task,
                    });
                this._Router.navigate(['tasks']);
            } else {
                let Collection = this._CloudFirestore.doc('Tasks/' + this.Name).update({
                    Date: this.GetNowDateString(),
                    IsClosed: false,
                    Principal: this.Principal,
                    Task: this.Task
                });
                this._Router.navigate(['tasks']);
            }
        } else {
            alert('請選擇人員');
        }
    }
}
