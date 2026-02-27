import moment from "moment";
import type { Entitas } from "../BC23.types";

export const createDefaultEntitas = (): Entitas[] => [
  { ...entitasPengusaha},
  { ...entitasPemasok},
  { ...entitasPemilik},
  
];

export const entitasPengusaha: Entitas = {
  alamatEntitas:  "JL. MERAPI NO.23 BANARAN, KECAMATAN GROGOL, KABUPATEN SUKOHARJO 57552 DAN MEMILIKI KANTOR REPRESENTATIF DI JAKARTA, DENGAN ALAMAT EQUITY TOWER 15TH FLOOR SUITE C. SUDIRMAN CENTRAL BUSINESS DISTRICT, LOT 9, JL. JENDRAL SUDIRMAN KAV.52-53, JAKARTA 12190 - BANARAN, GROGOL, SUKOHARJO, JAWA TENGAH",
  kodeEntitas: "3",
  kodeJenisIdentitas: "5",
  kodeJenisApi: null,
  kodeNegara: null,
  kodeStatus: null,
  namaEntitas: "DAN LIRIS",
  nibEntitas: "8120016080883",
  nomorIdentitas: "011399078532000",
  nomorIjinEntitas: "207/WBC.10/2022",
  tanggalIjinEntitas: moment(new Date("2022-11-03")).format("YYYY-MM-DD"),
  seriEntitas: 1,
};

export const entitasPemasok: Entitas = {
  alamatEntitas: null,
  kodeEntitas: "5",
  kodeJenisIdentitas: "2",
  kodeJenisApi: null,
  kodeNegara: null,
  kodeStatus: null,
  namaEntitas: null,
  nibEntitas: null,
  nomorIdentitas: null,
  nomorIjinEntitas: null,
  tanggalIjinEntitas: null,
  seriEntitas: 2,
};

export const entitasPemilik: Entitas = {
  alamatEntitas: null,
  kodeEntitas: "7",
  kodeJenisIdentitas: "5",
  kodeJenisApi: "2",
  kodeNegara: null,
  kodeStatus: "5",
  namaEntitas: null,
  nibEntitas: null,
  nomorIdentitas: null,
  nomorIjinEntitas: null,
  tanggalIjinEntitas: null,
  seriEntitas: 3,
};



