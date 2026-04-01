import { Button, Tab, Tabs } from "react-bootstrap";
import Card from "../../../../../components/Card";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import CustomTable from "../../../../../components/TableList";
import { ModalKemasan } from "../Modals/ModalKemasan";
import { ModalPetiKemas } from "../Modals/ModalPetiKemas";
import { ListTipeKontainer } from "../../../../../services/loader/ListTipeKontainer";
import { ListUkuranKontainer } from "../../../../../services/loader/ListUkuranKontainer";
import { ListJenisKontainer } from "../../../../../services/loader/ListJenisKontainer";
import { useEffect, useState } from "react";
import { ListJenisKemasan } from "../../../../../services/loader/ListJenisKemasan";
import { FaCircleExclamation } from "react-icons/fa6";

const KemasanBC23Page = ({ data, setData, setIsComplete, readOnlyView }: any) => {
    const [activeTab, setActiveTab] = useState("kemasan");
    const [activeForm, setActiveForm] = useState<"kemasan" | "petiKemas" | null>(null);
 
    const [editingKemasanIndex, setEditingKemasanIndex] = useState<number | null>(null);
    const [editingPetiKemasIndex, setEditingPetiKemasIndex] = useState<number | null>(null);

    const handleEditKemasan = (row: any, index: number) => {
        setEditingKemasanIndex(index);
        setEditingPetiKemasIndex(null);
        setActiveForm("kemasan");
        setActiveTab("kemasan");
    };

  const handleDeleteKemasan = (index: number) => {
    if (!window.confirm("Yakin hapus Kemasan?")) return;
    setData((prev: any) => {
      const updated = [...(prev.kemasan || [])];
      updated.splice(index, 1);
      const reIndexed = updated.map((item, i) => ({
        ...item,
        seriKemasan: i + 1,
        }));
      return { ...prev, kemasan: reIndexed };
    });
  };

  const handleEditPetiKemas = (row: any, index: number) => {
    setEditingPetiKemasIndex(index);
    setEditingKemasanIndex(null);
    setActiveForm("petiKemas");
    setActiveTab("petiKemas");
  };

  const handleDeletePetiKemas = (index: number) => {
    if (!window.confirm("Yakin hapus Peti Kemas?")) return;
    setData((prev: any) => {
      const updated = [...(prev.kontainer || [])];
      updated.splice(index, 1);
        const reIndexed = updated.map((item, i) => ({
        ...item,
        seriKontainer: i + 1,
        }));
      return { ...prev, kontainer: reIndexed };
    }); 
  };

    const getNamaTipeKontainer = (kode: string) => {
        const kontainer = ListTipeKontainer.find((item) => item.value === kode);
        return kontainer ? `${kontainer.value} - ${kontainer.label}` : "";
    };
    const getNamaJenisKontainer = (kode: string) => {
        const kontainer = ListJenisKontainer.find((item) => item.value === kode);
        return kontainer ? `${kontainer.value} - ${kontainer.label}` : "";
    }
    const getUkuranKontainer = (kode: string) => {
        const ukuran = ListUkuranKontainer.find((item) => item.value === kode);
        return ukuran ? `${ukuran.value} - ${ukuran.label}` : "";
    };
    const getJenisKemasan = (kode: string) => {
        const jenis = ListJenisKemasan.find((item) => item.value === kode);
        return jenis ? `${jenis.value} - ${jenis.label}` : "";
    }

    useEffect(() => {
        const hasKemasan = data.kemasan && data.kemasan.length > 0;
        setIsComplete(hasKemasan);
    }, [data.kemasan]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "row", fontWeight: 500, fontSize: 12, padding: 12, backgroundColor: "#fff7db", alignItems: "center", gap: 6 }}>
       <FaCircleExclamation style={{color:"orange"}}/> <span style={{color:"black"}}>Wajib mengisi data kemasan</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
      {activeForm === "kemasan"  && (
        <ModalKemasan
          data={data.kemasan}
          setData={setData}
          setActiveForm={setActiveForm}
          editingKemasanIndex={editingKemasanIndex}
          setEditingKemasanIndex={setEditingKemasanIndex}
        />
      )}
      {activeForm === "petiKemas" && (
        <ModalPetiKemas
          data={data.kontainer}
          setData={setData}
            setActiveForm={setActiveForm}
            editingPetiKemasIndex={editingPetiKemasIndex}
            setEditingPetiKemasIndex={setEditingPetiKemasIndex}
        />
        )}
        </div>
         <Card
            title="Kemasan & Peti Kemas"
            bodyStyle={{ display: "flex", flexDirection: "row", gap: 16, justifyContent: "center" }}
            >
                    <Card
                        title="Kemasan"
                        headerStyle={{ backgroundColor: "#f5f5f5"}}
                        headerCustom={(
                            readOnlyView ? null :
                            <Button size="sm" variant="primary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }}
                            onClick={() => {
                                setEditingKemasanIndex(null);
                                setEditingPetiKemasIndex(null);
                                setActiveForm("kemasan");
                            }}>
                                <FaPlusCircle/><span style={{paddingTop:1}}>Tambah</span>                
                            </Button>
                        )}
                        >   
                    <CustomTable
                        title=""
                        containerStyle={{ background: "#f9fafc", padding: 0}}
                        headerStyle={{marginBottom:0}}
                        actionContainerStyle={{ gap: 15 }}
                        tableStyle={{ fontSize: 12, marginBottom: 0 }}
                        columns={[
                            { header: "Seri", accessor: "seriKemasan",thStyle:{ textAlign: "center" }, tdStyle: { textAlign: "center" } },
                            { header: "Jumlah", accessor: "jumlahKemasan", render: (row) => row.jumlahKemasan },
                            { header: "Jenis", accessor: "kodeJenisKemasan", render: (row) => getJenisKemasan(row.kodeJenisKemasan) },
                            { header: "Merek", accessor: "merkKemasan", render: (row) => row.merkKemasan },
                            
                            {
                                header: !readOnlyView ? "Action" : "",
                                accessor: "id",
                                thStyle: { width: 60, textAlign: "center" },
                                tdStyle: { width: 60, textAlign: "center" },
                                render: (row, index) => (
                                    !readOnlyView && (
                                    <div style={{ display: "flex", gap: 6 }}>
                                    <Button
                                        size="sm"
                                        variant="warning"
                                        onClick={() => handleEditKemasan(row, index)}
                                    >
                                        <FaEdit />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDeleteKemasan(index)}
                                    >
                                        <FaTrash />
                                    </Button>
                                    </div>
                                    )
                                ),
                            },
                        ]}
                        data={data.kemasan || []}   
                        striped={false}
                        bordered={false}
                        hover={true}
                        responsive={true}
                        className="custom-table"
                    />
                </Card>
                    <Card
                        title="Peti Kemas"
                        headerStyle={{ backgroundColor: "#f5f5f5"}}
                        headerCustom={(
                            !readOnlyView && (
                            <Button size="sm" variant="primary" style={{ display: "flex", alignItems:"center", justifyContent:"center", gap: 4 , borderRadius: 0, fontSize: 12 }}
                            onClick={() => {
                            setEditingKemasanIndex(null);
                            setEditingPetiKemasIndex(null);
                            setActiveForm("petiKemas");
                        }}>
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
                            { header: "Seri", accessor: "seriKontainer",thStyle: { textAlign: "center" }, tdStyle: { textAlign: "center" } },
                            { header: "Nomor", accessor: "nomorKontainer"},
                            { header: "Ukuran", accessor: "kodeUkuranKontainer", render: (row) => getUkuranKontainer(row.kodeUkuranKontainer) },
                            { header: "Jenis", accessor: "kodeJenisKontainer", render: (row) => getNamaJenisKontainer(row.kodeJenisKontainer) },
                            { header: "Tipe", accessor: "kodeTipeKontainer", render: (row) => getNamaTipeKontainer(row.kodeTipeKontainer) },
                            {
                                header: !readOnlyView ? "Action" : "",
                                accessor: "id",
                                thStyle: { width: 60, textAlign: "center" },
                                tdStyle: { width: 60, textAlign: "center" },
                                render: (row, index) => (
                                    !readOnlyView && (
                                    <div style={{ display: "flex", gap: 6 }}>
                                    <Button
                                        size="sm"
                                        variant="warning"
                                        onClick={() => handleEditPetiKemas(row, index)}
                                    >
                                        <FaEdit />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDeletePetiKemas(index)}
                                    >
                                        <FaTrash />
                                    </Button>
                                    </div>
                                    )
                                ),
                            },
                        ]}
                        data={data.kontainer || []}   
                        striped={false}
                        bordered={false}
                        hover={true}
                        responsive={true}
                        className="custom-table"
                    />    
                </Card>
        </Card>
    </div>
          
  );
};
export default KemasanBC23Page;