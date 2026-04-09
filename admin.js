const databaseApi = window.BananaDatabase || {};
const adminEmailInput = document.getElementById("adminEmail");
const adminPasswordInput = document.getElementById("adminPassword");
const adminLoginButton = document.getElementById("adminLogin");
const adminRefreshButton = document.getElementById("adminRefreshButton");
const adminLogoutButton = document.getElementById("adminLogout");
const adminExportButton = document.getElementById("adminExportButton");
const adminStatusText = document.getElementById("adminStatusText");
const adminPublicStatus = document.getElementById("adminPublicStatus");
const adminAuthStatus = document.getElementById("adminAuthStatus");
const adminStatsGrid = document.getElementById("adminStatsGrid");
const adminTableBody = document.getElementById("adminTableBody");
const adminRowCount = document.getElementById("adminRowCount");

let latestRows = [];

function getPublicConfig() {
  return typeof databaseApi.getPublicConfig === "function"
    ? databaseApi.getPublicConfig()
    : { provider: null, apiBaseUrl: "", supabaseUrl: "", supabaseAnonKey: "" };
}

function isCloudflareMode() {
  return getPublicConfig().provider === "cloudflare_api";
}

function escapeHtml(text) {
  return String(text == null ? "" : text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTextList(values) {
  return Array.isArray(values) && values.length ? values.join(" / ") : "-";
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "number") {
    return Number(value).toFixed(1).replace(".0", "");
  }

  return String(value);
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function countBy(getValue) {
  const counter = new Map();

  latestRows.forEach((row) => {
    const values = getValue(row);
    const list = Array.isArray(values) ? values : [values];
    list
      .filter(Boolean)
      .forEach((value) => counter.set(value, (counter.get(value) || 0) + 1));
  });

  return Array.from(counter.entries()).sort((left, right) => right[1] - left[1])[0];
}

function renderStats(rows) {
  const today = Date.now();
  const weeklyCount = rows.filter((row) => {
    const createdAt = new Date(row.created_at).getTime();
    return !Number.isNaN(createdAt) && today - createdAt <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const topScene = countBy((row) => row.scene);
  const topModel = countBy((row) => row.recommended_model);

  const stats = [
    {
      label: "总提交数",
      value: String(rows.length),
      note: "累计写入数据库的选码记录",
    },
    {
      label: "近 7 天",
      value: String(weeklyCount),
      note: "最近一周新增提交",
    },
    {
      label: "最高频场景",
      value: topScene ? topScene[0] : "-",
      note: topScene ? `出现 ${topScene[1]} 次` : "暂无数据",
    },
    {
      label: "最高频推荐",
      value: topModel ? topModel[0] : "-",
      note: topModel ? `出现 ${topModel[1]} 次` : "暂无数据",
    },
  ];

  adminStatsGrid.innerHTML = stats
    .map(
      (item) => `
        <article class="admin-stat-card">
          <p class="mini-kicker">${escapeHtml(item.label)}</p>
          <strong>${escapeHtml(item.value)}</strong>
          <p>${escapeHtml(item.note)}</p>
        </article>
      `,
    )
    .join("");
}

function renderRows(rows) {
  adminRowCount.textContent = `共 ${rows.length} 条`;

  if (!rows.length) {
    adminTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="admin-empty-cell">暂无可显示数据，请先在前台跑一次选码。</td>
      </tr>
    `;
    return;
  }

  adminTableBody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(formatDateTime(row.created_at))}</td>
          <td>${escapeHtml(formatTextList(row.scene))}</td>
          <td>${escapeHtml(
            [row.shape0, row.toe, row.instep, row.arch, row.heel].filter(Boolean).join(" / ") || "-",
          )}</td>
          <td>${escapeHtml(`EU ${formatValue(row.street_size)} / ${formatValue(row.feel)}`)}</td>
          <td>${escapeHtml(row.recommended_model ? `${row.recommended_brand || ""} ${row.recommended_model}`.trim() : "-")}</td>
          <td>${escapeHtml(row.recommended_size ? `EU ${formatValue(row.recommended_size)}` : "-")}</td>
        </tr>
      `,
    )
    .join("");
}

function syncPublicStatus() {
  const config = getPublicConfig();

  if (config.provider === "cloudflare_api") {
    adminPublicStatus.textContent = `数据后端：Cloudflare API（${config.apiBaseUrl}）`;
    return;
  }

  const hasSupabase = Boolean(config.supabaseUrl && config.supabaseAnonKey);
  adminPublicStatus.textContent = hasSupabase
    ? `数据后端：Supabase（${config.supabaseUrl}）`
    : "数据库未配置，请先在 database-config.js 中配置 Cloudflare API 或 Supabase。";
}

function syncAuthStatus() {
  const session = typeof databaseApi.readAdminSession === "function" ? databaseApi.readAdminSession() : null;
  const identity = session && session.user && session.user.email ? session.user.email : "";

  if (identity) {
    adminAuthStatus.textContent = `当前已登录：${identity}`;
    return;
  }

  adminAuthStatus.textContent = isCloudflareMode()
    ? "当前未登录。Cloudflare 模式下请输入管理员口令后登录。"
    : "当前未登录。Supabase 模式下请输入管理员邮箱和密码。";
}

function setStatus(message, tone) {
  adminStatusText.textContent = message;
  adminStatusText.dataset.tone = tone || "muted";
}

function normalizeRowsPayload(result) {
  if (Array.isArray(result?.rows)) {
    return result.rows;
  }

  if (Array.isArray(result)) {
    return result;
  }

  return [];
}

async function loadRows() {
  if (typeof databaseApi.fetchSizingResponses !== "function") {
    setStatus("数据库脚本未加载成功。", "danger");
    return;
  }

  setStatus("正在拉取数据...", "muted");

  try {
    const result = await databaseApi.fetchSizingResponses({ limit: 200 });
    if (result.skipped) {
      latestRows = [];
      renderStats(latestRows);
      renderRows(latestRows);

      if (result.reason === "missing-public-config") {
        setStatus("请先完成数据库配置。", "warn");
      } else {
        setStatus("请先登录管理员账号。", "warn");
      }
      return;
    }

    latestRows = normalizeRowsPayload(result);
    renderStats(latestRows);
    renderRows(latestRows);
    setStatus(`已同步 ${latestRows.length} 条记录。`, "success");
  } catch (error) {
    latestRows = [];
    renderStats(latestRows);
    renderRows(latestRows);
    setStatus(`读取失败：${error.message || error}`, "danger");
  }
}

function downloadCsv() {
  if (!latestRows.length || typeof databaseApi.rowsToCsv !== "function") {
    setStatus("当前没有可导出的数据。", "warn");
    return;
  }

  const csv = databaseApi.rowsToCsv(latestRows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `banana-sizing-data-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  setStatus("CSV 已导出。", "success");
}

async function loginAdmin() {
  if (typeof databaseApi.signInAdmin !== "function") {
    setStatus("当前环境不支持管理员登录。", "danger");
    return;
  }

  const email = String(adminEmailInput.value || "").trim();
  const password = String(adminPasswordInput.value || "");

  if (isCloudflareMode()) {
    if (!password) {
      setStatus("请输入管理员口令。", "warn");
      return;
    }
  } else if (!email || !password) {
    setStatus("请输入管理员邮箱和密码。", "warn");
    return;
  }

  setStatus("正在登录...", "muted");

  try {
    const result = await databaseApi.signInAdmin({ email, password });
    if (result.skipped) {
      setStatus("请先完成数据库配置。", "warn");
      return;
    }

    adminPasswordInput.value = "";
    syncAuthStatus();
    setStatus("登录成功。", "success");
    await loadRows();
  } catch (error) {
    setStatus(`登录失败：${error.message || error}`, "danger");
  }
}

function logoutAdmin() {
  if (typeof databaseApi.clearAdminSession === "function") {
    databaseApi.clearAdminSession();
  }

  latestRows = [];
  renderStats(latestRows);
  renderRows(latestRows);
  syncAuthStatus();
  setStatus("已退出登录。", "warn");
}

function setupCloudflareTokenHints() {
  if (!isCloudflareMode()) {
    return;
  }

  if (adminEmailInput) {
    adminEmailInput.value = "token-admin";
    adminEmailInput.placeholder = "标识（可选）";
  }

  if (adminPasswordInput) {
    adminPasswordInput.placeholder = "请输入管理员口令";
  }
}

if (
  adminEmailInput &&
  adminPasswordInput &&
  adminLoginButton &&
  adminRefreshButton &&
  adminLogoutButton &&
  adminExportButton &&
  adminStatusText &&
  adminPublicStatus &&
  adminAuthStatus &&
  adminStatsGrid &&
  adminTableBody &&
  adminRowCount
) {
  setupCloudflareTokenHints();
  syncPublicStatus();
  syncAuthStatus();
  renderStats([]);
  renderRows([]);

  adminLoginButton.addEventListener("click", () => {
    void loginAdmin();
  });

  adminPasswordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void loginAdmin();
    }
  });

  adminRefreshButton.addEventListener("click", () => {
    void loadRows();
  });

  adminLogoutButton.addEventListener("click", logoutAdmin);
  adminExportButton.addEventListener("click", downloadCsv);

  void loadRows();
}
