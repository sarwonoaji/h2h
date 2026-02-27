type Environment = {
  AUTH_API: string;
  DL_SUPPORT_API: string;
  TPB_API: string;
  PEB_API: string;
  CEISA_API: string;
};

const ENV: Record<string, Environment> = {

  //DEV
    //AUTH_API: "https://com-danliris-service-auth-v8-dev.azurewebsites.net/v1/",
    // Ceisa_API: "https://com-danliris-service-support-dev.azurewebsites.net/v1/ceisa",
    // TPB_API: "https://com-danliris-service-support-dev.azurewebsites.net/v1/tpb",
    // PEB_API: "https://com-danliris-service-support-dev.azurewebsites.net/v1/peb",
    // DL_SUPPORT_API: "https://com-danliris-service-support-dev.azurewebsites.net/v1/",
  //PRD
    // Ceisa_API: "https://com-danliris-service-support.azurewebsites.net/v1/ceisa",
    // TPB_API: "https://com-danliris-service-support.azurewebsites.net/v1/tpb",
    // PEB_API: "https://com-danliris-service-support.azurewebsites.net/v1/peb",
    // AUTH_API: "https://com-danliris-service-auth-v8.azurewebsites.net/v1/",
    // DL_SUPPORT_API: "https://com-danliris-service-support.azurewebsites.net/v1/",
    development: {
    
    AUTH_API: "https://com-danliris-service-auth-v8.azurewebsites.net/v1/",
    DL_SUPPORT_API: "https://localhost:56190/v1/",
    TPB_API: "https://localhost:56190/v1/tpb",
    PEB_API: "https://localhost:56190/v1/peb",
    CEISA_API: "https://localhost:56190/v1/ceisa"
    
  },
  production: {
    AUTH_API: "https://auth.myapp.com/api/",
    DL_SUPPORT_API: "https://master.myapp.com/api/",
    TPB_API: "https://master.myapp.com/api",
    PEB_API: "https://master.myapp.com/api",
    CEISA_API: "https://master.myapp.com/api"
  }
};

const currentEnv = import.meta.env.MODE || "development";

export default ENV[currentEnv];
