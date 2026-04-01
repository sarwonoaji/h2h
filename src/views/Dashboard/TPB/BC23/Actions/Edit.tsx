import { useEffect, useState } from "react";
import Header from "../Tabs/Header";
import Entitas from "../Tabs/Entitas";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from "react-bootstrap";
import Card from "../../../../../components/Card";
import GenerateAju from "../GenerateAju";
import { defaultBC23Request } from "../../../../../models/BC23Model/DataModel/HeaderModels";
import type { BC23Request } from "../../../../../models/BC23Model/BC23.types";
import { entitasPemasok, entitasPemilik, entitasPengusaha} from "../../../../../models/BC23Model/DataModel/EntitasModels";
import LoadingOverlay from "../../../../../components/LoadingOverlay";
import Dokumen from "../Tabs/Dokumen";
import Pengangkut from "../Tabs/Pengangkut";
import Kemasan from "../Tabs/KemasanPetiKemas";
import Transaksi from "../Tabs/Transaksi";
import Barang from "../Tabs/Barang";
import Pernyataan from "../Tabs/Pernyataan";
import Pungutan from "../Tabs/Pungutan";
import { useNavigate } from "react-router-dom";
const BASE_ROUTE = "/dashboard/tpb/bc23";
import { useLocation } from "react-router-dom";

const BC23EditView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCompleteAll, setIsCompleteAll] = useState(false);
  const [isCompleteHeader, setIsCompleteHeader] = useState(false);
  const [isCompleteEntitas, setIsCompleteEntitas] = useState(false);
  const [isCompleteDokumen, setIsCompleteDokumen] = useState(false);
  const [isCompletePengangkut, setIsCompletePengangkut] = useState(false);
  const [isCompleteKemasan, setIsCompleteKemasan] = useState(false);
  const [isCompleteTransaksi, setIsCompleteTransaksi] = useState(false);
  const [isCompleteBarang, setIsCompleteBarang] = useState(false);
  const [isCompletePungutan, setIsCompletePungutan] = useState(false);
  const [isCompletePernyataan, setIsCompletePernyataan] = useState(false);
  const [data, setData] = useState<BC23Request>(() => {
    // Cek jika ada data dari navigasi (edit)
    if (location.state && location.state.data) {
      const dataEdit = location.state.data;
      // Pastikan pengangkut selalu array
      return { ...dataEdit, pengangkut: Array.isArray(dataEdit.pengangkut) ? dataEdit.pengangkut : [dataEdit.pengangkut || {}] };
    }
    return { ...defaultBC23Request };
  });
  const [isLoading, setIsLoading] = useState(false);

  // Hanya generate nomor aju jika create baru
  useEffect(() => {
    if (!(location.state && location.state.data)) {
      let mounted = true;
      const generate = async () => {
        setIsLoading(true);
        const nomorAju = await GenerateAju();
        if (mounted) {
          setData((prev) => ({ ...prev, nomorAju }));
          setTimeout(() => setIsLoading(false), 400);
        }
      };
      generate();
      return () => {
        mounted = false;
      };
    }
  }, [location.state]);

    //set Entitas default from EntitasModels
    useEffect(() => {
        if (!(location.state && location.state.data)) {
      setData(prev => ({
        ...prev,
        entitas: [
          {...entitasPemilik},
          {...entitasPemasok},
          {...entitasPengusaha},
        ]
      }));
        }
    }, []);

    useEffect(() => {
        const allComplete = isCompleteHeader && isCompleteEntitas && isCompletePengangkut && isCompleteKemasan && isCompleteTransaksi  && isCompletePernyataan;
        setIsCompleteAll(allComplete);
    }, [isCompleteHeader, isCompleteEntitas, isCompletePengangkut, isCompleteKemasan, isCompleteTransaksi, isCompletePernyataan]);
    
  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 96px)" }}>
      <LoadingOverlay
        show={isLoading}
        // text="Generating Nomor AJU..."
      />
    <div style={{ display: "flex", flexDirection: "column"}}>
    <Card 
        title="Data BC 2.3"
        headerStyle={{ backgroundColor: "#f5f5f5", padding: "18px 12px" }}
        headerCustom={(
            <div style={{ display: "flex", flexDirection: "row", gap: 8, }}>
                <Button style={{ borderRadius:0,fontSize: 12, width: "100px"}} variant={isCompleteAll ? "primary" : "secondary"} disabled={!isCompleteAll}>Simpan</Button>
                <Button style={{ borderRadius:0,fontSize: 12, width: "100px"}} variant="secondary" onClick={() => navigate(`${BASE_ROUTE}`)}>Batal</Button>
            </div>
        )}
      >
      <Form style={{ display: "flex", flexDirection: "column"}}>
      <Tabs defaultActiveKey="header" id="bc23-tabs" className="mb-3" fill variant="tabs" style={{ marginBottom: 16 }}>
        <Tab eventKey="header" title="Header" tabClassName={isCompleteHeader ? "text-success" : "text-danger"}>
          <Header data={data} setData={setData} setIsComplete={setIsCompleteHeader} readOnlyView={false} />
        </Tab>
        <Tab eventKey="entitas" title="Entitas" tabClassName={isCompleteEntitas ? "text-success" : "text-danger"}>
          <Entitas data={data.entitas} setData={setData} setIsComplete={setIsCompleteEntitas} readOnlyView={false} />
        </Tab>
        <Tab eventKey="dokumen" title="Dokumen" tabClassName={isCompleteDokumen ? "text-success" : "text-danger"}>
          <Dokumen data={data.dokumen} setData={setData} headers={data} setIsComplete={setIsCompleteDokumen} readOnlyView={false} />
        </Tab>
        <Tab eventKey="pengangkut" title="Pengangkut" tabClassName={isCompletePengangkut ? "text-success" : "text-danger"}>
          <Pengangkut data={data.pengangkut} setData={setData} headers={data} setIsComplete={setIsCompletePengangkut} readOnlyView={false} />
        </Tab>
        <Tab eventKey="kemasan" title="Kemasan & Peti Kemas" tabClassName={isCompleteKemasan ? "text-success" : "text-danger"}>
          <Kemasan data={data} setData={setData} setIsComplete={setIsCompleteKemasan} readOnlyView={false} />
        </Tab>
        <Tab eventKey="transaksi" title="Transaksi" tabClassName={isCompleteTransaksi ? "text-success" : "text-danger"}>
          <Transaksi data={data} setData={setData} setIsComplete={setIsCompleteTransaksi} readOnlyView={false} />
        </Tab>
        <Tab eventKey="barang" title="Barang" tabClassName={isCompleteBarang ? "text-success" : "text-danger"}>
          <Barang data={data.barang} setData={setData} headers={data} setIsComplete={setIsCompleteBarang} readOnlyView={false} />
        </Tab>
        <Tab eventKey="pungutan" title="Pungutan" tabClassName={isCompletePungutan ? "text-success" : "text-danger"}>
          <Pungutan data={data.barang} setData={setData} dataPungutan={data.pungutan} setIsComplete={setIsCompletePungutan} readOnlyView={false} />
        </Tab>
        <Tab eventKey="pernyataan" title="Pernyataan" tabClassName={isCompletePernyataan ? "text-success" : "text-danger"}>
          <Pernyataan data={data} setData={setData} setIsComplete={setIsCompletePernyataan} readOnlyView={false} />
        </Tab>
      </Tabs>
    </Form>
    </Card>
    
    
    </div>
    </div>
  );
};

export default BC23EditView;
