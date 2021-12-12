// https://stackoverflow.com/questions/54351492/how-to-export-a-class-instance-in-typescript
// https://wcc723.github.io/development/2020/03/25/import-export/

export class ShardService {

}

export class LoginInfo {
    public Email: string;
    public Password: string;
    public DisplayName: string;
    public Admin: boolean;
    public User: string;
    public Name: string;
    public Principal: string;
}

export class UserInfo {

    public key: string;
    public Name: string;
    public Password: string;
}

export class AppInitInfo {

    public ServiceStatus: string;
    public ServiceWorkSup: string;
    public NotificationStatus: string;
    public NotificationSup: string;
}