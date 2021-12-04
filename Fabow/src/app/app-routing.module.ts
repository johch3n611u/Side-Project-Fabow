import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoneTasksComponent } from './pages/done-tasks/done-tasks.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { UndoneTasksComponent } from './pages/undone-tasks/undone-tasks.component';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';

const routes: Routes = [
    {
        path: 'register',
        component: UserRegisterComponent,
    }, {
        path: 'login',
        component: UserLoginComponent,
    },
    {
        path: 'done-tasks',
        component: DoneTasksComponent,
    },
    {
        path: 'undone-tasks',
        component: UndoneTasksComponent,
    },
    {
        path: 'edit-task',
        component: EditTaskComponent,
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
