# Fabow

1. Task Fabow System
2. Firebase Database,Auth
3. PWA Push Notification,App Add

## Step

1. 參考自己以前寫的專案 [OKR-WorkAid](https://github.com/Big-Code-Milk/Side-Project-OKR-WorkAid/tree/main/studio-backstage)
2. FireBase 更新引入方式，模組版本 [stackoverflow](https://stackoverflow.com/questions/47920838/typescript-error-cannot-find-module-firebase-app)
3. 根據新的方式重寫 [做一個面試官無法拒絕的sideproject，當一個全能的前端系列](https://ithelp.ithome.com.tw/articles/10272945)
4. FireBase Auth 註冊帳號 [angular firebase auth createUser](https://www.positronx.io/create-user-with-email-password-in-firebase-and-angular/)
5. [處理使用者資訊](https://givemepass.blogspot.com/2017/05/firebase-authentication-user.html) 這端以往沒處理過嘗試看看
6. [AngularFireAuth setDisplayName](https://stackoverflow.com/questions/60405997/angular-8-firebase-how-do-i-set-the-displayname-when-creating-user-with-email)
7. [官方使用說明書](https://firebase.google.com/docs/reference/android/com/google/firebase/auth/FirebaseUser)
8. 原先為正常的帳號任務架構 => 改為中心化類似匿名留言版的架構，目的是使使用者更方便。
9. [cookie](https://shubo.io/cookies/#%E5%A6%82%E4%BD%95%E7%94%A8-javascrip-%E5%AF%AB%E5%85%A5-cookie)
10. [RealtimeDatabase CRUD](https://www.digitalocean.com/community/tutorials/angular-firebase-crud-operations)
11. [moment 引入錯誤](https://stackoverflow.com/questions/35272832/systemjs-moment-is-not-a-function)
12. 應用 set => create + update [crud](https://www.bezkoder.com/angular-12-firestore-crud-angularfirestore/)
13. firebase [crud](https://www.oxxostudio.tw/articles/201905/firebase-firestore.html)
14. 上版 github page 卡了一段時間 --hraf-base /儲存庫網域/
15. FCM free [推播實作](https://medium.com/%E5%BD%BC%E5%BE%97%E6%BD%98%E7%9A%84-swift-ios-app-%E9%96%8B%E7%99%BC%E5%95%8F%E9%A1%8C%E8%A7%A3%E7%AD%94%E9%9B%86/%E5%88%A9%E7%94%A8-firebase-cloud-messaging-fcm-%E7%99%BC%E9%80%81%E6%8E%A8%E6%92%AD-b4a9bd4f89d6)
16. ag [FCM](https://ithelp.ithome.com.tw/articles/10196749)
18. [PWA 相關](https://jonny-huang.github.io/angular/training/19_pwa/)
19. [PWA 基礎](https://ithelp.ithome.com.tw/articles/10197329) *******
20. [PWA 更版](https://blog.kevinyang.net/2018/09/07/angular-sw-update/)
21. `install --save @angular/service-worker`
22. [ADD PWA](https://www.twblogs.net/a/5d745167bd9eee541c3423d9)
23. `ng add @angular/pwa`
24. [FCM](https://nick-chen.medium.com/%E4%BD%BF%E7%94%A8-firebase-%E5%BF%AB%E9%80%9F%E5%BB%BA%E7%AB%8B%E7%B6%B2%E9%A0%81%E6%8E%A8%E6%92%AD%E6%9C%8D%E5%8B%99-web-push-notifications-service-3e7b0d0c5ac6)
25. 過了一天才發現 [FCM 與 ServiceWork Push Notification 差異](https://www.letswrite.tw/pwa-web-push/)
26. 發現要實作資料增加時推播只要利用到 subscribe websocket 機制即可好像不用搞到要主動推播 ...
27. 如果實作 FCM 主動推播，則要在允許推播時上傳一組此設備的 Token 作為主動推播位置的依據
28. 而如果利用 webocket realtime database 則是要確定前後數據差異才能主動推播至 Notification
29. 嘗試先用二種因為目前留言就有 realtime 功能，所需的推播只需要借助回傳的 subscribe 資料就不用再 call 外部 api 避免過多的問題
30. [研究過後前端三大神獸看起來不能使用都有大小上的限制](https://medium.com/@bebebobohaha/cookie-localstorage-sessionstorage-%E5%B7%AE%E7%95%B0-9e1d5df3dd7f)，決定利用 Firebase 資料來做機制
31. 增加欄位來判定需不需要通知，通知完後將欄位回寫已通知，代價是增加讀寫一次，相較於 call 外部 api 後續可能出現的問題是較可以接受的
