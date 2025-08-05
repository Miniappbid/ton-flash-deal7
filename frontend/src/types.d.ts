declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        showConfirm: (msg: string) => boolean;
        initData: string;
        initDataUnsafe: Record<string, any>;
      };
    };
  }
}

export {};
