import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base-component';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from '@firebase/app';
import { ShardService } from 'src/app/services/shard/shard.service';
import { UserInfo, LoginInfo, AppInitInfo, Remark } from 'src/app/model/shard-model';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.css']
})
export class TasksComponent extends BaseComponent implements OnInit, OnChanges {
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

    // ngDoCheck() {
    //     console.log('ngDoCheck');
    // }

    ngOnChanges() {
        console.log('ngOnChanges');
    }

    UsersInfo: UserInfo[] = [] as UserInfo[];
    LoginInfo = new LoginInfo;
    AppInitInfo = new AppInitInfo;

    ngOnInit(): void {

        this.GetUsers().subscribe(res => {
            this._ShardService.SetSharedUsersInfo(res);
            this.UsersInfo = res;
            this.RememberMeInit();
        });

        this._ShardService.SharedLoginInfo.subscribe(res => {
            this.LoginInfo = res;
            if(this.LoginInfo.Admin)
            {
                this.TempRemark.Principal = 'Jason';
            }
            this.GetTasks();
        });

        this._ShardService.SharedAppInitInfo.subscribe(res => {
            this.AppInitInfo = res;
        });

        this._ShardService.SharedTasks.subscribe(Tasks => {
            this.DoneTasks = [];
            this.UndoneTasks = [];
            Tasks.forEach((element: any) => {
                if (element.id == this.RemarkBtnOpenedId) {
                    element.RemarkBtn = true;
                } else {
                    element.RemarkBtn = false;
                }
                if (element.IsClosed) {
                    this.DoneTasks.push(element);
                } else {
                    this.UndoneTasks.push(element);
                }
            });
            if (!this.LoginInfo.Admin) {
                let Temp1 = [];
                this.DoneTasks.forEach(res => {
                    if (res.Principal == this.LoginInfo.DisplayName) {
                        Temp1.push(res);
                    }
                });
                this.DoneTasks = Temp1;
                let Temp2 = [];
                this.UndoneTasks.forEach(res => {
                    if (res.Principal == this.LoginInfo.DisplayName) {
                        Temp2.push(res);
                    }
                });
                this.UndoneTasks = Temp2;
            }
        });

    }

    RememberMeInit() {
        this.RememberMe = Boolean(localStorage.getItem('RememberMe'));
        if (this.RememberMe) {
            this.LoginInfo.Account = localStorage.getItem('Account');
            this.LoginInfo.Password = localStorage.getItem('Password');
            this.FakeLogin();
        }
    }

    TeskTasks = [];
    TasksActive = '進行中';
    DoneTasks = [];
    UndoneTasks = [];

    GetTasks() {
        console.log('任務清單初始化');
        let Collection = this._CloudFirestore.collection('Tasks', ref => ref.orderBy('Date'))
            .snapshotChanges().pipe(map((actions: DocumentChangeAction<any>[]) => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            }));
        if (this.LoginInfo.DisplayName || this.LoginInfo.Admin) {
            let Subscribe = Collection.subscribe(Tasks => {
                console.log('訂閱任務清單', this.GetNowDateString());
                this._ShardService.SetShareTasks(Tasks);
            });
        }
    }

    // 任務狀態切換
    FilterTasks(Status) {
        this.TasksActive = Status;
    }

    // 登出
    FakeLogout() {
        if (confirm('確定要登出嗎?')) {
            localStorage.clear();
            this.RememberMe = false;
            let obj = new LoginInfo;
            this._ShardService.SetSharedLoginInfo(obj);
            this.Logout();
        }
    }

    // 負責人登入
    FakeLogin() {
        this.UsersInfo.forEach(element => {
            if (element.Account == this.LoginInfo.Account && element.Password == this.LoginInfo.Password) {
                this.LoginInfo.DisplayName = this.LoginInfo.Account;
                this.TempRemark.Principal = this.LoginInfo.Account;
                this.KeepLocalStorage();
            }
        });
        if (!this.LoginInfo.DisplayName) {
            this.Login();
        }
    }

    // Firebase 登入
    Login() {
        return this._AngularFireAuth.signInWithEmailAndPassword(this.LoginInfo.Account, this.LoginInfo.Password)
            .then((result) => {
                this.LoginInfo.DisplayName = '管理員';
                this.LoginInfo.Admin = true;
                this.KeepLocalStorage();
            }).catch((error) => {
                window.alert('帳號密碼錯誤，如有問題請詢問管理員!!');
                localStorage.clear();
                this.RememberMe = false;
                let obj = new LoginInfo;
                this._ShardService.SetSharedLoginInfo(obj);
                this.Logout();
            })
    }

    RememberMe = false;
    // 記住本地資料
    KeepLocalStorage() {
        if (this.RememberMe) {
            localStorage.setItem('RememberMe', this.RememberMe.toString());
            localStorage.setItem('Account', this.LoginInfo.Account);
            localStorage.setItem('Password', this.LoginInfo.Password);
        }
        this._ShardService.SetSharedLoginInfo(this.LoginInfo);
    }

    // 結案
    CloseTask(id, Task) {
        if (confirm('確定要結案嗎 ? 復原需要調整線上資料庫')) {
            let Collection = this._CloudFirestore.doc('Tasks/' + id).update({
                Date: this.GetNowDateString(),
                IsClosed: true,
            });

            let TempRemark: Remark = {} as Remark;
            TempRemark.Info = Task.Task;
            TempRemark.Principal = '結案通知';
            this.AddNotificationTask(Task, TempRemark);
        }
    }

    TempRemark: Remark = {} as Remark;
    RemarkBtnOpenedId = ''; // 保持訊息開啟
    // 回復訊息
    TaskAddMessage(Task) {
        this.RemarkBtnOpenedId = Task.id;
        if (Task.Remarks == undefined) {
            Task.Remarks = [];
        }

        let Remark: any = {};
        Remark.Date = this.GetNowDateString();
        Remark.Principal = this.TempRemark.Principal;
        Remark.Info = this.TempRemark.Info;
        Remark.Informed = false;
        Task.Remarks.push(Remark);

        let Collection = this._CloudFirestore.doc('Tasks/' + Task.id).update({
            Remarks: Task.Remarks,
        }).then(res => {
            Task.RemarkBtn = true;
            this.TempRemark.Info = "";
        });

        this.AddNotificationTask(Task, this.TempRemark);
    }

    HoverClass = 'MouseOut';

    DeleteTask(TaskId) {
        if (confirm('請確定需不需匯出，按下確定將永久刪除')) {
            let Collection = this._CloudFirestore.doc('Tasks/' + TaskId).delete();
        }
    }
}
