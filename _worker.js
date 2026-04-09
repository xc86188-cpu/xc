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

function buildCorsHeaders(request, env) {
  const requestOrigin = normalizeOrigin(request.headers.get("origin"));
  const allowOrigin = normalizeOrigin(env.CORS_ORIGIN);
  const safeOrigin = requestOrigin && requestOrigin === allowOrigin ? requestOrigin : allowOrigin || "*";

  return {
    "Access-Control-Allow-Origin": safeOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
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

  return String(request.headers.get("x-admin-token") || "").trim();
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
      const token = readAdminToken(request);
      const expectedToken = String(env.ADMIN_TOKEN || "").trim();
      if (!token || !expectedToken || token !== expectedToken) {
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
