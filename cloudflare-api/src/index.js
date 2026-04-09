function json(value, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function normalizeOrigin(origin) {
  return String(origin || "").trim().replace(/\/+$/, "");
}

function buildCorsHeaders(request, env) {
  const requestOrigin = normalizeOrigin(request.headers.get("origin"));
  const allowedOrigin = normalizeOrigin(env.CORS_ORIGIN);
  const allowOrigin = requestOrigin && requestOrigin === allowedOrigin ? requestOrigin : allowedOrigin || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
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
  } catch {
    return fallback;
  }
}

function rowToResponse(row) {
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

function readBearerToken(request) {
  const authHeader = String(request.headers.get("authorization") || "");
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return String(request.headers.get("x-admin-token") || "").trim();
}

function unauthorized(corsHeaders) {
  return json({ ok: false, error: "unauthorized" }, 401, corsHeaders);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = buildCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "banana-climbing-store-api" }, 200, corsHeaders);
    }

    if (url.pathname === "/api/submissions" && request.method === "POST") {
      let payload;
      try {
        payload = await request.json();
      } catch {
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
          record.client_id || null,
          record.source || "web",
          JSON.stringify(Array.isArray(record.scene) ? record.scene : []),
          record.level || null,
          record.shape0 || null,
          record.toe || null,
          record.instep || null,
          record.arch || null,
          record.heel || null,
          typeof record.street_size === "number" ? record.street_size : null,
          record.feel || null,
          record.recommended_brand || null,
          record.recommended_model || null,
          typeof record.recommended_size === "number" ? record.recommended_size : null,
          JSON.stringify(Array.isArray(record.alternative_models) ? record.alternative_models : []),
          Number.isFinite(Number(record.matched_count)) ? Number(record.matched_count) : 0,
          JSON.stringify(record.answers && typeof record.answers === "object" ? record.answers : {}),
          JSON.stringify(record.recommendation && typeof record.recommendation === "object" ? record.recommendation : {}),
          record.user_agent || "",
        )
        .run();

      return json({ ok: true }, 200, corsHeaders);
    }

    if (url.pathname === "/api/submissions" && request.method === "GET") {
      const token = readBearerToken(request);
      const adminToken = String(env.ADMIN_TOKEN || "").trim();
      if (!token || !adminToken || token !== adminToken) {
        return unauthorized(corsHeaders);
      }

      const limitParam = Number(url.searchParams.get("limit"));
      const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(500, limitParam)) : 200;
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

      const rows = Array.isArray(result?.results) ? result.results.map(rowToResponse) : [];
      return json({ ok: true, rows }, 200, corsHeaders);
    }

    return json({ ok: false, error: "not-found" }, 404, corsHeaders);
  },
};
