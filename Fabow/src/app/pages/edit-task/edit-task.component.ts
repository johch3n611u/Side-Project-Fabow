import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { ShardService } from 'src/app/services/shard/shard.service';
import { LoginInfo, Task, UserInfo } from 'src/app/model/shard-model';

@Component({
    selector: 'app-edit-task',
    templateUrl: './edit-task.component.html',
    styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent extends BaseComponent implements OnInit {
    Title = "";

    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
        public _ActivatedRoute: ActivatedRoute,
        public _RealtimeDatabase: AngularFireDatabase,
        public _CloudFirestore: AngularFirestore,
        public _ShardService: ShardService,
    ) {
        super(
            _AngularFireAuth,
            _Router,
            _ActivatedRoute,
            _CloudFirestore,
            _RealtimeDatabase,
            _ShardService,
        );
    }

    LoginInfo = new LoginInfo;
    UsersInfo: UserInfo[] = [] as UserInfo[];
    ngOnInit(): void {
        this.FirebaseAuth();
        this.GetTask();
        this._ShardService.SharedLoginInfo.subscribe(res => { this.LoginInfo = res; });
        this._ShardService.SharedUsersInfo.subscribe(res => { this.UsersInfo = res; });
    }

    Task = new Task;
    // 取得任務資料
    GetTask() {
        this._ActivatedRoute.queryParams.subscribe((queryParams) => {
            let TaskId = queryParams['TaskId'];
            if (TaskId == undefined) {
                this.Title = '新增';
            } else {
                this.Title = '編輯';
                let Collection = this._CloudFirestore.doc('Tasks/' + TaskId).valueChanges();
                Collection.subscribe((res: any) => { this.Task = res; });
            }
        });
    }

    // 新增編輯任務
    EditTask() {
        let Principal = this.Task.Principal;
        if (Principal != null && Principal != '' && Principal != undefined) {

            if (this.Title == '新增') {
                let Collection = this._CloudFirestore.collection('Tasks').add(
                    {
                        Date: this.GetNowDateString(),
                        IsClosed: false,
                        Principal: this.Task.Principal,
                        Task: this.Task,
                    });
                this._Router.navigate(['tasks']);
            } else {
                let Collection = this._CloudFirestore.doc('Tasks/' + this.Task.id).update({
                    Date: this.GetNowDateString(),
                    IsClosed: false,
                    Principal: Principal,
                    Task: this.Task
                });
                this._Router.navigate(['tasks']);
            }
        } else {
            alert('請選擇人員!');
        }
    }
}
