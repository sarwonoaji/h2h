/* =========================================
   ROOT
========================================= */

export interface BC23Request {
  asalData: "S";
  asuransi: number;
  bruto: number;
  cif: number;
  fob: number;
  freight: number;
  hargaPenyerahan: number;
  jabatanTtd: string | null;
  jumlahKontainer: number;
  kodeAsuransi: "LN" | "DN";
  kodeDokumen: "23";
  kodeIncoterm: string | null;
  kodeKantor: string | null;
  kodeKantorBongkar: string | null;
  kodePelBongkar: string | null;
  kodePelMuat: string | null;
  kodePelTransit: string | null;
  kodeTps: string | null;

  kodeTujuanTpb: string | null;
  kodeTutupPu: "11" | "12" | "14";
  kodeValuta: string | null;
  kotaTtd: string | null;
  namaTtd: string | null;
  ndpbm: number;
  netto: number;
  nik:string | null;
  nilaiBarang: number;
  nomorAju: string | null;
  nomorBc11: string | null;
  posBc11: string | null;
  seri: number;
  subposBc11: string | null;
  tanggalBc11: string | null;
  tanggalTiba: string | null;
  tanggalTtd: string | null;
  biayaTambahan: number;
  biayaPengurang: number;
  kodeKenaPajak: "1" | "2";

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
  asuransi: number;
  cif: number;
  diskon: number;
  fob: number;
  freight: number;
  hargaEkspor: number;
  hargaPenyerahan: number;
  hargaSatuan: number;
  isiPerKemasan: number;
  jumlahKemasan: number;
  jumlahSatuan: number;
  kodeBarang: string | null;
  kodeDokumen: string | null;
  kodeKategoriBarang: string | null;
  kodeJenisKemasan: string | null;
  kodeNegaraAsal: string | null;
  kodePerhitungan: "0" | "1";
  kodeSatuanBarang: string | null;
  merk: string | null;
  netto: number;
  nilaiBarang: number;
  nilaiTambah: number;
  posTarif: string | null;
  seriBarang: number;
  spesifikasiLain: string | null;
  tipe: string | null;
  ukuran: string | null;
  uraian: string | null;
  ndpbm: number;
  cifRupiah: number;
  hargaPerolehan: number;
  kodeAsalBahanBaku: "0" | "1";

  barangTarif: BarangTarif[];
  barangDokumen: BarangDokumen[];
}

/* =========================================
   BARANG TARIF
========================================= */

export interface BarangTarif {
  kodeJenisTarif: "1" | "2";
  jumlahSatuan: number;
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