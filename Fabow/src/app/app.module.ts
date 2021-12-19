import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TasksComponent } from './pages/tasks/tasks.component';
import { UsersComponent } from './pages/users/users.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { MessagingService } from './messaging.service';
import { AsyncPipe } from '@angular/common';
import { ShardService } from './services/shard/shard.service';
import { ReportComponent } from './pages/report/report.component';

@NgModule({
    declarations: [
        AppComponent,
        TasksComponent,
        UsersComponent,
        EditTaskComponent,
        ReportComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        FormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
    ],
    providers: [
        // MessagingService,
        AsyncPipe,
        ShardService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
