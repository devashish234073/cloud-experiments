# This contains 5 applications
1. db.js is in memory db providing rest api for interacting with the db
2. registerService.js is for registering new users it interacts with the db.js
3. searchSerrvice.js is for searching users it also interacts with the db.js
4. ui.js this one provides a ui to call the apis from the above two services
5. apiInteraction.js provides api to log all teh api interaction its /ui path provides a ui for showing all the interactions