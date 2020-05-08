# Nodejs uploader

backend untuk keperluan upload file ke server menggunakan multer

## Installation

1. Clone terlebih dulu repo ini :

```bash
git clone https://github.com/thariq1211/nodejs-uploader.git
```

2. Masuk ke directory nodejs-uploader

```bash
cd nodejs-uploader
```

3. Install dependencies

```bash
npm install
```

4. Pasang pm2 secara global

```bash
npm install pm2 -g
```

5. Pasang nodemon

```bash
npm install -g nodemon
```

6. Jika ingin ditambah security ssl, buat folder baru bernama "cert" dan import privkey.pem dan cert.pem didalam nya
7. Uncomment code index.js pada baris 57 - 66

```js
// https
//   .createServer(
//     {
//       key: fs.readFileSync("./cert/privkey.pem"),
//       cert: fs.readFileSync("./cert/cert.pem"),
//       passphrase: "PASSWORD CERT",
//     },
//     app
//   )
//   .listen(SPORT);
```

8. Buat folder baru di server

```bash
mkdir /var/spool/recording/
```

9. Pastikan library ffmpeg terinstall di server. Jika belum terinstall, maka install terlebih dahulu, klik https://bit.ly/2WbXhru

```bash
ffmpeg -version
```

## Penggunaan

```bash
pm2 start pm2.json
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
