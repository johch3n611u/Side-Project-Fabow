// https://stackoverflow.com/questions/54351492/how-to-export-a-class-instance-in-typescript
// https://wcc723.github.io/development/2020/03/25/import-export/

export class ShardService {

}

export class LoginInfo {
    public Account: string; // 帳號
    public Password: string; // 密碼
    public Admin: boolean; // 管理員
    public DisplayName: string; // 暱稱
}

export class UserInfo {
    public key: string; // 暱稱
    public Account: string; // 暱稱
    public Password: string; // 暱稱
}

export class AppInitInfo {
    public ServiceStatus: boolean;
    public ServiceWorkSup: boolean;
    public NotificationStatus: boolean;
    public NotificationSup: boolean;
}

export class Task {
    public id: string;
    public IsClosed: boolean;
    public Principal: string;
    public Task: string;
    public Date: string;
    public Remarks: Remark[];
}

export class Remark {
    public Date: string;
    public Info: string;
    public Informed: boolean;
    public Principal: string;
}