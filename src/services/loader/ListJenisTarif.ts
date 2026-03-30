export const ListJenisTarif = [
    { kode: "1", nama: "Advalorum" },
    { kode: "2", nama: "Spesifik" },
].map(item => ({ label: `${item.kode} - ${item.nama}`, value: item.kode }));