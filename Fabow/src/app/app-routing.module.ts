import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { ReportComponent } from './pages/report/report.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
    {
        path: 'users',
        component: UsersComponent,
    },
    {
        path: 'tasks',
        component: TasksComponent,
    },
    {
        path: 'report',
        component: ReportComponent,
    },
    {
        path: 'edit-task',
        component: EditTaskComponent,
    },
    {
        path: 'edit-task/:Name',
        component: EditTaskComponent,
    },
    {
        path: '**',
        redirectTo: 'tasks',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
