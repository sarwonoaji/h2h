import moment from "moment";
import { bc23Service } from "../../../../services/support/TPB/BC23/AccessBC23";

export default async function GenerateAju(): Promise<string> {
  let KdKantor = "0000";
  let KdDok = "23";
  let KdPerusahaan = "011399";
  let tgl = moment(new Date()).format("YYYYMMDD");
const response = await bc23Service.getUrutNoAju() as any;
let urut = response.data || 0;
let NoAju = KdKantor + KdDok + KdPerusahaan + tgl + urut;

  return NoAju;
}