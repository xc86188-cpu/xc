(function () {
  const ADMIN_SESSION_STORAGE_KEY = "banana_admin_database_session_v2";
  const CLIENT_ID_STORAGE_KEY = "banana_database_client_id_v1";
  const PROVIDER_CLOUDFLARE_API = "cloudflare_api";
  const PROVIDER_SUPABASE = "supabase";

  function safeStorage(type) {
    try {
      return window[type];
    } catch (error) {
      return null;
    }
  }

  function safeParse(rawValue) {
    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch (error) {
      return null;
    }
  }

  function normalizeUrl(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function readConfig() {
    const raw = window.BANANA_DATABASE_CONFIG || {};

    return {
      apiBaseUrl: normalizeUrl(raw.apiBaseUrl),
      adminAuthMode: String(raw.adminAuthMode || "auto").trim().toLowerCase(),
      supabaseUrl: normalizeUrl(raw.supabaseUrl),
      supabaseAnonKey: String(raw.supabaseAnonKey || "").trim(),
      submissionsTable: String(raw.submissionsTable || "responses").trim() || "responses",
    };
  }

  function getProvider(configValue) {
    const config = configValue || readConfig();
    if (config.apiBaseUrl) {
      return PROVIDER_CLOUDFLARE_API;
    }

    if (config.supabaseUrl && config.supabaseAnonKey) {
      return PROVIDER_SUPABASE;
    }

    return null;
  }

  function getPublicConfig() {
    const config = readConfig();
    return {
      ...config,
      provider: getProvider(config),
    };
  }

  function hasPublicConfig() {
    return Boolean(getProvider(readConfig()));
  }

  function readAdminSession() {
    const storage = safeStorage("localStorage");
    if (!storage) {
      return null;
    }

    return safeParse(storage.getItem(ADMIN_SESSION_STORAGE_KEY));
  }

  function writeAdminSession(session) {
    const storage = safeStorage("localStorage");
    if (!storage) {
      return false;
    }

    storage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
    return true;
  }

  function clearAdminSession() {
    const storage = safeStorage("localStorage");
    if (!storage) {
      return false;
    }

    storage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    return true;
  }

  function buildSupabaseHeaders(key, extraHeaders) {
    return Object.assign(
      {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      extraHeaders || {},
    );
  }

  function buildSupabaseRestUrl(baseUrl, table, query) {
    return `${baseUrl}/rest/v1/${table}${query || ""}`;
  }

  function buildApiUrl(baseUrl, path, query) {
    return `${baseUrl}${path}${query || ""}`;
  }

  async function readErrorText(response) {
    try {
      return await response.text();
    } catch (error) {
      return "";
    }
  }

  async function insertViaCloudflareApi(config, record) {
    const response = await fetch(buildApiUrl(config.apiBaseUrl, "/api/submissions"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
      keepalive: true,
    });

    if (!response.ok) {
      const message = await readErrorText(response);
      throw new Error(message || `Cloudflare API insert failed with ${response.status}`);
    }

    return {
      ok: true,
      skipped: false,
    };
  }

  async function insertViaSupabase(config, record) {
    const response = await fetch(buildSupabaseRestUrl(config.supabaseUrl, config.submissionsTable), {
      method: "POST",
      headers: buildSupabaseHeaders(config.supabaseAnonKey, {
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      }),
      body: JSON.stringify(record),
      keepalive: true,
    });

    if (!response.ok) {
      const message = await readErrorText(response);
      throw new Error(message || `Database insert failed with ${response.status}`);
    }

    return {
      ok: true,
      skipped: false,
    };
  }

  async function insertSizingResponse(record) {
    const config = readConfig();
    const provider = getProvider(config);
    if (!provider) {
      return {
        ok: false,
        skipped: true,
        reason: "missing-public-config",
      };
    }

    if (provider === PROVIDER_CLOUDFLARE_API) {
      return insertViaCloudflareApi(config, record);
    }

    return insertViaSupabase(config, record);
  }

  async function signInAdminWithCloudflare(config, credentials) {
    const token = String(credentials.password || credentials.token || credentials.email || "").trim();
    if (!token) {
      throw new Error("Missing admin token");
    }

    const response = await fetch(buildApiUrl(config.apiBaseUrl, "/api/submissions", "?limit=1"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("Invalid admin token");
    }

    if (!response.ok) {
      const message = await readErrorText(response);
      throw new Error(message || `Cloudflare API sign-in failed with ${response.status}`);
    }

    const adminLabel = String(credentials.email || "").trim() || "token-admin";
    const session = {
      provider: PROVIDER_CLOUDFLARE_API,
      access_token: token,
      user: {
        email: adminLabel,
      },
      created_at: Date.now(),
    };

    writeAdminSession(session);
    return {
      ok: true,
      skipped: false,
      session,
    };
  }

  async function signInAdminWithSupabase(config, credentials) {
    const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: buildSupabaseHeaders(config.supabaseAnonKey, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        email: String(credentials.email || "").trim(),
        password: String(credentials.password || ""),
      }),
    });

    if (!response.ok) {
      const message = await readErrorText(response);
      throw new Error(message || `Admin sign-in failed with ${response.status}`);
    }

    const session = await response.json();
    session.provider = PROVIDER_SUPABASE;
    writeAdminSession(session);
    return {
      ok: true,
      skipped: false,
      session,
    };
  }

  async function signInAdmin(credentials) {
    const config = readConfig();
    const provider = getProvider(config);
    if (!provider) {
      return {
        ok: false,
        skipped: true,
        reason: "missing-public-config",
      };
    }

    if (provider === PROVIDER_CLOUDFLARE_API) {
      return signInAdminWithCloudflare(config, credentials || {});
    }

    return signInAdminWithSupabase(config, credentials || {});
  }

  async function refreshSupabaseSession(config, session) {
    const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: buildSupabaseHeaders(config.supabaseAnonKey, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        refresh_token: session.refresh_token,
      }),
    });

    if (!response.ok) {
      clearAdminSession();
      return null;
    }

    const nextSession = await response.json();
    nextSession.provider = PROVIDER_SUPABASE;
    writeAdminSession(nextSession);
    return nextSession;
  }

  async function getAdminAccessToken() {
    const config = readConfig();
    const session = readAdminSession();
    if (!session || !session.access_token) {
      return null;
    }

    if (session.provider === PROVIDER_CLOUDFLARE_API || getProvider(config) === PROVIDER_CLOUDFLARE_API) {
      return session.access_token;
    }

    if (!config.supabaseUrl || !config.supabaseAnonKey || !session.refresh_token) {
      return null;
    }

    if (session.expires_at && Number(session.expires_at) * 1000 <= Date.now() + 30 * 1000) {
      const refreshed = await refreshSupabaseSession(config, session);
      return refreshed ? refreshed.access_token : null;
    }

    return session.access_token;
  }

  async function fetchViaCloudflareApi(config, accessToken, limit) {
    const response = await fetch(buildApiUrl(config.apiBaseUrl, "/api/submissions", `?limit=${limit}`), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      clearAdminSession();
      return {
        ok: false,
        skipped: true,
        reason: "expired-admin-session",
        rows: [],
      };
    }

    if (!response.ok) {
      const message = await readErrorText(response);
      throw new Error(message || `Cloudflare API query failed with ${response.status}`);
    }

    const payload = await response.json();
    const rows = Array.isArray(payload?.rows) ? payload.rows : [];
    return {
      ok: true,
      skipped: false,
      rows,
    };
  }

  async function fetchViaSupabase(config, accessToken, limit) {
    const query = `?select=*&order=created_at.desc&limit=${limit}`;
    const response = await fetch(buildSupabaseRestUrl(config.supabaseUrl, config.submissionsTable, query), {
      method: "GET",
      headers: buildSupabaseHeaders(config.supabaseAnonKey, {
        Authorization: `Bearer ${accessToken}`,
      }),
    });

    if (response.status === 401) {
      clearAdminSession();
      return {
        ok: false,
        skipped: true,
        reason: "expired-admin-session",
        rows: [],
      };
    }

    if (!response.ok) {
      const message = await readErrorText(response);
      throw new Error(message || `Database query failed with ${response.status}`);
    }

    const rows = await response.json();
    return {
      ok: true,
      skipped: false,
      rows: Array.isArray(rows) ? rows : [],
    };
  }

  async function fetchSizingResponses(options) {
    const settings = options || {};
    const limit = Math.max(1, Math.min(500, Number(settings.limit) || 150));
    const config = readConfig();
    const provider = getProvider(config);

    if (!provider) {
      return {
        ok: false,
        skipped: true,
        reason: "missing-public-config",
        rows: [],
      };
    }

    const accessToken = await getAdminAccessToken();
    if (!accessToken) {
      return {
        ok: false,
        skipped: true,
        reason: "missing-admin-session",
        rows: [],
      };
    }

    if (provider === PROVIDER_CLOUDFLARE_API) {
      return fetchViaCloudflareApi(config, accessToken, limit);
    }

    return fetchViaSupabase(config, accessToken, limit);
  }

  function escapeCsvValue(value) {
    if (value === null || value === undefined) {
      return "";
    }

    const text =
      Array.isArray(value) || (typeof value === "object" && value !== null)
        ? JSON.stringify(value)
        : String(value);

    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  }

  function rowsToCsv(rows) {
    const columns = [
      "created_at",
      "client_id",
      "source",
      "scene",
      "level",
      "shape0",
      "toe",
      "instep",
      "arch",
      "heel",
      "street_size",
      "feel",
      "recommended_brand",
      "recommended_model",
      "recommended_size",
      "alternative_models",
      "matched_count",
      "answers",
      "recommendation",
      "user_agent",
    ];

    const header = columns.join(",");
    const body = (rows || []).map((row) => columns.map((column) => escapeCsvValue(row[column])).join(","));
    return [header].concat(body).join("\n");
  }

  function createRandomId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `banana-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }

  function getOrCreateClientId() {
    const storage = safeStorage("localStorage");
    if (!storage) {
      return createRandomId();
    }

    const current = String(storage.getItem(CLIENT_ID_STORAGE_KEY) || "").trim();
    if (current) {
      return current;
    }

    const next = createRandomId();
    storage.setItem(CLIENT_ID_STORAGE_KEY, next);
    return next;
  }

  window.BananaDatabase = {
    getPublicConfig,
    hasPublicConfig,
    readAdminSession,
    clearAdminSession,
    signInAdmin,
    fetchSizingResponses,
    rowsToCsv,
    getOrCreateClientId,
  };
})();
