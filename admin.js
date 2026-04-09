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

function escapeHtml(text) {
  return String(text == null ? "" : text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTextList(values) {
  return Array.isArray(values) && values.length ? values.join(" / ") : "—";
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    return Number(value).toFixed(1).replace(".0", "");
  }

  return String(value);
}

function formatDateTime(value) {
  if (!value) {
    return "—";
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
      note: "最近一周新增的提交",
    },
    {
      label: "最高频场景",
      value: topScene ? topScene[0] : "—",
      note: topScene ? `出现 ${topScene[1]} 次` : "暂时还没有数据",
    },
    {
      label: "最高频推荐",
      value: topModel ? topModel[0] : "—",
      note: topModel ? `出现 ${topModel[1]} 次` : "暂时还没有数据",
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
        <td colspan="6" class="admin-empty-cell">还没有可显示的数据，先让用户在网页上跑一次选码。</td>
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
            [row.shape0, row.toe, row.instep, row.arch, row.heel].filter(Boolean).join(" / ") || "—",
          )}</td>
          <td>${escapeHtml(`EU ${formatValue(row.street_size)} · ${formatValue(row.feel)}`)}</td>
          <td>${escapeHtml(
            row.recommended_model ? `${row.recommended_brand || ""} ${row.recommended_model}`.trim() : "—",
          )}</td>
          <td>${escapeHtml(row.recommended_size ? `EU ${formatValue(row.recommended_size)}` : "—")}</td>
        </tr>
      `,
    )
    .join("");
}

function syncPublicStatus() {
  const publicConfig =
    typeof databaseApi.getPublicConfig === "function"
      ? databaseApi.getPublicConfig()
      : { supabaseUrl: "", supabaseAnonKey: "" };
  const hasPublicConfig = Boolean(publicConfig.supabaseUrl && publicConfig.supabaseAnonKey);

  adminPublicStatus.textContent = hasPublicConfig
    ? `前台写入已配置：${publicConfig.supabaseUrl}`
    : "前台写入还没接好：请先在 database-config.js 里填写 Supabase Project URL 和 anon key。";
}

function syncAuthStatus() {
  const session = typeof databaseApi.readAdminSession === "function" ? databaseApi.readAdminSession() : null;
  const email = session && session.user && session.user.email ? session.user.email : "";

  adminAuthStatus.textContent = email
    ? `当前后台账号：${email}`
    : "当前还没有管理员登录。请先在 Supabase Authentication 里创建一个管理员账号，再回来登录。";
}

function setStatus(message, tone) {
  adminStatusText.textContent = message;
  adminStatusText.dataset.tone = tone || "muted";
}

async function loadRows() {
  if (typeof databaseApi.fetchSizingResponses !== "function") {
    setStatus("数据库脚本还没有加载成功。", "danger");
    return;
  }

  setStatus("正在拉取数据库记录...", "muted");

  try {
    const result = await databaseApi.fetchSizingResponses({ limit: 200 });
    if (result.skipped) {
      latestRows = [];
      renderStats(latestRows);
      renderRows(latestRows);

      if (result.reason === "missing-public-config") {
        setStatus("还没填 Supabase Project URL 和 anon key。", "warn");
      } else {
        setStatus("请先登录管理员账号后再查看数据。", "warn");
      }
      return;
    }

    latestRows = result.rows || [];
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
    setStatus("当前还不能登录后台。", "danger");
    return;
  }

  const email = String(adminEmailInput.value || "").trim();
  const password = String(adminPasswordInput.value || "");

  if (!email || !password) {
    setStatus("请先输入后台账号邮箱和密码。", "warn");
    return;
  }

  setStatus("正在登录管理员账号...", "muted");

  try {
    const result = await databaseApi.signInAdmin({ email, password });
    if (result.skipped) {
      setStatus("请先在 database-config.js 中填写 Supabase Project URL 和 anon key。", "warn");
      return;
    }

    adminPasswordInput.value = "";
    syncAuthStatus();
    setStatus("管理员登录成功。", "success");
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
  setStatus("管理员账号已退出。", "warn");
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
