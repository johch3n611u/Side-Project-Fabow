import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { ShardService } from 'src/app/services/shard/shard.service';

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

    ngOnInit(): void {
        this._AngularFireAuth.authState.subscribe(auth => {
            if (auth != undefined && auth != null) {
                // Admin
                this.DisplayName = '管理員';
                this.Admin = true;
                this.GetUsers()
                    .subscribe(res => {
                        this.Users = res;
                    });
            } else {
                this._Router.navigateByUrl('/tasks');
            }
        });
    }

    AddUser(Key) {
        this._RealtimeDatabase.list('/Users/').push({ Name: this.Name, Password: this.Password })
            .then((result) => {
                this.Name = "";
                this.Password = "";
            })
            .catch((result) => {
            });
    }

    RemoveUser(Key) {
        if (confirm('確定要刪除嗎?')) {
            this._RealtimeDatabase.object('/Users/' + Key).remove()
                .then((result) => {
                })
                .catch((result) => {
                });
        }
    }
}
