// src/config/env.ts
interface AppConfig {
    apiUrl: string;
  }
  
  const ENV = {
    apiUrl: process.env.EXPO_PUBLIC_API_URL, 
  } as const;
  
  // Validare pentru a ne asigura că toate variabilele de mediu necesare există
  const getValidatedEnvVar = (obj: Record<string, string | undefined>, key: string) => {
    const value = obj[key];
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  };
  
  // Configurația aplicației cu validare
  export const Config: AppConfig = {
    apiUrl: getValidatedEnvVar(ENV, 'apiUrl'),
  };
  