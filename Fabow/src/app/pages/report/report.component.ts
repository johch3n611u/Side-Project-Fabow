import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginInfo, Task } from 'src/app/model/shard-model';
import { ShardService } from 'src/app/services/shard/shard.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {


    LoginInfo = new LoginInfo;
    Tasks: Task[] = [] as Task[];

    constructor(
        public _ShardService: ShardService,
        public _Router: Router,
    ) {
    }

    ngOnInit(): void {
        this._ShardService.SharedLoginInfo.subscribe(res => {
            this.LoginInfo = res;
            // this.AuthNavigate();
        });
        this._ShardService.SharedTasks.subscribe(res => {
            this.Tasks = res;
        });
    }

    // 驗證
    AuthNavigate() {
        if (!this.LoginInfo.Admin) {
            this._Router.navigateByUrl('/tasks');
        }
    }

    TranslationStatus(Status) {
        switch (Status) {
            case true:
                Status = '✔';
                break;
            case false:
                Status = '❌';
                break;
            default:
                break;
        }
        return Status;
    }

    Excel = [
        ['項次', '負責人員', '發布日期', '內容', '是否結案', '詳細內容']
    ];

    // 匯出
    Export() {

        this.Tasks.forEach((Task, index) => {
            let Temp = [];
            Temp.push(index + 1);
            Temp.push(Task.Principal);
            Temp.push(moment(Task.Date).format('YYYY-MM-DD'));
            Temp.push(Task.Task);
            Temp.push(this.TranslationStatus(Task.IsClosed));

            Task.Remarks.forEach(Remark => {
                let TempPush = JSON.parse(JSON.stringify(Temp));
                let TempRemark = '[' + moment(Remark.Date).format('YYYY-MM-DD HH:mm:ss') + ']' + Remark.Principal + ':' + Remark.Info;
                TempPush.push(TempRemark);
                this.Excel.push(TempPush);
            });
        });

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.Excel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, '任務報表.xlsx');
    }

    Select = '';
    FilterTasks = [];
    Filter() {

    }
}
