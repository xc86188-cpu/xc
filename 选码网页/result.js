const core = window.BananaClimbingCore || {};
const RESULT_STORAGE_KEY = core.RESULT_STORAGE_KEY || "banana_climbing_result_payload_v2";
const STATE_STORAGE_KEY = core.STATE_STORAGE_KEY || "banana_climbing_result_state_v2";
const RESULT_STATE_HASH_PREFIX = core.RESULT_STATE_HASH_PREFIX || "#state=";
const RESULT_PAYLOAD_HASH_PREFIX = core.RESULT_PAYLOAD_HASH_PREFIX || "#payload=";

const FEEL_LABELS = {
  performance_plus: "极致包裹",
  performance: "适当包裹",
  balanced: "平衡推荐",
  comfort: "适当舒适",
  comfort_plus: "极致舒适",
};

const resultPageSummary = document.getElementById("resultPageSummary");
const resultPagePrimary = document.getElementById("resultPagePrimary");
const resultPageAlternatives = document.getElementById("resultPageAlternatives");
const resultPageEmpty = document.getElementById("resultPageEmpty");
const resultPageBody = document.getElementById("resultPageBody");
const resultRestartButton = document.getElementById("resultRestartButton");

const hasResultPageDom = Boolean(
  resultPageSummary && resultPagePrimary && resultPageAlternatives && resultPageEmpty && resultPageBody,
);

function getStorageArea(type) {
  try {
    return window[type];
  } catch (error) {
    return null;
  }
}

function safeParse(rawValue) {
  if (typeof core.safeParse === "function") {
    return core.safeParse(rawValue);
  }

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
}

function decodeBase64Unicode(rawValue) {
  if (typeof core.decodeBase64Unicode === "function") {
    return core.decodeBase64Unicode(rawValue);
  }

  if (!rawValue) {
    return null;
  }

  try {
    const normalized = rawValue.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "+");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return decodeURIComponent(escape(window.atob(padded)));
  } catch (error) {
    return null;
  }
}

function readStorageState(storage) {
  if (!storage) {
    return null;
  }

  try {
    return safeParse(storage.getItem(STATE_STORAGE_KEY));
  } catch (error) {
    return null;
  }
}

function readStoragePayload(storage) {
  if (!storage) {
    return null;
  }

  try {
    return safeParse(storage.getItem(RESULT_STORAGE_KEY));
  } catch (error) {
    return null;
  }
}

function readBridgeState() {
  const bridge = safeParse(window.name);
  if (!bridge || !bridge.resultState) {
    return null;
  }

  return bridge.resultState;
}

function readHashState() {
  const hash = window.location.hash || "";
  if (!hash.startsWith(RESULT_STATE_HASH_PREFIX)) {
    return null;
  }

  const decoded = decodeBase64Unicode(hash.slice(RESULT_STATE_HASH_PREFIX.length));
  return safeParse(decoded);
}

function readHashPayload() {
  const hash = window.location.hash || "";
  if (!hash.startsWith(RESULT_PAYLOAD_HASH_PREFIX)) {
    return null;
  }

  const decoded = decodeBase64Unicode(hash.slice(RESULT_PAYLOAD_HASH_PREFIX.length));
  return safeParse(decoded);
}

function persistStateSnapshot(snapshot) {
  const serializedState = JSON.stringify(snapshot);

  try {
    window.sessionStorage.setItem(STATE_STORAGE_KEY, serializedState);
  } catch (error) {
    // Ignore locked-down environments.
  }

  try {
    window.localStorage.setItem(STATE_STORAGE_KEY, serializedState);
  } catch (error) {
    // Ignore locked-down environments.
  }

  try {
    window.name = JSON.stringify({
      resultState: snapshot,
    });
  } catch (error) {
    // Ignore.
  }
}

function readResultState() {
  const hashState = readHashState();
  if (hashState) {
    persistStateSnapshot(hashState);
    return hashState;
  }

  const sessionState = readStorageState(getStorageArea("sessionStorage"));
  if (sessionState) {
    return sessionState;
  }

  const localState = readStorageState(getStorageArea("localStorage"));
  if (localState) {
    return localState;
  }

  return readBridgeState();
}

function readStoredPayload() {
  const hashPayload = readHashPayload();
  if (hashPayload) {
    return hashPayload;
  }

  const sessionPayload = readStoragePayload(getStorageArea("sessionStorage"));
  if (sessionPayload) {
    return sessionPayload;
  }

  const localPayload = readStoragePayload(getStorageArea("localStorage"));
  if (localPayload) {
    return localPayload;
  }

  const bridge = safeParse(window.name);
  if (bridge && bridge.resultPayload) {
    return bridge.resultPayload;
  }

  return null;
}

function clearStoredResultData() {
  if (typeof core.clearStoredResultData === "function") {
    core.clearStoredResultData();
    return;
  }

  try {
    window.sessionStorage.removeItem(RESULT_STORAGE_KEY);
    window.sessionStorage.removeItem(STATE_STORAGE_KEY);
  } catch (error) {
    // Ignore.
  }

  try {
    window.localStorage.removeItem(RESULT_STORAGE_KEY);
    window.localStorage.removeItem(STATE_STORAGE_KEY);
  } catch (error) {
    // Ignore.
  }

  try {
    window.name = "";
  } catch (error) {
    // Ignore.
  }
}

function formatSize(value) {
  return Number(value).toFixed(1).replace(".0", "");
}

function buildFallbackSummary(state) {
  if (!state) {
    return "根据上一页选择生成的推荐结果。";
  }

  const parts = [];

  if (state.streetSize !== null && state.streetSize !== undefined && !Number.isNaN(Number(state.streetSize))) {
    parts.push(`平时 EU ${formatSize(state.streetSize)}`);
  }

  if (state.feel && FEEL_LABELS[state.feel]) {
    parts.push(`脚感 ${FEEL_LABELS[state.feel]}`);
  }

  return parts.length ? parts.join(" · ") : "根据上一页选择生成的推荐结果。";
}

function buildFallbackAlternatives() {
  return `
    <article class="alt-card">
      <h3>暂无更多备选</h3>
      <p class="alt-note">当前条件下，系统优先展示最贴近的一组推荐。</p>
    </article>
  `;
}

function buildPayloadFromState(snapshot) {
  if (!snapshot || typeof core.computeResultPayloadFromSnapshot !== "function") {
    return null;
  }

  try {
    return core.computeResultPayloadFromSnapshot(snapshot);
  } catch (error) {
    return null;
  }
}

function hasRenderablePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return Boolean(
    (typeof payload.summaryText === "string" && payload.summaryText.trim()) ||
      (typeof payload.primaryHtml === "string" && payload.primaryHtml.trim()) ||
      (typeof payload.alternativesHtml === "string" && payload.alternativesHtml.trim()),
  );
}

function showEmptyState() {
  resultPageEmpty.hidden = false;
  resultPageBody.hidden = true;
  resultPageSummary.textContent = "";
}

function showResultState(payload, state) {
  resultPageEmpty.hidden = true;
  resultPageBody.hidden = false;
  resultPageSummary.textContent = payload.summaryText || buildFallbackSummary(state);
  resultPagePrimary.innerHTML = payload.primaryHtml || "";
  resultPageAlternatives.innerHTML = payload.alternativesHtml || buildFallbackAlternatives();
  window.scrollTo(0, 0);
}

function bindActions() {
  if (resultRestartButton) {
    resultRestartButton.addEventListener("click", () => {
      clearStoredResultData();
    });
  }
}

function initResultPage() {
  if (!hasResultPageDom) {
    return;
  }

  bindActions();

  const snapshot = readResultState();
  const storedPayload = readStoredPayload();
  const computedPayload = snapshot ? buildPayloadFromState(snapshot) : null;
  const payload = hasRenderablePayload(computedPayload)
    ? computedPayload
    : hasRenderablePayload(storedPayload)
      ? storedPayload
      : null;

  if (!payload) {
    showEmptyState();
    return;
  }

  showResultState(payload, snapshot);
}

initResultPage();
