# DSS-KGS-2020
Source code DSS KGS 2020

## Instalasi node.js
https://www.dumetschool.com/blog/cara-install-node-js-dan-npm-pada-windows

## How to run?
1. buat database project1
2. kemudian import file project1.sql
3. masuk cmd dan masuk ke path project
4. jalankan command npm install
5. jalankan command node index.js
6. pindah folder /view ke htdocs
7. jalankan http://localhost/view


## Deskripsi singkat Core Engine
- Core Engine KGS adalah tempat Algoritma komputasi dalam bentuk probabilitas untuk menghitung kerentanan seorang pasien terhadap data data yang di input seperti gejala klinis untuk di ambil sebuah hasil presentase dari data data yang sudah di input ke dalam core engine KGS

## Step Instalasi
- Jika Core Engine sudah dalam .exe maka tinggal di run saja core_engine.exe
- Juga siapkan database yang akan di gunakan untuk core engine tersebut dengan nama `project1`

## Step By Step Flow
- Pengguna mengirim data berbentuk CSV tentang data data kerentanan pasien yang sudah ditetapkan. CSV file bisa secara Multiple File.
- Setelah di input file akan di simpan di storage core engine dan akan di buka untuk di baca kedalam format JSON oleh Core Engine agar data data dapat di masukkan kedalam komputasi Core Engine.
- Setelah Data sudah di komputasi, data akan di simpan di database Core Engine
- Data yang di simpan tersebut dapat di tampilkan melalui Tampilan grafik yang menyajikan data data yang sudah di kalkulasi oleh Core Engine

## Dokumentasi Api
- https://documenter.getpostman.com/view/8651814/SzzhdHsX
