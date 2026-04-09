window.BANANA_DATABASE_CONFIG = window.BANANA_DATABASE_CONFIG || {
  // Cloudflare Pages API (primary)
  apiBaseUrl: "https://banana-climbing-store.pages.dev",
  adminAuthMode: "token",

  // Supabase fallback (optional)
  supabaseUrl: "",
  supabaseAnonKey: "",
  submissionsTable: "responses",
};
