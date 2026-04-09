(function () {
  const ADMIN_SESSION_STORAGE_KEY = "banana_admin_supabase_session_v1";
  const CLIENT_ID_STORAGE_KEY = "banana_database_client_id_v1";

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
      supabaseUrl: normalizeUrl(raw.supabaseUrl),
      supabaseAnonKey: String(raw.supabaseAnonKey || "").trim(),
      submissionsTable: String(raw.submissionsTable || "responses").trim() || "responses",
    };
  }

  function getPublicConfig() {
    return readConfig();
  }

  function hasPublicConfig() {
    const config = readConfig();
    return Boolean(config.supabaseUrl && config.supabaseAnonKey);
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

  function buildHeaders(key, extraHeaders) {
    return Object.assign(
      {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      extraHeaders || {},
    );
  }

  function buildRestUrl(baseUrl, table, query) {
    return `${baseUrl}/rest/v1/${table}${query || ""}`;
  }

  async function readErrorText(response) {
    try {
      return await response.text();
    } catch (error) {
      return "";
    }
  }

  async function insertSizingResponse(record) {
    const config = readConfig();
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      return {
        ok: false,
        skipped: true,
        reason: "missing-public-config",
      };
    }

    const response = await fetch(buildRestUrl(config.supabaseUrl, config.submissionsTable), {
      method: "POST",
      headers: buildHeaders(config.supabaseAnonKey, {
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

  async function signInAdmin(credentials) {
    const config = readConfig();
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      return {
        ok: false,
        skipped: true,
        reason: "missing-public-config",
      };
    }

    const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: buildHeaders(config.supabaseAnonKey, {
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
    writeAdminSession(session);
    return {
      ok: true,
      skipped: false,
      session,
    };
  }

  async function refreshAdminSession() {
    const config = readConfig();
    const session = readAdminSession();

    if (!config.supabaseUrl || !config.supabaseAnonKey || !session || !session.refresh_token) {
      return null;
    }

    const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: buildHeaders(config.supabaseAnonKey, {
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
    writeAdminSession(nextSession);
    return nextSession;
  }

  async function getAdminAccessToken() {
    const session = readAdminSession();
    if (!session || !session.access_token) {
      return null;
    }

    if (session.expires_at && Number(session.expires_at) * 1000 <= Date.now() + 30 * 1000) {
      const refreshed = await refreshAdminSession();
      return refreshed ? refreshed.access_token : null;
    }

    return session.access_token;
  }

  async function fetchSizingResponses(options) {
    const settings = options || {};
    const limit = Math.max(1, Math.min(500, Number(settings.limit) || 150));
    const config = readConfig();
    const accessToken = await getAdminAccessToken();

    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      return {
        ok: false,
        skipped: true,
        reason: "missing-public-config",
        rows: [],
      };
    }

    if (!accessToken) {
      return {
        ok: false,
        skipped: true,
        reason: "missing-admin-session",
        rows: [],
      };
    }

    const query = `?select=*&order=created_at.desc&limit=${limit}`;
    const response = await fetch(buildRestUrl(config.supabaseUrl, config.submissionsTable, query), {
      method: "GET",
      headers: buildHeaders(config.supabaseAnonKey, {
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
