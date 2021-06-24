# README

## 前端启动方法

进入myapp文件夹下

首先安装依赖

```bash
npm install
```

之后

```bash
npm run dev
```

启动前端程序

前端运行在localhost:8080,登录界面在localhost:8080/login

## 后端程序启动方法

进入server文件，该文件内为后端应用

执行

```bash
node app
```

后端程序运行在localhost:4000端口，跨域路由为/api/*

期中db.js文件为数据库和elasticsearch配置连接文件，

如果在助教的本地运行的话记得将数据库、elasticsearch的名称、用户名和密码改为自己本地的再运行