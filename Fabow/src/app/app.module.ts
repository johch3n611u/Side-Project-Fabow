import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { DoneTasksComponent } from './pages/done-tasks/done-tasks.component';
import { UndoneTasksComponent } from './pages/undone-tasks/undone-tasks.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

@NgModule({
    declarations: [
        AppComponent,
        UserLoginComponent,
        UserRegisterComponent,
        DoneTasksComponent,
        UndoneTasksComponent,
        EditTaskComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
