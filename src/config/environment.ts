type Environment = {
  AUTH_API: string;
  DL_SUPPORT_API: string;
  TPB_API: string;
};

const ENV: Record<string, Environment> = {
  development: {
    AUTH_API: "https://com-danliris-service-auth-v8-dev.azurewebsites.net/v1/",
    DL_SUPPORT_API: "https://localhost:5002/api/",
    TPB_API: "https://localhost:5002/api"
  },
  production: {
    AUTH_API: "https://auth.myapp.com/api/",
    DL_SUPPORT_API: "https://master.myapp.com/api/",
    TPB_API: "https://master.myapp.com/api"
  }
};

const currentEnv = import.meta.env.MODE || "development";

export default ENV[currentEnv];
