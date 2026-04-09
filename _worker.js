function json(value, status = 200, headers = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

function normalizeOrigin(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function parseAllowedOrigins(rawValue) {
  const list = String(rawValue || "")
    .split(",")
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);

  return Array.from(new Set(list));
}

function buildCorsHeaders(request, env) {
  const requestOrigin = normalizeOrigin(request.headers.get("origin"));
  const allowedOrigins = parseAllowedOrigins(env.CORS_ORIGIN);
  const firstAllowedOrigin = allowedOrigins[0] || "";
  const safeOrigin = requestOrigin && allowedOrigins.includes(requestOrigin) ? requestOrigin : firstAllowedOrigin || "*";

  return {
    "Access-Control-Allow-Origin": safeOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function parseJsonField(value, fallback) {
  if (value == null || value === "") {
    return fallback;
  }

  try {
    return JSON.parse(String(value));
  } catch (error) {
    return fallback;
  }
}

function rowToSubmission(row) {
  return {
    created_at: row.created_at,
    client_id: row.client_id,
    source: row.source,
    scene: parseJsonField(row.scene, []),
    level: row.level,
    shape0: row.shape0,
    toe: row.toe,
    instep: row.instep,
    arch: row.arch,
    heel: row.heel,
    street_size: row.street_size,
    feel: row.feel,
    recommended_brand: row.recommended_brand,
    recommended_model: row.recommended_model,
    recommended_size: row.recommended_size,
    alternative_models: parseJsonField(row.alternative_models, []),
    matched_count: row.matched_count,
    answers: parseJsonField(row.answers, {}),
    recommendation: parseJsonField(row.recommendation, {}),
    user_agent: row.user_agent,
  };
}

function readAdminToken(request) {
  const authHeader = String(request.headers.get("authorization") || "");
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return "";
}

function toSafeString(value) {
  return value == null ? null : String(value);
}

function toSafeNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toJsonText(value, fallback) {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return JSON.stringify(value);
  }

  return JSON.stringify(fallback);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function safeIsoTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

function randomHex(bytes = 32) {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, (item) => item.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(String(text || ""));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (item) => item.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left, right) {
  const leftText = String(left || "");
  const rightText = String(right || "");
  if (!leftText || !rightText || leftText.length !== rightText.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < leftText.length; index += 1) {
    mismatch |= leftText.charCodeAt(index) ^ rightText.charCodeAt(index);
  }

  return mismatch === 0;
}

async function cleanupExpiredAdminSessions(env, nowIso) {
  await env.DB.prepare(`DELETE FROM admin_sessions WHERE expires_at <= ?`).bind(nowIso).run();
}

async function verifyAdminCredentials(env, email, password) {
  const normalizedEmail = normalizeEmail(email);
  const passwordText = String(password || "");
  if (!normalizedEmail || !passwordText) {
    return null;
  }

  const row = await env.DB.prepare(
    `
      SELECT email, password_hash, password_salt, is_active
      FROM admin_users
      WHERE email = ?
      LIMIT 1
    `,
  )
    .bind(normalizedEmail)
    .first();

  if (!row || Number(row.is_active) !== 1) {
    return null;
  }

  const salt = String(row.password_salt || "");
  const storedHash = String(row.password_hash || "").toLowerCase();
  if (!salt || !storedHash) {
    return null;
  }

  const incomingHash = await sha256Hex(`${salt}:${passwordText}`);
  if (!safeEqual(storedHash, incomingHash)) {
    return null;
  }

  return {
    email: normalizedEmail,
  };
}

async function createAdminSession(env, adminEmail) {
  const now = Date.now();
  const expiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
  const sessionToken = randomHex(32);

  await env.DB.prepare(
    `
      INSERT INTO admin_sessions (session_token, admin_email, expires_at)
      VALUES (?, ?, ?)
    `,
  )
    .bind(sessionToken, normalizeEmail(adminEmail), expiresAt)
    .run();

  return {
    access_token: sessionToken,
    expires_at: expiresAt,
    user: {
      email: normalizeEmail(adminEmail),
    },
    provider: "cloudflare_api",
    created_at: now,
  };
}

async function authorizeAdmin(request, env) {
  const token = readAdminToken(request);
  if (!token) {
    return {
      ok: false,
      reason: "missing-token",
    };
  }

  const nowIso = new Date().toISOString();

  const legacyToken = String(env.ADMIN_TOKEN || "").trim();
  if (legacyToken && safeEqual(token, legacyToken)) {
    return {
      ok: true,
      identity: "legacy-token-admin",
    };
  }

  await cleanupExpiredAdminSessions(env, nowIso);

  const row = await env.DB.prepare(
    `
      SELECT s.admin_email, s.expires_at, u.is_active
      FROM admin_sessions s
      LEFT JOIN admin_users u ON u.email = s.admin_email
      WHERE s.session_token = ?
      LIMIT 1
    `,
  )
    .bind(token)
    .first();

  if (!row) {
    return {
      ok: false,
      reason: "invalid-session",
    };
  }

  const expiresAt = safeIsoTime(row.expires_at);
  if (!expiresAt || expiresAt <= nowIso) {
    await env.DB.prepare(`DELETE FROM admin_sessions WHERE session_token = ?`).bind(token).run();
    return {
      ok: false,
      reason: "expired-session",
    };
  }

  if (Number(row.is_active) !== 1) {
    return {
      ok: false,
      reason: "inactive-admin",
    };
  }

  return {
    ok: true,
    identity: String(row.admin_email || ""),
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = buildCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === "/api/health") {
      return json(
        {
          ok: true,
          service: "banana-climbing-store-pages-api",
        },
        200,
        corsHeaders,
      );
    }

    if (url.pathname === "/api/admin/login" && request.method === "POST") {
      let payload;
      try {
        payload = await request.json();
      } catch (error) {
        return json({ ok: false, error: "invalid-json" }, 400, corsHeaders);
      }

      const email = normalizeEmail(payload?.email);
      const password = String(payload?.password || "");
      if (!email || !password) {
        return json({ ok: false, error: "missing-credentials" }, 400, corsHeaders);
      }

      const nowIso = new Date().toISOString();
      await cleanupExpiredAdminSessions(env, nowIso);

      const admin = await verifyAdminCredentials(env, email, password);
      if (!admin) {
        return json({ ok: false, error: "unauthorized" }, 401, corsHeaders);
      }

      const session = await createAdminSession(env, admin.email);
      return json({ ok: true, session }, 200, corsHeaders);
    }

    if (url.pathname === "/api/submissions" && request.method === "POST") {
      let payload;
      try {
        payload = await request.json();
      } catch (error) {
        return json({ ok: false, error: "invalid-json" }, 400, corsHeaders);
      }

      const record = payload && typeof payload === "object" ? payload : {};

      await env.DB.prepare(
        `
          INSERT INTO responses (
            client_id, source, scene, level, shape0, toe, instep, arch, heel,
            street_size, feel, recommended_brand, recommended_model, recommended_size,
            alternative_models, matched_count, answers, recommendation, user_agent
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
        .bind(
          toSafeString(record.client_id),
          toSafeString(record.source) || "web",
          toJsonText(record.scene, []),
          toSafeString(record.level),
          toSafeString(record.shape0),
          toSafeString(record.toe),
          toSafeString(record.instep),
          toSafeString(record.arch),
          toSafeString(record.heel),
          toSafeNumber(record.street_size),
          toSafeString(record.feel),
          toSafeString(record.recommended_brand),
          toSafeString(record.recommended_model),
          toSafeNumber(record.recommended_size),
          toJsonText(record.alternative_models, []),
          Number.isFinite(Number(record.matched_count)) ? Number(record.matched_count) : 0,
          toJsonText(record.answers, {}),
          toJsonText(record.recommendation, {}),
          toSafeString(record.user_agent) || "",
        )
        .run();

      return json({ ok: true }, 200, corsHeaders);
    }

    if (url.pathname === "/api/submissions" && request.method === "GET") {
      const auth = await authorizeAdmin(request, env);
      if (!auth.ok) {
        return json({ ok: false, error: "unauthorized" }, 401, corsHeaders);
      }

      const limitRaw = Number(url.searchParams.get("limit"));
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(500, limitRaw)) : 200;

      const result = await env.DB.prepare(
        `
          SELECT
            created_at, client_id, source, scene, level, shape0, toe, instep, arch, heel,
            street_size, feel, recommended_brand, recommended_model, recommended_size,
            alternative_models, matched_count, answers, recommendation, user_agent
          FROM responses
          ORDER BY created_at DESC
          LIMIT ?
        `,
      )
        .bind(limit)
        .all();

      const rows = Array.isArray(result?.results) ? result.results.map(rowToSubmission) : [];
      return json({ ok: true, rows }, 200, corsHeaders);
    }

    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }

    return json({ ok: false, error: "not-found" }, 404, corsHeaders);
  },
};
