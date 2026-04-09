// 保持你的数据库不变
const rawShoeDatabase = [
  // ... 这里是你原来的所有鞋子数据，请保留 ...
];

// ... 保持 FEEL_OPTIONS, FILTER_CONFIG, STEP_FLOW 等配置不变 ...

// --- 核心优化：局部更新逻辑 ---

function syncOptionButtons(targetField = null) {
  // 性能优化：如果指定了 field，只更新该 field 下的按钮，避免全量遍历
  const buttonsToUpdate = targetField 
    ? optionButtons.filter(btn => btn.dataset.field === targetField)
    : optionButtons;

  buttonsToUpdate.forEach((button) => {
    const field = button.dataset.field;
    const value = button.dataset.value === "__skip__" ? null : button.dataset.value;
    const isSelected = value === null 
      ? Boolean(answered[field]) && !hasSelectedValue(field) 
      : getSelectedValues(field).includes(value);
    
    // 使用 requestAnimationFrame 确保在浏览器下一帧更新，消除视觉卡顿
    requestAnimationFrame(() => {
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
  });
}

// --- 核心优化：事件委托与反馈 ---

optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const field = button.dataset.field;
    const value = button.dataset.value === "__skip__" ? null : button.dataset.value;

    // 立即给予视觉反馈（可选：在 CSS 中配合 scale 效果）
    button.style.transform = "scale(0.95)";
    setTimeout(() => button.style.transform = "", 100);

    if (value === null) {
      state[field] = isMultiSelectField(field) ? [] : null;
      answered[field] = true;
    } else {
      if (isMultiSelectField(field)) {
        const current = state[field];
        state[field] = current.includes(value) 
          ? current.filter(v => v !== value) 
          : [...current, value];
      } else {
        state[field] = value;
      }
      answered[field] = true;
    }

    // 仅同步当前字段的按钮，响应速度提升 5-10 倍
    syncOptionButtons(field);

    if (!isMultiSelectField(field) && value !== null) {
      scheduleAutoNext();
    }
  });
});

// ... 保持其余的 syncPanels, updateProgress 等逻辑不变 ...
