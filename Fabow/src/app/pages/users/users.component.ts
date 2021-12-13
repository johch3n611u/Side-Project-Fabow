import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { ShardService } from 'src/app/services/shard/shard.service';
import { UserInfo, LoginInfo } from 'src/app/model/shard-model';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent extends BaseComponent implements OnInit {
    constructor(
        public _AngularFireAuth: AngularFireAuth,
        public _Router: Router,
        public _ActivatedRoute: ActivatedRoute,
        public _CloudFirestore: AngularFirestore,
        public _RealtimeDatabase: AngularFireDatabase,
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
        this._ShardService.SharedLoginInfo.subscribe(res => { this.LoginInfo = res; });
        this._ShardService.SharedUsersInfo.subscribe(res => { this.UsersInfo = res; });
    }

    User = new UserInfo;
    // 新增負責人員
    AddUser(Key) {
        this._RealtimeDatabase.list('/Users/').push({ Name: this.User.Account, Password: this.User.Password })
            .then((result) => {
                this.User.Account = "";
                this.User.Password = "";
            })
            .catch((result) => {
                console.log('AddUser', result);
            });
    }

    // 刪除負責人員
    RemoveUser(Key) {
        if (confirm('確定要刪除嗎?')) {
            this._RealtimeDatabase.object('/Users/' + Key).remove()
                .then((result) => {
                })
                .catch((result) => {
                    console.log('RemoveUser', result);
                });
        }
    }
}
