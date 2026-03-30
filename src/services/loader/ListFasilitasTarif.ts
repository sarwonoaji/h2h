export const ListFalsitasTarif = [
    { "tableKey": "1", "tableValue": "DIBAYAR" },
    { "tableKey": "2", "tableValue": "DITANGGUNG PEMERINTAH" },
    { "tableKey": "3", "tableValue": "DITANGGUHKAN" },
    { "tableKey": "4", "tableValue": "BERKALA" },
    { "tableKey": "5", "tableValue": "DIBEBASKAN" },
    { "tableKey": "6", "tableValue": "TIDAK DIPUNGUT" },
    { "tableKey": "7", "tableValue": "SUDAH DILUNASI" },
    { "tableKey": "8", "tableValue": "DIJAMINKAN" },
    { "tableKey": "9", "tableValue": "DITUNDA" }
].map(item => ({ label: `${item.tableKey} - ${item.tableValue}`, value: item.tableKey }));