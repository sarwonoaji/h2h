import React from 'react';

interface HeaderProps {
  data: {
    nomorPengajuan: string;
    pelabuhanBongkar: string;
    [key: string]: any;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function Header({ data, setFormData }: HeaderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      header: {
        ...prev.header,
        [name]: value
      }
    }));
  };

  return (
    <>
      <input
        name="nomorPengajuan"
        value={data.nomorPengajuan}
        onChange={handleChange}
        placeholder="Nomor Pengajuan"
      />

      <input
        name="pelabuhanBongkar"
        value={data.pelabuhanBongkar}
        onChange={handleChange}
        placeholder="Pelabuhan Bongkar"
      />
    </>
  );
}
