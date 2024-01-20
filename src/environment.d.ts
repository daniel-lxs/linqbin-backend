export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGODB_URI: string;
      MONGODB_USER: string;
      MONGODB_PASSWORD: string;
    }
  }
}
