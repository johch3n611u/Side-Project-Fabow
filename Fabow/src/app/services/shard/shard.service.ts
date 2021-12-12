import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppInitInfo, LoginInfo, UserInfo } from 'src/app/model/shard-model';

@Injectable({
    providedIn: 'root'
})
export class ShardService {

    constructor() { }

    private _Data: any[] = [];
    private _BehaviorSubject = new BehaviorSubject(this._Data);
    SharedData = this._BehaviorSubject.asObservable();

    SetShareData<T>(Data: T[]) {
        console.log('Data', Data);
        this._BehaviorSubject.next(Data);
        console.log('SharedData', this.SharedData);
    }

    private _LoginInfo: LoginInfo = {
        Email: '',
        Password: '',
        DisplayName: '',
        Admin: false,
        User: '',
        Name: '',
        Principal: ''
    };
    private _LoginInfoSubject = new BehaviorSubject(this._LoginInfo);
    SharedLoginInfo = this._LoginInfoSubject.asObservable();

    SetSharedLoginInfo<T>(Data: LoginInfo) {
        console.log('Data', Data);
        this._LoginInfoSubject.next(Data);
        console.log('SharedLoginInfo', this.SharedLoginInfo);
    }

    private _UsersInfo: UserInfo[] = [];
    private _UsersInfoSubject = new BehaviorSubject(this._UsersInfo);
    SharedUsersInfo = this._UsersInfoSubject.asObservable();

    SetSharedUsersInfo<T>(Datas: UserInfo[]) {
        console.log('Data', Datas);
        this._UsersInfoSubject.next(Datas);
        console.log('SharedUsersInfo', this.SharedUsersInfo);
    }

    private _AppInitInfo: AppInitInfo = {
        ServiceStatus: '❌',
        ServiceWorkSup: '❌',
        NotificationStatus: '❌',
        NotificationSup: '❌'
    };
    private _AppInitInfoSubject = new BehaviorSubject(this._AppInitInfo);
    SharedAppInitInfo = this._AppInitInfoSubject.asObservable();

    SetSharedAppInitInfo<T>(Data: AppInitInfo) {
        console.log('Data', Data);
        this._AppInitInfoSubject.next(Data);
        console.log('SharedAppInitInfo', this.SharedAppInitInfo);
    }
}
