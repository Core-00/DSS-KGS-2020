# DSS-KGS-2020
Source Code Core Engine DSS KGS 2020

## Instalasi node.js
https://www.dumetschool.com/blog/cara-install-node-js-dan-npm-pada-windows

## How to run?
1. Buat database project1
2. Lakukan import file project1.sql
3. Masuk ke cmd dan ke path project
4. Jalankan command npm install
5. Jalankan command node index.js
6. Pindah folder /view ke htdocs
7. Jalankan http://localhost/view


## Deskripsi singkat Core Engine
- Core Engine DSS KGS adalah algoritma komputasi Knowledge Growing System dengan metode fusi penginferensian informasi ASSA2010 yang saat ini masih dalam proses memperoleh paten nasional. Core Engine DSS KGS menerima masukan berupa data-data gejala klinis pasien melalui platform data mining dengan fasilitas API dan memberikan hasil komputasi dalam bentuk persentase dari nilai probabilitas Degree of Certainty (DoC) terinfeksi Covid-19.

## Step Instalasi
- Jika Core Engine DSS KGS sudah dalam format executable file .exe, maka jalankan core_engine.exe.
- Agar disiapkan database yang akan digunakan untuk Core Engine DSS KGS dengan nama `project1`

## Step By Step Flow
##01 Sistem Terintegrasi dalam Platform TFRIC-19 (main)
- Subsistem data mining mengirimkan data-data gejala klinis yang dimasukkan melalui user interface data gejala klinis.
- Data-data gejala klinis dikirimkan ke Core Engine DSS KGS dengan failitas API dan dilakukan komputasi guna memperoleh nilai probabilitas DoC.
- Hasil-hasil komputasi dalam bentuk persentasi probabilitas DoC dikirimkan untuk ditampilkan hasilnya pada user interface dengan faslitas API.
- Hasil-hasil komputasi tersebut ditampilkan dalam bentuk Confidence Level berdasarkan data-data gejala klinis.

##02 Sistem Mandiri
- Pengguna menginstalasi sistem ke server mandiri.
- Pengguna mengirim data berbentuk CSV tentang data-data gejala klinus pasien sesuai dengan format yang sudah ditetapkan. 
- Pemasukan file CSV ke Core Engine DSS KGS dapat dilakukan secara file by file dan dapat secara simultan Multiple Files.
- Setelah dimasukkan, file (multiple files) akan disimpan di dalam storage Core Engine DSS KGS. 
- File (multiple files) akan dibuka dan untuk dibaca dalam format JSON oleh Core Engine DSS KGS untuk dilanjutkan dengan komputasinya.
- Hasil komputasi Core Engine DSS KGS akan disimpan di dalam database.
- Data yang disimpan tersebut dapat ditampilkan melalui tampilan grafik yang telah disediakan atau diunduh dalam format .txt.

## Dokumentasi API
- https://documenter.getpostman.com/view/8651814/SzzhdHsX
