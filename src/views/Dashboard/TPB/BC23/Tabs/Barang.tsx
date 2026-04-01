import { Button } from "react-bootstrap";
import Card from "../../../../../components/Card";
import { FaEdit, FaEye, FaPlusCircle, FaTrash } from "react-icons/fa";
import CustomTable from "../../../../../components/TableList";
import { ListSatuanBarang } from "../../../../../services/loader/ListSatuanBarang";
import { useEffect, useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { ModalBarang } from "../Modals/ModalBarang";

const BarangBC23Page = ({ data, setData, headers, setShowModals, setIsComplete, readOnlyView }: any) => {
        // Fungsi untuk menjumlahkan semua netto barang
        const getTotalNettoBarang = () => Array.isArray(data) ? data.reduce((sum, item) => sum + (Number(item.netto) || 0), 0) : 0;

        // Update header netto setiap kali data barang berubah
        useEffect(() => {
            if (typeof setData === "function") {
                setData((prev: any) => ({
                    ...prev,
                    netto: getTotalNettoBarang(),
                }));
            }
        }, [data]);

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);

    const handleEdit = (row: any, index: number) => {
        setEditData(row);
        setEditingIndex(index);
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditData(null);
        setEditingIndex(null);
        setShowForm(true);
    };

const handleDelete = (index: number) => {
    if (!window.confirm("Yakin ingin menghapus barang ini?")) return;

    setData((prev: any) => {
        const updated = [...(prev.barang || [])];
        updated.splice(index, 1);
        // Re-index seriBarang setelah hapus
        const reIndexed = updated.map((item, i) => ({
            ...item,
            seriBarang: (i + 1).toString(),
        }));
        return {
            ...prev,
            barang: reIndexed,
        };
    });
};

useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
        setIsComplete(true);
    } else {
        setIsComplete(false);
    }
}, [data, setIsComplete]);

  // Fungsi untuk membandingkan total cif barang dan header
  const getTotalCifBarang = () => Array.isArray(data) ? data.reduce((sum, item) => sum + (Number(item.cif) || 0), 0) : 0;
  const isCifEqual = getTotalCifBarang() === (Number(headers.cif) || 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
        {!showForm && <div style={{ display: "flex", flexDirection: "row", fontWeight: 500, fontSize: 12, padding: 12, backgroundColor: "#fff7db", alignItems: "center", gap: 6}}>
            <FaCircleExclamation style={{color:"orange"}}/> <span style={{color:"black"}}>Wajib mengisi data barang</span>
        </div>}
        {!showForm && !isCifEqual && (
          <div style={{ display: "flex", flexDirection: "row", fontWeight: 500, fontSize: 12, padding: 12, backgroundColor: "#fff7db", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <FaCircleExclamation style={{color:"orange"}}/>
            <span style={{color:"black"}}>
                CIF barang ({getTotalCifBarang()}) tidak sama dengan CIF transaksi ({headers.cif ?? 0})
            </span>
          </div>
        )}
      {!showForm && <Card
          title="Data Barang"
          headerStyle={{ backgroundColor: "#f5f5f5"}}
          headerCustom={(
                !readOnlyView && (
            <Button size="sm" variant="primary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }} onClick={handleAdd}>
                <FaPlusCircle/><span style={{paddingTop:1}}>Tambah</span>                
            </Button>
                )
          )}
        >
        <CustomTable
            title=""
            containerStyle={{ background: "#f9fafc", padding: 0}}
            headerStyle={{marginBottom:0}}
            actionContainerStyle={{ gap: 15 }}
            tableStyle={{ fontSize: 12, marginBottom: 0 }}
            columns={[
                { header: "Seri", accessor: "seriBarang",thStyle:{ textAlign: "center" }, tdStyle: { minWidth: 50, textAlign: "center" } },
                { header: "HS", accessor: "posTarif", tdStyle: { minWidth: 100},},
                { header: "Uraian", accessor: "uraian", tdStyle: { minWidth: 200}, },
                { header: "Nilai Barang", accessor: "cif", tdStyle: { minWidth: 100},},
                { header: "Jumlah Satuan", accessor: "jumlahSatuan" ,tdStyle: { minWidth: 100} },
                                {
                                    header: "Kode Satuan",
                                    accessor: "kodeSatuanBarang",
                                    tdStyle: { minWidth: 100 },
                                    render: (row) => {
                                        const satuan = ListSatuanBarang.find(
                                            (s) => s.tableKey === row.kodeSatuanBarang
                                        );
                                        return satuan
                                            ? `${row.kodeSatuanBarang} - ${satuan.tableValue}`
                                            : row.kodeSatuanBarang;
                                    },
                                },
                {
                    header: "Action",
                    accessor: "id",
                    tdStyle: { minWidth: 100 },
                    render: (row, index) => (
                        readOnlyView ? 
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleEdit(row, index)}
                        >
                           <FaEye />
                        </Button> : (
                        <div style={{ display: "flex", gap: 6 }}>
                        <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleEdit(row, index)}
                        >
                            <FaEdit />
                        </Button>

                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(index)}
                        >
                            <FaTrash />
                        </Button>
                        </div>
                        )
                    ),
                },
            ]}
            data={data}   
            striped={false}
            bordered={false}
            hover={true}
            responsive={true}
            className="custom-table"
        />
        </Card>}
        {showForm && (
            <ModalBarang
                data={data}
                setData={setData}
                header={headers}
                setActiveForm={(val: boolean) => {
                    setShowForm(val);
                    if (!val) {
                        setEditingIndex(null);
                        setEditData(null);
                    }
                }}
                editingIndex={editingIndex}
                editData={editData}
                readOnlyView={readOnlyView}
            />
        )}
    </div>
  );
};

export default BarangBC23Page;