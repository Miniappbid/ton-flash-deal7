declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        showConfirm: (message: string) => boolean;
        initData: string;
        initDataUnsafe: Record<string, any>;
      };
    };
  }
}

export {};