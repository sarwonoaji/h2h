import React, { useEffect, useState } from "react";
import Header from "../Tabs/Header";
import Entitas from "../Tabs/Entitas";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from "react-bootstrap";
import GenerateAju from "../GenerateAju";
import { defaultBC23Request } from "../../../../../models/BC23Model/DataModel/HeaderModels";
import type { BC23Request } from "../../../../../models/BC23Model/BC23.types";
import { entitasPemasok, entitasPemilik, entitasPengusaha} from "../../../../../models/BC23Model/DataModel/EntitasModels";
import LoadingOverlay from "../../../../../components/LoadingOverlay";
import Dokumen from "../Tabs/Dokumen";
import Pengangkut from "../Tabs/Pengangkut";

const BC23CreateView = () => {
  const [isCompleteHeader, setIsCompleteHeader] = useState(false);
  const [isCompleteEntitas, setIsCompleteEntitas] = useState(false);
  const [isCompleteDokumen, setIsCompleteDokumen] = useState(false);
  const [isCompletePengangkut, setIsCompletePengangkut] = useState(false);
  const [data, setData] = useState<BC23Request>({
        ...defaultBC23Request
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
  }, []);

    //set Entitas default from EntitasModels
    useEffect(() => {
      setData(prev => ({
        ...prev,
        entitas: [
          {...entitasPemilik},
          {...entitasPemasok},
          {...entitasPengusaha},
        ]
      }));
    }, []);
    
  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 96px)" }}>
      <LoadingOverlay
        show={isLoading}
        // text="Generating Nomor AJU..."
      />
    <Form style={{ display: "flex", flexDirection: "column"}}>
      <Tabs defaultActiveKey="header" id="bc23-tabs" className="mb-3" fill variant="tabs" style={{ marginBottom: 16 }}>
        <Tab eventKey="header" title="Header" tabClassName={isCompleteHeader ? "text-success" : ""}>
          <Header data={data} setData={setData} setIsComplete={setIsCompleteHeader} />
        </Tab>
        <Tab eventKey="entitas" title="Entitas" tabClassName={isCompleteEntitas ? "text-success" : ""}>
          <Entitas data={data.entitas} setData={setData} setIsComplete={setIsCompleteEntitas} />
        </Tab>
        <Tab eventKey="dokumen" title="Dokumen" tabClassName={isCompleteDokumen ? "text-success" : ""}>
          <Dokumen data={data.dokumen} setData={setData} headers={data} setIsComplete={setIsCompleteDokumen} />
        </Tab>
        <Tab eventKey="pengangkut" title="Pengangkut" tabClassName={isCompletePengangkut ? "text-success" : ""}>
          <Pengangkut data={data.pengangkut} setData={setData} headers={data} setIsComplete={setIsCompletePengangkut} />
        </Tab>
      </Tabs>
    </Form>
    </div>
  );
};

export default BC23CreateView;
