# gulp-scp3 v1.0.0 ![npm](https://img.shields.io/npm/v/gulp-scp3.svg) ![Node](https://img.shields.io/node/v/18.svg)

Modern SCP deployment for **Gulp 4/5+** (Node >=20)

> Secure file uploads via SSH2 with **password & privateKey support**

[![npm](https://img.shields.io/npm/v/gulp-scp3)](https://www.npmjs.com/package/gulp-scp3)
[![Node](https://img.shields.io/badge/node-%3E=20-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Install

```bash
npm install gulp-scp3 --save-dev
```

## Usage

### 📱 **ESM / CommonJS**

```js
// ESM
import gulp from "gulp";
import scp from "gulp-scp3";

export default () =>
  gulp.src("dist/**/*").pipe(
    scp({
      host: "your-server.com",
      username: "deploy",
      dest: "/var/www/app/",
      // password: 'pass123', OR ↓
      privateKey: "./id_rsa", // 🆕 v1.0.0
      passphrase: "keypass123", // opcional
    }),
  );
```

```js
// CommonJS
const gulp = require("gulp");
const scp = require("gulp-scp3");

gulp.task("deploy", () =>
  gulp.src("**/*.js").pipe(
    scp({
      host: "192.168.1.100",
      port: 22, // 🆕 default:22
      username: "user",
      password: "pass", // legacy support ✅
      dest: "/home/user/app/",
    }),
  ),
);
```

## 🔧 **Options**

| Option       | Type   | Default            | Description                |
| ------------ | ------ | ------------------ | -------------------------- |
| `host`       | String | `localhost`        | Server hostname/IP         |
| `port`       | Number | `22`               | SSH port 🆕                |
| `username`   | String | `admin`            | SSH username               |
| `password`   | String | -                  | Password auth ✅ legacy    |
| `privateKey` | String | -                  | **Path to private key** 🆕 |
| `passphrase` | String | -                  | Key passphrase 🆕          |
| `dest`       | String | `/home/[username]` | Remote destination         |

## 🧪 **Tests**

```bash
npm test
```

## 📁 **Repository**

[![GitHub](https://github.com/jinvillaz/gulp-scp3)](https://github.com/jinvillaz/gulp-scp3)

## 👨‍💻 **Author**

[Jhonatan Villanueva](https://github.com/jinvillaz)

## 💝 **Support**

<a href="https://www.paypal.me/jinvillaz">
  <img src="https://img.shields.io/badge/Donate-PayPal-blue.svg" alt="Donate">
</a>

## 📄 **License**

MIT © [jinvillaz](https://github.com/jinvillaz)

### options.host

Type: `String`
Default value: `localhost`

A string value that is the host of the server.

### options.port

Type: `Number`
Default value: `22`

The ssh port of the server.
Note this option wasn't tested.

### options.username

Type: `String`
Default value: `admin`

The username of the server.

### options.password

Type: `String`

The password of the user on the remote server.

### options.dest

Type: `String`
Default value: `/home/username`

Remote server directory

## Repository

[gulp-scp3](https://github.com/jinvillaz/gulp-scp3)

## Author

[Jhonatan Villanueva](https://github.com/jinvillaz)

## Thanks for your donation

If you want to support this free project. Any help is welcome. You can donate by clicking one of the following links:

<a target="blank" href="https://www.paypal.me/jinvillaz"><img src="https://img.shields.io/badge/Donate-PayPal-blue.svg"/></a>

## LISENCE

Copyright (c) 2019 jinvillaz. Licensed under the MIT license.
