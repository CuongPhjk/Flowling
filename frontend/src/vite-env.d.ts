/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize(config: Record<string, unknown>): void;
        renderButton(element: HTMLElement, options: Record<string, unknown>): void;
        disableAutoSelect(): void;
      };
    };
  };
}
