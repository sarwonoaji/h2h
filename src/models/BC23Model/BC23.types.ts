/* =========================================
   ROOT
========================================= */

export interface BC23Request {
  asalData: "S";
  asuransi: number; //TAB Transaksi - Asuransi
  bruto: number; // TAB Transaksi - Berat Kotor
  cif: number; // TAB Transaksi - Nilai CIF Rumus = FOB + Freight + Asuransi + (Biaya Tambahan - Biaya Pengurang)
  fob: number; // TAB Transaksi - Nilai FOB Rumus = Harga Penyerahan + (Biaya Tambahan - Biaya Pengurang)
  freight: number; // TAB Transaksi - Freight
  hargaPenyerahan: number; // TAB Transaksi - Harga Barang
  jabatanTtd: string | null; // TAB Pernyataan - Jabatan
  jumlahKontainer: number; //Jumlah Kontainer dari TAB Pengangkut - Peti Kemas
  kodeAsuransi: "LN" | "DN"; //TAB Transaksi - Kode Asuransi
  kodeDokumen: "23";
  kodeIncoterm: string | null; //TAB Transaksi - Jenis Harga Barang
  kodeKantor: string | null; //TAB Header - Kantor Pabean Pengawas
  kodeKantorBongkar: string | null; //TAB Header - Kantor Pabean Bongkar
  kodePelBongkar: string | null; //TAB Header - Pelabuhan Bongkar
  kodePelMuat: string | null; //TAB Pengangkut - Pelabuhan Muat
  kodePelTransit: string | null; //TAB Pengangkut - Pelabuhan Transit
  kodeTps: string | null; //TAB Pengangkut - Tempat Penimbunan

  kodeTujuanTpb: string | null;//TAB Header - Tujuan TPB
  kodeTutupPu: "11" | "12" | "14"; //TAB Pengangkut - BC Kode Tutup (kolom pertama)
  kodeValuta: string | null; //TAB Transaksi - Jenis Valuta
  kotaTtd: string | null; //TAB Pernyataan - Kota
  namaTtd: string | null; //TAB Pernyataan - Nama
  ndpbm: number; //TAB Transaksi - NDPBM
  netto: number; //TAB Transaksi - Berat Bersih
  nik:string | null; //
  nilaiBarang: number; //TAB Transaksi - Nilai Pabean Rumus = NDPBM + Total CIF
  nomorAju: string | null; //TAB Header - Nomor Aju
  nomorBc11: string | null; //TAB Pengangkut - BC Nomor
  posBc11: string | null; //TAB Pengangkut - BC Kolom 1
  seri: number;
  subposBc11: string | null; //TAB Pengangkut - BC Kolom 2
  tanggalBc11: string | null; //TAB Pengangkut - BC Tanggal
  tanggalTiba: string | null;
  tanggalTtd: string | null; //TAB Pernyataan - Tanggal
  biayaTambahan: number; //TAB Transaksi - Biaya Penambah
  biayaPengurang: number; //TAB Transaksi - Biaya Pengurang
  kodeKenaPajak: "1" | "2"; //TAB Transaksi - Jasa Kena Pajak

  barang: Barang[];
  entitas: Entitas[];
  kemasan: Kemasan[];
  kontainer: Kontainer[];
  dokumen: Dokumen[];
  pengangkut: Pengangkut[];
}

/* =========================================
   BARANG
========================================= */

export interface Barang {
  idBarang: string | null;
  asuransi: number; //TAB Barang - Asuransi Rumus = Harga Penyerahan * (Header Asuransi)
  cif: number; //TAB Barang - Nilai CIF Rumus = FOB + Freight + Asuransi + (Biaya Tambahan - Biaya Pengurang)
  diskon: number; 
  fob: number; //TAB Barang - Nilai FOB Rumus = Harga Penyerahan + ( Tranksaksi.Biaya Tambahan - Tranksaksi.Biaya Pengurang)
  freight: number; //TAB Barang - Freight Rumus = Harga Penyerahan * (Header Freight)
  hargaEkspor: number;
  hargaPenyerahan: number; //TAB Barang - Harga
  hargaSatuan: number; //TAB Barang - Harga Satuan Rumus = FOB / Jumlah Satuan Barang
  isiPerKemasan: number; 
  jumlahKemasan: number; //TAB Barang - Jumlah Kemasan
  jumlahSatuan: number; //TAB Barang - Jumlah Satuan
  kodeBarang: string | null; //TAB Barang - Kode Barang
  kodeDokumen: string | null; //TAB Barang - Kode Dokumen dari Dokumen Fasilitas/Lartas ketika dipilih
  kodeKategoriBarang: string | null; 
  kodeJenisKemasan: string | null; //TAB Barang - Kode Jenis Kemasan
  kodeNegaraAsal: string | null; //TAB Barang - Negara
  kodePerhitungan: "0" | "1";
  kodeSatuanBarang: string | null; //TAB Barang - Kode Satuan Barang
  merk: string | null; //TAB Barang - Merk
  netto: number; //TAB Barang - Berat Bersih
  nilaiBarang: number; //TAB Barang - Nilai Pabean Rumus = Transaksi.NDPBM + CIF
  nilaiTambah: number;
  posTarif: string | null; //TAB Barang - Pos Tarif/HS
  seriBarang: number; //TAB Barang - Seri
  spesifikasiLain: string | null; //TAB Barang - Spesifikasi Lain
  tipe: string | null; //TAB Barang - Tipe
  ukuran: string | null; //TAB Barang - Ukuran
  uraian: string | null; //TAB Barang - Uraian Jenis Barang
  ndpbm: number; 
  cifRupiah: number; //TAB Barang - CIF dalam Rupiah
  hargaPerolehan: number;
  kodeAsalBahanBaku: "0" | "1";

  barangTarif: BarangTarif[];
  barangDokumen: BarangDokumen[];
}

/* =========================================
   BARANG TARIF
========================================= */
//Jenis Spesific = KodeJenisPungutan - kodeJenisTarif - jumlahSatuan - Satuan - Tarif - kodeFasilitasTarif - tarifFasilitas 
export interface BarangTarif {
  kodeJenisTarif: "1" | "2"; //TAB Barang Pungutan - Jenis Tarif (kolom pertama)
  jumlahSatuan: number; //TAB Barang Pungutan - Jumlah Satuan Muncul ketika Jenis Tarif dipilih Spesific
  kodeFasilitasTarif: string | null;
  kodeSatuanBarang: string | null;
  kodeJenisPungutan: string | null; // BM | PPH | PPN | dll
  nilaiBayar: number;
  nilaiFasilitas: number;
  nilaiSudahDilunasi: number;
  seriBarang: number;
  tarif: number;
  tarifFasilitas: number;
}

/* =========================================
   BARANG DOKUMEN
========================================= */

export interface BarangDokumen {
  seriDokumen: string | null;
}

/* =========================================
   ENTITAS
========================================= */

export interface Entitas {
  alamatEntitas: string | null;
  kodeEntitas: string | null;
  kodeJenisIdentitas: "2" | "3" | "4" | "5" | "6" | null;
  kodeJenisApi: string | null;
  kodeNegara?: string | null;
  kodeStatus?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | null;
  namaEntitas: string | null;
  nibEntitas: string | null;
  nomorIdentitas: string | null;
  nomorIjinEntitas: string | null;
  tanggalIjinEntitas?: string | null;
  seriEntitas: number;
}

/* =========================================
   KEMASAN
========================================= */

export interface Kemasan {
  jumlahKemasan: number;
  kodeJenisKemasan: string | null;
  seriKemasan: number;
  merkKemasan: string | null;
}

/* =========================================
   KONTAINER
========================================= */

export interface Kontainer {
  kodeTipeKontainer: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "99";
  kodeUkuranKontainer: "20" | "40" | "45" | "60";
  nomorKontainer: string | null;
  seriKontainer: number;
  kodeJenisKontainer: "4" | "7" | "8";
}

/* =========================================
   DOKUMEN
========================================= */

export interface Dokumen {
  idDokumen: string | null;
  kodeDokumen: string | null;
  nomorDokumen: string | null;
  seriDokumen: number;
  tanggalDokumen: string | null;
}

/* =========================================
   PENGANGKUT
========================================= */

export interface Pengangkut {
  kodeBendera: string | null;
  namaPengangkut: string | null;
  nomorPengangkut: string | null;
  kodeCaraAngkut: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | null;
  seriPengangkut: number;
}

// {
//   "apiVersion": "1.0",
//   "data": {
    
//     "idManifesDetail": null,
//     "kodeGudang": null,
//     "namaPemilik": null,
//     "namaPenerima": null,
//     "nilaiSimi": null,
//     "npwpPemilik": null,
//     "npwpPemilk": null,
//     "npwpPenerima": null,
//     "respon": "Data B/L CEISA4.0 atau AWB Tidak Ditemukan atau Dokumen Sudah Ditutup",
//   },
//   "message": "Ok",
//   "statusCode": 200
// }