interface ImportMetaEnv {
  /**
   * The base URL the app is being served from.
   * This value is determined during build time.
   */
  readonly BASE_URL: string;
  /**
   * The mode the app is running in.
   * Usually, this is either `'development'` or `'production'`.
   */
  readonly MODE: string;
  /**
   * Indicates whether the app is running in development mode.
   * This is `true` when `mode` is equal to `'development'`, and `false` otherwise.
   */
  readonly DEV: boolean;
  /**
   * Indicates whether the app is running in production mode.
   * This is `true` when `mode` is equal to `'production'`, and `false` otherwise.
   */
  readonly PROD: boolean;
  /**
   * Indicates whether SSR is enabled.
   */
  readonly SSR: boolean;
  /**
   * Custom environment variables prefixed with `VITE_`.
   * These are defined in the `.env` files.
   */
  readonly VITE_API_BASE_URL: string;
  readonly VITE_MODEL_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}