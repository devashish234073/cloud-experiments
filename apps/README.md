# This contains 5 applications
1. db.js is in memory db providing rest api for interacting with the db
2. registerService.js is for registering new users it interacts with the db.js
3. searchSerrvice.js is for searching users it also interacts with the db.js
4. ui.js this one provides a ui to call the apis from the above two services
5. apiInteraction.js provides api to log all teh api interaction its /ui path provides a ui for showing all the interactions

All the above apps can be started by running step0.sh to step4.sh in windows these can be renamed to .bat files and can be run.

This is the UI from the apiInteraction application the green colored numbers shows the hit count between its diaginally opposite services

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/b6f003f6-9985-4d64-9141-755a149e1534)

Clicking on the number shows details below and hovering over them shows success and failure count, here search service was killed as a result count of request going to serachService increased but calls to db did not:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/779ffdc4-7839-4ee3-896e-9f4dce186130)
