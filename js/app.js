(() => {
  const STORAGE_KEYS = {
    profile: "slimspark.profile",
    checkins: "slimspark.checkins",
    checkinRecords: "slimspark.checkinRecords",
    exercisePlans: "slimspark.exercisePlans",
    exerciseRoutine: "slimspark.exerciseRoutine",
    mealPresets: "slimspark.mealPresets",
    mealPhotos: "slimspark.mealPhotos",
    aiVisitorId: "slimspark.aiVisitorId",
    schedule: "slimspark.schedule",
    weeklyPlan: "slimspark.weeklyPlan",
    bodyMetrics: "slimspark.bodyMetrics",
    dormChallenge: "slimspark.dormChallenge",
    dormChallengeReports: "slimspark.dormChallengeReports",
  };
  // checkins: 已完成三项的日期；checkinRecords: 按日期保存的完整打卡明细
  // exercisePlans: 按日期保存从动作库额外加入的今日计划
  // exerciseRoutine: 用户维护的每日训练清单
  // mealPresets: 每个餐次由用户维护的快捷菜品
  // mealPhotos: 按日期 + 餐次保存的本机拍照记录，仅保留最近 7 天
  const weightFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 });
  const calorieFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
  const weeklyRateFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 });
  const dateFormatter = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric" });
  const weekdayFormatter = new Intl.DateTimeFormat("zh-CN", { weekday: "long" });
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const dialogTriggers = new WeakMap();

  const rememberDialogTrigger = (dialog) => {
    if (dialog && document.activeElement instanceof HTMLElement) {
      dialogTriggers.set(dialog, document.activeElement);
    }
  };

  const restoreDialogTrigger = (dialog, fallback = null) => {
    const stored = dialogTriggers.get(dialog);
    const target = stored?.isConnected ? stored : fallback;

    dialogTriggers.delete(dialog);

    if (target) {
      target.focus({ preventScroll: true });
    }
  };

  const elements = {
    date: document.getElementById("home-date"),
    greeting: document.getElementById("home-greeting"),
    profileGuide: document.getElementById("profile-guide"),
    currentWeight: document.getElementById("current-weight"),
    targetWeight: document.getElementById("target-weight"),
    progressPercent: document.getElementById("progress-percent"),
    progressRing: document.getElementById("weight-ring-value"),
    weightDelta: document.getElementById("weight-delta"),
    weightNote: document.getElementById("weight-note"),
    streakCount: document.getElementById("streak-count"),
    streakNote: document.getElementById("streak-note"),
    todayPlanCount: document.getElementById("today-plan-count"),
    todayPlanList: document.getElementById("today-plan-list"),
    todayPlanCard: document.getElementById("today-plan-card"),
    todayPlanComplete: document.getElementById("today-plan-complete"),
    todayPlanFeedback: document.getElementById("today-plan-feedback"),
    carryoverCard: document.getElementById("carryover-card"),
    carryoverTag: document.getElementById("carryover-tag"),
    carryoverMessage: document.getElementById("carryover-message"),
    carryoverList: document.getElementById("carryover-list"),
    carryoverHint: document.getElementById("carryover-hint"),
    carryoverFeedback: document.getElementById("carryover-feedback"),
    carryoverButtons: [...document.querySelectorAll("[data-carryover-action]")],
    todayIntake: document.getElementById("today-intake"),
    todayBurn: document.getElementById("today-burn"),
    todayRemaining: document.getElementById("today-remaining"),
    todayOverviewTarget: document.getElementById("today-overview-target"),
    todayOverviewNote: document.getElementById("today-overview-note"),
    campusMotionStatus: document.getElementById("campus-motion-status"),
    motionCards: [...document.querySelectorAll("[data-motion-workout]")],
    motionDialog: document.getElementById("motion-timer-dialog"),
    motionTitle: document.getElementById("motion-timer-title"),
    motionStep: document.getElementById("motion-timer-step"),
    motionTip: document.getElementById("motion-timer-tip"),
    motionTime: document.getElementById("motion-timer-time"),
    motionRound: document.getElementById("motion-timer-round"),
    motionProgress: document.getElementById("motion-timer-progress"),
    motionSequence: document.getElementById("motion-timer-sequence"),
    motionFeedback: document.getElementById("motion-timer-feedback"),
    motionToggle: document.getElementById("motion-timer-toggle"),
    motionSkip: document.getElementById("motion-timer-skip"),
    motionComplete: document.getElementById("motion-timer-complete"),
    motionClose: document.getElementById("motion-timer-close"),
    actionTimerDialog: document.getElementById("action-timer-dialog"),
    actionTimerTitle: document.getElementById("action-timer-title"),
    actionTimerEmoji: document.getElementById("action-timer-emoji"),
    actionTimerCategory: document.getElementById("action-timer-category"),
    actionTimerStep: document.getElementById("action-timer-step"),
    actionTimerClock: document.getElementById("action-timer-clock"),
    actionTimerTags: document.getElementById("action-timer-tags"),
    actionTimerProgress: document.getElementById("action-timer-progress"),
    actionTimerFeedback: document.getElementById("action-timer-feedback"),
    actionTimerToggle: document.getElementById("action-timer-toggle"),
    actionTimerNext: document.getElementById("action-timer-next"),
    actionTimerComplete: document.getElementById("action-timer-complete"),
    actionTimerClose: document.getElementById("action-timer-close"),
    quickCheckin: document.getElementById("quick-checkin"),
    recordFab: document.getElementById("record-fab"),
    recordBack: document.getElementById("record-back"),
    recordShortcutButtons: [...document.querySelectorAll("[data-record-target]")],
    bottomNav: document.querySelector(".bottom-nav"),
  };
  const planElements = {
    steps: [...document.querySelectorAll("[data-plan-step]")],
    formPanel: document.getElementById("plan-step-form"),
    schedulePanel: document.getElementById("plan-step-schedule"),
    resultPanel: document.getElementById("plan-step-result"),
    scheduleTitle: document.getElementById("plan-schedule-title"),
    scheduleGrid: document.getElementById("schedule-grid"),
    scheduleFeedback: document.getElementById("schedule-feedback"),
    scheduleBack: document.getElementById("schedule-back"),
    scheduleSmart: document.getElementById("schedule-smart"),
    form: document.getElementById("plan-form"),
    formTitle: document.getElementById("plan-form-title"),
    formError: document.getElementById("plan-form-error"),
    resultTitle: document.getElementById("plan-results-title"),
    goalVerb: document.getElementById("result-goal-verb"),
    warning: document.getElementById("plan-warning"),
    warningTitle: document.getElementById("plan-warning-title"),
    warningMessage: document.getElementById("plan-warning-message"),
    currentWeight: document.getElementById("result-current-weight"),
    targetWeight: document.getElementById("result-target-weight"),
    totalLoss: document.getElementById("result-total-loss"),
    bmi: document.getElementById("result-bmi"),
    bmiLabel: document.getElementById("result-bmi-label"),
    bmr: document.getElementById("result-bmr"),
    tdee: document.getElementById("result-tdee"),
    activityFactor: document.getElementById("result-activity-factor"),
    adjustmentLabel: document.getElementById("result-adjustment-label"),
    deficit: document.getElementById("result-deficit"),
    calories: document.getElementById("result-calories"),
    energyTitle: document.getElementById("energy-plan-title"),
    energyNote: document.getElementById("energy-plan-note"),
    gainGuide: document.getElementById("plan-gain-guide"),
    gainCalories: document.getElementById("gain-guide-calories"),
    gainProtein: document.getElementById("gain-guide-protein"),
    gainTraining: document.getElementById("gain-guide-training"),
    goalHint: document.getElementById("plan-goal-hint"),
    weeklyTag: document.getElementById("weekly-duration-tag"),
    weeklyBody: document.getElementById("weekly-plan-body"),
    smartWeekTag: document.getElementById("smart-week-tag"),
    smartWeekSummary: document.getElementById("smart-week-summary"),
    smartWeekGrid: document.getElementById("smart-week-grid"),
    smartWeekDietNote: document.getElementById("smart-week-diet-note"),
    smartWeekEdit: document.getElementById("smart-week-schedule-edit"),
    swapDialog: document.getElementById("swap-dialog"),
    swapTitle: document.getElementById("swap-dialog-title"),
    swapClose: document.getElementById("swap-dialog-close"),
    swapSlotStep: document.getElementById("swap-slot-step"),
    swapSlotLabel: document.getElementById("swap-slot-label"),
    swapSlotList: document.getElementById("swap-slot-list"),
    swapOptionStep: document.getElementById("swap-option-step"),
    swapOptionLabel: document.getElementById("swap-option-label"),
    swapSlotBack: document.getElementById("swap-slot-back"),
    swapOptionList: document.getElementById("swap-option-list"),
    swapFeedback: document.getElementById("swap-feedback"),
    editButtons: [...document.querySelectorAll("#plan-edit, #plan-edit-secondary")],
    saveButton: document.getElementById("plan-save"),
    saveStatus: document.getElementById("plan-save-status"),
  };
  const checkinElements = {
    date: document.getElementById("checkin-date"),
    storageNote: document.getElementById("checkin-storage-note"),
    hero: document.getElementById("checkin-hero"),
    streakCount: document.getElementById("checkin-streak-count"),
    dailyProgressLabel: document.getElementById("daily-progress-label"),
    dailyProgressBar: document.getElementById("daily-progress-bar"),
    todayStatus: document.getElementById("checkin-today-status"),
    heroChecks: [...document.querySelectorAll("[data-daily-module]")],
    dietSummary: document.getElementById("diet-summary"),
    mealInputs: [...document.querySelectorAll("[data-meal-field]")],
    mealStates: [...document.querySelectorAll("[data-meal-state]")],
    mealPresetLists: [...document.querySelectorAll("[data-meal-preset-list]")],
    mealPresetManageButtons: [
      ...document.querySelectorAll("[data-preset-editor-target]"),
    ],
    dishDatabaseCount: document.getElementById("dish-database-count"),
    dishMealButtons: [...document.querySelectorAll("[data-dish-meal]")],
    dishSearchInput: document.getElementById("dish-search-input"),
    dishSearchClear: document.getElementById("dish-search-clear"),
    dishSearchStatus: document.getElementById("dish-search-status"),
    dishResultsTitle: document.getElementById("dish-results-title"),
    dishResultCount: document.getElementById("dish-result-count"),
    dishResultList: document.getElementById("dish-result-list"),
    dishEmpty: document.getElementById("dish-empty"),
    mealPhotoSlots: [...document.querySelectorAll("[data-meal-photo]")],
    photoMealOpen: document.getElementById("photo-meal-open"),
    photoMealDialog: document.getElementById("photo-meal-dialog"),
    photoMealClose: document.getElementById("photo-meal-close"),
    photoMealCancel: document.getElementById("photo-meal-cancel"),
    photoMealMealButtons: [...document.querySelectorAll("[data-photo-meal]")],
    photoMealFile: document.getElementById("photo-meal-file"),
    photoMealPick: document.getElementById("photo-meal-pick"),
    photoMealRepick: document.getElementById("photo-meal-repick"),
    photoMealPreview: document.getElementById("photo-meal-preview"),
    photoMealPreviewImage: document.getElementById("photo-meal-preview-image"),
    photoMealFileStatus: document.getElementById("photo-meal-file-status"),
    photoMealAi: document.getElementById("photo-meal-ai"),
    photoMealAiStatus: document.getElementById("photo-meal-ai-status"),
    photoMealManual: document.getElementById("photo-meal-manual"),
    photoMealSearchInput: document.getElementById("photo-meal-search-input"),
    photoMealSearchStatus: document.getElementById("photo-meal-search-status"),
    photoMealDishList: document.getElementById("photo-meal-dish-list"),
    photoMealDishEmpty: document.getElementById("photo-meal-dish-empty"),
    photoMealPortion: document.getElementById("photo-meal-portion"),
    photoMealSelectedDish: document.getElementById("photo-meal-selected-dish"),
    photoMealSelectedMeta: document.getElementById("photo-meal-selected-meta"),
    photoMealPortionSelect: document.getElementById("photo-meal-portion-select"),
    photoMealCalories: document.getElementById("photo-meal-calories"),
    photoMealFeedback: document.getElementById("photo-meal-feedback"),
    photoMealSave: document.getElementById("photo-meal-save"),
    presetDialog: document.getElementById("preset-dialog"),
    presetDialogTitle: document.getElementById("preset-dialog-title"),
    presetDialogClose: document.getElementById("preset-dialog-close"),
    presetDone: document.getElementById("preset-done"),
    presetCount: document.getElementById("preset-count"),
    presetList: document.getElementById("preset-list"),
    presetListEmpty: document.getElementById("preset-list-empty"),
    presetForm: document.getElementById("preset-form"),
    presetFormTitle: document.getElementById("preset-form-title"),
    presetFoodInput: document.getElementById("preset-food-input"),
    presetCaloriesInput: document.getElementById("preset-calories-input"),
    presetFeedback: document.getElementById("preset-feedback"),
    presetCancel: document.getElementById("preset-cancel"),
    presetSave: document.getElementById("preset-save"),
    exerciseList: document.getElementById("checkin-exercise-list"),
    exerciseSummary: document.getElementById("exercise-summary"),
    exercisePlanManage: document.getElementById("exercise-plan-manage"),
    exerciseRecommendBasis: document.getElementById("exercise-recommend-basis"),
    exerciseRecommendList: document.getElementById("exercise-recommend-list"),
    exerciseRecommendEmpty: document.getElementById("exercise-recommend-empty"),
    exerciseFeedback: document.getElementById("exercise-feedback"),
    exerciseDialog: document.getElementById("exercise-dialog"),
    exerciseDialogClose: document.getElementById("exercise-dialog-close"),
    exerciseDone: document.getElementById("exercise-done"),
    exerciseRoutineCount: document.getElementById("exercise-routine-count"),
    exerciseRoutineList: document.getElementById("exercise-routine-list"),
    exerciseExtraHeading: document.getElementById("exercise-extra-heading"),
    exerciseExtraList: document.getElementById("exercise-extra-list"),
    exerciseForm: document.getElementById("exercise-form"),
    exerciseFormTitle: document.getElementById("exercise-form-title"),
    exerciseNameInput: document.getElementById("exercise-name-input"),
    exerciseTypeInput: document.getElementById("exercise-type-input"),
    exerciseMinutesInput: document.getElementById("exercise-minutes-input"),
    exerciseFormFeedback: document.getElementById("exercise-form-feedback"),
    exerciseCancel: document.getElementById("exercise-cancel"),
    exerciseSave: document.getElementById("exercise-save"),
    celebration: document.getElementById("exercise-celebration"),
    weightForm: document.getElementById("weight-form"),
    weightInput: document.getElementById("weight-input"),
    weightFeedback: document.getElementById("weight-feedback"),
    weightSummary: document.getElementById("weight-summary"),
    weightCount: document.getElementById("weight-count"),
    weightHistory: document.getElementById("weight-history"),
    weightHistoryEmpty: document.getElementById("weight-history-empty"),
  };
  const exerciseElements = {
    filters: document.getElementById("exercise-filters"),
    resultCount: document.getElementById("exercise-result-count"),
    status: document.getElementById("exercise-library-status"),
    cardList: document.getElementById("exercise-card-list"),
    empty: document.getElementById("exercise-empty"),
    viewButtons: [...document.querySelectorAll("[data-exercise-view]")],
    dormPanel: document.getElementById("exercise-library"),
    canteenPanel: document.getElementById("canteen-panel"),
    canteenCount: document.getElementById("canteen-count"),
    canteenSearchInput: document.getElementById("canteen-search-input"),
    canteenSearchClear: document.getElementById("canteen-search-clear"),
    canteenStatus: document.getElementById("canteen-search-status"),
    canteenList: document.getElementById("canteen-list"),
    canteenEmpty: document.getElementById("canteen-empty"),
  };
  const dataElements = {
    weightTag: document.getElementById("data-weight-tag"),
    weightShell: document.getElementById("data-weight-shell"),
    weightCanvas: document.getElementById("data-weight-chart"),
    weightEmpty: document.getElementById("data-weight-empty"),
    heatmapTag: document.getElementById("data-heatmap-tag"),
    heatmapWrap: document.getElementById("data-heatmap-wrap"),
    heatmapGrid: document.getElementById("data-heatmap"),
    heatmapRange: document.getElementById("data-heatmap-range"),
    heatmapEmpty: document.getElementById("data-heatmap-empty"),
    calorieTag: document.getElementById("data-calorie-tag"),
    calorieShell: document.getElementById("data-calorie-shell"),
    calorieCanvas: document.getElementById("data-calorie-chart"),
    calorieEmpty: document.getElementById("data-calorie-empty"),
    adjustStrip: document.getElementById("data-adjust-strip"),
    adjustCount: document.getElementById("data-adjust-count"),
    adjustNote: document.getElementById("data-adjust-note"),
  };
  const bodyMetricElements = {
    form: document.getElementById("body-metrics-form"),
    date: document.getElementById("body-metrics-date"),
    waist: document.getElementById("body-metrics-waist"),
    hip: document.getElementById("body-metrics-hip"),
    thigh: document.getElementById("body-metrics-thigh"),
    feedback: document.getElementById("body-metrics-feedback"),
    tag: document.getElementById("data-body-tag"),
    shell: document.getElementById("data-body-shell"),
    canvas: document.getElementById("data-body-chart"),
    empty: document.getElementById("data-body-empty"),
  };
  const dormChallengeElements = {
    setup: document.getElementById("dorm-challenge-setup"),
    form: document.getElementById("dorm-challenge-form"),
    name: document.getElementById("dorm-challenge-name"),
    start: document.getElementById("dorm-challenge-start"),
    selfName: document.getElementById("dorm-challenge-self"),
    roommates: document.getElementById("dorm-challenge-roommates"),
    formFeedback: document.getElementById("dorm-challenge-form-feedback"),
    play: document.getElementById("dorm-challenge-play"),
    tag: document.getElementById("dorm-challenge-tag"),
    nameLabel: document.getElementById("dorm-challenge-name-label"),
    meta: document.getElementById("dorm-challenge-meta"),
    day: document.getElementById("dorm-challenge-day"),
    days: document.getElementById("dorm-challenge-days"),
    minutes: document.getElementById("dorm-challenge-minutes"),
    last: document.getElementById("dorm-challenge-last"),
    progress: document.getElementById("dorm-challenge-progress"),
    progressBar: document.getElementById("dorm-challenge-progressbar"),
    reportButton: document.getElementById("dorm-challenge-report-button"),
    reportPanel: document.getElementById("dorm-challenge-report-panel"),
    reportCode: document.getElementById("dorm-challenge-report-code"),
    reportFeedback: document.getElementById("dorm-challenge-report-feedback"),
    importInput: document.getElementById("dorm-challenge-import"),
    importButton: document.getElementById("dorm-challenge-import-button"),
    importFeedback: document.getElementById("dorm-challenge-import-feedback"),
    leaderboard: document.getElementById("dorm-challenge-leaderboard"),
    leaderboardEmpty: document.getElementById("dorm-challenge-leaderboard-empty"),
    leaderboardCount: document.getElementById("dorm-challenge-leaderboard-count"),
  };
  const badgeElements = {
    grid: document.getElementById("data-badge-grid"),
    tag: document.getElementById("data-badge-tag"),
    detail: document.getElementById("data-badge-detail"),
    detailName: document.getElementById("data-badge-detail-name"),
    detailState: document.getElementById("data-badge-detail-state"),
    detailCondition: document.getElementById("data-badge-detail-condition"),
    detailCount: document.getElementById("data-badge-detail-count"),
    detailBar: document.getElementById("data-badge-detail-bar"),
    detailProgressBar: document.getElementById("data-badge-detail-progressbar"),
    hint: document.getElementById("data-badge-hint"),
  };
  let weightChartInstance = null;
  let calorieChartInstance = null;
  let bodyMetricsChartInstance = null;
  const navItems = [...document.querySelectorAll("[data-page-target]")];
  const pages = [...document.querySelectorAll(".page[data-page]")];

  let generatedPlan = null;
  let scheduleState = null;
  let smartWeekState = null;
  let swapContext = null;
  let lastAdjustmentCheckDate = null;
  let activePageName = "home";
  let recordReturnPage = "home";
  let recordReturnScrollY = 0;

  const readStorage = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const toPositiveNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : null;
  };

  const getProfile = () => {
    const stored = readStorage(STORAGE_KEYS.profile, null);

    if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
      return null;
    }

    const currentWeight = toPositiveNumber(stored.currentWeight);
    const targetWeight = toPositiveNumber(stored.targetWeight);

    if (currentWeight === null || targetWeight === null) {
      return null;
    }

    const goalType =
      stored.goalType === "gain" || stored.goalType === "lose"
        ? stored.goalType
        : targetWeight > currentWeight
          ? "gain"
          : "lose";

    return {
      startWeight: toPositiveNumber(stored.startWeight),
      currentWeight,
      targetWeight,
      goalType,
      dailyCalorieTarget: toPositiveNumber(stored.dailyCalorieTarget),
      height: toPositiveNumber(stored.height),
      exerciseDays: toPositiveNumber(stored.exerciseDays),
      bmi: toPositiveNumber(stored.bmi),
    };
  };

  const getCheckinDates = () => {
    const stored = readStorage(STORAGE_KEYS.checkins, []);

    if (!Array.isArray(stored)) {
      return [];
    }

    return stored.filter((date) => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date));
  };

  const toDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getStreakSummary = (dates) => {
    const checkedDates = new Set(dates);
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);

    const checkedToday = checkedDates.has(toDateKey(cursor));

    if (!checkedToday) {
      cursor.setDate(cursor.getDate() - 1);

      if (!checkedDates.has(toDateKey(cursor))) {
        return { count: 0, checkedToday };
      }
    }

    let count = 0;

    while (checkedDates.has(toDateKey(cursor))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return { count, checkedToday };
  };

  const parseDateKey = (dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  };

  const isValidDateKey = (dateKey) => {
    if (typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return false;
    }

    return toDateKey(parseDateKey(dateKey)) === dateKey;
  };

  const createIcon = (name) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", `#icon-${name}`);
    svg.append(use);
    return svg;
  };

  const readTrimmedString = (value) => (typeof value === "string" ? value.trim() : "");
  const exerciseData =
    window.SLIMSPARK_EXERCISE_DATA &&
    typeof window.SLIMSPARK_EXERCISE_DATA === "object"
      ? window.SLIMSPARK_EXERCISE_DATA
      : {};
  const parsedCategories = [];
  const categoryIds = new Set();

  (Array.isArray(exerciseData.categories) ? exerciseData.categories : []).forEach((source) => {
    if (!source || typeof source !== "object") {
      return;
    }

    const id = readTrimmedString(source.id);
    const label = readTrimmedString(source.label);

    if (!id || !label || categoryIds.has(id)) {
      return;
    }

    categoryIds.add(id);
    parsedCategories.push({ id, label });
  });

  const exerciseCategories = [
    parsedCategories.find(({ id }) => id === "all") ?? { id: "all", label: "全部" },
    ...parsedCategories.filter(({ id }) => id !== "all"),
  ];
  const exerciseCategoryLabels = new Map(
    exerciseCategories.map(({ id, label }) => [id, label]),
  );
  const exerciseCatalog = [];
  const exerciseIds = new Set();

  (Array.isArray(exerciseData.exercises) ? exerciseData.exercises : []).forEach((source) => {
    if (!source || typeof source !== "object") {
      return;
    }

    const id = readTrimmedString(source.id);
    const name = readTrimmedString(source.name);
    const category = readTrimmedString(source.category);

    if (!id || !name || !category || exerciseIds.has(id)) {
      return;
    }

    const difficultyNumber = Number(source.difficulty);
    const difficulty = Number.isFinite(difficultyNumber)
      ? Math.min(5, Math.max(1, Math.round(difficultyNumber)))
      : 1;
    const steps = Array.isArray(source.steps)
      ? source.steps.map(readTrimmedString).filter(Boolean)
      : [];
    const mistakes = Array.isArray(source.mistakes)
      ? source.mistakes.map(readTrimmedString).filter(Boolean)
      : [];
    const durationValue = Number(source.duration);
    const duration = Number.isFinite(durationValue)
      ? Math.min(30, Math.max(1, Math.round(durationValue)))
      : 5;

    exerciseIds.add(id);
    exerciseCatalog.push({
      id,
      name,
      category,
      difficulty,
      dorm: source.dorm === true,
      quiet: source.quiet === true,
      bedtime: source.bedtime === true,
      space: readTrimmedString(source.space) || "宿舍空地",
      equipment: readTrimmedString(source.equipment) || "无器械",
      duration,
      sets: readTrimmedString(source.sets) || "按能力完成",
      emoji: readTrimmedString(source.emoji) || "🏋️",
      intro: readTrimmedString(source.intro),
      steps,
      breathing: readTrimmedString(source.breathing),
      mistakes,
    });
  });

  const exerciseById = new Map(exerciseCatalog.map((exercise) => [exercise.id, exercise]));
  const MAX_DAILY_EXERCISES = 8;
  const EXERCISE_TYPES = ["热身", "有氧", "力量", "核心", "拉伸", "其他"];
  const DEFAULT_EXERCISE_ROUTINE = [
    { id: "morning-stretch", name: "晨间拉伸", type: "热身", note: "全身唤醒", minutes: 10 },
    { id: "lunch-walk", name: "午间快走", type: "有氧", note: "轻松燃脂", minutes: 30 },
    { id: "evening-core", name: "晚间核心", type: "力量", note: "核心塑形", minutes: 12 },
  ];

  const createDefaultExerciseRoutine = () =>
    DEFAULT_EXERCISE_ROUTINE.map((item) => ({ ...item }));

  const MOTION_SESSION_LIMIT = 20;
  const MOTION_WORKOUTS = {
    "recess-5": {
      id: "recess-5",
      title: "课间 5 分钟",
      steps: [
        { name: "颈部环绕", seconds: 45, tip: "动作放慢，肩膀保持放松。" },
        { name: "肩部舒展", seconds: 45, tip: "手臂画圈，打开胸腔。" },
        { name: "原地踏步", seconds: 60, tip: "抬膝到舒适高度，保持节奏。" },
        { name: "深蹲提膝", seconds: 60, tip: "左右交替，膝盖始终朝向脚尖。" },
        { name: "站姿侧伸展", seconds: 90, tip: "两侧各保持 45 秒，呼吸均匀。" },
      ],
    },
    "dorm-quiet": {
      id: "dorm-quiet",
      title: "宿舍静音燃脂",
      steps: [
        { name: "坐姿转体", seconds: 45, tip: "背部挺直，用腹部带动身体旋转。" },
        { name: "臀桥", seconds: 60, tip: "脚跟踩地，顶端夹紧臀部。" },
        { name: "死虫式", seconds: 60, tip: "腰部贴地，手脚交替伸展。" },
        { name: "侧卧抬腿", seconds: 60, tip: "左右各 30 秒，动作保持缓慢。" },
        { name: "平板支撑", seconds: 45, tip: "头、背、髋保持一条直线。" },
        { name: "婴儿式放松", seconds: 90, tip: "深呼吸，放松背部和髋部。" },
      ],
    },
  };

  const normalizeExerciseRoutine = (value) => {
    if (!Array.isArray(value)) {
      return null;
    }

    const usedIds = new Set();
    const usedNames = new Set();
    const routine = [];

    value.slice(0, MAX_DAILY_EXERCISES).forEach((source, index) => {
      if (!source || typeof source !== "object") {
        return;
      }

      const name = readTrimmedString(source.name).slice(0, 16);
      const minutes = Math.round(Number(source.minutes));
      const nameKey = name.toLocaleLowerCase("zh-CN");

      if (
        !name ||
        usedNames.has(nameKey) ||
        !Number.isFinite(minutes) ||
        minutes < 1 ||
        minutes > 180
      ) {
        return;
      }

      const typeSource = readTrimmedString(source.type);
      const type = EXERCISE_TYPES.includes(typeSource) ? typeSource : "其他";
      const note = readTrimmedString(source.note).slice(0, 16) || "自定训练";
      let id = readTrimmedString(source.id) || `daily-${Date.now()}-${index}`;

      while (usedIds.has(id)) {
        id = `${id}-${index}`;
      }

      usedIds.add(id);
      usedNames.add(nameKey);
      routine.push({ id, name, type, note, minutes });
    });

    return routine.length > 0 ? routine : null;
  };

  const createExerciseRoutineId = () =>
    typeof window.crypto?.randomUUID === "function"
      ? `custom-training-${window.crypto.randomUUID()}`
      : `custom-training-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const toRoutinePlanItem = (item) => ({
    id: item.id,
    name: item.name,
    meta: `${item.type} · ${item.note}`,
    amount: `${item.minutes} 分钟`,
  });

  let exerciseRoutine =
    normalizeExerciseRoutine(readStorage(STORAGE_KEYS.exerciseRoutine, null)) ??
    createDefaultExerciseRoutine();
  let editingExerciseId = null;

  const normalizeExercisePlans = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }

    const plans = {};

    Object.entries(value).forEach(([dateKey, ids]) => {
      if (!isValidDateKey(dateKey) || !Array.isArray(ids)) {
        return;
      }

      const cleanIds = [
        ...new Set(
          ids
            .map(readTrimmedString)
            .filter((id) => id !== "" && exerciseById.has(id)),
        ),
      ];

      if (cleanIds.length > 0) {
        plans[dateKey] = cleanIds;
      }
    });

    return plans;
  };

  let exercisePlans = normalizeExercisePlans(
    readStorage(STORAGE_KEYS.exercisePlans, {}),
  );
  let activeExerciseFilter = "all";
  let activeExerciseCampusFilters = new Set();
  let activeExerciseView = "dorm";
  const EXERCISE_CAMPUS_FILTERS = [
    {
      id: "dorm",
      label: "宿舍无器械",
      matches: (exercise) =>
        exercise.dorm === true && exercise.equipment === "无器械",
    },
    {
      id: "quiet",
      label: "静音不扰民",
      matches: (exercise) => exercise.quiet === true,
    },
    {
      id: "bedtime",
      label: "睡前拉伸",
      matches: (exercise) => exercise.bedtime === true,
    },
    {
      id: "quick",
      label: "课间 5 分钟",
      matches: (exercise) => exercise.duration <= 5,
    },
  ];
  const exerciseMatchesFilters = (exercise) =>
    (activeExerciseFilter === "all" || exercise.category === activeExerciseFilter) &&
    EXERCISE_CAMPUS_FILTERS.every(
      ({ id, matches }) =>
        !activeExerciseCampusFilters.has(id) || matches(exercise),
    );
  const movementCardViews = new Map();

  const getCustomExerciseIds = (dateKey) =>
    Array.isArray(exercisePlans[dateKey]) ? exercisePlans[dateKey] : [];

  const getExercisePlanForDate = (dateKey) => {
    const plan = exerciseRoutine.map(toRoutinePlanItem);
    const plannedIds = new Set(plan.map(({ id }) => id));

    getCustomExerciseIds(dateKey).forEach((id) => {
      const exercise = exerciseById.get(id);

      if (!exercise || plannedIds.has(id)) {
        return;
      }

      plannedIds.add(id);
      plan.push({
        id,
        name: exercise.name,
        meta: `动作库 · ${exerciseCategoryLabels.get(exercise.category) ?? "其他"}`,
        amount: exercise.sets,
      });
    });

    return plan;
  };

  const getExercisePlanIds = (dateKey) =>
    getExercisePlanForDate(dateKey).map(({ id }) => id);

  const MEAL_DEFINITIONS = [
    { key: "breakfast", label: "早餐" },
    { key: "lunch", label: "午餐" },
    { key: "dinner", label: "晚餐" },
  ];
  const MODULE_LABELS = { meals: "饮食", exercise: "运动", weight: "体重" };

  const createEmptyMeals = () =>
    Object.fromEntries(
      MEAL_DEFINITIONS.map(({ key }) => [key, { food: "", calories: null }]),
    );

  const createEmptyCheckinRecord = (dateKey) => ({
    meals: createEmptyMeals(),
    exercises: Object.fromEntries(getExercisePlanIds(dateKey).map((id) => [id, false])),
    motionSessions: [],
    weight: null,
    completed: false,
    updatedAt: null,
  });

  const toValidCheckinCalories = (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    const calories = Number(value);
    if (!Number.isFinite(calories) || calories <= 0 || calories > 5000) {
      return null;
    }

    return Math.round(calories);
  };

  const toValidCheckinWeight = (value) => {
    const weight = Number(value);

    if (!Number.isFinite(weight) || weight < 25 || weight > 300) {
      return null;
    }

    return Math.round(weight * 10) / 10;
  };

  const normalizeMotionSessions = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.slice(-MOTION_SESSION_LIMIT).flatMap((source) => {
      if (!source || typeof source !== "object") {
        return [];
      }

      const workoutId = readTrimmedString(source.workoutId);
      const name = readTrimmedString(source.name).slice(0, 24);
      const minutes = Math.round(Number(source.minutes));

      if (
        !workoutId ||
        !name ||
        !Number.isFinite(minutes) ||
        minutes < 1 ||
        minutes > 60
      ) {
        return [];
      }

      return [
        {
          workoutId,
          name,
          minutes,
          completedAt:
            typeof source.completedAt === "string" ? source.completedAt : null,
        },
      ];
    });
  };

  const normalizeMeal = (value) => {
    const source = value && typeof value === "object" ? value : {};

    return {
      food: typeof source.food === "string" ? source.food.slice(0, 80) : "",
      calories: toValidCheckinCalories(source.calories),
    };
  };

  const isMealComplete = (meal) => meal.food.trim() !== "" && meal.calories !== null;

  const MEAL_LABELS = Object.fromEntries(
    MEAL_DEFINITIONS.map(({ key, label }) => [key, label]),
  );
  const MAX_MEAL_PRESETS = 8;
  const DEFAULT_MEAL_PRESETS = {
    breakfast: [
      { id: "default-breakfast-oat", food: "燕麦牛奶", calories: 320 },
      { id: "default-breakfast-egg", food: "全麦鸡蛋", calories: 300 },
    ],
    lunch: [
      { id: "default-lunch-salad", food: "鸡胸肉沙拉", calories: 350 },
      { id: "default-lunch-rice", food: "糙米鸡腿饭", calories: 520 },
    ],
    dinner: [
      { id: "default-dinner-fish", food: "清蒸鱼蔬菜", calories: 400 },
      { id: "default-dinner-soup", food: "番茄豆腐汤", calories: 260 },
    ],
  };
  const normalizeDishSearchText = (value) =>
    String(value ?? "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[\s·•\-_/，,。.、]/g, "");
  const dishData =
    window.SLIMSPARK_DISH_DATA && typeof window.SLIMSPARK_DISH_DATA === "object"
      ? window.SLIMSPARK_DISH_DATA
      : {};
  const dishCatalog = [];
  const dishIds = new Set();

  (Array.isArray(dishData.dishes) ? dishData.dishes : []).forEach((source) => {
    if (!source || typeof source !== "object") {
      return;
    }

    const id = readTrimmedString(source.id);
    const name = readTrimmedString(source.name);
    const calories = toValidCheckinCalories(source.calories);

    if (!id || !name || calories === null || dishIds.has(id)) {
      return;
    }

    const aliases = [
      ...new Set(
        (Array.isArray(source.aliases) ? source.aliases : [])
          .map((alias) => readTrimmedString(alias))
          .filter(Boolean),
      ),
    ];
    const meals = [
      ...new Set(
        (Array.isArray(source.meals) ? source.meals : []).filter(
          (mealKey) => typeof mealKey === "string" && MEAL_LABELS[mealKey],
        ),
      ),
    ];
    const category = readTrimmedString(source.category) || "常见菜品";
    const portion = readTrimmedString(source.portion) || "1 份";

    dishIds.add(id);
    dishCatalog.push({
      id,
      name,
      aliases,
      category,
      portion,
      calories,
      meals: meals.length > 0 ? meals : MEAL_DEFINITIONS.map(({ key }) => key),
      recommended: source.recommended === true,
      searchText: normalizeDishSearchText(
        [
          name,
          ...aliases,
          category,
          ...meals.map((mealKey) => MEAL_LABELS[mealKey]),
        ].join(" "),
      ),
    });
  });

  const dishById = new Map(dishCatalog.map((dish) => [dish.id, dish]));
  const CANTEEN_LEVELS = {
    red: { label: "红榜" },
    yellow: { label: "黄榜" },
    black: { label: "黑榜" },
  };
  const normalizeCanteenLevel = (value) => {
    const key = String(value ?? "").trim().toLowerCase();
    const aliases = {
      red: "red",
      "红": "red",
      "红榜": "red",
      yellow: "yellow",
      "黄": "yellow",
      "黄榜": "yellow",
      black: "black",
      "黑": "black",
      "黑榜": "black",
    };

    return aliases[key] ?? null;
  };
  const normalizeCanteenMeal = (value) => {
    const source = String(value ?? "").trim();
    const normalized = source.toLowerCase();
    const match = Object.entries(MEAL_LABELS).find(
      ([key, label]) => normalized === key || source === label,
    );

    return match?.[0] ?? null;
  };
  const canteenSource = window.SLIMSPARK_CANTEEN_DATA;
  const canteenEntries = Array.isArray(canteenSource)
    ? canteenSource
    : Array.isArray(canteenSource?.dishes)
      ? canteenSource.dishes
      : [];
  const canteenCatalog = [];
  const canteenIds = new Set();

  canteenEntries.forEach((source) => {
    if (!source || typeof source !== "object") {
      return;
    }

    const id = readTrimmedString(source.id);
    const name = readTrimmedString(source.name);
    const calories = toValidCheckinCalories(source.calories);
    const level = normalizeCanteenLevel(source.level);

    if (!id || !name || calories === null || !level || canteenIds.has(id)) {
      return;
    }

    const aliases = [
      ...new Set(
        (Array.isArray(source.aliases) ? source.aliases : [])
          .map((alias) => readTrimmedString(alias))
          .filter(Boolean),
      ),
    ];
    const meals = [
      ...new Set(
        (Array.isArray(source.meal) ? source.meal : [source.meal])
          .map(normalizeCanteenMeal)
          .filter(Boolean),
      ),
    ];
    const tags = [
      ...new Set(
        (Array.isArray(source.tags) ? source.tags : [])
          .map((tag) => readTrimmedString(tag))
          .filter(Boolean),
      ),
    ];

    canteenIds.add(id);
    canteenCatalog.push({
      id,
      name,
      aliases,
      meals: meals.length > 0 ? meals : ["lunch", "dinner"],
      calories,
      level,
      levelLabel: CANTEEN_LEVELS[level].label,
      tags,
      reason: readTrimmedString(source.reason),
      swap: readTrimmedString(source.swap),
      pairing: readTrimmedString(source.pairing),
      searchText: normalizeDishSearchText([name, ...aliases].join(" ")),
    });
  });

  const canteenById = new Map(canteenCatalog.map((dish) => [dish.id, dish]));
  let canteenSearchQuery = "";
  const getDefaultDishMeal = () => {
    const hour = new Date().getHours();

    if (hour < 10) {
      return "breakfast";
    }

    if (hour < 15) {
      return "lunch";
    }

    return "dinner";
  };

  const searchDishes = (query, mealKey) => {
    const phrase = normalizeDishSearchText(query);
    const tokens = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(normalizeDishSearchText)
      .filter(Boolean);

    if (!phrase || tokens.length === 0) {
      return [];
    }

    return dishCatalog
      .filter((dish) => tokens.every((token) => dish.searchText.includes(token)))
      .sort((left, right) => {
        const getNameScore = (dish) => {
          const name = normalizeDishSearchText(dish.name);

          if (name === phrase) {
            return 0;
          }

          if (name.startsWith(phrase)) {
            return 1;
          }

          return name.includes(phrase) ? 2 : 3;
        };
        const scoreDifference = getNameScore(left) - getNameScore(right);

        if (scoreDifference !== 0) {
          return scoreDifference;
        }

        const leftMealMatch = left.meals.includes(mealKey) ? 0 : 1;
        const rightMealMatch = right.meals.includes(mealKey) ? 0 : 1;

        if (leftMealMatch !== rightMealMatch) {
          return leftMealMatch - rightMealMatch;
        }

        return left.name.localeCompare(right.name, "zh-CN");
      })
      .slice(0, 8);
  };

  const getRecommendedDishes = (mealKey) => {
    const matching = dishCatalog.filter(
      (dish) => dish.recommended && dish.meals.includes(mealKey),
    );

    if (matching.length >= 6) {
      return matching.slice(0, 6);
    }

    const fallback = dishCatalog.filter(
      (dish) =>
        !matching.includes(dish) &&
        dish.meals.includes(mealKey) &&
        dish.category !== "加餐",
    );

    return [...matching, ...fallback].slice(0, 6);
  };

  const createDefaultPresetList = (mealKey) =>
    (DEFAULT_MEAL_PRESETS[mealKey] ?? []).map((preset) => ({ ...preset }));

  const normalizeMealPresetList = (value, mealKey) => {
    if (!Array.isArray(value)) {
      return null;
    }

    const usedIds = new Set();

    return value.slice(0, MAX_MEAL_PRESETS).flatMap((source, index) => {
      if (!source || typeof source !== "object") {
        return [];
      }

      const food = readTrimmedString(source.food).slice(0, 20);
      const calories = toValidCheckinCalories(source.calories);

      if (!food || calories === null) {
        return [];
      }

      let id = readTrimmedString(source.id);

      if (!id || usedIds.has(id)) {
        id = `${mealKey}-saved-${index}`;
      }

      usedIds.add(id);
      return [{ id, food, calories }];
    });
  };

  const createMealPresetState = () => {
    const stored = readStorage(STORAGE_KEYS.mealPresets, null);
    const storedMap =
      stored && typeof stored === "object" && !Array.isArray(stored)
        ? stored
        : null;

    return Object.fromEntries(
      MEAL_DEFINITIONS.map(({ key }) => {
        const saved = storedMap
          ? normalizeMealPresetList(storedMap[key], key)
          : null;

        return [key, saved ?? createDefaultPresetList(key)];
      }),
    );
  };

  const createMealPresetId = () =>
    typeof window.crypto?.randomUUID === "function"
      ? `custom-${window.crypto.randomUUID()}`
      : `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const MEAL_PHOTO_RETENTION_DAYS = 7;
  const MEAL_PHOTO_MAX_EDGE = 720;
  const MEAL_PHOTO_JPEG_QUALITY = 0.6;
  const MEAL_PHOTO_MAX_BYTES = 80 * 1024;
  const MEAL_PHOTO_MAX_DATA_URL_LENGTH = 120000;
  const MEAL_PHOTO_PORTIONS = [
    { value: 0.5, label: "半份" },
    { value: 1, label: "1 份" },
    { value: 1.5, label: "1.5 份" },
    { value: 2, label: "2 份" },
  ];
  const PHOTO_RECOGNITION_ENDPOINT =
    "/functions/v1/app/api/meal-photo/recognize";
  const PHOTO_RECOGNITION_TIMEOUT_MS = 20000;
  const PHOTO_RECOGNITION_CONFIDENCE = 0.8;

  const getAiVisitorId = () => {
    const pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let id = "";

    try {
      id = window.localStorage.getItem(storageKeys.aiVisitorId) || "";
    } catch {
      id = "";
    }

    if (pattern.test(id)) {
      return id;
    }

    if (typeof window.crypto?.randomUUID === "function") {
      id = window.crypto.randomUUID();
    } else {
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, "0"),
      ).join("");
      id = [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20),
      ].join("-");
    }

    try {
      window.localStorage.setItem(storageKeys.aiVisitorId, id);
    } catch {
      // 本地存储不可用时，本次会话仍使用内存中的标识。
    }

    return id;
  };

  let mealPresetState = createMealPresetState();
  let selectedDishMeal = getDefaultDishMeal();
  let dishSearchQuery = "";
  let activePresetMeal = null;
  let editingPresetId = null;
  let mealPhotoStore = null;
  let photoMealCompressionToken = 0;
  const photoMealState = {
    mealKey: "breakfast",
    dataUrl: "",
    width: 0,
    height: 0,
    bytes: 0,
    selectedDish: null,
    multiplier: 1,
    searchQuery: "",
    requestToken: 0,
    busy: false,
  };

  const getModuleCompletion = (record, dateKey) => ({
    meals: MEAL_DEFINITIONS.every(({ key }) => isMealComplete(record.meals[key])),
    exercise: getExercisePlanIds(dateKey).every((id) => record.exercises[id] === true),
    weight: record.weight !== null,
  });

  const isCheckinComplete = (record, dateKey) =>
    Object.values(getModuleCompletion(record, dateKey)).every(Boolean);

  const normalizeCheckinRecord = (value, dateKey) => {
    const source = value && typeof value === "object" ? value : {};
    const mealsSource =
      source.meals && typeof source.meals === "object" ? source.meals : {};
    const exercisesSource =
      source.exercises && typeof source.exercises === "object" ? source.exercises : {};
    const record = createEmptyCheckinRecord(dateKey);

    MEAL_DEFINITIONS.forEach(({ key }) => {
      record.meals[key] = normalizeMeal(mealsSource[key]);
    });
    getExercisePlanIds(dateKey).forEach((id) => {
      record.exercises[id] = exercisesSource[id] === true;
    });
    Object.entries(exercisesSource).forEach(([id, value]) => {
      if (id && typeof value === "boolean") {
        record.exercises[id] = value;
      }
    });
    record.motionSessions = normalizeMotionSessions(source.motionSessions);
    record.weight = toValidCheckinWeight(source.weight);
    record.updatedAt = typeof source.updatedAt === "string" ? source.updatedAt : null;
    record.completed = isCheckinComplete(record, dateKey);

    return record;
  };

  const normalizeCheckinRecords = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(value)
        .filter(([dateKey]) => isValidDateKey(dateKey))
        .map(([dateKey, record]) => [dateKey, normalizeCheckinRecord(record, dateKey)]),
    );
  };

  let checkinRecords = normalizeCheckinRecords(
    readStorage(STORAGE_KEYS.checkinRecords, {}),
  );
  let activeCheckinDate = toDateKey(new Date());

  const calculateProgress = (profile) => {
    if (!profile) {
      return null;
    }

    const isGain = profile.goalType === "gain";

    if (profile.startWeight !== null) {
      if (isGain) {
        const totalGain = profile.targetWeight - profile.startWeight;

        if (totalGain > 0) {
          const achievedGain = profile.currentWeight - profile.startWeight;
          return Math.min(100, Math.max(0, (achievedGain / totalGain) * 100));
        }
      } else if (profile.startWeight > profile.targetWeight) {
        const totalLoss = profile.startWeight - profile.targetWeight;
        const achievedLoss = profile.startWeight - profile.currentWeight;
        return Math.min(100, Math.max(0, (achievedLoss / totalLoss) * 100));
      }
    }

    if (isGain) {
      return profile.currentWeight >= profile.targetWeight ? 100 : null;
    }

    return profile.currentWeight <= profile.targetWeight ? 100 : null;
  };

  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "晚安";

    if (hour >= 5 && hour < 12) {
      greeting = "早安";
    } else if (hour >= 12 && hour < 18) {
      greeting = "午安";
    }

    elements.greeting.textContent = greeting;
    elements.date.textContent = `${dateFormatter.format(now)} · ${weekdayFormatter.format(now)}`;
  };

  const getTodayPlanTasks = () => {
    const dateKey = toDateKey(new Date());
    const routinePlan = getExercisePlanForDate(dateKey);
    const baseTasks =
      routinePlan.length > 0
        ? routinePlan
        : DEFAULT_EXERCISE_ROUTINE.map(toRoutinePlanItem);
    const weeklyTasks = getWeeklyPlanTasksForDate(dateKey);

    return [
      ...new Map(
        [...baseTasks, ...weeklyTasks].map((task) => [task.id, task]),
      ).values(),
    ];
  };

  const isTodayPlanComplete = (record, tasks = getTodayPlanTasks()) =>
    tasks.length > 0 &&
    tasks.every(({ id }) => record?.exercises?.[id] === true);

  const updateTodayPlanCompletion = (record, tasks = getTodayPlanTasks()) => {
    const completedCount = tasks.filter(
      ({ id }) => record?.exercises?.[id] === true,
    ).length;
    const complete = isTodayPlanComplete(record, tasks);

    elements.todayPlanCount.textContent = complete
      ? "今日完成"
      : `${completedCount}/${tasks.length}`;
    elements.todayPlanCount.classList.toggle("is-complete", complete);
    elements.todayPlanComplete.hidden = !complete;

    return { completedCount, complete };
  };

  const setTodayPlanFeedback = (message, state = "") => {
    elements.todayPlanFeedback.textContent = message;

    if (state) {
      elements.todayPlanFeedback.dataset.state = state;
    } else {
      delete elements.todayPlanFeedback.dataset.state;
    }

    elements.todayPlanFeedback.hidden = message === "";
  };

  const celebrateTodayPlan = () => {
    if (prefersReducedMotion.matches) {
      return;
    }

    elements.todayPlanCard.classList.remove("is-celebrating");
    void elements.todayPlanCard.offsetWidth;
    elements.todayPlanCard.classList.add("is-celebrating");
    window.setTimeout(() => {
      elements.todayPlanCard.classList.remove("is-celebrating");
    }, 1200);
  };

  const renderTodayPlan = () => {
    const dateKey = toDateKey(new Date());
    const tasks = getTodayPlanTasks();
    const record = checkinRecords[dateKey] ?? null;
    const fragment = document.createDocumentFragment();

    tasks.forEach((exercise) => {
      const item = createCheckinExerciseItem(exercise, { planTask: true });
      const input = item.querySelector("input");
      const checked = record?.exercises?.[exercise.id] === true;

      if (input) {
        input.checked = checked;
        input.closest(".checkin-exercise")?.classList.toggle("is-checked", checked);
      }

      fragment.append(item);
    });

    elements.todayPlanList.replaceChildren(fragment);
    updateTodayPlanCompletion(record, tasks);
    setTodayPlanFeedback("");
  };

  const getTodayIntakeCalories = (record) => {
    if (!record?.meals) {
      return 0;
    }

    return MEAL_DEFINITIONS.reduce((total, { key }) => {
      const calories = record.meals[key]?.calories;
      return total + (Number.isFinite(calories) ? calories : 0);
    }, 0);
  };

  const getPlanTaskMinutes = (task) => {
    const routineExercise = exerciseRoutine.find(({ id }) => id === task.id);

    if (routineExercise) {
      return routineExercise.minutes;
    }

    const amount = readTrimmedString(task.amount);
    const secondsMatch = amount.match(/(\d+)\s*组\s*[×x]\s*(\d+)\s*秒/);

    if (secondsMatch) {
      return (Number(secondsMatch[1]) * Number(secondsMatch[2])) / 60;
    }

    const minutesMatch = amount.match(/(\d+)\s*分钟/);

    if (minutesMatch) {
      return Number(minutesMatch[1]);
    }

    const repsMatch = amount.match(/(\d+)\s*组\s*[×x]\s*(\d+)\s*次/);

    if (repsMatch) {
      return (Number(repsMatch[1]) * Number(repsMatch[2]) * 3) / 60;
    }

    return 5;
  };

  const getTodayBurnCalories = (record, dateKey, profile) => {
    const weight = Number(profile?.currentWeight);
    const safeWeight = Number.isFinite(weight) && weight > 0 ? weight : 60;
    const caloriesPerMinute = (5 * 3.5 * safeWeight) / 200;
    const plan = getExercisePlanForDate(dateKey);
    const exerciseMinutes = plan.reduce((total, task) => {
      if (record?.exercises?.[task.id] !== true) {
        return total;
      }

      const minutes = Number(getPlanTaskMinutes(task));
      return total + (Number.isFinite(minutes) && minutes > 0 ? minutes : 0);
    }, 0);
    const motionMinutes = (record?.motionSessions ?? []).reduce(
      (total, session) => {
        const minutes = Number(session.minutes);
        return total + (Number.isFinite(minutes) && minutes > 0 ? minutes : 0);
      },
      0,
    );
    const calories = (exerciseMinutes + motionMinutes) * caloriesPerMinute;

    return Number.isFinite(calories) ? Math.max(0, Math.round(calories)) : 0;
  };

  const renderTodayOverview = () => {
    const dateKey = toDateKey(new Date());
    const record = checkinRecords[dateKey] ?? null;
    const profile = getProfile();
    const intake = getTodayIntakeCalories(record);
    const burn = getTodayBurnCalories(record, dateKey, profile);
    const target = profile?.dailyCalorieTarget ?? null;
    const remaining =
      target === null
        ? null
        : Math.max(0, Math.round(target - intake + burn));

    elements.todayIntake.textContent = calorieFormatter.format(intake);
    elements.todayBurn.textContent = calorieFormatter.format(burn);
    elements.todayRemaining.textContent =
      remaining === null ? "—" : calorieFormatter.format(remaining);
    elements.todayOverviewTarget.textContent =
      target === null
        ? "目标未设定"
        : `目标 ${calorieFormatter.format(target)} kcal`;
    elements.todayOverviewNote.textContent =
      target === null
        ? "完善计划后可计算剩余可摄入热量。"
        : "运动消耗按体重与今日已完成训练估算。";
  };

  const renderCampusMotionStatus = () => {
    const record = checkinRecords[toDateKey(new Date())] ?? null;
    const sessions = Array.isArray(record?.motionSessions)
      ? record.motionSessions
      : [];
    const totalMinutes = sessions.reduce((total, session) => {
      const minutes = Number(session.minutes);
      return total + (Number.isFinite(minutes) ? minutes : 0);
    }, 0);

    elements.campusMotionStatus.textContent =
      sessions.length > 0
        ? `已完成 ${sessions.length} 次 · ${totalMinutes} 分钟`
        : "随时开始";
    elements.campusMotionStatus.classList.toggle("is-complete", sessions.length > 0);
  };

  const renderStreakCard = () => {
    const streak = getStreakSummary(getCheckinDates());

    elements.streakCount.textContent = String(streak.count);
    elements.streakNote.textContent = streak.checkedToday
      ? "今天的火焰已点亮，保持这份节奏。"
      : streak.count > 0
        ? "今天再打卡，就能延续连续记录。"
        : "今天打卡，开启你的连续记录。";
  };

  const renderDashboard = () => {
    const profile = getProfile();
    const progress = calculateProgress(profile);

    ensureYesterdayAdjustment();
    renderTodayPlan();
    renderCarryoverCard();
    renderTodayOverview();
    renderCampusMotionStatus();
    renderStreakCard();
    elements.profileGuide.hidden = profile !== null;

    if (!profile) {
      elements.currentWeight.textContent = "—";
      elements.targetWeight.textContent = "—";
      elements.progressPercent.textContent = "—";
      elements.progressRing.style.strokeDashoffset = "100";
      elements.weightDelta.textContent = "未设置";
      elements.weightNote.textContent = "完善个人资料后，这里会显示你的体重目标进度。";
      return;
    }

    const isGain = profile.goalType === "gain";
    const remaining = isGain
      ? profile.targetWeight - profile.currentWeight
      : profile.currentWeight - profile.targetWeight;
    const roundedProgress = progress === null ? null : Math.round(progress);

    elements.currentWeight.textContent = weightFormatter.format(profile.currentWeight);
    elements.targetWeight.textContent = weightFormatter.format(profile.targetWeight);
    elements.progressPercent.textContent = roundedProgress === null ? "—" : `${roundedProgress}%`;
    elements.progressRing.style.strokeDashoffset = String(100 - (progress ?? 0));

    if (remaining <= 0) {
      elements.weightDelta.textContent = "已达目标";
      elements.weightNote.textContent = isGain
        ? "已达成增重目标，继续保持力量训练和充足饮食。"
        : "已达成目标体重，继续保持现在的节奏。";
    } else {
      elements.weightDelta.textContent = "目标已设定";
      elements.weightNote.textContent =
        progress === null
          ? `距离${isGain ? "增重" : ""}目标还差 ${weightFormatter.format(remaining)} kg，记录初始体重后即可计算进度。`
          : `距离${isGain ? "增重" : ""}目标还差 ${weightFormatter.format(remaining)} kg，按自己的节奏继续前进。`;
    }
  };

  const getActiveCheckinRecord = (create = false) => {
    const existing = checkinRecords[activeCheckinDate];

    if (existing) {
      return existing;
    }

    const emptyRecord = createEmptyCheckinRecord(activeCheckinDate);

    if (create) {
      checkinRecords[activeCheckinDate] = emptyRecord;
    }

    return emptyRecord;
  };

  const setStorageNote = (message) => {
    checkinElements.storageNote.textContent = message;
    checkinElements.storageNote.hidden = message === "";
  };

  const writeCheckinRecord = (dateKey, record) => {
    record.updatedAt = new Date().toISOString();
    record.completed = isCheckinComplete(record, dateKey);

    try {
      localStorage.setItem(STORAGE_KEYS.checkinRecords, JSON.stringify(checkinRecords));

      const storedDates = getCheckinDates();
      const nextDates = record.completed
        ? [...new Set([...storedDates, dateKey])].sort()
        : storedDates.filter((date) => date !== dateKey);
      const datesChanged =
        nextDates.length !== storedDates.length ||
        nextDates.some((date, index) => date !== storedDates[index]);

      if (datesChanged) {
        localStorage.setItem(STORAGE_KEYS.checkins, JSON.stringify(nextDates));
      }

      setStorageNote("");
      return true;
    } catch {
      setStorageNote(
        "本地存储写入失败，本次打卡可能无法在刷新后保留。请检查浏览器存储权限或空间。",
      );
      return false;
    }
  };

  const writeActiveCheckinRecord = (record) =>
    writeCheckinRecord(activeCheckinDate, record);

  const formatWeightEntryDate = (dateKey) => {
    if (dateKey === activeCheckinDate) {
      return "今天";
    }

    const activeDate = parseDateKey(activeCheckinDate);
    const yesterday = new Date(activeDate);
    yesterday.setDate(yesterday.getDate() - 1);

    if (toDateKey(yesterday) === dateKey) {
      return "昨天";
    }

    const date = parseDateKey(dateKey);

    if (date.getFullYear() !== activeDate.getFullYear()) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }

    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const renderWeightHistory = () => {
    const entries = Object.entries(checkinRecords)
      .filter(([, record]) => record.weight !== null)
      .map(([dateKey, record]) => ({ dateKey, weight: record.weight }))
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
    const fragment = document.createDocumentFragment();

    entries.forEach(({ dateKey, weight }) => {
      const item = document.createElement("li");
      const dateLabel = document.createElement("span");
      const valueLabel = document.createElement("span");
      const unitLabel = document.createElement("small");

      if (dateKey === activeCheckinDate) {
        item.className = "is-today";
      }

      dateLabel.className = "weight-history-date";
      dateLabel.textContent = formatWeightEntryDate(dateKey);
      valueLabel.className = "weight-history-value";
      valueLabel.append(weightFormatter.format(weight));
      unitLabel.textContent = "kg";
      valueLabel.append(unitLabel);
      item.append(dateLabel, valueLabel);
      fragment.append(item);
    });

    checkinElements.weightHistory.replaceChildren(fragment);
    checkinElements.weightHistory.hidden = entries.length === 0;
    checkinElements.weightHistoryEmpty.hidden = entries.length > 0;
    checkinElements.weightCount.textContent = `${entries.length} 条`;
  };

  const renderMealSummary = (record) => {
    let completedMeals = 0;

    MEAL_DEFINITIONS.forEach(({ key }) => {
      const meal = record.meals[key];
      const complete = isMealComplete(meal);
      const partial = meal.food.trim() !== "" || meal.calories !== null;
      const stateLabel = checkinElements.mealStates.find(
        (state) => state.dataset.mealState === key,
      );

      if (complete) {
        completedMeals += 1;
      }

      if (stateLabel) {
        stateLabel.textContent = complete ? "已记录" : partial ? "待补充" : "待记录";
        stateLabel.classList.toggle("is-complete", complete);
      }
    });

    checkinElements.dietSummary.textContent = `${completedMeals}/3 餐`;
    checkinElements.dietSummary.classList.toggle(
      "is-complete",
      completedMeals === MEAL_DEFINITIONS.length,
    );
  };

  const createCheckinExerciseItem = (exercise, { planTask = false } = {}) => {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const check = document.createElement("span");
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    const meta = document.createElement("span");
    const amount = document.createElement("span");

    label.className = "checkin-exercise";
    input.type = "checkbox";

    if (planTask) {
      input.dataset.planTaskId = exercise.id;
    } else {
      input.dataset.exerciseId = exercise.id;
    }

    input.setAttribute("aria-label", `完成${exercise.name}`);
    check.className = "exercise-check";
    check.setAttribute("aria-hidden", "true");
    check.append(createIcon("check"));
    copy.className = "check-exercise-copy";
    name.textContent = exercise.name;
    meta.textContent = exercise.meta;
    amount.className = "exercise-duration";
    amount.textContent = exercise.amount;
    copy.append(name, meta);
    label.append(input, check, copy, amount);
    item.append(label);
    return item;
  };

  const renderCheckinExerciseList = () => {
    const plan = getExercisePlanForDate(activeCheckinDate);
    const fragment = document.createDocumentFragment();

    plan.forEach((exercise) => {
      fragment.append(createCheckinExerciseItem(exercise));
    });

    checkinElements.exerciseList.replaceChildren(fragment);
  };

  const renderExerciseSummary = (record) => {
    const inputs = [
      ...checkinElements.exerciseList.querySelectorAll("input[data-exercise-id]"),
    ];
    let completedCount = 0;

    inputs.forEach((input) => {
      const exerciseId = input.dataset.exerciseId;
      const checked = record.exercises[exerciseId] === true;

      input.checked = checked;
      input.closest(".checkin-exercise")?.classList.toggle("is-checked", checked);

      if (checked) {
        completedCount += 1;
      }
    });

    const isComplete = inputs.length > 0 && completedCount === inputs.length;
    checkinElements.exerciseSummary.textContent = `${completedCount}/${inputs.length} 完成`;
    checkinElements.exerciseSummary.classList.toggle("is-complete", isComplete);
    checkinElements.celebration.hidden = !isComplete;
  };

  const setExerciseFeedback = (message, state = "") => {
    checkinElements.exerciseFeedback.textContent = message;

    if (state) {
      checkinElements.exerciseFeedback.dataset.state = state;
    } else {
      delete checkinElements.exerciseFeedback.dataset.state;
    }

    checkinElements.exerciseFeedback.hidden = message === "";
  };

  const setExerciseFormFeedback = (message, state = "") => {
    checkinElements.exerciseFormFeedback.textContent = message;

    if (state) {
      checkinElements.exerciseFormFeedback.dataset.state = state;
    } else {
      delete checkinElements.exerciseFormFeedback.dataset.state;
    }

    checkinElements.exerciseFormFeedback.hidden = message === "";
  };

  const getRecentExerciseCompletion = () => {
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);

    let completedDays = 0;
    let activeDays = 0;

    for (let offset = 0; offset < 7; offset += 1) {
      const record = checkinRecords[toDateKey(cursor)];

      if (record) {
        const states = Object.values(record.exercises);

        if (states.some(Boolean)) {
          activeDays += 1;
        }

        if (states.length > 0 && states.every(Boolean)) {
          completedDays += 1;
        }
      }

      cursor.setDate(cursor.getDate() - 1);
    }

    return { completedDays, activeDays };
  };

  const getExerciseRecommendations = () => {
    const profile = getProfile();
    const rawBmi =
      profile?.bmi ??
      (profile?.height
        ? profile.currentWeight / (profile.height / 100) ** 2
        : null);
    const bmi = Number.isFinite(rawBmi) ? Math.round(rawBmi * 10) / 10 : null;
    const exerciseDays =
      profile?.exerciseDays && Number.isFinite(profile.exerciseDays)
        ? Math.min(7, Math.max(1, Math.round(profile.exerciseDays)))
        : null;
    const goalType = profile?.goalType ?? null;
    const stats = getRecentExerciseCompletion();
    const todayIds = new Set(getExercisePlanIds(activeCheckinDate));
    const isHighBmi = bmi !== null && bmi >= 28;
    const isBeginner = exerciseDays !== null && exerciseDays <= 2;
    const isActive = exerciseDays !== null && exerciseDays >= 5;
    const highImpactIds = new Set(["jumping-jack", "high-knees", "jump-rope", "burpee"]);
    let candidates = exerciseCatalog.filter((exercise) => !todayIds.has(exercise.id));

    if (isHighBmi) {
      const lowImpact = candidates.filter(
        (exercise) => exercise.difficulty <= 3 && !highImpactIds.has(exercise.id),
      );

      if (lowImpact.length >= 3) {
        candidates = lowImpact;
      }
    }

    const categoryScores =
      goalType === "gain"
        ? { lower: 3, upper: 3, core: 2, stretch: 1.5, cardio: 1 }
        : goalType === "lose"
          ? { cardio: 3, core: 2, lower: 2, upper: 1.5, stretch: 1.5 }
          : { core: 1.5, lower: 1.5, stretch: 1.5, cardio: 1, upper: 1 };

    const scored = candidates.map((exercise, index) => {
      let score = categoryScores[exercise.category] ?? 1;

      if (isBeginner) {
        score +=
          exercise.difficulty <= 2 ? 2 : exercise.difficulty >= 4 ? -2.5 : 0;
      }

      if (isHighBmi) {
        score += exercise.difficulty <= 2 ? 1.5 : exercise.difficulty >= 4 ? -3 : 0;
      }

      if (isActive && exercise.difficulty >= 3) {
        score += 0.5;
      }

      if (stats.completedDays <= 1) {
        score += exercise.category === "stretch" ? 2 : 0;
        score += exercise.difficulty <= 2 ? 1 : 0;
      }

      if (stats.completedDays >= 4) {
        if (goalType === "gain") {
          score += ["lower", "upper"].includes(exercise.category) ? 1 : 0;
        } else if (exercise.category === "cardio") {
          score += 1;
        }
      }

      return { exercise, index, score };
    });

    scored.sort((left, right) => right.score - left.score || left.index - right.index);

    const selected = [];
    const usedCategories = new Set();

    scored.forEach((entry) => {
      if (selected.length >= 3 || usedCategories.has(entry.exercise.category)) {
        return;
      }

      selected.push(entry);
      usedCategories.add(entry.exercise.category);
    });

    if (selected.length < 3) {
      scored.forEach((entry) => {
        if (selected.length >= 3 || selected.includes(entry)) {
          return;
        }

        selected.push(entry);
      });
    }

    const basis = [];

    if (!profile) {
      basis.push("尚未设置计划");
    } else {
      basis.push(goalType === "gain" ? "增重目标" : "减脂目标");
    }

    if (bmi !== null) {
      basis.push(`BMI ${bmi.toFixed(1)}`);
    }

    if (exerciseDays !== null) {
      basis.push(`每周运动 ${exerciseDays} 天`);
    }

    basis.push(
      stats.completedDays > 0
        ? `近 7 天完成 ${stats.completedDays} 次`
        : stats.activeDays > 0
          ? "近期训练待完成"
          : "近 7 天训练较少",
    );

    const contextLabel = isHighBmi
      ? "低冲击优先"
      : stats.completedDays <= 1
        ? "轻量重启"
        : goalType === "gain"
          ? "增重友好"
          : goalType === "lose"
            ? "减脂匹配"
            : "入门友好";
    const roleLabels = {
      cardio: "提升心率",
      core: "稳定核心",
      lower: "强化下肢",
      upper: "强化上肢",
      stretch: "放松恢复",
    };

    return {
      basis: basis.join(" · "),
      recommendations: selected.map(({ exercise }) => ({
        exercise,
        reason: `${contextLabel} · ${roleLabels[exercise.category] ?? "均衡训练"}`,
      })),
    };
  };

  const renderExerciseRecommendations = () => {
    const { basis, recommendations } = getExerciseRecommendations();
    const fragment = document.createDocumentFragment();

    checkinElements.exerciseRecommendBasis.textContent = `${basis}。`;

    recommendations.forEach(({ exercise, reason }) => {
      const item = document.createElement("li");
      const emoji = document.createElement("span");
      const copy = document.createElement("div");
      const name = document.createElement("strong");
      const meta = document.createElement("span");
      const reasonLabel = document.createElement("em");
      const addButton = document.createElement("button");

      item.className = "exercise-recommend-item";
      emoji.className = "exercise-recommend-emoji";
      emoji.setAttribute("aria-hidden", "true");
      emoji.textContent = exercise.emoji;
      copy.className = "exercise-recommend-copy";
      name.textContent = exercise.name;
      meta.textContent =
        `${exerciseCategoryLabels.get(exercise.category) ?? "其他"} · ` +
        `难度 ${exercise.difficulty} · ${exercise.sets}`;
      reasonLabel.textContent = reason;
      copy.append(name, meta, reasonLabel);
      addButton.type = "button";
      addButton.className = "exercise-recommend-add";
      addButton.dataset.exerciseRecommend = exercise.id;
      addButton.textContent = "加入今日";
      addButton.setAttribute("aria-label", `加入今日训练：${exercise.name}`);
      item.append(emoji, copy, addButton);
      fragment.append(item);
    });

    checkinElements.exerciseRecommendList.replaceChildren(fragment);
    checkinElements.exerciseRecommendList.hidden = recommendations.length === 0;
    checkinElements.exerciseRecommendEmpty.hidden = recommendations.length !== 0;
  };

  const refreshExerciseCheckinViews = (record = getActiveCheckinRecord(true)) => {
    renderCheckinExerciseList();
    renderExerciseSummary(record);
    renderDailyProgress(record);
    renderDashboard();
    renderExerciseRecommendations();
    refreshExerciseLibraryPlanState();

    if (checkinElements.exerciseDialog.open) {
      renderExerciseManagerList();
    }
  };

  const syncActiveExerciseRecord = () => {
    const record = getActiveCheckinRecord(true);
    const planIds = new Set(getExercisePlanIds(activeCheckinDate));

    Object.keys(record.exercises).forEach((id) => {
      if (!planIds.has(id)) {
        delete record.exercises[id];
      }
    });

    planIds.forEach((id) => {
      if (typeof record.exercises[id] !== "boolean") {
        record.exercises[id] = false;
      }
    });

    const saved = writeActiveCheckinRecord(record);
    return { record, saved };
  };

  const saveExerciseRoutineState = (nextRoutine) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.exerciseRoutine,
        JSON.stringify(nextRoutine),
      );
      exerciseRoutine = nextRoutine;
      return true;
    } catch {
      return false;
    }
  };

  const resetExerciseForm = () => {
    editingExerciseId = null;
    checkinElements.exerciseForm.reset();
    checkinElements.exerciseTypeInput.value = "有氧";
    checkinElements.exerciseMinutesInput.value = "20";
    checkinElements.exerciseFormTitle.textContent = "添加训练";
    checkinElements.exerciseSave.textContent = "添加训练";
    checkinElements.exerciseCancel.hidden = true;
    checkinElements.exerciseNameInput.removeAttribute("aria-invalid");
    checkinElements.exerciseMinutesInput.removeAttribute("aria-invalid");
    setExerciseFormFeedback("");
  };

  const createExerciseManagerRow = ({
    name,
    meta,
    primaryAction,
    removeAction,
    isEditing = false,
    removeDisabled = false,
  }) => {
    const item = document.createElement("li");
    const copy = document.createElement("div");
    const nameLabel = document.createElement("strong");
    const metaLabel = document.createElement("span");
    const actions = document.createElement("div");

    item.className = "preset-list-item";
    item.classList.toggle("is-editing", isEditing);
    copy.className = "preset-list-copy";
    nameLabel.textContent = name;
    metaLabel.textContent = meta;
    copy.append(nameLabel, metaLabel);
    actions.className = "preset-list-actions";

    if (primaryAction) {
      const editButton = document.createElement("button");

      editButton.type = "button";
      editButton.className = "preset-row-action";
      editButton.dataset.exerciseEdit = primaryAction.id;
      editButton.textContent = "编辑";
      editButton.setAttribute("aria-label", `编辑${name}`);
      actions.append(editButton);
    }

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "preset-row-action";
    deleteButton.dataset.exerciseDelete = removeAction.id;
    deleteButton.textContent = "删除";
    deleteButton.setAttribute("aria-label", `删除${name}`);
    deleteButton.disabled = removeDisabled;

    if (removeDisabled) {
      deleteButton.title = "至少保留 1 项每日训练";
    }

    actions.append(deleteButton);
    item.append(copy, actions);
    return item;
  };

  const renderExerciseManagerList = () => {
    const routineFragment = document.createDocumentFragment();
    const extraFragment = document.createDocumentFragment();
    const extraIds = getCustomExerciseIds(activeCheckinDate).filter((id) =>
      exerciseById.has(id),
    );

    checkinElements.exerciseRoutineCount.textContent =
      `${exerciseRoutine.length} / ${MAX_DAILY_EXERCISES}`;

    exerciseRoutine.forEach((exercise) => {
      routineFragment.append(
        createExerciseManagerRow({
          name: exercise.name,
          meta: `${exercise.type} · ${exercise.minutes} 分钟`,
          primaryAction: { id: exercise.id },
          removeAction: { id: exercise.id },
          isEditing: exercise.id === editingExerciseId,
          removeDisabled: exerciseRoutine.length <= 1,
        }),
      );
    });

    checkinElements.exerciseRoutineList.replaceChildren(routineFragment);

    extraIds.forEach((id) => {
      const exercise = exerciseById.get(id);
      const item = document.createElement("li");
      const copy = document.createElement("div");
      const name = document.createElement("strong");
      const meta = document.createElement("span");
      const actions = document.createElement("div");
      const removeButton = document.createElement("button");

      item.className = "preset-list-item exercise-extra-item";
      copy.className = "preset-list-copy";
      name.textContent = exercise.name;
      meta.textContent = `${exerciseCategoryLabels.get(exercise.category) ?? "其他"} · 动作库`;
      copy.append(name, meta);
      actions.className = "preset-list-actions";
      removeButton.type = "button";
      removeButton.className = "preset-row-action";
      removeButton.dataset.exerciseRemoveExtra = id;
      removeButton.textContent = "移出";
      removeButton.setAttribute("aria-label", `将${exercise.name}移出今日训练`);
      actions.append(removeButton);
      item.append(copy, actions);
      extraFragment.append(item);
    });

    checkinElements.exerciseExtraList.replaceChildren(extraFragment);
    checkinElements.exerciseExtraHeading.hidden = extraIds.length === 0;
    checkinElements.exerciseExtraList.hidden = extraIds.length === 0;
  };

  const openExerciseEditor = () => {
    refreshCheckinDate();
    resetExerciseForm();
    renderExerciseManagerList();

    if (!checkinElements.exerciseDialog.open) {
      rememberDialogTrigger(checkinElements.exerciseDialog);
      checkinElements.exerciseDialog.showModal();
    }

    checkinElements.exerciseDialogClose.focus({ preventScroll: true });
  };

  const closeExerciseEditor = () => {
    if (checkinElements.exerciseDialog.open) {
      checkinElements.exerciseDialog.close();
    }
  };

  const startEditingRoutineExercise = (exerciseId) => {
    const exercise = exerciseRoutine.find((item) => item.id === exerciseId);

    if (!exercise) {
      renderExerciseManagerList();
      return;
    }

    editingExerciseId = exercise.id;
    checkinElements.exerciseFormTitle.textContent = "编辑训练";
    checkinElements.exerciseSave.textContent = "保存修改";
    checkinElements.exerciseCancel.hidden = false;
    checkinElements.exerciseNameInput.value = exercise.name;
    checkinElements.exerciseTypeInput.value = exercise.type;
    checkinElements.exerciseMinutesInput.value = String(exercise.minutes);
    checkinElements.exerciseNameInput.removeAttribute("aria-invalid");
    checkinElements.exerciseMinutesInput.removeAttribute("aria-invalid");
    setExerciseFormFeedback("");
    renderExerciseManagerList();
    checkinElements.exerciseForm.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
    checkinElements.exerciseNameInput.focus({ preventScroll: true });
    checkinElements.exerciseNameInput.select();
  };

  const addRecommendedExerciseToToday = (exerciseId) => {
    const exercise = exerciseById.get(exerciseId);

    if (!exercise) {
      renderExerciseRecommendations();
      return;
    }

    refreshCheckinDate();
    const dateKey = activeCheckinDate;

    if (getExercisePlanIds(dateKey).includes(exerciseId)) {
      renderExerciseRecommendations();
      setExerciseFeedback(`「${exercise.name}」已在今日训练中。`);
      return;
    }

    const nextIds = [...new Set([...getCustomExerciseIds(dateKey), exerciseId])];
    const nextPlans = { ...exercisePlans, [dateKey]: nextIds };

    try {
      localStorage.setItem(
        STORAGE_KEYS.exercisePlans,
        JSON.stringify(nextPlans),
      );
    } catch {
      setExerciseFeedback(
        "保存失败，推荐动作未能加入今日训练。请检查浏览器存储权限或空间。",
        "error",
      );
      return;
    }

    exercisePlans = nextPlans;
    const record = getActiveCheckinRecord(true);
    record.exercises[exerciseId] = false;
    getExercisePlanIds(dateKey).forEach((id) => {
      if (record.exercises[id] !== true) {
        record.exercises[id] = false;
      }
    });

    const synced = writeCheckinRecord(dateKey, record);

    if (dateKey === activeCheckinDate) {
      refreshExerciseCheckinViews(record);
    }

    setExerciseFeedback(
      synced
        ? `已将「${exercise.name}」加入今日训练，完成后记得勾选。`
        : `已加入「${exercise.name}」，但打卡同步失败，请刷新页面后重试。`,
      synced ? "success" : "error",
    );
  };

  const renderWeightSummary = (record) => {
    const hasWeight = record.weight !== null;

    checkinElements.weightSummary.textContent = hasWeight
      ? `${weightFormatter.format(record.weight)} kg`
      : "待记录";
    checkinElements.weightSummary.classList.toggle("is-complete", hasWeight);
  };

  const renderDailyProgress = (record, dateKey = activeCheckinDate) => {
    const modules = getModuleCompletion(record, dateKey);
    const completedCount = Object.values(modules).filter(Boolean).length;
    const totalCount = Object.keys(modules).length;
    const missingLabels = Object.entries(modules)
      .filter(([, complete]) => !complete)
      .map(([moduleKey]) => MODULE_LABELS[moduleKey]);
    const streak = getStreakSummary(getCheckinDates());

    checkinElements.streakCount.textContent = String(streak.count);
    checkinElements.dailyProgressLabel.textContent = `${completedCount}/${totalCount}`;
    checkinElements.dailyProgressBar.style.width = `${(completedCount / totalCount) * 100}%`;
    checkinElements.hero.classList.toggle("is-complete", completedCount === totalCount);
    checkinElements.todayStatus.textContent =
      completedCount === totalCount
        ? "今日三项已完成，打卡成功。"
        : `今日打卡还差 ${totalCount - completedCount} 项：${missingLabels.join("、")}`;

    checkinElements.heroChecks.forEach((item) => {
      const moduleKey = item.dataset.dailyModule;
      const complete = modules[moduleKey] === true;
      item.classList.toggle("is-complete", complete);
      item.setAttribute(
        "aria-label",
        `${MODULE_LABELS[moduleKey]}${complete ? "已完成" : "未完成"}`,
      );
    });
  };

  const hideWeightFeedback = () => {
    checkinElements.weightFeedback.hidden = true;
    checkinElements.weightFeedback.textContent = "";
    delete checkinElements.weightFeedback.dataset.state;
  };

  const showWeightFeedback = (message, state) => {
    checkinElements.weightFeedback.dataset.state = state;
    checkinElements.weightFeedback.textContent = message;
    checkinElements.weightFeedback.hidden = false;
  };

  const hydrateCheckinForm = (record) => {
    checkinElements.mealInputs.forEach((input) => {
      const meal = record.meals[input.dataset.mealField];

      if (!meal) {
        return;
      }

      if (input.dataset.mealPart === "food") {
        input.value = meal.food;
      } else {
        input.value = meal.calories === null ? "" : String(meal.calories);
      }
    });

    checkinElements.weightInput.value = record.weight === null ? "" : String(record.weight);
  };

  const setDishSearchStatus = (message, state = "") => {
    checkinElements.dishSearchStatus.textContent = message;

    if (state) {
      checkinElements.dishSearchStatus.dataset.state = state;
    } else {
      delete checkinElements.dishSearchStatus.dataset.state;
    }
  };

  const renderMealPresetList = (list) => {
    const mealKey = list.dataset.mealPresetList;

    if (!MEAL_LABELS[mealKey]) {
      return;
    }

    const presets = mealPresetState[mealKey] ?? [];

    list
      .querySelectorAll("[data-preset-id], .meal-preset-empty")
      .forEach((node) => node.remove());

    if (presets.length === 0) {
      const empty = document.createElement("span");
      empty.className = "meal-preset-empty";
      empty.textContent = "点设置添加";
      list.append(empty);
      return;
    }

    presets.forEach((preset) => {
      const button = document.createElement("button");
      const food = document.createElement("span");
      const calories = document.createElement("small");

      button.type = "button";
      button.className = "meal-preset";
      button.dataset.presetId = preset.id;
      button.setAttribute(
        "aria-label",
        `填入${MEAL_LABELS[mealKey]}：${preset.food}，${preset.calories} 千卡`,
      );
      food.textContent = preset.food;
      calories.textContent = `${preset.calories} kcal`;
      button.append(food, calories);
      list.append(button);
    });
  };

  const renderAllMealPresets = () => {
    checkinElements.mealPresetLists.forEach(renderMealPresetList);
  };

  const createDishResultButton = (dish, mealKey) => {
    const button = document.createElement("button");
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    const meta = document.createElement("small");
    const calories = document.createElement("span");
    const calorieValue = document.createElement("strong");
    const calorieUnit = document.createElement("small");

    button.type = "button";
    button.className = "dish-result";
    button.dataset.dishId = dish.id;
    button.setAttribute(
      "aria-label",
      `填入${MEAL_LABELS[mealKey]}：${dish.name}，${dish.calories} 千卡，${dish.portion}`,
    );
    copy.className = "dish-result-copy";
    name.textContent = dish.name;
    meta.textContent = `${dish.category} · ${dish.portion}`;
    copy.append(name, meta);
    calories.className = "dish-result-calories";
    calorieValue.textContent = calorieFormatter.format(dish.calories);
    calorieUnit.textContent = "kcal";
    calories.append(calorieValue, calorieUnit);
    button.append(copy, calories);
    return button;
  };

  const renderDishSearch = () => {
    const query = dishSearchQuery.trim();
    const mealKey = selectedDishMeal;
    const results = query
      ? searchDishes(query, mealKey)
      : getRecommendedDishes(mealKey);
    const fragment = document.createDocumentFragment();

    checkinElements.dishMealButtons.forEach((button) => {
      const isActive = button.dataset.dishMeal === mealKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    checkinElements.dishDatabaseCount.textContent =
      `${dishCatalog.length} 道菜品`;
    checkinElements.dishResultsTitle.textContent = query ? "搜索结果" : "推荐菜品";
    checkinElements.dishResultCount.textContent = `${results.length} 道`;
    checkinElements.dishSearchClear.hidden = query === "";

    results.forEach((dish) => {
      const item = document.createElement("li");
      item.append(createDishResultButton(dish, mealKey));
      fragment.append(item);
    });

    checkinElements.dishResultList.replaceChildren(fragment);
    checkinElements.dishEmpty.hidden = results.length > 0;
    checkinElements.dishEmpty.textContent =
      dishCatalog.length === 0
        ? "菜品数据暂不可用，可直接在下方手动记录。"
        : query
          ? "没有找到相关菜品，换个关键词试试，或直接在下方手动记录。"
          : "暂时没有推荐菜品，试试搜索其他菜名。";

    return { query, results };
  };

  const announceDishSearch = ({ query, results }) => {
    const mealLabel = MEAL_LABELS[selectedDishMeal];

    if (!query) {
      setDishSearchStatus(`点选推荐菜品，将填入${mealLabel}。`);
      return;
    }

    if (results.length === 0) {
      setDishSearchStatus(
        `没有找到“${query}”相关菜品，试试更短的关键词。`,
        "warning",
      );
      return;
    }

    setDishSearchStatus(
      `找到 ${results.length} 道菜品，点选即可填入${mealLabel}。`,
    );
  };

  const fillMealValues = (mealKey, foodValue, caloriesValue) => {
    const food = readTrimmedString(foodValue).slice(0, 80);
    const calories = toValidCheckinCalories(caloriesValue);

    if (!MEAL_LABELS[mealKey] || !food || calories === null) {
      return false;
    }

    const foodInput = getMealInput(mealKey, "food");
    const caloriesInput = getMealInput(mealKey, "calories");

    if (!foodInput || !caloriesInput) {
      return false;
    }

    const record = getActiveCheckinRecord(true);
    record.meals[mealKey] = { food, calories };
    foodInput.value = food;
    caloriesInput.value = String(calories);
    writeActiveCheckinRecord(record);
    renderMealSummary(record);
    renderDailyProgress(record);
    return true;
  };

  const getMealPhotoCutoffKey = () => {
    const cutoff = new Date();
    cutoff.setHours(12, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (MEAL_PHOTO_RETENTION_DAYS - 1));
    return toDateKey(cutoff);
  };

  const isSupportedMealPhotoDataUrl = (value) =>
    typeof value === "string" &&
    value.startsWith("data:image/jpeg;base64,") &&
    value.length <= MEAL_PHOTO_MAX_DATA_URL_LENGTH;

  const normalizeMealPhotoStore = (source) => {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return {};
    }

    const todayKey = toDateKey(new Date());
    const cutoffKey = getMealPhotoCutoffKey();
    const normalized = {};

    Object.entries(source).forEach(([dateKey, mealsSource]) => {
      if (
        !isValidDateKey(dateKey) ||
        dateKey < cutoffKey ||
        dateKey > todayKey ||
        !mealsSource ||
        typeof mealsSource !== "object" ||
        Array.isArray(mealsSource)
      ) {
        return;
      }

      const meals = {};

      MEAL_DEFINITIONS.forEach(({ key }) => {
        const photo = mealsSource[key];

        if (!photo || typeof photo !== "object") {
          return;
        }

        if (!isSupportedMealPhotoDataUrl(photo.dataUrl)) {
          return;
        }

        meals[key] = {
          dataUrl: photo.dataUrl,
          updatedAt:
            typeof photo.updatedAt === "string" ? photo.updatedAt : null,
        };
      });

      if (Object.keys(meals).length > 0) {
        normalized[dateKey] = meals;
      }
    });

    return normalized;
  };

  const writeMealPhotoStore = (nextStore) => {
    const normalized = normalizeMealPhotoStore(nextStore);

    try {
      localStorage.setItem(STORAGE_KEYS.mealPhotos, JSON.stringify(normalized));
      mealPhotoStore = normalized;
      return true;
    } catch {
      return false;
    }
  };

  const loadMealPhotoStore = () => {
    if (mealPhotoStore !== null) {
      return mealPhotoStore;
    }

    const raw = readStorage(STORAGE_KEYS.mealPhotos, {});
    const normalized = normalizeMealPhotoStore(raw);
    mealPhotoStore = normalized;

    try {
      if (JSON.stringify(raw) !== JSON.stringify(normalized)) {
        localStorage.setItem(STORAGE_KEYS.mealPhotos, JSON.stringify(normalized));
      }
    } catch {
      // 清理失败不阻塞记录，后续保存时会再次尝试。
    }

    return mealPhotoStore;
  };

  const getStoredMealPhoto = (dateKey, mealKey) => {
    const store = loadMealPhotoStore();
    return store[dateKey]?.[mealKey] ?? null;
  };

  const saveMealPhoto = (dateKey, mealKey, dataUrl) => {
    if (
      !isValidDateKey(dateKey) ||
      !MEAL_LABELS[mealKey] ||
      !isSupportedMealPhotoDataUrl(dataUrl)
    ) {
      return false;
    }

    const nextStore = {};

    Object.entries(loadMealPhotoStore()).forEach(([storedDate, meals]) => {
      nextStore[storedDate] = { ...meals };
    });

    nextStore[dateKey] = {
      ...(nextStore[dateKey] ?? {}),
      [mealKey]: { dataUrl, updatedAt: new Date().toISOString() },
    };

    return writeMealPhotoStore(nextStore);
  };

  const renderMealPhotoSlots = () => {
    loadMealPhotoStore();

    checkinElements.mealPhotoSlots.forEach((slot) => {
      const mealKey = slot.dataset.mealPhoto;

      if (!MEAL_LABELS[mealKey]) {
        return;
      }

      const photo = getStoredMealPhoto(activeCheckinDate, mealKey);
      slot.replaceChildren();
      slot.hidden = !photo;

      if (!photo) {
        return;
      }

      const button = document.createElement("button");
      const image = document.createElement("img");
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      const hint = document.createElement("span");
      const arrow = document.createElement("span");

      button.type = "button";
      button.className = "meal-photo-thumb";
      button.setAttribute(
        "aria-label",
        `查看或更换${MEAL_LABELS[mealKey]}的拍照记餐`,
      );
      image.src = photo.dataUrl;
      image.alt = `${MEAL_LABELS[mealKey]}拍照记录缩略图`;
      image.loading = "lazy";
      image.decoding = "async";
      copy.className = "meal-photo-thumb-copy";
      title.textContent = `${MEAL_LABELS[mealKey]} · 拍照记餐`;
      hint.textContent = "照片仅保存在本机，点击查看或更换";
      copy.append(title, hint);
      arrow.className = "meal-photo-thumb-arrow";
      arrow.textContent = "查看";
      button.append(image, copy, arrow);
      button.addEventListener("click", () => {
        openPhotoMealDialog(mealKey, { useStoredPhoto: true });
      });
      slot.append(button);
    });
  };

  const setPhotoMealFeedback = (message, state = "error") => {
    const feedback = checkinElements.photoMealFeedback;

    if (!message) {
      feedback.hidden = true;
      feedback.textContent = "";
      delete feedback.dataset.state;
      return;
    }

    feedback.textContent = message;
    feedback.hidden = false;

    if (state) {
      feedback.dataset.state = state;
    } else {
      delete feedback.dataset.state;
    }
  };

  const setPhotoMealAiStatus = (message, state = "") => {
    const status = checkinElements.photoMealAiStatus;

    if (!message) {
      status.hidden = true;
      status.textContent = "";
      delete status.dataset.state;
      return;
    }

    status.textContent = message;
    status.hidden = false;

    if (state) {
      status.dataset.state = state;
    } else {
      delete status.dataset.state;
    }
  };

  const setPhotoMealSearchStatus = (message, state = "") => {
    const status = checkinElements.photoMealSearchStatus;
    status.textContent = message;

    if (state) {
      status.dataset.state = state;
    } else {
      delete status.dataset.state;
    }
  };

  const updatePhotoMealSaveState = () => {
    const canSave = Boolean(
      photoMealState.dataUrl &&
        photoMealState.selectedDish &&
        !photoMealState.busy,
    );

    checkinElements.photoMealSave.disabled = !canSave;
    checkinElements.photoMealSave.textContent =
      `记入${MEAL_LABELS[photoMealState.mealKey]}`;
    checkinElements.photoMealAi.disabled =
      photoMealState.busy || !photoMealState.dataUrl;
    checkinElements.photoMealPick.disabled = photoMealState.busy;
    checkinElements.photoMealRepick.disabled = photoMealState.busy;
  };

  const setPhotoMealBusy = (busy) => {
    photoMealState.busy = busy;
    updatePhotoMealSaveState();
  };

  const showPhotoMealImage = (dataUrl, width = 0, height = 0, bytes = 0) => {
    photoMealState.dataUrl = dataUrl;
    photoMealState.width = width;
    photoMealState.height = height;
    photoMealState.bytes = bytes;
    checkinElements.photoMealPreviewImage.src = dataUrl;
    checkinElements.photoMealPreview.hidden = false;
    checkinElements.photoMealPick.hidden = true;
    checkinElements.photoMealFileStatus.textContent =
      bytes > 0
        ? `已压缩 · ${width} × ${height} · ${Math.max(1, Math.round(bytes / 1024))} KB`
        : "已从本机照片载入";
    updatePhotoMealSaveState();
  };

  const renderPhotoMealDishSelection = () => {
    checkinElements.photoMealDishList
      .querySelectorAll("[data-photo-dish-id]")
      .forEach((button) => {
        const selected =
          button.dataset.photoDishId === photoMealState.selectedDish?.id;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
  };

  const updatePhotoMealCaloriesPreview = () => {
    const dish = photoMealState.selectedDish;
    const portion = checkinElements.photoMealPortionSelect;

    if (!dish) {
      checkinElements.photoMealPortion.hidden = true;
      checkinElements.photoMealCalories.textContent = "—";
      updatePhotoMealSaveState();
      return;
    }

    photoMealState.multiplier = Number(portion.value) || 1;
    const calories = Math.round(dish.calories * photoMealState.multiplier);
    checkinElements.photoMealCalories.textContent =
      calorieFormatter.format(Math.max(1, calories));
    checkinElements.photoMealPortion.hidden = false;
    updatePhotoMealSaveState();
  };

  const selectPhotoMealDish = (dish) => {
    if (!dish) {
      return;
    }

    photoMealState.selectedDish = dish;
    photoMealState.multiplier = 1;
    const portionSelect = checkinElements.photoMealPortionSelect;
    const options = MEAL_PHOTO_PORTIONS.map(({ value, label }) => {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent =
        `${label} · ${calorieFormatter.format(Math.max(1, Math.round(dish.calories * value)))} kcal`;
      return option;
    });

    portionSelect.replaceChildren(...options);
    portionSelect.value = "1";
    checkinElements.photoMealSelectedDish.textContent = dish.name;
    checkinElements.photoMealSelectedMeta.textContent =
      `${dish.category} · 基准 ${dish.portion} · ${calorieFormatter.format(dish.calories)} kcal`;
    renderPhotoMealDishSelection();
    updatePhotoMealCaloriesPreview();
    setPhotoMealSearchStatus(
      `已选择「${dish.name}」，确认份量后即可记入。`,
      "success",
    );
  };

  const clearPhotoMealDishSelection = () => {
    photoMealState.selectedDish = null;
    photoMealState.multiplier = 1;
    checkinElements.photoMealPortion.hidden = true;
    checkinElements.photoMealPortionSelect.replaceChildren();
    checkinElements.photoMealSelectedDish.textContent = "—";
    checkinElements.photoMealSelectedMeta.textContent = "—";
    checkinElements.photoMealCalories.textContent = "—";
    renderPhotoMealDishSelection();
    updatePhotoMealSaveState();
  };

  const renderPhotoMealDishes = () => {
    const query = photoMealState.searchQuery.trim();
    const results = query
      ? searchDishes(query, photoMealState.mealKey)
      : getRecommendedDishes(photoMealState.mealKey);
    const fragment = document.createDocumentFragment();

    results.forEach((dish) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      const copy = document.createElement("span");
      const name = document.createElement("strong");
      const meta = document.createElement("span");
      const calories = document.createElement("span");

      button.type = "button";
      button.className = "photo-meal-dish";
      button.dataset.photoDishId = dish.id;
      button.setAttribute("aria-pressed", "false");
      button.setAttribute(
        "aria-label",
        `选择${dish.name}，基准 ${dish.calories} 千卡，${dish.portion}`,
      );
      copy.className = "photo-meal-dish-copy";
      name.textContent = dish.name;
      meta.textContent = `${dish.category} · ${dish.portion}`;
      copy.append(name, meta);
      calories.className = "photo-meal-dish-kcal";
      calories.textContent = `${calorieFormatter.format(dish.calories)} kcal`;
      button.append(copy, calories);
      item.append(button);
      fragment.append(item);
    });

    checkinElements.photoMealDishList.replaceChildren(fragment);
    checkinElements.photoMealDishEmpty.hidden = results.length > 0;
    checkinElements.photoMealDishEmpty.textContent = query
      ? "没有找到相关菜品，换个关键词试试。"
      : "菜品数据暂不可用，可直接在下方手动记录。";

    if (query) {
      setPhotoMealSearchStatus(
        results.length > 0
          ? `找到 ${results.length} 道菜品，点选后确认份量。`
          : `没有找到“${query}”相关菜品，换个关键词试试。`,
      );
    } else {
      setPhotoMealSearchStatus("从推荐菜品中选一道，或搜索其他菜品。");
    }

    renderPhotoMealDishSelection();
  };

  const focusPhotoMealSearch = () => {
    const input = checkinElements.photoMealSearchInput;
    input.scrollIntoView({ block: "nearest" });
    input.focus({ preventScroll: true });
    input.select();
  };

  const findPhotoMealDish = (name) => {
    const phrase = normalizeDishSearchText(name);

    if (!phrase) {
      return null;
    }

    return (
      dishCatalog.find(
        (dish) => normalizeDishSearchText(dish.name) === phrase,
      ) ??
      dishCatalog.find((dish) =>
        dish.aliases.some(
          (alias) => normalizeDishSearchText(alias) === phrase,
        ),
      ) ??
      dishCatalog.find(
        (dish) =>
          normalizeDishSearchText(dish.name).includes(phrase) ||
          phrase.includes(normalizeDishSearchText(dish.name)),
      ) ??
      dishCatalog.find((dish) =>
        dish.aliases.some((alias) => {
          const normalizedAlias = normalizeDishSearchText(alias);
          return normalizedAlias.includes(phrase) || phrase.includes(normalizedAlias);
        }),
      ) ??
      null
    );
  };

  const decodePhotoFile = async (file) => {
    if (typeof createImageBitmap === "function") {
      try {
        const bitmap = await createImageBitmap(file, {
          imageOrientation: "from-image",
        });
        return {
          source: bitmap,
          width: bitmap.width,
          height: bitmap.height,
          close: () => bitmap.close(),
        };
      } catch {
        // 部分浏览器不支持 createImageBitmap 的图片选项，继续用 Image 解码。
      }
    }

    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        resolve({
          source: image,
          width: image.naturalWidth,
          height: image.naturalHeight,
          close: () => URL.revokeObjectURL(objectUrl),
        });
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("decode_failed"));
      };
      image.src = objectUrl;
    });
  };

  const getDataUrlByteSize = (dataUrl) => {
    const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    return Math.floor((base64.length * 3) / 4) - padding;
  };

  const compressMealPhoto = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("not_an_image");
    }

    if (file.size > 30 * 1024 * 1024) {
      throw new Error("file_too_large");
    }

    const decoded = await decodePhotoFile(file);

    try {
      if (!decoded.width || !decoded.height) {
        throw new Error("decode_failed");
      }

      const initialScale = Math.min(
        1,
        MEAL_PHOTO_MAX_EDGE / Math.max(decoded.width, decoded.height),
      );
      let width = Math.max(1, Math.round(decoded.width * initialScale));
      let height = Math.max(1, Math.round(decoded.height * initialScale));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("canvas_unavailable");
      }

      let quality = MEAL_PHOTO_JPEG_QUALITY;
      let dataUrl = "";

      for (let attempt = 0; attempt < 16; attempt += 1) {
        canvas.width = width;
        canvas.height = height;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(decoded.source, 0, 0, width, height);
        dataUrl = canvas.toDataURL("image/jpeg", quality);

        if (getDataUrlByteSize(dataUrl) <= MEAL_PHOTO_MAX_BYTES) {
          return {
            dataUrl,
            width,
            height,
            bytes: getDataUrlByteSize(dataUrl),
          };
        }

        if (quality > 0.3) {
          quality = Math.max(0.3, Math.round((quality - 0.07) * 100) / 100);
          continue;
        }

        if (Math.max(width, height) <= 320) {
          break;
        }

        width = Math.max(1, Math.round(width * 0.82));
        height = Math.max(1, Math.round(height * 0.82));
        quality = 0.5;
      }

      throw new Error("compress_too_large");
    } finally {
      decoded.close();
    }
  };

  const handlePhotoMealFile = async (file) => {
    const dialogOpen = checkinElements.photoMealDialog.open;

    if (!file || !dialogOpen) {
      return;
    }

    const token = photoMealCompressionToken + 1;
    photoMealCompressionToken = token;
    setPhotoMealBusy(true);
    setPhotoMealFeedback("正在压缩照片…", "");
    setPhotoMealAiStatus("");

    try {
      const compressed = await compressMealPhoto(file);

      if (token !== photoMealCompressionToken || !checkinElements.photoMealDialog.open) {
        return;
      }

      showPhotoMealImage(
        compressed.dataUrl,
        compressed.width,
        compressed.height,
        compressed.bytes,
      );
      setPhotoMealFeedback("");
      setPhotoMealSearchStatus("照片已就绪，可以点 AI 识别或直接选菜。");
    } catch (error) {
      if (token !== photoMealCompressionToken) {
        return;
      }

      const message =
        error instanceof Error && error.message === "file_too_large"
          ? "照片太大，请选择 30MB 以内的图片。"
          : error instanceof Error && error.message === "compress_too_large"
            ? "照片压缩后仍超过 80KB，请换一张更简单的照片。"
            : error instanceof Error && error.message === "not_an_image"
              ? "请选择图片文件。"
              : "无法读取这张照片，请换一张 JPG 或 PNG 图片。";
      setPhotoMealFeedback(message, "error");
    } finally {
      if (token === photoMealCompressionToken) {
        setPhotoMealBusy(false);
      }
    }
  };

  const requestPhotoMealRecognition = async () => {
    if (!photoMealState.dataUrl || photoMealState.busy) {
      setPhotoMealFeedback("先拍照或选择一张照片。", "error");
      return;
    }

    const token = photoMealState.requestToken + 1;
    photoMealState.requestToken = token;
    setPhotoMealBusy(true);
    setPhotoMealFeedback("");
    setPhotoMealAiStatus("正在识别餐盘里的主要菜品…");
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      PHOTO_RECOGNITION_TIMEOUT_MS,
    );

    try {
      const response = await fetch(PHOTO_RECOGNITION_ENDPOINT, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-Visitor-Id": getAiVisitorId(),
        },
        body: JSON.stringify({ image: photoMealState.dataUrl }),
        signal: controller.signal,
      });
      let payload = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (token !== photoMealState.requestToken) {
        return;
      }

      if (!response.ok) {
        if (response.status === 429 && payload?.code === "quota_exhausted") {
          setPhotoMealAiStatus(
            "今日识别次数已用完，请手动输入",
            "warning",
          );
          focusPhotoMealSearch();
          return;
        }

        if (response.status === 429 && payload?.code === "abuse_blocked") {
          setPhotoMealAiStatus(
            "识别请求过于频繁，已暂停 AI 识别，请改用本地菜品库手动选择。",
            "warning",
          );
          focusPhotoMealSearch();
          return;
        }

        if (response.status === 503) {
          setPhotoMealAiStatus(
            "AI 识别服务暂未配置，已回退到本地菜品库，请手动选择或输入。",
            "warning",
          );
        } else {
          setPhotoMealAiStatus(
            "AI 识别暂不可用，已回退到本地菜品库，请手动选择或输入。",
            "warning",
          );
        }

        focusPhotoMealSearch();
        return;
      }

      if (
        !payload ||
        payload.ok !== true ||
        typeof payload.dish !== "string"
      ) {
        throw new Error("invalid_result");
      }

      const rawConfidence = Number(payload.confidence);
      let confidence = Number.isFinite(rawConfidence) ? rawConfidence : 0;

      if (confidence > 1 && confidence <= 100) {
        confidence /= 100;
      }

      confidence = Math.min(1, Math.max(0, confidence));
      const recognizedName = payload.dish.trim().slice(0, 30);
      const confidencePercent = Math.round(confidence * 100);

      if (
        !recognizedName ||
        confidence < PHOTO_RECOGNITION_CONFIDENCE
      ) {
        photoMealState.searchQuery = recognizedName;
        checkinElements.photoMealSearchInput.value = recognizedName;
        clearPhotoMealDishSelection();
        renderPhotoMealDishes();

        setPhotoMealAiStatus(
          recognizedName
            ? `没认出来，请手动选择或输入。（识别到「${recognizedName}」，置信度 ${confidencePercent}%）`
            : "没认出来，请手动选择或输入。",
          "warning",
        );
        focusPhotoMealSearch();
        return;
      }

      const matchedDish = findPhotoMealDish(recognizedName);

      if (!matchedDish) {
        photoMealState.searchQuery = recognizedName;
        checkinElements.photoMealSearchInput.value = recognizedName;
        clearPhotoMealDishSelection();
        renderPhotoMealDishes();
        setPhotoMealAiStatus(
          `识别到「${recognizedName}」，本地菜品库暂未匹配，请手动修正/搜索。`,
          "warning",
        );
        focusPhotoMealSearch();
        return;
      }

      photoMealState.searchQuery = recognizedName;
      checkinElements.photoMealSearchInput.value = recognizedName;
      renderPhotoMealDishes();
      selectPhotoMealDish(matchedDish);
      setPhotoMealAiStatus(
        `识别到「${recognizedName}」，已匹配「${matchedDish.name}」，请确认份量。`,
      );
    } catch (error) {
      if (token !== photoMealState.requestToken) {
        return;
      }

      setPhotoMealAiStatus(
        error instanceof Error && error.name === "AbortError"
          ? "AI 识别超时，已回退到本地菜品库，请手动选择或输入。"
          : "AI 识别暂不可用，已回退到本地菜品库，请手动选择或输入。",
        "warning",
      );
      focusPhotoMealSearch();
    } finally {
      window.clearTimeout(timeout);

      if (token === photoMealState.requestToken) {
        setPhotoMealBusy(false);
      }
    }
  };

  const resetPhotoMealDialog = () => {
    photoMealCompressionToken += 1;
    photoMealState.requestToken += 1;
    photoMealState.dataUrl = "";
    photoMealState.width = 0;
    photoMealState.height = 0;
    photoMealState.bytes = 0;
    photoMealState.selectedDish = null;
    photoMealState.multiplier = 1;
    photoMealState.searchQuery = "";
    photoMealState.busy = false;
    checkinElements.photoMealFile.value = "";
    checkinElements.photoMealPreviewImage.removeAttribute("src");
    checkinElements.photoMealPreview.hidden = true;
    checkinElements.photoMealPick.hidden = false;
    checkinElements.photoMealAiStatus.hidden = true;
    checkinElements.photoMealSearchInput.value = "";
    checkinElements.photoMealDishList.replaceChildren();
    checkinElements.photoMealPortion.hidden = true;
    checkinElements.photoMealPortionSelect.replaceChildren();
    checkinElements.photoMealSelectedDish.textContent = "—";
    checkinElements.photoMealSelectedMeta.textContent = "—";
    checkinElements.photoMealCalories.textContent = "—";
    setPhotoMealFeedback("");
    setPhotoMealAiStatus("");
    setPhotoMealMeal(getDefaultDishMeal());
    updatePhotoMealSaveState();
  };

  const setPhotoMealMeal = (mealKey) => {
    if (!MEAL_LABELS[mealKey]) {
      return;
    }

    photoMealState.mealKey = mealKey;
    checkinElements.photoMealMealButtons.forEach((button) => {
      const active = button.dataset.photoMeal === mealKey;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    updatePhotoMealSaveState();

    if (checkinElements.photoMealDialog.open) {
      renderPhotoMealDishes();
    }
  };

  const prefillPhotoMealDish = () => {
    const record = getActiveCheckinRecord();
    const meal = record.meals[photoMealState.mealKey];

    if (!meal || !meal.food) {
      return;
    }

    const portionMatch = meal.food.match(/（(半份|([12](?:\.5)?) 份)）\s*$/);
    const storedMultiplier = portionMatch
      ? portionMatch[1] === "半份"
        ? 0.5
        : Number(portionMatch[2])
      : 1;
    const dishName = meal.food.replace(/（[^）]*）\s*$/, "").trim();
    const dish = findPhotoMealDish(dishName);

    if (dish) {
      photoMealState.searchQuery = dishName;
      checkinElements.photoMealSearchInput.value = dishName;
      renderPhotoMealDishes();
      selectPhotoMealDish(dish);

      if (MEAL_PHOTO_PORTIONS.some(({ value }) => value === storedMultiplier)) {
        checkinElements.photoMealPortionSelect.value = String(storedMultiplier);
        updatePhotoMealCaloriesPreview();
      }
    } else {
      photoMealState.searchQuery = dishName;
      checkinElements.photoMealSearchInput.value = dishName;
      renderPhotoMealDishes();
    }
  };

  const openPhotoMealDialog = (mealKey, { useStoredPhoto = false } = {}) => {
    refreshCheckinDate();
    resetPhotoMealDialog();

    if (MEAL_LABELS[mealKey]) {
      setPhotoMealMeal(mealKey);
    }

    if (useStoredPhoto) {
      const stored = getStoredMealPhoto(activeCheckinDate, photoMealState.mealKey);

      if (stored) {
        showPhotoMealImage(stored.dataUrl);
        prefillPhotoMealDish();
      }
    }

    if (!photoMealState.selectedDish) {
      renderPhotoMealDishes();
    }

    if (!checkinElements.photoMealDialog.open) {
      rememberDialogTrigger(checkinElements.photoMealDialog);
      checkinElements.photoMealDialog.showModal();
    }

    checkinElements.photoMealPick.focus({ preventScroll: true });
  };

  const closePhotoMealDialog = () => {
    photoMealCompressionToken += 1;
    photoMealState.requestToken += 1;

    if (checkinElements.photoMealDialog.open) {
      checkinElements.photoMealDialog.close();
    }
  };

  const formatPhotoMealFood = (dish, multiplier) => {
    if (multiplier === 1) {
      return dish.name;
    }

    const label =
      multiplier === 0.5 ? "半份" : `${multiplier} 份`;
    return `${dish.name}（${label}）`.slice(0, 80);
  };

  const savePhotoMealRecord = () => {
    if (photoMealState.busy) {
      return;
    }

    if (!photoMealState.dataUrl) {
      setPhotoMealFeedback("先拍照或选择一张照片。", "error");
      checkinElements.photoMealPick.focus({ preventScroll: true });
      return;
    }

    if (!photoMealState.selectedDish) {
      setPhotoMealFeedback("请先从菜品库选择一道菜。", "error");
      focusPhotoMealSearch();
      return;
    }

    refreshCheckinDate();
    const dish = photoMealState.selectedDish;
    const multiplier = Number(checkinElements.photoMealPortionSelect.value) || 1;
    const calories = Math.round(dish.calories * multiplier);
    const food = formatPhotoMealFood(dish, multiplier);
    const mealKey = photoMealState.mealKey;

    if (!fillMealValues(mealKey, food, calories)) {
      setPhotoMealFeedback("文字记录保存失败，请稍后重试。", "error");
      return;
    }

    setDishSearchStatus(
      `已记入${MEAL_LABELS[mealKey]}：${food}，${calorieFormatter.format(calories)} kcal。`,
      "success",
    );

    if (!saveMealPhoto(activeCheckinDate, mealKey, photoMealState.dataUrl)) {
      setPhotoMealFeedback("照片未保存，文字记录已保留", "error");
      renderMealPhotoSlots();
      return;
    }

    renderMealPhotoSlots();
    closePhotoMealDialog();
  };

  const setPresetFeedback = (message, state = "error") => {
    const feedback = checkinElements.presetFeedback;

    if (!message) {
      feedback.hidden = true;
      feedback.textContent = "";
      delete feedback.dataset.state;
      return;
    }

    feedback.textContent = message;
    feedback.dataset.state = state;
    feedback.hidden = false;
  };

  const resetPresetForm = () => {
    editingPresetId = null;
    checkinElements.presetForm.reset();
    checkinElements.presetFormTitle.textContent = "添加快捷项";
    checkinElements.presetSave.textContent = "添加快捷项";
    checkinElements.presetCancel.hidden = true;
    checkinElements.presetFoodInput.removeAttribute("aria-invalid");
    checkinElements.presetCaloriesInput.removeAttribute("aria-invalid");
    setPresetFeedback("");
  };

  const renderPresetManagerList = () => {
    const mealKey = activePresetMeal;

    if (!mealKey) {
      return;
    }

    const presets = mealPresetState[mealKey] ?? [];
    const fragment = document.createDocumentFragment();

    checkinElements.presetCount.textContent =
      `${presets.length} / ${MAX_MEAL_PRESETS}`;
    checkinElements.presetListEmpty.hidden = presets.length > 0;

    presets.forEach((preset) => {
      const item = document.createElement("li");
      const copy = document.createElement("div");
      const name = document.createElement("strong");
      const calories = document.createElement("span");
      const actions = document.createElement("div");
      const editButton = document.createElement("button");
      const deleteButton = document.createElement("button");

      item.className = "preset-list-item";
      item.classList.toggle("is-editing", preset.id === editingPresetId);
      copy.className = "preset-list-copy";
      name.textContent = preset.food;
      calories.textContent = `${preset.calories} kcal`;
      copy.append(name, calories);
      actions.className = "preset-list-actions";
      editButton.type = "button";
      editButton.className = "preset-row-action";
      editButton.dataset.presetEdit = preset.id;
      editButton.textContent = "编辑";
      editButton.setAttribute("aria-label", `编辑${preset.food}`);
      deleteButton.type = "button";
      deleteButton.className = "preset-row-action";
      deleteButton.dataset.presetDelete = preset.id;
      deleteButton.textContent = "删除";
      deleteButton.setAttribute("aria-label", `删除${preset.food}`);
      actions.append(editButton, deleteButton);
      item.append(copy, actions);
      fragment.append(item);
    });

    checkinElements.presetList.replaceChildren(fragment);
  };

  const openPresetEditor = (mealKey) => {
    if (!MEAL_LABELS[mealKey]) {
      return;
    }

    activePresetMeal = mealKey;
    resetPresetForm();
    checkinElements.presetDialogTitle.textContent = `${MEAL_LABELS[mealKey]}快捷项`;
    renderPresetManagerList();

    if (!checkinElements.presetDialog.open) {
      rememberDialogTrigger(checkinElements.presetDialog);
      checkinElements.presetDialog.showModal();
    }

    checkinElements.presetDialogClose.focus({ preventScroll: true });
  };

  const closePresetEditor = () => {
    if (checkinElements.presetDialog.open) {
      checkinElements.presetDialog.close();
    }
  };

  const saveMealPresetState = (nextState) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.mealPresets,
        JSON.stringify(nextState),
      );
      mealPresetState = nextState;
      return true;
    } catch {
      return false;
    }
  };

  const renderCheckin = () => {
    const activeDate = parseDateKey(activeCheckinDate);
    const record = getActiveCheckinRecord();
    const dishRender = renderDishSearch();

    checkinElements.date.textContent =
      `${dateFormatter.format(activeDate)} · ${weekdayFormatter.format(activeDate)}`;
    hydrateCheckinForm(record);
    renderAllMealPresets();
    renderMealPhotoSlots();
    announceDishSearch(dishRender);
    renderMealSummary(record);
    renderCheckinExerciseList();
    renderExerciseSummary(record);
    renderExerciseRecommendations();
    renderWeightSummary(record);
    renderDailyProgress(record);
    renderWeightHistory();
    hideWeightFeedback();
  };

  const refreshCheckinDate = () => {
    const todayKey = toDateKey(new Date());

    if (todayKey === activeCheckinDate) {
      return false;
    }

    activeCheckinDate = todayKey;
    renderCheckin();
    renderDashboard();
    refreshExerciseLibraryPlanState();
    return true;
  };

  const setExerciseLibraryStatus = (message, state = "") => {
    exerciseElements.status.textContent = message;
    exerciseElements.status.classList.toggle("is-error", state === "error");
    exerciseElements.status.hidden = message === "";
  };

  const setMovementCardOpen = (view, open) => {
    view.detail.hidden = !open;
    view.card.classList.toggle("is-open", open);
    view.toggle.setAttribute("aria-expanded", String(open));
    view.toggle.setAttribute(
      "aria-label",
      `${open ? "收起" : "展开"}${view.exercise.name}详情`,
    );
  };

  const updateMovementPlanButton = (view) => {
    const isAdded = getCustomExerciseIds(toDateKey(new Date())).includes(
      view.exercise.id,
    );

    view.addButton.classList.toggle("is-added", isAdded);
    view.addButton.setAttribute("aria-pressed", String(isAdded));
    view.addButton.setAttribute(
      "aria-label",
      `${isAdded ? "移出" : "加入"}今日计划：${view.exercise.name}`,
    );
    view.addLabel.textContent = isAdded ? "已加入今日计划" : "加入今日计划";
    view.addIconUse.setAttribute("href", isAdded ? "#icon-check" : "#icon-plus");
  };

  const refreshExerciseLibraryPlanState = () => {
    movementCardViews.forEach(updateMovementPlanButton);
  };

  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const motionSource =
    window.SLIMSPARK_MOTION && typeof window.SLIMSPARK_MOTION === "object"
      ? window.SLIMSPARK_MOTION
      : {};
  const motionPoses =
    motionSource.poses && typeof motionSource.poses === "object" ? motionSource.poses : {};
  const motionBoards =
    motionSource.boards && typeof motionSource.boards === "object"
      ? motionSource.boards
      : {};
  const motionCategoryFallbacks =
    motionSource.categoryFallbacks && typeof motionSource.categoryFallbacks === "object"
      ? motionSource.categoryFallbacks
      : {};
  const motionBoardCache = new WeakMap();

  const isMotionPoint = (point) =>
    Array.isArray(point) &&
    point.length === 2 &&
    point.every((value) => Number.isFinite(value));

  const isMotionLimb = (limb) =>
    Array.isArray(limb) && limb.length >= 2 && limb.every(isMotionPoint);

  const isMotionPose = (pose) =>
    Boolean(pose) &&
    typeof pose === "object" &&
    isMotionPoint(pose.head) &&
    isMotionPoint(pose.neck) &&
    isMotionPoint(pose.hip) &&
    isMotionLimb(pose.backArm) &&
    isMotionLimb(pose.frontArm) &&
    isMotionLimb(pose.backLeg) &&
    isMotionLimb(pose.frontLeg) &&
    (pose.back === undefined || isMotionPoint(pose.back));

  const getExerciseMotion = (exercise) => {
    if (motionBoardCache.has(exercise)) {
      return motionBoardCache.get(exercise);
    }

    const source =
      motionBoards[exercise.id] ??
      motionCategoryFallbacks[exercise.category] ??
      motionCategoryFallbacks.other;

    if (!source || typeof source !== "object" || !Array.isArray(source.frames)) {
      motionBoardCache.set(exercise, null);
      return null;
    }

    const frames = source.frames.flatMap((frame) => {
      if (!frame || typeof frame !== "object") {
        return [];
      }

      const label = readTrimmedString(frame.label);
      const pose = motionPoses[readTrimmedString(frame.pose)];

      if (!label || !isMotionPose(pose)) {
        return [];
      }

      return [
        {
          label,
          pose,
          flip: frame.flip === true,
          prop: readTrimmedString(frame.prop),
        },
      ];
    });

    if (frames.length < 2) {
      motionBoardCache.set(exercise, null);
      return null;
    }

    const rawGround = Number(source.ground);
    const motion = {
      frames,
      ground: Number.isFinite(rawGround)
        ? Math.min(96, Math.max(70, rawGround))
        : 92,
      prop: readTrimmedString(source.prop),
    };

    motionBoardCache.set(exercise, motion);
    return motion;
  };

  const createSvgElement = (tagName, attributes = {}) => {
    const node = document.createElementNS(SVG_NAMESPACE, tagName);

    Object.entries(attributes).forEach(([name, value]) => {
      if (value !== undefined && value !== null) {
        node.setAttribute(name, String(value));
      }
    });

    return node;
  };

  const createMotionLimb = (points, className) =>
    createSvgElement("polyline", {
      class: className,
      points: points.map(([x, y]) => `${x},${y}`).join(" "),
    });

  const createMotionProp = (prop, pose) => {
    if (prop === "bench") {
      const group = createSvgElement("g", {
        class: "motion-prop motion-prop-bench",
      });
      const top = createSvgElement("rect", {
        x: 6,
        y: 60,
        width: 47,
        height: 5,
        rx: 2.5,
        class: "motion-bench-top",
      });
      const legs = createSvgElement("path", {
        d: "M13 65V92M46 65V92",
        class: "motion-bench-leg",
      });

      group.append(top, legs);
      return group;
    }

    if (prop === "rope-top" || prop === "rope-bottom") {
      const group = createSvgElement("g", {
        class: "motion-prop motion-prop-rope",
      });
      const leftHand = pose.backArm[pose.backArm.length - 1];
      const rightHand = pose.frontArm[pose.frontArm.length - 1];
      const controlY = prop === "rope-top" ? -8 : 108;
      const rope = createSvgElement("path", {
        d: `M ${leftHand[0]} ${leftHand[1]} C ${leftHand[0] - 8} ${controlY}, ${rightHand[0] + 8} ${controlY}, ${rightHand[0]} ${rightHand[1]}`,
        class: "motion-rope",
      });
      const leftHandle = createSvgElement("circle", {
        cx: leftHand[0],
        cy: leftHand[1],
        r: 1.9,
        class: "motion-rope-handle",
      });
      const rightHandle = createSvgElement("circle", {
        cx: rightHand[0],
        cy: rightHand[1],
        r: 1.9,
        class: "motion-rope-handle",
      });

      group.append(rope, leftHandle, rightHandle);
      return group;
    }

    return null;
  };

  const createMotionScene = (frame, motion) => {
    const { pose } = frame;
    const scene = createSvgElement("g", { class: "motion-pose" });

    if (frame.flip) {
      scene.setAttribute("transform", "translate(120 0) scale(-1 1)");
    }

    const prop = createMotionProp(frame.prop || motion.prop, pose);

    if (prop) {
      scene.append(prop);
    }

    scene.append(
      createMotionLimb(pose.backArm, "motion-limb motion-limb-back"),
      createMotionLimb(pose.backLeg, "motion-limb motion-limb-back"),
    );

    const [headX, headY] = pose.head;
    const [neckX, neckY] = pose.neck;
    const [hipX, hipY] = pose.hip;
    const body = createSvgElement("path", {
      class: "motion-spine",
      d: pose.back
        ? `M${headX} ${headY} L${neckX} ${neckY} Q${pose.back[0]} ${pose.back[1]} ${hipX} ${hipY}`
        : `M${headX} ${headY} L${neckX} ${neckY} L${hipX} ${hipY}`,
    });

    scene.append(body);
    scene.append(
      createMotionLimb(pose.frontLeg, "motion-limb motion-limb-front"),
      createMotionLimb(pose.frontArm, "motion-limb motion-limb-front"),
      createSvgElement("circle", {
        cx: headX,
        cy: headY,
        r: 6.2,
        class: "motion-head",
      }),
    );

    return scene;
  };

  const createMotionSvg = (frame, motion, { preview = false } = {}) => {
    const svg = createSvgElement("svg", {
      class: preview ? "motion-art motion-preview" : "motion-art",
      viewBox: "0 0 120 100",
      preserveAspectRatio: preview ? "xMidYMax meet" : "xMidYMid meet",
      "aria-hidden": "true",
      focusable: "false",
    });

    if (!preview) {
      svg.append(
        createSvgElement("line", {
          x1: 6,
          y1: motion.ground,
          x2: 114,
          y2: motion.ground,
          class: "motion-ground",
        }),
      );

      const points = [
        frame.pose.head,
        frame.pose.neck,
        frame.pose.hip,
        ...frame.pose.backArm,
        ...frame.pose.frontArm,
        ...frame.pose.backLeg,
        ...frame.pose.frontLeg,
      ];
      const xs = points.map(([x]) => x);
      const center = (Math.min(...xs) + Math.max(...xs)) / 2;
      const spread = Math.max(...xs) - Math.min(...xs);

      svg.append(
        createSvgElement("ellipse", {
          cx: center,
          cy: motion.ground - 1.2,
          rx: Math.min(29, Math.max(12, spread * 0.3)),
          ry: 2.2,
          class: "motion-shadow",
        }),
      );
    }

    svg.append(createMotionScene(frame, motion));
    return svg;
  };

  const createMotionPreview = (exercise) => {
    const motion = getExerciseMotion(exercise);

    if (!motion) {
      return null;
    }

    return createMotionSvg(motion.frames[motion.frames.length - 1], motion, {
      preview: true,
    });
  };

  const createExerciseStoryboard = (exercise) => {
    const motion = getExerciseMotion(exercise);

    if (!motion) {
      return null;
    }

    const section = document.createElement("section");
    const heading = document.createElement("div");
    const title = document.createElement("h3");
    const hint = document.createElement("span");
    const track = document.createElement("div");

    section.className = "movement-storyboard";
    heading.className = "movement-storyboard-head";
    title.className = "movement-detail-title";
    title.textContent = "动作示意";
    hint.className = "movement-storyboard-hint";
    hint.textContent = "按箭头顺序";
    heading.append(title, hint);
    track.className = "motion-track";
    track.setAttribute("role", "list");

    motion.frames.forEach((frame, index) => {
      if (index > 0) {
        const flow = document.createElement("span");
        flow.className = "motion-flow";
        flow.setAttribute("aria-hidden", "true");
        flow.append(createIcon("arrow"));
        track.append(flow);
      }

      const figure = document.createElement("figure");
      const frameNumber = document.createElement("span");
      const art = document.createElement("div");
      const caption = document.createElement("figcaption");

      figure.className = "motion-frame";
      figure.setAttribute("role", "listitem");
      frameNumber.className = "motion-frame-number";
      frameNumber.setAttribute("aria-hidden", "true");
      frameNumber.textContent = String(index + 1).padStart(2, "0");
      art.className = "motion-frame-art";
      art.append(createMotionSvg(frame, motion));
      caption.className = "motion-frame-label";
      caption.textContent = frame.label;
      figure.append(frameNumber, art, caption);
      track.append(figure);
    });

    section.append(heading, track);
    return section;
  };

  const createMovementCard = (exercise, index) => {
    const card = document.createElement("article");
    const summary = document.createElement("div");
    const thumb = document.createElement("span");
    const copy = document.createElement("div");
    const metaLine = document.createElement("span");
    const category = document.createElement("span");
    const difficulty = document.createElement("span");
    const filledStars = document.createElement("span");
    const emptyStars = document.createElement("span");
    const name = document.createElement("h2");
    const prescription = document.createElement("p");
    const campusTags = document.createElement("div");
    const chevron = document.createElement("span");
    const toggle = document.createElement("button");
    const detail = document.createElement("div");
    const detailId = `movement-detail-${index + 1}`;
    const nameId = `movement-name-${index + 1}`;
    const view = { card, detail, toggle, exercise };

    card.className = "movement-card";
    card.dataset.category = exercise.category;
    card.setAttribute("aria-labelledby", nameId);
    summary.className = "movement-summary";
    thumb.className = "movement-thumb";
    thumb.setAttribute("aria-hidden", "true");

    const motionPreview = createMotionPreview(exercise);

    if (motionPreview) {
      thumb.append(motionPreview);
    } else {
      const emoji = document.createElement("span");
      emoji.className = "movement-emoji";
      emoji.textContent = exercise.emoji;
      thumb.append(emoji);
    }

    const thumbArrow = document.createElement("span");
    thumbArrow.className = "movement-thumb-arrow";
    thumbArrow.append(createIcon("arrow"));
    thumb.append(thumbArrow);

    copy.className = "movement-summary-copy";
    metaLine.className = "movement-meta-line";
    category.className = "movement-category";
    category.textContent = exerciseCategoryLabels.get(exercise.category) ?? "其他";
    difficulty.className = "movement-difficulty";
    difficulty.setAttribute(
      "aria-label",
      `难度 ${exercise.difficulty} 星，共 5 星`,
    );
    difficulty.setAttribute("role", "img");
    filledStars.className = "is-filled";
    filledStars.setAttribute("aria-hidden", "true");
    filledStars.textContent = "★".repeat(exercise.difficulty);
    emptyStars.className = "is-empty";
    emptyStars.setAttribute("aria-hidden", "true");
    emptyStars.textContent = "★".repeat(5 - exercise.difficulty);
    difficulty.append(filledStars, emptyStars);
    metaLine.append(category, difficulty);
    name.className = "movement-name";
    name.id = nameId;
    name.textContent = exercise.name;
    prescription.className = "movement-prescription";
    prescription.textContent = `建议 ${exercise.sets}`;
    campusTags.className = "movement-campus-tags";
    campusTags.setAttribute("aria-label", "场地、噪音和时长");
    [
      `场地·${exercise.space}`,
      `噪音·${exercise.quiet ? "静音" : "有声音"}`,
      `时长·${exercise.duration} 分钟`,
    ].forEach((label) => {
      const tag = document.createElement("span");
      tag.className = "movement-campus-tag";
      tag.textContent = label;
      campusTags.append(tag);
    });
    copy.append(metaLine, name, prescription, campusTags);
    chevron.className = "movement-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.append(createIcon("chevron"));
    toggle.className = "movement-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", detailId);
    toggle.setAttribute("aria-label", `展开${exercise.name}详情`);
    summary.append(thumb, copy, chevron, toggle);

    detail.className = "movement-detail";
    detail.id = detailId;
    detail.hidden = true;

    if (exercise.intro !== "") {
      const intro = document.createElement("p");
      intro.className = "movement-intro";
      intro.textContent = exercise.intro;
      detail.append(intro);
    }

    const storyboard = createExerciseStoryboard(exercise);

    if (storyboard) {
      detail.append(storyboard);
    }

    if (exercise.steps.length > 0) {
      const stepsSection = document.createElement("section");
      const stepsTitle = document.createElement("h3");
      const steps = document.createElement("ol");

      stepsTitle.className = "movement-detail-title";
      stepsTitle.textContent = "动作要点";
      steps.className = "movement-steps";

      exercise.steps.forEach((step) => {
        const item = document.createElement("li");
        item.textContent = step;
        steps.append(item);
      });

      stepsSection.append(stepsTitle, steps);
      detail.append(stepsSection);
    }

    if (exercise.breathing !== "") {
      const breathing = document.createElement("div");
      const breathingMark = document.createElement("span");
      const breathingCopy = document.createElement("p");
      const breathingTitle = document.createElement("strong");

      breathing.className = "movement-breathing";
      breathingMark.className = "movement-breathing-mark";
      breathingMark.setAttribute("aria-hidden", "true");
      breathingMark.textContent = "息";
      breathingCopy.className = "movement-breathing-copy";
      breathingTitle.textContent = "呼吸提示";
      breathingCopy.append(breathingTitle, exercise.breathing);
      breathing.append(breathingMark, breathingCopy);
      detail.append(breathing);
    }

    if (exercise.mistakes.length > 0) {
      const mistakesBlock = document.createElement("section");
      const mistakesTitle = document.createElement("h3");
      const mistakes = document.createElement("ul");

      mistakesBlock.className = "movement-mistakes-block";
      mistakesTitle.className = "movement-detail-title";
      mistakesTitle.textContent = "常见错误";
      mistakes.className = "movement-mistakes";

      exercise.mistakes.forEach((mistake) => {
        const item = document.createElement("li");
        item.textContent = mistake;
        mistakes.append(item);
      });

      mistakesBlock.append(mistakesTitle, mistakes);
      detail.append(mistakesBlock);
    }

    const addButton = document.createElement("button");
    const addIcon = createIcon("plus");
    const addIconUse = addIcon.querySelector("use");
    const addLabel = document.createElement("span");
    const timerButton = document.createElement("button");
    const timerLabel = document.createElement("span");
    const timerMeta = document.createElement("span");
    const detailActions = document.createElement("div");

    addButton.className = "movement-add";
    addButton.type = "button";
    addButton.setAttribute("aria-pressed", "false");
    addButton.append(addIcon, addLabel);

    timerButton.className = "movement-timer-button";
    timerButton.type = "button";
    timerButton.setAttribute(
      "aria-label",
      `开始${exercise.name}5 分钟动作计时`,
    );
    timerLabel.textContent = "开始 5 分钟计时";
    timerMeta.className = "movement-timer-meta";
    timerMeta.textContent = "05:00";
    timerButton.append(timerLabel, timerMeta);

    detailActions.className = "movement-detail-actions";
    detailActions.append(timerButton, addButton);
    detail.append(detailActions);

    view.addButton = addButton;
    view.addLabel = addLabel;
    view.addIconUse = addIconUse;

    toggle.addEventListener("click", () => {
      const willOpen = !card.classList.contains("is-open");

      if (willOpen) {
        movementCardViews.forEach((otherView) => {
          if (otherView !== view && otherView.card.classList.contains("is-open")) {
            setMovementCardOpen(otherView, false);
          }
        });
      }

      setMovementCardOpen(view, willOpen);
    });

    addButton.addEventListener("click", () => {
      handleExercisePlanToggle(exercise.id);
    });

    timerButton.addEventListener("click", () => {
      openActionTimer(exercise.id, timerButton);
    });

    card.append(summary, detail);
    updateMovementPlanButton(view);
    return { card, view };
  };

  const applyExerciseFilters = () => {
    let visibleCount = 0;

    exerciseElements.filters
      .querySelectorAll("[data-exercise-filter]")
      .forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.exerciseFilter === activeExerciseFilter),
        );
      });
    exerciseElements.filters
      .querySelectorAll("[data-exercise-campus-filter]")
      .forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(
            activeExerciseCampusFilters.has(button.dataset.exerciseCampusFilter),
          ),
        );
      });

    movementCardViews.forEach((view) => {
      const isVisible = exerciseMatchesFilters(view.exercise);
      view.card.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      } else if (view.card.classList.contains("is-open")) {
        setMovementCardOpen(view, false);
      }
    });

    const filterLabels = [
      exerciseCategories.find(({ id }) => id === activeExerciseFilter)?.label ??
        "全部",
      ...EXERCISE_CAMPUS_FILTERS.filter(({ id }) =>
        activeExerciseCampusFilters.has(id),
      ).map(({ label }) => label),
    ];

    exerciseElements.resultCount.textContent =
      `${filterLabels.join(" · ")} · ${visibleCount} 个动作`;
    exerciseElements.empty.textContent = "这个筛选下还没有动作，试试全部";
    exerciseElements.empty.hidden = visibleCount !== 0;
  };

  const updateExerciseFilter = (filterId) => {
    if (!exerciseCategories.some(({ id }) => id === filterId)) {
      return;
    }

    activeExerciseFilter = filterId;
    applyExerciseFilters();
  };

  const toggleExerciseCampusFilter = (filterId) => {
    if (!EXERCISE_CAMPUS_FILTERS.some(({ id }) => id === filterId)) {
      return;
    }

    if (activeExerciseCampusFilters.has(filterId)) {
      activeExerciseCampusFilters.delete(filterId);
    } else {
      activeExerciseCampusFilters.add(filterId);
    }

    applyExerciseFilters();
  };

  const handleExercisePlanToggle = (exerciseId) => {
    const exercise = exerciseById.get(exerciseId);

    if (!exercise) {
      return;
    }

    refreshCheckinDate();
    const todayKey = toDateKey(new Date());
    const currentIds = getCustomExerciseIds(todayKey);
    const shouldAdd = !currentIds.includes(exerciseId);
    const nextIds = shouldAdd
      ? [...new Set([...currentIds, exerciseId])]
      : currentIds.filter((id) => id !== exerciseId);
    const nextPlans = { ...exercisePlans };

    if (nextIds.length > 0) {
      nextPlans[todayKey] = nextIds;
    } else {
      delete nextPlans[todayKey];
    }

    try {
      localStorage.setItem(STORAGE_KEYS.exercisePlans, JSON.stringify(nextPlans));
    } catch {
      setExerciseLibraryStatus(
        "保存失败，今日计划未能更新。请检查浏览器存储权限或空间。",
        "error",
      );
      return;
    }

    exercisePlans = nextPlans;

    const record =
      checkinRecords[todayKey] ?? createEmptyCheckinRecord(todayKey);
    checkinRecords[todayKey] = record;

    if (shouldAdd) {
      record.exercises[exerciseId] = false;
    } else {
      delete record.exercises[exerciseId];
    }

    getExercisePlanIds(todayKey).forEach((id) => {
      if (record.exercises[id] !== true) {
        record.exercises[id] = false;
      }
    });

    const synced = writeCheckinRecord(todayKey, record);
    const totalCount = getExercisePlanForDate(todayKey).length;

    refreshExerciseLibraryPlanState();
    renderDashboard();

    if (!synced) {
      setExerciseLibraryStatus(
        "计划已更新，但今日打卡同步失败，请刷新页面后重试。",
        "error",
      );
      return;
    }

    setExerciseLibraryStatus(
      shouldAdd
        ? `已将「${exercise.name}」加入今日计划，今日共 ${totalCount} 项运动。`
        : `已将「${exercise.name}」移出今日计划，今日共 ${totalCount} 项运动。`,
    );
  };

  const renderExerciseLibrary = () => {
    const filterFragment = document.createDocumentFragment();
    const cardFragment = document.createDocumentFragment();

    movementCardViews.clear();

    exerciseCategories.forEach(({ id, label }) => {
      const button = document.createElement("button");
      button.className = "exercise-filter";
      button.type = "button";
      button.dataset.exerciseFilter = id;
      button.setAttribute(
        "aria-pressed",
        String(id === activeExerciseFilter),
      );
      button.textContent = label;
      filterFragment.append(button);
    });

    const campusDivider = document.createElement("span");
    campusDivider.className = "exercise-filter-divider";
    campusDivider.setAttribute("aria-hidden", "true");
    filterFragment.append(campusDivider);

    EXERCISE_CAMPUS_FILTERS.forEach(({ id, label }) => {
      const button = document.createElement("button");
      button.className = "exercise-filter exercise-filter-campus";
      button.type = "button";
      button.dataset.exerciseCampusFilter = id;
      button.setAttribute(
        "aria-pressed",
        String(activeExerciseCampusFilters.has(id)),
      );
      button.textContent = label;
      filterFragment.append(button);
    });

    exerciseElements.filters.replaceChildren(filterFragment);

    exerciseCatalog.forEach((exercise, index) => {
      const { card, view } = createMovementCard(exercise, index);
      movementCardViews.set(exercise.id, view);
      cardFragment.append(card);
    });

    exerciseElements.cardList.replaceChildren(cardFragment);
    refreshExerciseLibraryPlanState();
    updateExerciseFilter(activeExerciseFilter);
  };

  const setExerciseView = (view) => {
    activeExerciseView = view === "canteen" ? "canteen" : "dorm";
    exerciseElements.viewButtons.forEach((button) => {
      const isActive = button.dataset.exerciseView === activeExerciseView;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    exerciseElements.dormPanel.hidden = activeExerciseView !== "dorm";
    exerciseElements.canteenPanel.hidden = activeExerciseView !== "canteen";
  };

  const setCanteenStatus = (message, state = "") => {
    exerciseElements.canteenStatus.textContent = message;

    if (state) {
      exerciseElements.canteenStatus.dataset.state = state;
    } else {
      delete exerciseElements.canteenStatus.dataset.state;
    }
  };

  const searchCanteen = (query) => {
    const tokens = String(query ?? "")
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(normalizeDishSearchText)
      .filter(Boolean);

    if (tokens.length === 0) {
      return canteenCatalog;
    }

    return canteenCatalog.filter((dish) =>
      tokens.every((token) => dish.searchText.includes(token)),
    );
  };

  const createCanteenCard = (dish) => {
    const card = document.createElement("article");
    const head = document.createElement("header");
    const titleGroup = document.createElement("div");
    const badge = document.createElement("span");
    const name = document.createElement("h3");
    const calories = document.createElement("div");
    const calorieValue = document.createElement("strong");
    const calorieUnit = document.createElement("small");
    const tagList = document.createElement("ul");
    const facts = document.createElement("dl");
    const actions = document.createElement("div");
    const nameId = `canteen-name-${dish.id}`;

    card.className = "canteen-card";
    card.dataset.level = dish.level;
    card.dataset.canteenId = dish.id;
    card.setAttribute("aria-labelledby", nameId);
    head.className = "canteen-card-head";
    titleGroup.className = "canteen-card-title";
    badge.className = "canteen-badge";
    badge.textContent = dish.levelLabel;
    name.id = nameId;
    name.textContent = dish.name;
    titleGroup.append(badge, name);
    calories.className = "canteen-calories";
    calorieValue.textContent = calorieFormatter.format(dish.calories);
    calorieUnit.textContent = "kcal";
    calories.append(calorieValue, calorieUnit);
    head.append(titleGroup, calories);

    tagList.className = "canteen-tags";
    tagList.setAttribute("aria-label", `${dish.name}特点`);

    dish.tags.forEach((tag) => {
      const item = document.createElement("li");
      item.className = "canteen-tag";
      item.textContent = tag;
      tagList.append(item);
    });

    facts.className = "canteen-facts";
    [
      ["上榜理由", dish.reason],
      ["改良吃法", dish.swap],
      ["推荐搭配", dish.pairing],
    ].forEach(([label, value]) => {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      const detail = document.createElement("dd");

      row.className = "canteen-fact";
      term.textContent = label;
      detail.textContent = value || "按自己的份量适量选择。";
      row.append(term, detail);
      facts.append(row);
    });

    actions.className = "canteen-record-actions";

    dish.meals.forEach((mealKey) => {
      const button = document.createElement("button");
      const mealLabel = MEAL_LABELS[mealKey];

      if (!mealLabel) {
        return;
      }

      button.type = "button";
      button.className = "canteen-record-button";
      button.dataset.canteenMeal = mealKey;
      button.dataset.canteenId = dish.id;
      button.textContent = `记入${mealLabel}`;
      button.setAttribute(
        "aria-label",
        `把${dish.name}记入${mealLabel}，${dish.calories} 千卡`,
      );
      actions.append(button);
    });

    card.append(head, tagList, facts, actions);
    return card;
  };

  const renderCanteen = () => {
    const query = canteenSearchQuery.trim();
    const results = searchCanteen(query);
    const fragment = document.createDocumentFragment();

    results.forEach((dish) => {
      fragment.append(createCanteenCard(dish));
    });

    exerciseElements.canteenList.replaceChildren(fragment);
    exerciseElements.canteenCount.textContent = `${results.length} 道`;
    exerciseElements.canteenEmpty.hidden = results.length !== 0;
    exerciseElements.canteenSearchClear.hidden = query === "";

    if (canteenCatalog.length === 0) {
      setCanteenStatus("食堂榜单暂时没有数据。", "warning");
      return;
    }

    if (!query) {
      setCanteenStatus(
        `共 ${results.length} 道校园菜，点“记入午餐/晚餐”可直接填入当天餐次。`,
      );
      return;
    }

    if (results.length === 0) {
      setCanteenStatus(
        `没有找到“${query}”相关菜品，换个菜名或别名试试。`,
        "warning",
      );
      return;
    }

    setCanteenStatus(`找到 ${results.length} 道与“${query}”相关的菜。`);
  };

  const getMealInput = (mealKey, part) =>
    checkinElements.mealInputs.find(
      (input) => input.dataset.mealField === mealKey && input.dataset.mealPart === part,
    );

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) {
      return "偏瘦";
    }

    if (bmi < 24) {
      return "正常";
    }

    if (bmi < 28) {
      return "超重";
    }

    return "肥胖";
  };

  const getHealthyWeightFloor = (height) =>
    Math.round(18.5 * (height / 100) ** 2 * 10) / 10;

  const getActivityProfile = (exerciseDays) => {
    if (exerciseDays <= 2) {
      return { factor: 1.375, label: "轻度活动" };
    }

    if (exerciseDays <= 4) {
      return { factor: 1.55, label: "中度活动" };
    }

    if (exerciseDays <= 6) {
      return { factor: 1.725, label: "高度活动" };
    }

    return { factor: 1.9, label: "非常活跃" };
  };

  const buildWeeklyPlan = (
    currentWeight,
    targetWeight,
    durationWeeks,
    exerciseDays,
    goalType,
  ) => {
    const isGain = goalType === "gain";
    const strengthDays = isGain
      ? Math.min(exerciseDays, Math.max(2, Math.round(exerciseDays * 0.6)))
      : exerciseDays > 1
        ? Math.min(exerciseDays - 1, Math.max(1, Math.round(exerciseDays * 0.4)))
        : 0;
    const aerobicDays = exerciseDays - strengthDays;
    const exerciseLabel = isGain
      ? aerobicDays > 0
        ? `力量 ${strengthDays} 天 + 有氧 ${aerobicDays} 天`
        : `力量 ${strengthDays} 天`
      : strengthDays > 0
        ? `有氧 ${aerobicDays} 天 + 力量 ${strengthDays} 天`
        : "有氧 + 力量 1 天";
    const totalChange = targetWeight - currentWeight;

    return Array.from({ length: durationWeeks }, (_, index) => {
      const week = index + 1;
      const weeklyWeight =
        week === durationWeeks
          ? targetWeight
          : currentWeight + (totalChange * week) / durationWeeks;

      return {
        week,
        targetWeight: Math.round(weeklyWeight * 10) / 10,
        aerobicDays,
        strengthDays,
        exerciseLabel,
      };
    });
  };

  const buildPlan = ({ gender, age, height, currentWeight, targetWeight, exerciseDays, durationWeeks }) => {
    const bmi = Math.round((currentWeight / (height / 100) ** 2) * 10) / 10;
    const activity = getActivityProfile(exerciseDays);
    const bmr =
      (gender === "male" ? 5 : -161) + 10 * currentWeight + 6.25 * height - 5 * age;
    const tdee = bmr * activity.factor;
    const isGain = targetWeight > currentWeight;
    const goalType = isGain ? "gain" : "lose";
    const weeklyTargetChange = Math.abs(currentWeight - targetWeight) / durationWeeks;
    const rawDailyAdjustment = (weeklyTargetChange * 7700) / 7;
    const dailyEnergyAdjustment = isGain
      ? Math.round(Math.min(500, Math.max(250, rawDailyAdjustment)))
      : Math.round(Math.min(500, Math.max(300, rawDailyAdjustment)));
    const weeklyPlan = buildWeeklyPlan(
      currentWeight,
      targetWeight,
      durationWeeks,
      exerciseDays,
      goalType,
    );

    return {
      gender,
      age,
      height,
      currentWeight,
      targetWeight,
      exerciseDays,
      durationWeeks,
      goalType,
      bmi,
      bmiCategory: getBmiCategory(bmi),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      activityFactor: activity.factor,
      activityLevel: activity.label,
      weeklyTargetChange: Math.round(weeklyTargetChange * 100) / 100,
      goalTooFast: weeklyTargetChange > (isGain ? 0.5 : 1),
      weeklyTargetLoss: isGain ? 0 : Math.round(weeklyTargetChange * 100) / 100,
      weeklyTargetGain: isGain ? Math.round(weeklyTargetChange * 100) / 100 : 0,
      dailyEnergyAdjustment,
      dailyDeficit: isGain ? 0 : dailyEnergyAdjustment,
      dailySurplus: isGain ? dailyEnergyAdjustment : 0,
      dailyCalorieTarget: Math.round(
        isGain ? tdee + dailyEnergyAdjustment : tdee - dailyEnergyAdjustment,
      ),
      strengthDays: weeklyPlan[0]?.strengthDays ?? 0,
      aerobicDays: weeklyPlan[0]?.aerobicDays ?? 0,
      weeklyPlan,
    };
  };

  const WEEK_DAYS = [
    { key: "mon", label: "周一" },
    { key: "tue", label: "周二" },
    { key: "wed", label: "周三" },
    { key: "thu", label: "周四" },
    { key: "fri", label: "周五" },
    { key: "sat", label: "周六" },
    { key: "sun", label: "周日" },
  ];
  const SCHEDULE_MINUTES = [
    { value: 15, label: "15 分钟" },
    { value: 30, label: "30 分钟" },
    { value: 45, label: "45 分钟" },
    { value: 60, label: "60+ 分钟" },
  ];
  const SMART_SLOT_META = {
    cardio: { label: "有氧", met: 7.2 },
    strength: { label: "力量", met: 5.5 },
    stretch: { label: "拉伸", met: 2.3 },
    micro: { label: "课间", met: 4.0 },
  };
  const SMART_SWAP_CATEGORIES = {
    cardio: ["cardio"],
    strength: ["lower", "upper", "core"],
    stretch: ["stretch"],
    micro: ["cardio", "lower", "upper", "core", "stretch"],
  };
  const SMART_CATEGORY_TAGS = {
    cardio: "有氧",
    core: "核心",
    lower: "臀腿",
    upper: "上肢",
    stretch: "拉伸",
  };

  const getWeekDayLabel = (dayKey) =>
    WEEK_DAYS.find(({ key }) => key === dayKey)?.label ?? "本周";

  const getScheduleModeLabel = (mode) => (mode === "class" ? "有课" : "空闲");

  const getScheduleMinutesLabel = (minutes) => (minutes === 60 ? "60+" : String(minutes));

  const createDefaultSchedule = () =>
    WEEK_DAYS.map(({ key }, index) => ({
      dayKey: key,
      mode: index < 5 ? "class" : "free",
      minutes: index < 5 ? 30 : 60,
    }));

  const normalizeSchedule = (source) => {
    const fallback = createDefaultSchedule();
    const sourceDays = Array.isArray(source)
      ? source
      : Array.isArray(source?.days)
        ? source.days
        : [];

    return fallback.map((defaultDay) => {
      const saved = sourceDays.find(
        (item) => item && typeof item === "object" && item.dayKey === defaultDay.dayKey,
      );

      if (!saved) {
        return { ...defaultDay };
      }

      const mode =
        saved.mode === "free" ? "free" : saved.mode === "class" ? "class" : defaultDay.mode;
      const minutesNumber = Number(saved.minutes);
      const minutes = SCHEDULE_MINUTES.some(({ value }) => value === minutesNumber)
        ? minutesNumber
        : defaultDay.minutes;

      return { dayKey: defaultDay.dayKey, mode, minutes };
    });
  };

  const readSavedSchedule = () => normalizeSchedule(readStorage(STORAGE_KEYS.schedule, null));

  const setScheduleFeedback = (message, state = "") => {
    if (!planElements.scheduleFeedback) {
      return;
    }

    planElements.scheduleFeedback.textContent = message;

    if (state) {
      planElements.scheduleFeedback.dataset.state = state;
    } else {
      delete planElements.scheduleFeedback.dataset.state;
    }
  };

  const persistSchedule = () => {
    scheduleState = normalizeSchedule(scheduleState);

    try {
      localStorage.setItem(
        STORAGE_KEYS.schedule,
        JSON.stringify({
          version: 1,
          days: scheduleState,
          updatedAt: new Date().toISOString(),
        }),
      );
      return true;
    } catch {
      return false;
    }
  };

  const updateScheduleDayCard = (card, day) => {
    if (!card || !day) {
      return;
    }

    const meta = WEEK_DAYS.find(({ key }) => key === day.dayKey);
    const stateLabel = card.querySelector("[data-schedule-state]");

    card.dataset.mode = day.mode;
    card.setAttribute(
      "aria-label",
      `${meta?.label ?? ""}，${getScheduleModeLabel(day.mode)}，可用 ${getScheduleMinutesLabel(day.minutes)} 分钟`,
    );

    card.querySelectorAll("[data-schedule-mode]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.scheduleMode === day.mode));
    });

    if (stateLabel) {
      stateLabel.textContent = `${getScheduleModeLabel(day.mode)}日`;
    }
  };

  const renderScheduleGrid = () => {
    scheduleState = normalizeSchedule(scheduleState);
    const fragment = document.createDocumentFragment();

    WEEK_DAYS.forEach((meta) => {
      const day = scheduleState.find(({ dayKey }) => dayKey === meta.key);
      const card = document.createElement("article");
      const head = document.createElement("header");
      const dayName = document.createElement("strong");
      const dayState = document.createElement("span");
      const modeGroup = document.createElement("div");
      const durationLabel = document.createElement("label");
      const durationText = document.createElement("span");
      const select = document.createElement("select");

      card.className = "schedule-day";
      card.dataset.scheduleDay = meta.key;
      card.dataset.mode = day.mode;
      card.setAttribute(
        "aria-label",
        `${meta.label}，${getScheduleModeLabel(day.mode)}，可用 ${getScheduleMinutesLabel(day.minutes)} 分钟`,
      );

      head.className = "schedule-day-head";
      dayName.textContent = meta.label;
      dayState.className = "schedule-day-state";
      dayState.dataset.scheduleState = "";
      dayState.textContent = `${getScheduleModeLabel(day.mode)}日`;
      head.append(dayName, dayState);

      modeGroup.className = "schedule-mode";
      modeGroup.setAttribute("role", "group");
      modeGroup.setAttribute("aria-label", `${meta.label}是否有课`);

      [
        { value: "class", label: "有课" },
        { value: "free", label: "空闲" },
      ].forEach(({ value, label }) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "schedule-mode-button";
        button.dataset.scheduleMode = value;
        button.textContent = label;
        button.setAttribute("aria-pressed", String(day.mode === value));
        modeGroup.append(button);
      });

      durationLabel.className = "schedule-duration";
      durationText.textContent = "可用时长";
      select.className = "schedule-duration-select";
      select.dataset.scheduleMinutes = "";
      select.setAttribute("aria-label", `${meta.label}可用时长`);

      SCHEDULE_MINUTES.forEach(({ value, label }) => {
        const option = document.createElement("option");

        option.value = String(value);
        option.textContent = label;
        option.selected = day.minutes === value;
        select.append(option);
      });

      durationLabel.append(durationText, select);
      card.append(head, modeGroup, durationLabel);
      fragment.append(card);
    });

    planElements.scheduleGrid.replaceChildren(fragment);
  };

  const estimateSmartCalories = (slot, minutes, weight, difficulty = 1) => {
    const baseMet = SMART_SLOT_META[slot]?.met ?? 4;
    const level = Number.isFinite(difficulty)
      ? Math.min(5, Math.max(1, difficulty))
      : 1;
    const met = baseMet + (level - 1) * 0.25;
    const calories = (met * 3.5 * weight * minutes) / 200;

    return Math.max(5, Math.round(calories / 5) * 5);
  };

  const createLibraryAction = (slot, exercise, minutes, dayKey, weight) => {
    if (!exercise) {
      return null;
    }

    return {
      id: `${dayKey}-${slot}-${exercise.id}`,
      slot,
      exerciseId: exercise.id,
      name: exercise.name,
      emoji: exercise.emoji,
      tag: SMART_CATEGORY_TAGS[exercise.category] ?? SMART_SLOT_META[slot].label,
      sets: "",
      minutes,
      calories: estimateSmartCalories(slot, minutes, weight, exercise.difficulty),
      difficulty: exercise.difficulty,
    };
  };

  const createMicroAction = (dayKey, minutes, sets, weight) => ({
    id: `${dayKey}-micro-${minutes}`,
    slot: "micro",
    exerciseId: null,
    name: "微运动",
    emoji: "⚡",
    tag: "课间",
    sets: `${sets} 组`,
    minutes,
    calories: estimateSmartCalories("micro", minutes, weight, 2),
    difficulty: 2,
  });

  const pickExercise = (pool, seed) => {
    if (!pool.length) {
      return null;
    }

    return pool[((seed % pool.length) + pool.length) % pool.length];
  };

  const pickStrengthExercise = (seed) => {
    const groups = ["lower", "upper", "core"]
      .map((category) => exerciseCatalog.filter((exercise) => exercise.category === category))
      .filter((group) => group.length > 0);

    if (!groups.length) {
      return null;
    }

    const group = groups[seed % groups.length];
    return pickExercise(group, Math.floor(seed / groups.length));
  };

  const buildSmartSessionActions = (scheduleDay, seed, weight) => {
    const dayKey = scheduleDay.dayKey;

    if (scheduleDay.mode === "class") {
      return [createMicroAction(dayKey, 5, 1, weight)];
    }

    if (scheduleDay.minutes >= 45) {
      const cardio = pickExercise(
        exerciseCatalog.filter((exercise) => exercise.category === "cardio"),
        seed,
      );
      const strength = pickStrengthExercise(seed);
      const stretch = pickExercise(
        exerciseCatalog.filter((exercise) => exercise.category === "stretch"),
        seed,
      );
      const actions = [
        createLibraryAction("cardio", cardio, 20, dayKey, weight),
        createLibraryAction("strength", strength, 15, dayKey, weight),
        createLibraryAction("stretch", stretch, 5, dayKey, weight),
      ].filter(Boolean);

      return actions.length ? actions : [createMicroAction(dayKey, 5, 1, weight)];
    }

    if (scheduleDay.minutes === 30) {
      const stretch = pickExercise(
        exerciseCatalog.filter((exercise) => exercise.category === "stretch"),
        seed,
      );
      const actions = [
        createMicroAction(dayKey, 10, 2, weight),
        createLibraryAction("stretch", stretch, 5, dayKey, weight),
      ].filter(Boolean);

      return actions;
    }

    if (scheduleDay.minutes >= 15) {
      const stretch = pickExercise(
        exerciseCatalog.filter((exercise) => exercise.category === "stretch"),
        seed,
      );
      return [
        createMicroAction(dayKey, 5, 1, weight),
        createLibraryAction("stretch", stretch, 5, dayKey, weight),
      ].filter(Boolean);
    }

    return [createMicroAction(dayKey, 5, 1, weight)];
  };

  // 智能定制规则入口：调整训练结构、时长分配或休息日策略时，优先改这里。
  const buildSmartWeekSchedule = (plan, scheduleSource) => {
    const days = normalizeSchedule(scheduleSource);
    const weightNumber = Number(plan?.currentWeight);
    const weight = Number.isFinite(weightNumber) && weightNumber > 0 ? weightNumber : 60;
    const requestedDays = Number(plan?.exerciseDays);
    const trainingCount = Math.min(
      5,
      Math.max(1, Math.round(Number.isFinite(requestedDays) ? requestedDays : 3)),
    );
    const ranked = days
      .map((day, index) => ({
        day,
        index,
        score: day.mode === "free" ? 100 + day.minutes : day.minutes,
      }))
      .sort((left, right) => right.score - left.score || left.index - right.index);
    const trainingDays = new Set(
      ranked.slice(0, trainingCount).map(({ day }) => day.dayKey),
    );

    return days.map((scheduleDay, index) => {
      const isRest = !trainingDays.has(scheduleDay.dayKey);
      const actions = isRest
        ? []
        : buildSmartSessionActions(scheduleDay, index, weight);
      const totalMinutes = actions.reduce((total, action) => total + action.minutes, 0);
      const totalCalories = actions.reduce((total, action) => total + action.calories, 0);

      return {
        dayKey: scheduleDay.dayKey,
        label: getWeekDayLabel(scheduleDay.dayKey),
        mode: scheduleDay.mode,
        scheduledMinutes: scheduleDay.minutes,
        isRest,
        actions,
        totalMinutes,
        totalCalories,
      };
    });
  };

  const summarizeSmartWeek = (days) => {
    const trainingDays = days.filter((day) => !day.isRest).length;
    const restDays = days.length - trainingDays;
    const totalMinutes = days.reduce((total, day) => total + day.totalMinutes, 0);
    const totalCalories = days.reduce((total, day) => total + day.totalCalories, 0);

    return {
      trainingDays,
      restDays,
      totalMinutes,
      totalCalories,
      tag: `${trainingDays} 练 · ${restDays} 休`,
    };
  };

  const createSmartWeekState = (plan, days) => ({
    version: 2,
    generatedAt: new Date().toISOString(),
    plan,
    days,
    summary: summarizeSmartWeek(days),
    adjustments: [],
  });

  const isValidSavedPlan = (plan) => {
    if (!plan || typeof plan !== "object") {
      return false;
    }

    return [
      "bmi",
      "bmr",
      "tdee",
      "currentWeight",
      "targetWeight",
      "dailyEnergyAdjustment",
      "dailyCalorieTarget",
      "durationWeeks",
      "exerciseDays",
      "activityFactor",
      "weeklyTargetChange",
    ].every((key) => Number.isFinite(Number(plan[key]))) && Array.isArray(plan.weeklyPlan);
  };

  const normalizeSavedSmartDays = (sourceDays) => {
    if (!Array.isArray(sourceDays) || sourceDays.length !== WEEK_DAYS.length) {
      return null;
    }

    const normalized = [];

    for (const meta of WEEK_DAYS) {
      const source = sourceDays.find(
        (day) => day && typeof day === "object" && day.dayKey === meta.key,
      );

      if (!source || typeof source.isRest !== "boolean") {
        return null;
      }

      const rawActions = source.isRest ? [] : source.actions;

      if (!source.isRest && (!Array.isArray(rawActions) || rawActions.length === 0)) {
        return null;
      }

      const actions = [];

      for (const [index, rawAction] of (rawActions ?? []).entries()) {
        if (!rawAction || typeof rawAction !== "object") {
          return null;
        }

        const name = readTrimmedString(rawAction.name);
        const minutes = Number(rawAction.minutes);
        const calories = Number(rawAction.calories);

        if (!name || !Number.isFinite(minutes) || !Number.isFinite(calories)) {
          return null;
        }

        const slot = SMART_SLOT_META[rawAction.slot] ? rawAction.slot : "micro";
        const difficulty = Number(rawAction.difficulty);
        const exerciseId = readTrimmedString(rawAction.exerciseId);

        actions.push({
          id: readTrimmedString(rawAction.id) || `${meta.key}-${index}`,
          slot,
          exerciseId: exerciseId || null,
          name,
          emoji: readTrimmedString(rawAction.emoji) || "🏋️",
          tag: readTrimmedString(rawAction.tag) || SMART_SLOT_META[slot].label,
          sets: readTrimmedString(rawAction.sets),
          minutes: Math.max(1, Math.round(minutes)),
          calories: Math.max(0, Math.round(calories)),
          difficulty: Number.isFinite(difficulty) ? difficulty : 1,
        });
      }

      const totalMinutes = actions.reduce((total, action) => total + action.minutes, 0);
      const totalCalories = actions.reduce((total, action) => total + action.calories, 0);

      normalized.push({
        dayKey: meta.key,
        label: meta.label,
        mode: source.mode === "free" ? "free" : "class",
        scheduledMinutes: Number.isFinite(Number(source.scheduledMinutes))
          ? Number(source.scheduledMinutes)
          : 0,
        isRest: source.isRest,
        actions,
        totalMinutes,
        totalCalories,
        carryOver: source.carryOver === true,
        carryOverDate: isValidDateKey(source.carryOverDate)
          ? source.carryOverDate
          : null,
        skipped: source.skipped === true,
        skippedDate: isValidDateKey(source.skippedDate)
          ? source.skippedDate
          : null,
        rescheduled: source.rescheduled === true,
      });
    }

    return normalized;
  };

  const ADJUSTMENT_STATUSES = new Set([
    "pending",
    "carried",
    "rescheduled",
    "skipped",
    "superseded",
  ]);

  const normalizeAdjustmentTask = (rawTask, fallbackId) => {
    if (!rawTask || typeof rawTask !== "object") {
      return null;
    }

    const name = readTrimmedString(rawTask.name);
    const minutes = Number(rawTask.minutes);
    const calories = Number(rawTask.calories);

    if (!name || !Number.isFinite(minutes) || !Number.isFinite(calories)) {
      return null;
    }

    const slot = SMART_SLOT_META[rawTask.slot] ? rawTask.slot : "micro";
    const difficulty = Number(rawTask.difficulty);
    const exerciseId = readTrimmedString(rawTask.exerciseId);
    const sourceActionId = readTrimmedString(rawTask.sourceActionId);
    const sourceDate = isValidDateKey(rawTask.sourceDate)
      ? rawTask.sourceDate
      : null;

    return {
      id: readTrimmedString(rawTask.id) || fallbackId,
      slot,
      exerciseId: exerciseId || null,
      name,
      emoji: readTrimmedString(rawTask.emoji) || "🏋️",
      tag: readTrimmedString(rawTask.tag) || SMART_SLOT_META[slot].label,
      sets: readTrimmedString(rawTask.sets),
      minutes: Math.max(1, Math.round(minutes)),
      calories: Math.max(0, Math.round(calories)),
      difficulty: Number.isFinite(difficulty) ? difficulty : 1,
      sourceActionId: sourceActionId || null,
      sourceDate,
    };
  };

  const normalizeAdjustmentTasks = (source, fallbackPrefix) => {
    if (!Array.isArray(source)) {
      return [];
    }

    return source
      .map((task, index) =>
        normalizeAdjustmentTask(task, `${fallbackPrefix}-${index}`),
      )
      .filter(Boolean);
  };

  const normalizeSavedAdjustments = (sourceRecords) => {
    if (!Array.isArray(sourceRecords)) {
      return [];
    }

    const records = [];

    sourceRecords.forEach((source, index) => {
      if (!source || typeof source !== "object" || !isValidDateKey(source.sourceDate)) {
        return;
      }

      const sourceDayKey =
        WEEK_DAYS.some(({ key }) => key === source.sourceDayKey)
          ? source.sourceDayKey
          : getWeekdayKey(source.sourceDate);
      const fallbackId = `adjust-${source.sourceDate}`;
      const sourceTasks = normalizeAdjustmentTasks(
        source.sourceTasks,
        `${fallbackId}-source`,
      );
      const carryOverTasks = normalizeAdjustmentTasks(
        source.carryOverTasks,
        `${fallbackId}-carry`,
      );
      const assignments = [];

      if (Array.isArray(source.assignments)) {
        source.assignments.forEach((assignment, assignmentIndex) => {
          if (
            !assignment ||
            typeof assignment !== "object" ||
            !isValidDateKey(assignment.dateKey)
          ) {
            return;
          }

          const tasks = normalizeAdjustmentTasks(
            assignment.tasks,
            `${fallbackId}-target-${assignmentIndex}`,
          );

          if (tasks.length > 0) {
            assignments.push({ dateKey: assignment.dateKey, tasks });
          }
        });
      }

      const status = ADJUSTMENT_STATUSES.has(source.status)
        ? source.status
        : source.skipped === true
          ? "skipped"
          : source.carryOver === true
            ? "carried"
            : source.rescheduled === true
              ? "rescheduled"
              : "pending";

      records.push({
        id: readTrimmedString(source.id) || `${fallbackId}-${index}`,
        sourceDate: source.sourceDate,
        sourceDayKey,
        status,
        carryOver: source.carryOver === true || status === "carried",
        skipped: source.skipped === true || status === "skipped",
        rescheduled: source.rescheduled === true || status === "rescheduled",
        targetDate: isValidDateKey(source.targetDate) ? source.targetDate : null,
        resolvedAt: isValidDateKey(source.resolvedAt) ? source.resolvedAt : null,
        sourceTasks,
        carryOverTasks,
        assignments,
        detectedAt: readTrimmedString(source.detectedAt) || null,
        updatedAt: readTrimmedString(source.updatedAt) || null,
      });
    });

    return records;
  };

  const saveWeeklyPlanState = () => {
    if (!smartWeekState || !Array.isArray(smartWeekState.days)) {
      return false;
    }

    try {
      localStorage.setItem(
        STORAGE_KEYS.weeklyPlan,
        JSON.stringify({
          version: 2,
          generatedAt: smartWeekState.generatedAt,
          plan: smartWeekState.plan,
          days: smartWeekState.days,
          summary: smartWeekState.summary,
          schedule: scheduleState,
          adjustments: smartWeekState.adjustments ?? [],
        }),
      );
      return true;
    } catch {
      return false;
    }
  };

  const getWeekdayKey = (dateKey) => {
    const date = parseDateKey(dateKey);
    return WEEK_DAYS[(date.getDay() + 6) % 7].key;
  };

  const getYesterdayKey = () => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - 1);
    return toDateKey(date);
  };

  const getCurrentWeekDateEntries = () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    return WEEK_DAYS.map((meta, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return { dayKey: meta.key, dateKey: toDateKey(date) };
    });
  };

  const getCurrentWeekRange = () => {
    const entries = getCurrentWeekDateEntries();
    return { startKey: entries[0].dateKey, endKey: entries[6].dateKey };
  };

  const getPlanGeneratedDateKey = () => {
    if (!smartWeekState?.generatedAt) {
      return null;
    }

    const date = new Date(smartWeekState.generatedAt);
    return Number.isNaN(date.getTime()) ? null : toDateKey(date);
  };

  const getAdjustmentRecords = () =>
    Array.isArray(smartWeekState?.adjustments) ? smartWeekState.adjustments : [];

  const getWeeklyPlanDayForDate = (dateKey) => {
    if (!smartWeekState || !Array.isArray(smartWeekState.days)) {
      return null;
    }

    const dayKey = getWeekdayKey(dateKey);
    return smartWeekState.days.find((day) => day.dayKey === dayKey) ?? null;
  };

  const clonePlanActionForAdjustment = (action) => ({
    id: action.id,
    slot: action.slot,
    exerciseId: action.exerciseId ?? null,
    name: action.name,
    emoji: action.emoji,
    tag: action.tag,
    sets: action.sets,
    minutes: action.minutes,
    calories: action.calories,
    difficulty: action.difficulty ?? 1,
  });

  const buildLightMakeupTasks = (sourceTasks, sourceDate) => {
    if (!Array.isArray(sourceTasks) || sourceTasks.length === 0) {
      return [];
    }

    const totalMinutes = 10;
    const baseMinutes = Math.floor(totalMinutes / sourceTasks.length);
    const remainder = totalMinutes % sourceTasks.length;
    const weightValue = Number(smartWeekState?.plan?.currentWeight);
    const weight = Number.isFinite(weightValue) && weightValue > 0 ? weightValue : 60;

    return sourceTasks.map((task, index) => {
      const minutes = Math.max(
        1,
        baseMinutes + (index < remainder ? 1 : 0),
      );

      return {
        ...clonePlanActionForAdjustment(task),
        id: `carryover-${sourceDate}-${task.id}`,
        tag: "补练",
        sets: "",
        minutes,
        calories: estimateSmartCalories(
          task.slot,
          minutes,
          weight,
          task.difficulty,
        ),
        sourceActionId: task.id,
        sourceDate,
      };
    });
  };

  const getPendingAdjustment = () => {
    const yesterdayKey = getYesterdayKey();
    return (
      getAdjustmentRecords().find(
        (record) =>
          record.status === "pending" && record.sourceDate === yesterdayKey,
      ) ?? null
    );
  };

  const ensureYesterdayAdjustment = () => {
    if (!smartWeekState || !Array.isArray(smartWeekState.days)) {
      return;
    }

    const todayKey = toDateKey(new Date());

    if (lastAdjustmentCheckDate === todayKey) {
      return;
    }

    lastAdjustmentCheckDate = todayKey;

    if (!Array.isArray(smartWeekState.adjustments)) {
      smartWeekState.adjustments = [];
    }

    const records = smartWeekState.adjustments;
    const yesterdayKey = getYesterdayKey();
    const now = new Date().toISOString();
    let changed = false;

    records.forEach((record) => {
      if (record.status === "pending" && record.sourceDate !== yesterdayKey) {
        record.status = "superseded";
        record.updatedAt = now;
        changed = true;
      }
    });

    if (records.some((record) => record.sourceDate === yesterdayKey)) {
      if (changed && !saveWeeklyPlanState()) {
        lastAdjustmentCheckDate = null;
      }
      return;
    }

    const generatedDateKey = getPlanGeneratedDateKey();

    if (!generatedDateKey || generatedDateKey > yesterdayKey) {
      if (changed && !saveWeeklyPlanState()) {
        lastAdjustmentCheckDate = null;
      }
      return;
    }

    const yesterdayPlan = getWeeklyPlanDayForDate(yesterdayKey);
    const yesterdayRecord = checkinRecords[yesterdayKey] ?? null;

    if (!yesterdayPlan || yesterdayPlan.isRest) {
      if (changed && !saveWeeklyPlanState()) {
        lastAdjustmentCheckDate = null;
      }
      return;
    }

    const sourceTasks = yesterdayPlan.actions
      .filter(
        (action) => yesterdayRecord?.exercises?.[action.id] !== true,
      )
      .map(clonePlanActionForAdjustment);

    if (sourceTasks.length === 0) {
      if (changed && !saveWeeklyPlanState()) {
        lastAdjustmentCheckDate = null;
      }
      return;
    }

    records.push({
      id: `adjust-${yesterdayKey}`,
      sourceDate: yesterdayKey,
      sourceDayKey: getWeekdayKey(yesterdayKey),
      status: "pending",
      carryOver: false,
      skipped: false,
      rescheduled: false,
      targetDate: null,
      resolvedAt: null,
      sourceTasks,
      carryOverTasks: buildLightMakeupTasks(sourceTasks, yesterdayKey),
      assignments: [],
      detectedAt: now,
      updatedAt: now,
    });

    if (!saveWeeklyPlanState()) {
      lastAdjustmentCheckDate = null;
    }
  };

  const setCarryoverFeedback = (message, state = "") => {
    elements.carryoverFeedback.textContent = message;

    if (state) {
      elements.carryoverFeedback.dataset.state = state;
    } else {
      delete elements.carryoverFeedback.dataset.state;
    }

    elements.carryoverFeedback.hidden = message === "";
  };

  const renderCarryoverCard = () => {
    if (!elements.carryoverCard) {
      return;
    }

    const record = getPendingAdjustment();

    if (!record || record.sourceTasks.length === 0) {
      elements.carryoverCard.hidden = true;
      return;
    }

    const makeupTasks =
      record.carryOverTasks.length > 0
        ? record.carryOverTasks
        : buildLightMakeupTasks(record.sourceTasks, record.sourceDate);
    const totalMinutes = makeupTasks.reduce(
      (total, task) => total + task.minutes,
      0,
    );
    const fragment = document.createDocumentFragment();

    elements.carryoverTag.textContent = `${totalMinutes} 分钟补练`;
    elements.carryoverMessage.textContent =
      "昨天没完成，今天给你安排了 10 分钟轻量补练。";
    elements.carryoverHint.textContent =
      "顺延会转成 10 分钟轻量补练；重排会保留原时长。";

    record.sourceTasks.forEach((task) => {
      const item = document.createElement("li");
      const copy = document.createElement("span");
      const name = document.createElement("strong");
      const meta = document.createElement("span");
      const duration = document.createElement("span");

      copy.className = "adjust-task-copy";
      name.textContent = task.name;
      meta.textContent = `${task.tag}${task.sets ? ` · ${task.sets}` : ""}`;
      copy.append(name, meta);

      duration.className = "adjust-task-duration";
      duration.textContent = `${task.minutes} 分钟`;

      item.className = "adjust-task";
      item.append(copy, duration);
      fragment.append(item);
    });

    elements.carryoverList.replaceChildren(fragment);
    setCarryoverFeedback("");
    elements.carryoverCard.hidden = false;
  };

  const commitAdjustment = (mutator) => {
    if (!smartWeekState) {
      return false;
    }

    const previous = JSON.stringify({
      adjustments: getAdjustmentRecords(),
      days: smartWeekState.days,
    });

    mutator();

    if (saveWeeklyPlanState()) {
      return true;
    }

    try {
      const restored = JSON.parse(previous);
      smartWeekState.adjustments = restored.adjustments;
      smartWeekState.days = restored.days;
    } catch {
      // Keep the in-memory state usable when storage is unavailable.
    }

    return false;
  };

  const focusTodayPlanHeading = () => {
    window.setTimeout(() => {
      const heading = elements.todayPlanCard?.querySelector("h2");

      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }, 0);
  };

  const focusCarryOverTask = () => {
    window.setTimeout(() => {
      const input = elements.todayPlanList.querySelector(
        'input[data-plan-task-id^="carryover-"]',
      );

      if (input) {
        input.focus({ preventScroll: true });
      } else {
        focusTodayPlanHeading();
      }
    }, 0);
  };

  const carryOverAdjustmentToToday = (record) => {
    const todayKey = toDateKey(new Date());
    const records = getAdjustmentRecords();

    if (
      records.some(
        (item) => item.status === "carried" && item.targetDate === todayKey,
      )
    ) {
      setCarryoverFeedback("今天已经有一组补练安排，先完成它就好。");
      return;
    }

    const targetDay = getWeeklyPlanDayForDate(todayKey);
    const makeupTasks =
      record.carryOverTasks.length > 0
        ? record.carryOverTasks
        : buildLightMakeupTasks(record.sourceTasks, record.sourceDate);
    const totalMinutes = makeupTasks.reduce(
      (total, task) => total + task.minutes,
      0,
    );
    const now = new Date().toISOString();

    if (!targetDay || makeupTasks.length === 0) {
      setCarryoverFeedback("今天的安排暂时不可用，请稍后重试。", "error");
      return;
    }

    const saved = commitAdjustment(() => {
      record.status = "carried";
      record.carryOver = true;
      record.rescheduled = false;
      record.skipped = false;
      record.targetDate = todayKey;
      record.resolvedAt = todayKey;
      record.carryOverTasks = makeupTasks;
      record.updatedAt = now;
      targetDay.carryOver = true;
      targetDay.carryOverDate = todayKey;
      targetDay.carryOverTasks = makeupTasks;
    });

    if (!saved) {
      setCarryoverFeedback(
        "暂时无法保存，请检查浏览器存储权限或空间后重试。",
        "error",
      );
      return;
    }

    renderDashboard();
    focusCarryOverTask();
    setTodayPlanFeedback(
      `已把 ${totalMinutes} 分钟轻量补练顺延到今天。`,
    );
  };

  const getRemainingFreeDateKeys = () => {
    const todayKey = toDateKey(new Date());
    const normalized = normalizeSchedule(scheduleState);

    return getCurrentWeekDateEntries()
      .filter(
        ({ dayKey, dateKey }) =>
          dateKey > todayKey &&
          normalized.find((day) => day.dayKey === dayKey)?.mode === "free",
      )
      .map(({ dateKey }) => dateKey);
  };

  const rescheduleAdjustment = (record) => {
    const todayKey = toDateKey(new Date());
    const targetDates = getRemainingFreeDateKeys();

    if (targetDates.length === 0) {
      setCarryoverFeedback(
        "本周没有剩余空闲日，可以先选择顺延到今天。",
      );
      return;
    }

    const assignments = targetDates.map((dateKey) => ({
      dateKey,
      tasks: [],
    }));

    record.sourceTasks.forEach((task, index) => {
      const assignment = assignments[index % assignments.length];
      assignment.tasks.push({
        ...clonePlanActionForAdjustment(task),
        id: `reschedule-${record.sourceDate}-${task.id}-${assignment.dateKey}`,
        tag: "重排",
        sourceActionId: task.id,
        sourceDate: record.sourceDate,
      });
    });

    const nonEmptyAssignments = assignments.filter(
      ({ tasks }) => tasks.length > 0,
    );
    const now = new Date().toISOString();
    const targetLabels = nonEmptyAssignments
      .map(({ dateKey }) => getWeekDayLabel(getWeekdayKey(dateKey)))
      .join("、");

    const saved = commitAdjustment(() => {
      record.status = "rescheduled";
      record.carryOver = false;
      record.skipped = false;
      record.rescheduled = true;
      record.targetDate = null;
      record.resolvedAt = todayKey;
      record.assignments = nonEmptyAssignments;
      record.updatedAt = now;

      const sourceDay = smartWeekState.days.find(
        (day) => day.dayKey === record.sourceDayKey,
      );

      if (sourceDay) {
        sourceDay.rescheduled = true;
      }

      nonEmptyAssignments.forEach(({ dateKey }) => {
        const targetDay = getWeeklyPlanDayForDate(dateKey);

        if (targetDay) {
          targetDay.rescheduled = true;
        }
      });
    });

    if (!saved) {
      setCarryoverFeedback(
        "暂时无法保存，请检查浏览器存储权限或空间后重试。",
        "error",
      );
      return;
    }

    renderDashboard();
    focusTodayPlanHeading();
    setTodayPlanFeedback(
      `已把 ${record.sourceTasks.length} 项安排到本周剩余空闲日（${targetLabels}）。`,
    );
  };

  const skipAdjustment = (record) => {
    const todayKey = toDateKey(new Date());
    const now = new Date().toISOString();

    const saved = commitAdjustment(() => {
      record.status = "skipped";
      record.carryOver = false;
      record.rescheduled = false;
      record.skipped = true;
      record.targetDate = null;
      record.resolvedAt = todayKey;
      record.updatedAt = now;

      const sourceDay = smartWeekState.days.find(
        (day) => day.dayKey === record.sourceDayKey,
      );

      if (sourceDay) {
        sourceDay.skipped = true;
        sourceDay.skippedDate = record.sourceDate;
      }
    });

    if (!saved) {
      setCarryoverFeedback(
        "暂时无法保存，请检查浏览器存储权限或空间后重试。",
        "error",
      );
      return;
    }

    renderDashboard();
    focusTodayPlanHeading();
    setTodayPlanFeedback("已记录这次跳过，连续打卡按原规则计算。");
  };

  const handleCarryoverAction = (action) => {
    const record = getPendingAdjustment();

    if (!record) {
      renderCarryoverCard();
      return;
    }

    if (action === "carry") {
      carryOverAdjustmentToToday(record);
      return;
    }

    if (action === "reschedule") {
      rescheduleAdjustment(record);
      return;
    }

    if (action === "skip") {
      skipAdjustment(record);
    }
  };

  const getWeeklyPlanTasksForDate = (dateKey) => {
    if (!smartWeekState || !Array.isArray(smartWeekState.days)) {
      return [];
    }

    const day = getWeeklyPlanDayForDate(dateKey);
    const tasks = [];

    if (day && !day.isRest) {
      day.actions.forEach((action) => {
        tasks.push({
          id: action.id,
          name: action.name,
          meta: `智能计划 · ${action.tag}`,
          amount: `${action.sets ? `${action.sets} · ` : ""}${action.minutes} 分钟`,
        });
      });
    }

    getAdjustmentRecords().forEach((record) => {
      if (
        record.status === "carried" &&
        record.targetDate === dateKey
      ) {
        record.carryOverTasks.forEach((task) => {
          tasks.push({
            id: task.id,
            name: task.name,
            meta: "顺延补练 · 来自昨天",
            amount: `${task.minutes} 分钟`,
          });
        });
      }

      if (record.status !== "rescheduled") {
        return;
      }

      record.assignments.forEach((assignment) => {
        if (assignment.dateKey !== dateKey) {
          return;
        }

        assignment.tasks.forEach((task) => {
          tasks.push({
            id: task.id,
            name: task.name,
            meta: `本周重排 · 来自${formatShortDate(record.sourceDate)}`,
            amount: `${task.minutes} 分钟`,
          });
        });
      });
    });

    return tasks;
  };

  const renderAdjustmentStats = () => {
    if (!dataElements.adjustStrip) {
      return;
    }

    if (!smartWeekState) {
      dataElements.adjustStrip.hidden = true;
      return;
    }

    const { startKey, endKey } = getCurrentWeekRange();
    const records = getAdjustmentRecords().filter((record) => {
      const dateKey = record.resolvedAt || record.sourceDate;
      return dateKey >= startKey && dateKey <= endKey;
    });
    const carried = records.filter((record) => record.carryOver).length;
    const rescheduled = records.filter((record) => record.rescheduled).length;
    const skipped = records.filter((record) => record.skipped).length;
    const details = [];

    if (carried > 0) {
      details.push(`顺延 ${carried} 次`);
    }

    if (rescheduled > 0) {
      details.push(`重排 ${rescheduled} 次`);
    }

    dataElements.adjustCount.textContent = `本周跳过 ${skipped} 次`;
    dataElements.adjustNote.textContent =
      (details.length > 0 ? `本周${details.join(" · ")}；` : "") +
      "跳过只调整安排，不影响连续打卡。";
    dataElements.adjustStrip.hidden = false;
  };

  const showPlanStorageError = (message) => {
    planElements.saveStatus.dataset.state = "error";
    planElements.saveStatus.textContent = message;
    planElements.saveStatus.hidden = false;
  };

  const renderSmartWeek = () => {
    if (!smartWeekState || !planElements.smartWeekGrid) {
      return;
    }

    const plan = smartWeekState.plan;
    const summary = summarizeSmartWeek(smartWeekState.days);
    const fragment = document.createDocumentFragment();

    smartWeekState.summary = summary;
    planElements.smartWeekTag.textContent = summary.tag;
    planElements.smartWeekSummary.textContent =
      `本周 ${summary.trainingDays} 天有训练安排，${summary.restDays} 天完整休息；` +
      `预计累计运动 ${summary.totalMinutes} 分钟，消耗约 ${calorieFormatter.format(summary.totalCalories)} kcal。`;

    const dailyTarget = Number(plan.dailyCalorieTarget);
    planElements.smartWeekDietNote.textContent = Number.isFinite(dailyTarget)
      ? `每日饮食目标沿用上方 ${calorieFormatter.format(dailyTarget)} kcal/天，训练日不单独增加热量目标。`
      : "每日饮食目标沿用上方 TDEE 计算结果。";

    smartWeekState.days.forEach((day) => {
      const modeLabel = day.isRest
        ? "休息"
        : day.mode === "class"
          ? "有课"
          : "空闲";
      const modeClass = day.isRest ? "rest" : day.mode;

      if (day.isRest) {
        const card = document.createElement("article");
        const top = document.createElement("span");
        const dayName = document.createElement("strong");
        const badge = document.createElement("span");
        const copy = document.createElement("p");
        const total = document.createElement("span");

        card.className = "week-day-card is-rest";
        card.dataset.weekRest = day.dayKey;
        card.setAttribute("aria-label", `${day.label}，休息日，不安排训练`);

        top.className = "week-day-top";
        dayName.className = "week-day-name";
        dayName.textContent = day.label;
        badge.className = "week-day-mode is-rest";
        badge.textContent = modeLabel;
        top.append(dayName, badge);

        copy.className = "week-day-rest";
        copy.textContent = "不安排训练，睡好、吃好，轻松散步就好。";

        total.className = "week-day-total";
        total.textContent = "完整休息日";

        card.append(top, copy, total);
        fragment.append(card);
        return;
      }

      const card = document.createElement("button");
      const top = document.createElement("span");
      const dayName = document.createElement("strong");
      const badge = document.createElement("span");
      const items = document.createElement("span");
      const footer = document.createElement("span");
      const total = document.createElement("span");
      const editHint = document.createElement("span");

      card.type = "button";
      card.className = "week-day-card is-training";
      card.dataset.weekDay = day.dayKey;
      card.setAttribute(
        "aria-label",
        `${day.label}，${modeLabel}，` +
          day.actions
            .map(
              (action) =>
                `${action.name}${action.sets ? ` ${action.sets}` : ""} ${action.minutes} 分钟`,
            )
            .join("、") +
          `，合计约 ${day.totalMinutes} 分钟，消耗约 ${day.totalCalories} 千卡。点按替换动作`,
      );

      top.className = "week-day-top";
      dayName.className = "week-day-name";
      dayName.textContent = day.label;
      badge.className = `week-day-mode is-${modeClass}`;
      badge.textContent = modeLabel;
      top.append(dayName, badge);

      items.className = "week-day-items";
      day.actions.forEach((action) => {
        const item = document.createElement("span");
        const tag = document.createElement("span");
        const name = document.createElement("strong");
        const time = document.createElement("span");

        item.className = "week-day-item";
        tag.className = "week-item-tag";
        tag.textContent = action.tag;
        name.className = "week-item-name";
        name.textContent = action.name;
        time.className = "week-item-time";
        time.textContent = action.sets
          ? `${action.sets} · ${action.minutes} 分钟`
          : `${action.minutes} 分钟`;
        item.append(tag, name, time);
        items.append(item);
      });

      footer.className = "week-day-footer";
      total.className = "week-day-total";
      total.textContent = `${day.totalMinutes} 分钟 · 约 ${day.totalCalories} kcal`;
      editHint.className = "week-day-edit";
      editHint.append("点按替换", createIcon("chevron"));
      footer.append(total, editHint);

      card.append(top, items, footer);
      fragment.append(card);
    });

    planElements.smartWeekGrid.replaceChildren(fragment);
  };

  const prefillPlanForm = (plan) => {
    const setValue = (name, value) => {
      const field = planElements.form.elements[name];

      if (field && value !== undefined && value !== null) {
        field.value = String(value);
      }
    };

    setValue("age", plan.age);
    setValue("height", plan.height);
    setValue("currentWeight", plan.currentWeight);
    setValue("targetWeight", plan.targetWeight);
    setValue("exerciseDays", plan.exerciseDays);
    setValue("durationWeeks", plan.durationWeeks);

    ["gender", "durationWeeks"].forEach((name) => {
      const value = String(plan[name] ?? "");
      const radio = planElements.form.querySelector(
        `input[name="${name}"][value="${value}"]`,
      );

      if (radio) {
        radio.checked = true;
      }
    });

    updatePlanGoalHint();
  };

  const restoreSavedWeeklyPlan = () => {
    const saved = readStorage(STORAGE_KEYS.weeklyPlan, null);

    if (!saved || typeof saved !== "object" || !isValidSavedPlan(saved.plan)) {
      return false;
    }

    const days = normalizeSavedSmartDays(saved.days);

    if (!days) {
      return false;
    }

    const plan = {
      ...saved.plan,
      goalType: saved.plan.goalType === "gain" ? "gain" : "lose",
      bmiCategory:
        readTrimmedString(saved.plan.bmiCategory) || getBmiCategory(Number(saved.plan.bmi)),
    };

    generatedPlan = plan;
    smartWeekState = {
      version: 2,
      generatedAt: readTrimmedString(saved.generatedAt) || new Date().toISOString(),
      plan,
      days,
      summary: summarizeSmartWeek(days),
      adjustments: normalizeSavedAdjustments(saved.adjustments),
    };

    prefillPlanForm(plan);
    renderPlan(plan);
    renderSmartWeek();
    setPlanStep(3);
    return true;
  };

  const resetSwapDialog = () => {
    planElements.swapSlotStep.hidden = false;
    planElements.swapOptionStep.hidden = true;
    planElements.swapSlotList.replaceChildren();
    planElements.swapOptionList.replaceChildren();
    planElements.swapFeedback.hidden = true;
    planElements.swapFeedback.textContent = "";
    delete planElements.swapFeedback.dataset.state;
    planElements.swapSlotBack.hidden = false;
  };

  const renderSwapSlots = (day) => {
    const fragment = document.createDocumentFragment();

    planElements.swapSlotLabel.textContent = `选择要替换的动作（${day.label}）`;

    day.actions.forEach((action, index) => {
      const button = document.createElement("button");
      const copy = document.createElement("span");
      const tag = document.createElement("span");
      const name = document.createElement("strong");
      const meta = document.createElement("span");

      button.type = "button";
      button.className = "swap-slot-button";
      button.dataset.swapSlot = String(index);
      button.autofocus = index === 0;
      button.setAttribute(
        "aria-label",
        `替换 ${action.name}，${action.tag}，${action.minutes} 分钟`,
      );

      copy.className = "swap-slot-copy";
      tag.className = "swap-slot-tag";
      tag.textContent = action.tag;
      name.textContent = action.name;
      meta.className = "swap-slot-meta";
      meta.textContent = `${action.sets ? `${action.sets} · ` : ""}${action.minutes} 分钟 · 约 ${action.calories} kcal`;
      copy.append(tag, name, meta);

      button.append(copy, createIcon("chevron"));
      fragment.append(button);
    });

    planElements.swapSlotList.replaceChildren(fragment);
    planElements.swapSlotStep.hidden = false;
    planElements.swapOptionStep.hidden = true;
    planElements.swapSlotBack.hidden = true;
  };

  const showSwapOptions = (slotIndex) => {
    if (!swapContext || !smartWeekState) {
      return;
    }

    const day = smartWeekState.days.find(({ dayKey }) => dayKey === swapContext.dayKey);
    const action = day?.actions[slotIndex];

    if (!day || !action) {
      return;
    }

    const allowedCategories = SMART_SWAP_CATEGORIES[action.slot] ?? [
      "cardio",
      "lower",
      "upper",
      "core",
      "stretch",
    ];
    const options = exerciseCatalog.filter(
      (exercise) =>
        allowedCategories.includes(exercise.category) &&
        exercise.id !== action.exerciseId,
    );
    const fragment = document.createDocumentFragment();

    swapContext.slotIndex = slotIndex;
    planElements.swapOptionLabel.textContent = `替换「${action.name}」`;
    planElements.swapSlotStep.hidden = true;
    planElements.swapOptionStep.hidden = false;
    planElements.swapSlotBack.hidden = day.actions.length <= 1;
    planElements.swapFeedback.hidden = true;

    if (!options.length) {
      planElements.swapFeedback.textContent = "动作库里暂时没有可替换的同类动作。";
      planElements.swapFeedback.dataset.state = "error";
      planElements.swapFeedback.hidden = false;
      planElements.swapOptionList.replaceChildren();
      return;
    }

    options.forEach((exercise, index) => {
      const button = document.createElement("button");
      const emoji = document.createElement("span");
      const copy = document.createElement("span");
      const name = document.createElement("strong");
      const meta = document.createElement("span");

      button.type = "button";
      button.className = "swap-option-button";
      button.dataset.swapExercise = exercise.id;
      button.autofocus = index === 0;
      button.setAttribute(
        "aria-label",
        `替换为 ${exercise.name}，${exerciseCategoryLabels.get(exercise.category) ?? ""}，难度 ${exercise.difficulty}`,
      );

      emoji.className = "swap-option-emoji";
      emoji.textContent = exercise.emoji;
      copy.className = "swap-option-copy";
      name.textContent = exercise.name;
      meta.className = "swap-option-meta";
      meta.textContent =
        `${exerciseCategoryLabels.get(exercise.category) ?? "动作"} · 难度 ${exercise.difficulty} · ${action.minutes} 分钟`;
      copy.append(name, meta);
      button.append(emoji, copy);
      fragment.append(button);
    });

    planElements.swapOptionList.replaceChildren(fragment);
  };

  const openSwapDialog = (dayKey, trigger) => {
    if (!smartWeekState) {
      return;
    }

    const day = smartWeekState.days.find(
      (item) => item.dayKey === dayKey && !item.isRest,
    );

    if (!day || !day.actions.length) {
      return;
    }

    swapContext = { dayKey, slotIndex: null, trigger };
    resetSwapDialog();
    planElements.swapTitle.textContent = `调整${day.label}的训练`;

    if (day.actions.length === 1) {
      showSwapOptions(0);
    } else {
      renderSwapSlots(day);
    }

    if (typeof planElements.swapDialog.showModal === "function") {
      planElements.swapDialog.showModal();
    } else {
      planElements.swapDialog.setAttribute("open", "");
    }

    window.setTimeout(() => {
      const focusTarget = planElements.swapOptionStep.hidden
        ? planElements.swapSlotList.querySelector("button")
        : planElements.swapOptionList.querySelector("button");
      focusTarget?.focus({ preventScroll: true });
    }, 0);
  };

  const finishSwapDialog = () => {
    const trigger = swapContext?.trigger;

    resetSwapDialog();
    swapContext = null;

    window.setTimeout(() => {
      if (trigger && document.contains(trigger)) {
        trigger.focus({ preventScroll: true });
      }
    }, 50);
  };

  const closeSwapDialog = () => {
    if (typeof planElements.swapDialog.close === "function") {
      planElements.swapDialog.close();
    } else {
      planElements.swapDialog.removeAttribute("open");
    }

    finishSwapDialog();
  };

  const replaceSmartAction = (exerciseId) => {
    if (!swapContext || !smartWeekState) {
      return;
    }

    const day = smartWeekState.days.find(
      ({ dayKey }) => dayKey === swapContext.dayKey,
    );
    const action = day?.actions[swapContext.slotIndex];
    const exercise = exerciseById.get(exerciseId);

    if (!day || !action || !exercise) {
      return;
    }

    const weightNumber = Number(smartWeekState.plan?.currentWeight);
    const weight = Number.isFinite(weightNumber) && weightNumber > 0 ? weightNumber : 60;

    day.actions[swapContext.slotIndex] = {
      ...action,
      id: `${day.dayKey}-${action.slot}-${exercise.id}`,
      exerciseId: exercise.id,
      name: exercise.name,
      emoji: exercise.emoji,
      tag: SMART_CATEGORY_TAGS[exercise.category] ?? action.tag,
      sets: "",
      calories: estimateSmartCalories(
        action.slot,
        action.minutes,
        weight,
        exercise.difficulty,
      ),
      difficulty: exercise.difficulty,
    };
    day.totalMinutes = day.actions.reduce((total, item) => total + item.minutes, 0);
    day.totalCalories = day.actions.reduce((total, item) => total + item.calories, 0);
    smartWeekState.summary = summarizeSmartWeek(smartWeekState.days);

    renderSmartWeek();

    const trigger = planElements.smartWeekGrid.querySelector(
      `[data-week-day="${day.dayKey}"]`,
    );

    if (swapContext) {
      swapContext.trigger = trigger;
    }

    if (!saveWeeklyPlanState()) {
      showPlanStorageError("动作已替换，但写入本地存储失败，请检查浏览器存储权限。");
    }

    closeSwapDialog();
  };

  const resetPlanSaveState = () => {
    planElements.saveButton.disabled = false;
    planElements.saveButton.textContent = "保存我的计划";
    planElements.saveStatus.hidden = true;
    planElements.saveStatus.textContent = "";
    delete planElements.saveStatus.dataset.state;
  };

  const renderWeeklyPlan = (weeklyPlan) => {
    const fragment = document.createDocumentFragment();

    weeklyPlan.forEach((row, index) => {
      const tableRow = document.createElement("tr");

      if (index === weeklyPlan.length - 1) {
        tableRow.className = "is-final";
      }

      const weekCell = document.createElement("td");
      const weekLabel = document.createElement("span");
      weekLabel.className = "weekly-week";
      weekLabel.textContent = `第 ${row.week} 周`;
      weekCell.append(weekLabel);

      const weightCell = document.createElement("td");
      const weightLabel = document.createElement("span");
      const weightUnit = document.createElement("small");
      weightLabel.className = "weekly-weight";
      weightLabel.append(weightFormatter.format(row.targetWeight), " ", weightUnit);
      weightUnit.textContent = "kg";
      weightCell.append(weightLabel);

      const exerciseCell = document.createElement("td");
      const exerciseLabel = document.createElement("span");
      exerciseLabel.className = "weekly-exercise";
      exerciseLabel.textContent = row.exerciseLabel;
      exerciseCell.append(exerciseLabel);

      tableRow.append(weekCell, weightCell, exerciseCell);
      fragment.append(tableRow);
    });

    planElements.weeklyBody.replaceChildren(fragment);
  };

  const renderPlan = (plan) => {
    const isGain = plan.goalType === "gain";
    const goalLabel = isGain ? "增重" : "减重";

    planElements.resultTitle.textContent = `你的 ${plan.durationWeeks} 周${goalLabel}计划`;
    planElements.goalVerb.textContent = goalLabel;
    planElements.currentWeight.textContent = weightFormatter.format(plan.currentWeight);
    planElements.targetWeight.textContent = weightFormatter.format(plan.targetWeight);
    planElements.totalLoss.textContent = weightFormatter.format(
      Math.abs(plan.currentWeight - plan.targetWeight),
    );
    planElements.bmi.textContent = plan.bmi.toFixed(1);
    planElements.bmiLabel.textContent = plan.bmiCategory;
    planElements.bmr.textContent = calorieFormatter.format(plan.bmr);
    planElements.tdee.textContent = calorieFormatter.format(plan.tdee);
    planElements.activityFactor.textContent = `${plan.activityFactor} · 每周 ${plan.exerciseDays} 天`;
    planElements.adjustmentLabel.textContent = isGain ? "建议热量盈余" : "建议热量缺口";
    planElements.deficit.textContent = calorieFormatter.format(plan.dailyEnergyAdjustment);
    planElements.calories.textContent = calorieFormatter.format(plan.dailyCalorieTarget);
    planElements.energyTitle.textContent = isGain
      ? "吃得扎实，稳步增重"
      : "按节奏，吃得刚刚好";
    planElements.energyNote.textContent = isGain
      ? "按每周健康增重 0.25–0.5 kg 推算，将每日盈余控制在 250–500 kcal，并优先保证蛋白质摄入。"
      : "按每周健康减重 0.5–1 kg 推算，将每日缺口控制在 300–500 kcal。";
    planElements.weeklyTag.textContent = `${plan.durationWeeks} 周`;

    planElements.gainGuide.hidden = !isGain;

    if (isGain) {
      const proteinMin = Math.round(plan.currentWeight * 1.6);
      const proteinMax = Math.round(plan.currentWeight * 2);
      const aerobicCopy = plan.aerobicDays > 0 ? `，搭配 ${plan.aerobicDays} 天轻有氧` : "";

      planElements.gainCalories.textContent =
        `每日在总消耗基础上增加约 ${calorieFormatter.format(plan.dailyEnergyAdjustment)} kcal，分到 3 餐和 2 次加餐。`;
      planElements.gainProtein.textContent =
        `蛋白质每天约 ${proteinMin}–${proteinMax} g，分散到每一餐。`;
      planElements.gainTraining.textContent =
        `每周安排 ${plan.strengthDays} 天力量训练${aerobicCopy}，优先练大肌群，给肌肉增长留出恢复时间。`;
    }

    planElements.warning.hidden = !plan.goalTooFast;

    if (plan.goalTooFast) {
      const visibleWeeklyRate = Math.ceil(plan.weeklyTargetChange * 100) / 100;
      planElements.warningTitle.textContent = isGain
        ? "增重节奏偏快，建议调整"
        : "目标过快，建议调整";
      planElements.warningMessage.textContent = isGain
        ? `当前计划平均每周需增重 ${weeklyRateFormatter.format(visibleWeeklyRate)} kg，超过每周 0.5 kg 的健康建议。`
        : `当前计划平均每周需减重 ${weeklyRateFormatter.format(visibleWeeklyRate)} kg，超过每周 1 kg 的健康建议。`;
    }

    renderWeeklyPlan(plan.weeklyPlan);
    resetPlanSaveState();
  };

  const updatePlanGoalHint = () => {
    const height = Number(planElements.form.elements.height.value);
    const currentWeight = Number(planElements.form.elements.currentWeight.value);
    const targetWeight = Number(planElements.form.elements.targetWeight.value);
    const hint = planElements.goalHint;

    if (
      ![height, currentWeight, targetWeight].every(Number.isFinite) ||
      height <= 0 ||
      currentWeight <= 0 ||
      targetWeight <= 0
    ) {
      hint.hidden = true;
      hint.textContent = "";
      delete hint.dataset.state;
      return;
    }

    const bmi = Math.round((currentWeight / (height / 100) ** 2) * 10) / 10;

    if (bmi < 18.5 && targetWeight <= currentWeight) {
      hint.dataset.state = "warning";
      hint.textContent =
        `当前 BMI ${bmi.toFixed(1)} 属于偏瘦，不建议继续减重。建议把目标设为 ${weightFormatter.format(getHealthyWeightFloor(height))} kg 以上，开启健康增重计划。`;
    } else if (targetWeight > currentWeight) {
      hint.dataset.state = "gain";
      hint.textContent = "已识别为增重目标，将安排热量盈余，并优先推荐力量训练。";
    } else {
      hint.hidden = true;
      hint.textContent = "";
      delete hint.dataset.state;
      return;
    }

    hint.hidden = false;
  };

  const setPlanStep = (step) => {
    planElements.formPanel.hidden = step !== 1;
    planElements.schedulePanel.hidden = step !== 2;
    planElements.resultPanel.hidden = step !== 3;

    planElements.steps.forEach((stepElement) => {
      const stepNumber = Number(stepElement.dataset.planStep);
      const isActive = stepNumber === step;
      stepElement.classList.toggle("is-active", isActive);
      stepElement.classList.toggle("is-complete", stepNumber < step);

      if (isActive) {
        stepElement.setAttribute("aria-current", "step");
      } else {
        stepElement.removeAttribute("aria-current");
      }
    });
  };

  const focusPlanStep = (heading) => {
    heading.focus({ preventScroll: true });
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  };

  planElements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    planElements.formError.hidden = true;

    const formData = new FormData(planElements.form);
    const gender = formData.get("gender");
    const age = Number(formData.get("age"));
    const height = Number(formData.get("height"));
    const currentWeight = Number(formData.get("currentWeight"));
    const targetWeight = Number(formData.get("targetWeight"));
    const exerciseDays = Number(formData.get("exerciseDays"));
    const durationWeeks = Number(formData.get("durationWeeks"));

    if (
      !["female", "male"].includes(gender) ||
      ![age, height, currentWeight, targetWeight, exerciseDays, durationWeeks].every(Number.isFinite) ||
      ![4, 8, 12].includes(durationWeeks)
    ) {
      planElements.formError.textContent = "请完整填写计划信息后再生成方案。";
      planElements.formError.hidden = false;
      return;
    }

    if (targetWeight === currentWeight) {
      planElements.formError.textContent = "目标体重不能与当前体重相同，请设置一个增重或减重目标。";
      planElements.formError.hidden = false;
      planElements.form.elements.targetWeight.focus();
      return;
    }

    const bmi = Math.round((currentWeight / (height / 100) ** 2) * 10) / 10;

    if (bmi < 18.5 && targetWeight < currentWeight) {
      planElements.formError.textContent =
        `当前 BMI ${bmi.toFixed(1)} 属于偏瘦，不建议继续减重。建议把目标体重设为 ${weightFormatter.format(getHealthyWeightFloor(height))} kg 以上，再生成健康增重计划。`;
      planElements.formError.hidden = false;
      planElements.form.elements.targetWeight.focus();
      return;
    }

    generatedPlan = buildPlan({
      gender,
      age,
      height,
      currentWeight,
      targetWeight,
      exerciseDays,
      durationWeeks,
    });

    renderPlan(generatedPlan);
    persistSchedule();
    setPlanStep(2);
    focusPlanStep(planElements.scheduleTitle);
  });

  planElements.form.addEventListener("input", () => {
    planElements.formError.hidden = true;
    updatePlanGoalHint();
  });

  planElements.scheduleGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-schedule-mode]");

    if (!button || !planElements.scheduleGrid.contains(button)) {
      return;
    }

    const card = button.closest("[data-schedule-day]");
    const day = scheduleState?.find(
      ({ dayKey }) => dayKey === card?.dataset.scheduleDay,
    );
    const mode = button.dataset.scheduleMode;

    if (!card || !day || !["class", "free"].includes(mode)) {
      return;
    }

    day.mode = mode;
    updateScheduleDayCard(card, day);

    if (persistSchedule()) {
      setScheduleFeedback(
        `已保存：${getWeekDayLabel(day.dayKey)}${getScheduleModeLabel(mode)}，可用 ${getScheduleMinutesLabel(day.minutes)} 分钟。`,
        "success",
      );
    } else {
      setScheduleFeedback("保存失败，请检查浏览器存储权限后重试。", "error");
    }
  });

  planElements.scheduleGrid.addEventListener("change", (event) => {
    const select = event.target.closest("[data-schedule-minutes]");

    if (!select || !planElements.scheduleGrid.contains(select)) {
      return;
    }

    const card = select.closest("[data-schedule-day]");
    const day = scheduleState?.find(
      ({ dayKey }) => dayKey === card?.dataset.scheduleDay,
    );
    const minutes = Number(select.value);

    if (!card || !day || !SCHEDULE_MINUTES.some(({ value }) => value === minutes)) {
      return;
    }

    day.minutes = minutes;
    updateScheduleDayCard(card, day);

    if (persistSchedule()) {
      setScheduleFeedback(
        `已保存：${getWeekDayLabel(day.dayKey)}${getScheduleModeLabel(day.mode)}，可用 ${getScheduleMinutesLabel(minutes)} 分钟。`,
        "success",
      );
    } else {
      setScheduleFeedback("保存失败，请检查浏览器存储权限后重试。", "error");
    }
  });

  planElements.scheduleBack.addEventListener("click", () => {
    setPlanStep(1);
    focusPlanStep(planElements.formTitle);
  });

  planElements.scheduleSmart.addEventListener("click", () => {
    if (!generatedPlan) {
      setPlanStep(1);
      planElements.formError.textContent = "请先完成基本信息，再安排课表。";
      planElements.formError.hidden = false;
      planElements.formTitle.focus({ preventScroll: true });
      return;
    }

    persistSchedule();

    const days = buildSmartWeekSchedule(generatedPlan, scheduleState);

    smartWeekState = createSmartWeekState(generatedPlan, days);
    renderSmartWeek();

    if (!saveWeeklyPlanState()) {
      showPlanStorageError("周计划已生成，但写入本地存储失败，请检查浏览器存储权限。");
    }

    setPlanStep(3);
    focusPlanStep(planElements.resultTitle);
  });

  planElements.smartWeekEdit.addEventListener("click", () => {
    setPlanStep(2);
    focusPlanStep(planElements.scheduleTitle);
  });

  planElements.swapClose.addEventListener("click", closeSwapDialog);

  planElements.swapDialog.addEventListener("click", (event) => {
    if (event.target === planElements.swapDialog) {
      closeSwapDialog();
    }
  });

  planElements.swapDialog.addEventListener("close", finishSwapDialog);

  planElements.swapSlotList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-swap-slot]");

    if (!button) {
      return;
    }

    const slotIndex = Number(button.dataset.swapSlot);

    if (!Number.isInteger(slotIndex)) {
      return;
    }

    showSwapOptions(slotIndex);
    window.setTimeout(() => {
      planElements.swapOptionList
        .querySelector("button")
        ?.focus({ preventScroll: true });
    }, 0);
  });

  planElements.swapSlotBack.addEventListener("click", () => {
    if (!swapContext || !smartWeekState) {
      return;
    }

    const day = smartWeekState.days.find(
      ({ dayKey }) => dayKey === swapContext.dayKey,
    );

    if (!day) {
      return;
    }

    swapContext.slotIndex = null;
    renderSwapSlots(day);
    window.setTimeout(() => {
      planElements.swapSlotList
        .querySelector("button")
        ?.focus({ preventScroll: true });
    }, 0);
  });

  planElements.smartWeekGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-week-day]");

    if (card) {
      openSwapDialog(card.dataset.weekDay, card);
    }
  });

  planElements.swapOptionList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-swap-exercise]");

    if (button) {
      replaceSmartAction(button.dataset.swapExercise);
    }
  });

  planElements.editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      resetPlanSaveState();
      setPlanStep(1);
      focusPlanStep(planElements.formTitle);
    });
  });

  planElements.saveButton.addEventListener("click", () => {
    if (!generatedPlan) {
      return;
    }

    const profile = {
      startWeight: generatedPlan.currentWeight,
      currentWeight: generatedPlan.currentWeight,
      targetWeight: generatedPlan.targetWeight,
      gender: generatedPlan.gender,
      age: generatedPlan.age,
      height: generatedPlan.height,
      exerciseDays: generatedPlan.exerciseDays,
      durationWeeks: generatedPlan.durationWeeks,
      goalType: generatedPlan.goalType,
      bmi: generatedPlan.bmi,
      bmiCategory: generatedPlan.bmiCategory,
      bmr: generatedPlan.bmr,
      tdee: generatedPlan.tdee,
      activityFactor: generatedPlan.activityFactor,
      activityLevel: generatedPlan.activityLevel,
      weeklyTargetChange: generatedPlan.weeklyTargetChange,
      weeklyTargetLoss: generatedPlan.weeklyTargetLoss,
      weeklyTargetGain: generatedPlan.weeklyTargetGain,
      goalTooFast: generatedPlan.goalTooFast,
      dailyEnergyAdjustment: generatedPlan.dailyEnergyAdjustment,
      dailyDeficit: generatedPlan.dailyDeficit,
      dailySurplus: generatedPlan.dailySurplus,
      dailyCalorieTarget: generatedPlan.dailyCalorieTarget,
      strengthDays: generatedPlan.strengthDays,
      aerobicDays: generatedPlan.aerobicDays,
      weeklyPlan: generatedPlan.weeklyPlan,
      savedAt: new Date().toISOString(),
    };

    try {
      if (!persistSchedule() || (smartWeekState && !saveWeeklyPlanState())) {
        throw new Error("storage");
      }

      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
      renderDashboard();
      planElements.saveButton.disabled = true;
      planElements.saveButton.textContent = "计划已保存";
      planElements.saveStatus.dataset.state = "success";
      planElements.saveStatus.textContent = smartWeekState
        ? "保存成功，计划与本周安排已存入当前浏览器。"
        : "保存成功，计划已存入当前浏览器。";
      planElements.saveStatus.hidden = false;
    } catch {
      planElements.saveButton.disabled = false;
      planElements.saveStatus.dataset.state = "error";
      planElements.saveStatus.textContent = "保存失败，请检查浏览器存储权限后重试。";
      planElements.saveStatus.hidden = false;
    }
  });

  checkinElements.mealInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (refreshCheckinDate()) {
        return;
      }

      const mealKey = input.dataset.mealField;
      const mealExists = MEAL_DEFINITIONS.some(({ key }) => key === mealKey);
      const foodInput = getMealInput(mealKey, "food");
      const caloriesInput = getMealInput(mealKey, "calories");

      if (!mealExists || !foodInput || !caloriesInput) {
        return;
      }

      const record = getActiveCheckinRecord(true);
      const meal = record.meals[mealKey];
      meal.food = foodInput.value.slice(0, 80);
      meal.calories = toValidCheckinCalories(caloriesInput.value);

      writeActiveCheckinRecord(record);
      renderMealSummary(record);
      renderDailyProgress(record);
    });
  });

  checkinElements.dishSearchInput.addEventListener("input", () => {
    dishSearchQuery = checkinElements.dishSearchInput.value;
    announceDishSearch(renderDishSearch());
  });

  checkinElements.dishSearchInput.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      checkinElements.dishSearchInput.value !== ""
    ) {
      event.preventDefault();
      checkinElements.dishSearchInput.value = "";
      dishSearchQuery = "";
      announceDishSearch(renderDishSearch());
    }
  });

  checkinElements.dishSearchClear.addEventListener("click", () => {
    checkinElements.dishSearchInput.value = "";
    dishSearchQuery = "";
    announceDishSearch(renderDishSearch());
    checkinElements.dishSearchInput.focus();
  });

  checkinElements.dishMealButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mealKey = button.dataset.dishMeal;

      if (!MEAL_LABELS[mealKey]) {
        return;
      }

      refreshCheckinDate();
      selectedDishMeal = mealKey;
      announceDishSearch(renderDishSearch());
    });
  });

  checkinElements.dishResultList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest("[data-dish-id]");

    if (!button) {
      return;
    }

    if (refreshCheckinDate()) {
      return;
    }

    const dish = dishById.get(button.dataset.dishId);

    if (!dish) {
      return;
    }

    if (fillMealValues(selectedDishMeal, dish.name, dish.calories)) {
      setDishSearchStatus(
        `已填入${MEAL_LABELS[selectedDishMeal]}：${dish.name}，${calorieFormatter.format(dish.calories)} kcal。`,
        "success",
      );
    }
  });

  checkinElements.mealPresetLists.forEach((list) => {
    list.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const button = event.target.closest("[data-preset-id]");

      if (!button) {
        return;
      }

      if (refreshCheckinDate()) {
        return;
      }

      const mealKey = list.dataset.mealPresetList;
      const preset = (mealPresetState[mealKey] ?? []).find(
        (item) => item.id === button.dataset.presetId,
      );

      if (!preset) {
        renderMealPresetList(list);
        return;
      }

      fillMealValues(mealKey, preset.food, preset.calories);
    });
  });

  checkinElements.mealPresetManageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openPresetEditor(button.dataset.presetEditorTarget);
    });
  });

  checkinElements.presetDialogClose.addEventListener("click", closePresetEditor);
  checkinElements.presetDone.addEventListener("click", closePresetEditor);
  checkinElements.presetDialog.addEventListener("click", (event) => {
    if (event.target === checkinElements.presetDialog) {
      closePresetEditor();
    }
  });
  checkinElements.presetDialog.addEventListener("close", () => {
    activePresetMeal = null;
    resetPresetForm();
    restoreDialogTrigger(checkinElements.presetDialog);
  });

  checkinElements.photoMealOpen.addEventListener("click", () => {
    openPhotoMealDialog(getDefaultDishMeal());
  });

  checkinElements.photoMealMealButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setPhotoMealMeal(button.dataset.photoMeal);
    });
  });

  checkinElements.photoMealPick.addEventListener("click", () => {
    checkinElements.photoMealFile.click();
  });

  checkinElements.photoMealRepick.addEventListener("click", () => {
    checkinElements.photoMealFile.click();
  });

  checkinElements.photoMealFile.addEventListener("change", () => {
    const file = checkinElements.photoMealFile.files?.[0] ?? null;
    checkinElements.photoMealFile.value = "";

    if (file) {
      handlePhotoMealFile(file);
    }
  });

  checkinElements.photoMealClose.addEventListener("click", closePhotoMealDialog);
  checkinElements.photoMealCancel.addEventListener("click", closePhotoMealDialog);
  checkinElements.photoMealDialog.addEventListener("click", (event) => {
    if (event.target === checkinElements.photoMealDialog) {
      closePhotoMealDialog();
    }
  });
  checkinElements.photoMealDialog.addEventListener("close", () => {
    resetPhotoMealDialog();
    restoreDialogTrigger(
      checkinElements.photoMealDialog,
      checkinElements.photoMealOpen,
    );
  });

  checkinElements.photoMealSearchInput.addEventListener("input", () => {
    photoMealState.searchQuery = checkinElements.photoMealSearchInput.value;
    renderPhotoMealDishes();
  });

  checkinElements.photoMealDishList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest("[data-photo-dish-id]");

    if (!button) {
      return;
    }

    const dish = dishById.get(button.dataset.photoDishId);

    if (dish) {
      selectPhotoMealDish(dish);
    }
  });

  checkinElements.photoMealPortionSelect.addEventListener(
    "change",
    updatePhotoMealCaloriesPreview,
  );
  checkinElements.photoMealManual.addEventListener("click", focusPhotoMealSearch);
  checkinElements.photoMealAi.addEventListener(
    "click",
    requestPhotoMealRecognition,
  );
  checkinElements.photoMealSave.addEventListener("click", savePhotoMealRecord);

  checkinElements.presetList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || !activePresetMeal) {
      return;
    }

    const mealKey = activePresetMeal;
    const presets = mealPresetState[mealKey] ?? [];
    const editButton = event.target.closest("[data-preset-edit]");
    const deleteButton = event.target.closest("[data-preset-delete]");

    if (editButton) {
      const preset = presets.find(
        (item) => item.id === editButton.dataset.presetEdit,
      );

      if (!preset) {
        renderPresetManagerList();
        return;
      }

      editingPresetId = preset.id;
      checkinElements.presetFormTitle.textContent = "编辑快捷项";
      checkinElements.presetSave.textContent = "保存修改";
      checkinElements.presetCancel.hidden = false;
      checkinElements.presetFoodInput.value = preset.food;
      checkinElements.presetCaloriesInput.value = String(preset.calories);
      checkinElements.presetFoodInput.removeAttribute("aria-invalid");
      checkinElements.presetCaloriesInput.removeAttribute("aria-invalid");
      setPresetFeedback("");
      renderPresetManagerList();
      checkinElements.presetFoodInput.focus({ preventScroll: true });
      checkinElements.presetFoodInput.select();
      return;
    }

    if (!deleteButton) {
      return;
    }

    const preset = presets.find(
      (item) => item.id === deleteButton.dataset.presetDelete,
    );

    if (!preset) {
      renderPresetManagerList();
      return;
    }

    const nextState = {
      ...mealPresetState,
      [mealKey]: presets.filter((item) => item.id !== preset.id),
    };

    if (!saveMealPresetState(nextState)) {
      setPresetFeedback("快捷项保存失败，请检查浏览器存储权限后重试。", "error");
      return;
    }

    if (editingPresetId === preset.id) {
      resetPresetForm();
    }

    renderPresetManagerList();
    const quickList = checkinElements.mealPresetLists.find(
      (list) => list.dataset.mealPresetList === mealKey,
    );

    if (quickList) {
      renderMealPresetList(quickList);
    }

    setPresetFeedback(`已删除「${preset.food}」。`, "success");
  });

  checkinElements.presetCancel.addEventListener("click", () => {
    resetPresetForm();
    renderPresetManagerList();
    checkinElements.presetFoodInput.focus({ preventScroll: true });
  });

  [checkinElements.presetFoodInput, checkinElements.presetCaloriesInput].forEach(
    (input) => {
      input.addEventListener("input", () => {
        input.removeAttribute("aria-invalid");
        setPresetFeedback("");
      });
    },
  );

  checkinElements.presetForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const mealKey = activePresetMeal;

    if (!mealKey) {
      return;
    }

    const food = readTrimmedString(checkinElements.presetFoodInput.value).slice(
      0,
      20,
    );
    const calories = toValidCheckinCalories(
      checkinElements.presetCaloriesInput.value,
    );
    const presets = mealPresetState[mealKey] ?? [];

    if (!food) {
      checkinElements.presetFoodInput.setAttribute("aria-invalid", "true");
      setPresetFeedback("请填写菜品名称。", "error");
      checkinElements.presetFoodInput.focus({ preventScroll: true });
      return;
    }

    if (calories === null) {
      checkinElements.presetCaloriesInput.setAttribute("aria-invalid", "true");
      setPresetFeedback("请输入 1–5000 之间的每份热量。", "error");
      checkinElements.presetCaloriesInput.focus({ preventScroll: true });
      return;
    }

    checkinElements.presetFoodInput.removeAttribute("aria-invalid");
    checkinElements.presetCaloriesInput.removeAttribute("aria-invalid");

    if (
      presets.some(
        (preset) => preset.food === food && preset.id !== editingPresetId,
      )
    ) {
      checkinElements.presetFoodInput.setAttribute("aria-invalid", "true");
      setPresetFeedback("这个快捷项已经存在，可以编辑原来的快捷项。", "error");
      checkinElements.presetFoodInput.focus({ preventScroll: true });
      return;
    }

    if (!editingPresetId && presets.length >= MAX_MEAL_PRESETS) {
      setPresetFeedback(
        `每个餐次最多保存 ${MAX_MEAL_PRESETS} 个快捷项，请先删除不需要的快捷项。`,
        "error",
      );
      return;
    }

    let nextList;
    let successMessage;

    if (editingPresetId) {
      if (!presets.some((preset) => preset.id === editingPresetId)) {
        resetPresetForm();
        renderPresetManagerList();
        setPresetFeedback("这个快捷项已不存在，请重新添加。", "error");
        return;
      }

      nextList = presets.map((preset) =>
        preset.id === editingPresetId ? { ...preset, food, calories } : preset,
      );
      successMessage = `已保存「${food}」快捷项。`;
    } else {
      nextList = [
        ...presets,
        { id: createMealPresetId(), food, calories },
      ];
      successMessage = `已添加「${food}」快捷项。`;
    }

    if (!saveMealPresetState({ ...mealPresetState, [mealKey]: nextList })) {
      setPresetFeedback("快捷项保存失败，请检查浏览器存储权限后重试。", "error");
      return;
    }

    resetPresetForm();
    renderPresetManagerList();
    const quickList = checkinElements.mealPresetLists.find(
      (list) => list.dataset.mealPresetList === mealKey,
    );

    if (quickList) {
      renderMealPresetList(quickList);
    }

    setPresetFeedback(successMessage, "success");
    checkinElements.presetFoodInput.focus({ preventScroll: true });
  });

  checkinElements.exerciseList.addEventListener("change", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const input = event.target.closest("input[data-exercise-id]");

    if (!input) {
      return;
    }

    if (refreshCheckinDate()) {
      return;
    }

    const exerciseId = input.dataset.exerciseId;

    if (!getExercisePlanIds(activeCheckinDate).includes(exerciseId)) {
      return;
    }

    const record = getActiveCheckinRecord(true);
    record.exercises[exerciseId] = input.checked;

    writeActiveCheckinRecord(record);
    renderExerciseSummary(record);
    renderDailyProgress(record);
  });

  elements.todayPlanList.addEventListener("change", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const input = event.target.closest("input[data-plan-task-id]");

    if (!input) {
      return;
    }

    if (refreshCheckinDate()) {
      return;
    }

    const tasks = getTodayPlanTasks();
    const taskId = input.dataset.planTaskId;

    if (!tasks.some(({ id }) => id === taskId)) {
      renderTodayPlan();
      return;
    }

    const record = getActiveCheckinRecord(true);
    const wasComplete = isTodayPlanComplete(record, tasks);

    record.exercises[taskId] = input.checked;

    if (!writeActiveCheckinRecord(record)) {
      record.exercises[taskId] = !input.checked;
      input.checked = !input.checked;
      input.closest(".checkin-exercise")?.classList.toggle("is-checked", input.checked);
      setTodayPlanFeedback("保存失败，请检查浏览器存储权限后重试。", "error");
      return;
    }

    input.closest(".checkin-exercise")?.classList.toggle("is-checked", input.checked);

    const { complete } = updateTodayPlanCompletion(record, tasks);

    renderExerciseSummary(record);
    renderDailyProgress(record);
    renderTodayOverview();
    renderStreakCard();
    setTodayPlanFeedback("");

    if (complete && !wasComplete) {
      celebrateTodayPlan();
    }
  });

  checkinElements.exercisePlanManage.addEventListener("click", openExerciseEditor);
  checkinElements.exerciseDialogClose.addEventListener("click", closeExerciseEditor);
  checkinElements.exerciseDone.addEventListener("click", closeExerciseEditor);
  checkinElements.exerciseCancel.addEventListener("click", resetExerciseForm);
  checkinElements.exerciseDialog.addEventListener("click", (event) => {
    if (event.target === checkinElements.exerciseDialog) {
      closeExerciseEditor();
    }
  });
  checkinElements.exerciseDialog.addEventListener("close", () => {
    resetExerciseForm();
    restoreDialogTrigger(checkinElements.exerciseDialog);
  });

  checkinElements.exerciseRecommendList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest("[data-exercise-recommend]");

    if (!button) {
      return;
    }

    addRecommendedExerciseToToday(button.dataset.exerciseRecommend);
  });

  checkinElements.exerciseRoutineList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const editButton = event.target.closest("[data-exercise-edit]");
    const deleteButton = event.target.closest("[data-exercise-delete]");

    if (editButton) {
      startEditingRoutineExercise(editButton.dataset.exerciseEdit);
      return;
    }

    if (!deleteButton) {
      return;
    }

    const exercise = exerciseRoutine.find(
      (item) => item.id === deleteButton.dataset.exerciseDelete,
    );

    if (!exercise) {
      renderExerciseManagerList();
      return;
    }

    if (exerciseRoutine.length <= 1) {
      setExerciseFormFeedback("每日训练至少保留 1 项，可以先添加替代训练再删除。", "error");
      return;
    }

    const nextRoutine = exerciseRoutine.filter((item) => item.id !== exercise.id);

    if (!saveExerciseRoutineState(nextRoutine)) {
      setExerciseFormFeedback(
        "训练清单保存失败，请检查浏览器存储权限后重试。",
        "error",
      );
      return;
    }

    if (editingExerciseId === exercise.id) {
      resetExerciseForm();
    }

    const { record, saved } = syncActiveExerciseRecord();
    refreshExerciseCheckinViews(record);
    setExerciseFormFeedback(
      saved
        ? `已删除「${exercise.name}」，今日打卡进度已同步。`
        : `已删除「${exercise.name}」，但今日打卡同步失败，请刷新页面后重试。`,
      saved ? "success" : "error",
    );
  });

  checkinElements.exerciseExtraList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const removeButton = event.target.closest("[data-exercise-remove-extra]");

    if (!removeButton) {
      return;
    }

    refreshCheckinDate();
    const dateKey = activeCheckinDate;
    const exerciseId = removeButton.dataset.exerciseRemoveExtra;
    const exercise = exerciseById.get(exerciseId);

    if (!exercise) {
      renderExerciseManagerList();
      return;
    }

    const nextIds = getCustomExerciseIds(dateKey).filter((id) => id !== exerciseId);
    const nextPlans = { ...exercisePlans };

    if (nextIds.length > 0) {
      nextPlans[dateKey] = nextIds;
    } else {
      delete nextPlans[dateKey];
    }

    try {
      localStorage.setItem(
        STORAGE_KEYS.exercisePlans,
        JSON.stringify(nextPlans),
      );
    } catch {
      setExerciseFormFeedback(
        "今日额外训练保存失败，请检查浏览器存储权限后重试。",
        "error",
      );
      return;
    }

    exercisePlans = nextPlans;
    const record = getActiveCheckinRecord(true);
    delete record.exercises[exerciseId];

    getExercisePlanIds(dateKey).forEach((id) => {
      if (record.exercises[id] !== true) {
        record.exercises[id] = false;
      }
    });

    const saved = writeCheckinRecord(dateKey, record);
    refreshExerciseCheckinViews(record);
    setExerciseFormFeedback(
      saved
        ? `已将「${exercise.name}」移出今日训练。`
        : `已将「${exercise.name}」移出，但打卡同步失败，请刷新页面后重试。`,
      saved ? "success" : "error",
    );
  });

  [
    checkinElements.exerciseNameInput,
    checkinElements.exerciseMinutesInput,
  ].forEach((input) => {
    input.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");

      if (checkinElements.exerciseFormFeedback.dataset.state === "error") {
        setExerciseFormFeedback("");
      }
    });
  });

  checkinElements.exerciseForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = checkinElements.exerciseNameInput.value.trim().slice(0, 16);
    const nameKey = name.toLocaleLowerCase("zh-CN");
    const type = EXERCISE_TYPES.includes(checkinElements.exerciseTypeInput.value)
      ? checkinElements.exerciseTypeInput.value
      : "其他";
    const minutes = Math.round(Number(checkinElements.exerciseMinutesInput.value));
    const duplicateName = exerciseRoutine.some(
      (item) =>
        item.id !== editingExerciseId &&
        item.name.toLocaleLowerCase("zh-CN") === nameKey,
    );

    checkinElements.exerciseNameInput.removeAttribute("aria-invalid");
    checkinElements.exerciseMinutesInput.removeAttribute("aria-invalid");

    if (!name) {
      checkinElements.exerciseNameInput.setAttribute("aria-invalid", "true");
      setExerciseFormFeedback("请填写训练名称。", "error");
      checkinElements.exerciseNameInput.focus();
      return;
    }

    if (duplicateName) {
      checkinElements.exerciseNameInput.setAttribute("aria-invalid", "true");
      setExerciseFormFeedback("每日训练中已有同名项目，请换一个名称。", "error");
      checkinElements.exerciseNameInput.focus();
      return;
    }

    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 180) {
      checkinElements.exerciseMinutesInput.setAttribute("aria-invalid", "true");
      setExerciseFormFeedback("训练时长需在 1–180 分钟之间。", "error");
      checkinElements.exerciseMinutesInput.focus();
      return;
    }

    if (!editingExerciseId && exerciseRoutine.length >= MAX_DAILY_EXERCISES) {
      setExerciseFormFeedback(
        `每日训练最多 ${MAX_DAILY_EXERCISES} 项，删除一项后再添加。`,
        "error",
      );
      return;
    }

    let nextRoutine = [];
    let successMessage = "";

    if (editingExerciseId) {
      const existing = exerciseRoutine.find((item) => item.id === editingExerciseId);

      if (!existing) {
        resetExerciseForm();
        setExerciseFormFeedback("这项训练已不存在，请重新选择。", "error");
        renderExerciseManagerList();
        return;
      }

      nextRoutine = exerciseRoutine.map((item) =>
        item.id === editingExerciseId
          ? { ...item, name, type, minutes }
          : item,
      );
      successMessage = `已保存「${name}」的修改。`;
    } else {
      nextRoutine = [
        ...exerciseRoutine,
        {
          id: createExerciseRoutineId(),
          name,
          type,
          note: "自定训练",
          minutes,
        },
      ];
      successMessage = `已将「${name}」加入每日训练。`;
    }

    if (!saveExerciseRoutineState(nextRoutine)) {
      setExerciseFormFeedback(
        "训练清单保存失败，请检查浏览器存储权限后重试。",
        "error",
      );
      return;
    }

    resetExerciseForm();
    const { record, saved } = syncActiveExerciseRecord();
    refreshExerciseCheckinViews(record);
    setExerciseFormFeedback(
      saved
        ? successMessage
        : "训练清单已保存，但今日打卡同步失败，请刷新页面后重试。",
      saved ? "success" : "error",
    );
    checkinElements.exerciseNameInput.focus({ preventScroll: true });
  });

  exerciseElements.filters.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const filterButton = event.target.closest("[data-exercise-filter]");

    if (filterButton && exerciseElements.filters.contains(filterButton)) {
      updateExerciseFilter(filterButton.dataset.exerciseFilter);
      return;
    }

    const campusButton = event.target.closest("[data-exercise-campus-filter]");

    if (campusButton && exerciseElements.filters.contains(campusButton)) {
      toggleExerciseCampusFilter(campusButton.dataset.exerciseCampusFilter);
    }
  });

  exerciseElements.viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setExerciseView(button.dataset.exerciseView);
    });
  });

  exerciseElements.canteenSearchInput.addEventListener("input", () => {
    canteenSearchQuery = exerciseElements.canteenSearchInput.value;
    renderCanteen();
  });

  exerciseElements.canteenSearchInput.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      exerciseElements.canteenSearchInput.value !== ""
    ) {
      event.preventDefault();
      exerciseElements.canteenSearchInput.value = "";
      canteenSearchQuery = "";
      renderCanteen();
    }
  });

  exerciseElements.canteenSearchClear.addEventListener("click", () => {
    exerciseElements.canteenSearchInput.value = "";
    canteenSearchQuery = "";
    renderCanteen();
    exerciseElements.canteenSearchInput.focus();
  });

  exerciseElements.canteenList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest("[data-canteen-meal]");

    if (!button) {
      return;
    }

    const dish = canteenById.get(button.dataset.canteenId);
    const mealKey = button.dataset.canteenMeal;

    if (!dish || !MEAL_LABELS[mealKey] || !dish.meals.includes(mealKey)) {
      return;
    }

    refreshCheckinDate();

    if (!fillMealValues(mealKey, dish.name, dish.calories)) {
      setCanteenStatus("写入失败，请检查浏览器存储权限后重试。", "error");
      return;
    }

    setCanteenStatus(
      `已记入${MEAL_LABELS[mealKey]}：${dish.name} · ${calorieFormatter.format(dish.calories)} kcal。可到记录中心查看。`,
      "success",
    );
  });

  checkinElements.weightInput.addEventListener("input", () => {
    hideWeightFeedback();
  });

  checkinElements.weightForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (refreshCheckinDate()) {
      return;
    }

    const rawWeight = checkinElements.weightInput.value.trim();
    const weight = Number(rawWeight);

    if (
      rawWeight === "" ||
      !Number.isFinite(weight) ||
      weight < 25 ||
      weight > 300
    ) {
      showWeightFeedback("请输入 25–300 kg 之间的今日体重。", "error");
      checkinElements.weightInput.focus();
      return;
    }

    const normalizedWeight = toValidCheckinWeight(weight);
    const record = getActiveCheckinRecord(true);
    const hadWeight = record.weight !== null;
    record.weight = normalizedWeight;

    const saved = writeActiveCheckinRecord(record);
    const summaryWeight = weightFormatter.format(normalizedWeight);

    showWeightFeedback(
      saved
        ? hadWeight
          ? `今日体重已更新为 ${summaryWeight} kg。`
          : `今日体重已记录为 ${summaryWeight} kg。`
        : "记录失败，本地存储当前不可用，请稍后重试。",
      saved ? "success" : "error",
    );

    checkinElements.weightInput.value = String(normalizedWeight);
    renderWeightSummary(record);
    renderWeightHistory();
    renderDailyProgress(record);
  });

  const DATA_EMPTY_TEXT = "开始打卡后这里会出现你的数据";
  const DATA_CHART_ERROR_TEXT = "图表组件加载失败，请检查网络后刷新页面。";
  const CHART_INK = "#171A1F";
  const CHART_INK_DARK = "#0B0D10";
  const CHART_ACCENT = "#3D8FAA";
  const CHART_ACCENT_INK = "#215A6E";
  const CHART_MUTED = "#667079";
  const CHART_GRID = "#E5E9EC";

  const setDataEmptyMessage = (element, message = DATA_EMPTY_TEXT) => {
    const copy = element.querySelector("p");

    if (copy) {
      copy.textContent = message;
    }
  };

  const showDataEmpty = (shell, empty, message = DATA_EMPTY_TEXT) => {
    shell.hidden = true;
    setDataEmptyMessage(empty, message);
    empty.hidden = false;
  };

  const showDataContent = (shell, empty) => {
    setDataEmptyMessage(empty);
    empty.hidden = true;
    shell.hidden = false;
  };

  const formatShortDate = (dateKey) => {
    const date = parseDateKey(dateKey);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatAxisDate = (dateKey) => {
    const date = parseDateKey(dateKey);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatLongDate = (dateKey) => {
    const date = parseDateKey(dateKey);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getChartFontFamily = () =>
    getComputedStyle(document.body).fontFamily || "sans-serif";

  const getChartTooltip = () => ({
    backgroundColor: "rgba(13, 19, 23, 0.96)",
    titleColor: "#ffffff",
    bodyColor: "#EAF5F9",
    padding: 12,
    cornerRadius: 12,
    displayColors: true,
    boxWidth: 8,
    boxHeight: 8,
    usePointStyle: true,
    titleFont: { size: 11, weight: "600" },
    bodyFont: { size: 11 },
  });

  const getWeightEntries = () =>
    Object.entries(checkinRecords)
      .filter(
        ([dateKey, record]) =>
          /^\d{4}-\d{2}-\d{2}$/.test(dateKey) && record.weight !== null,
      )
      .map(([dateKey, record]) => ({ dateKey, weight: record.weight }))
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  const createTargetWeightPlugin = (targetWeight) => ({
    id: "targetWeightLine",
    afterDatasetsDraw(chart) {
      const yScale = chart.scales.y;
      const area = chart.chartArea;

      if (!yScale || !area) {
        return;
      }

      const y = yScale.getPixelForValue(targetWeight);

      if (!Number.isFinite(y) || y < area.top - 1 || y > area.bottom + 1) {
        return;
      }

      const { ctx } = chart;
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = CHART_ACCENT;
      ctx.moveTo(area.left, y);
      ctx.lineTo(area.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = CHART_ACCENT_INK;
      ctx.font = `600 10px ${getChartFontFamily()}`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(`目标 ${weightFormatter.format(targetWeight)} kg`, area.right, y - 4);
      ctx.restore();
    },
  });

  const renderWeightChart = (profile) => {
    if (weightChartInstance) {
      weightChartInstance.destroy();
      weightChartInstance = null;
    }

    const entries = getWeightEntries();

    if (!window.Chart) {
      const targetWeight = profile?.targetWeight ?? null;
      let summary = DATA_CHART_ERROR_TEXT;

      if (entries.length > 0) {
        const first = entries[0];
        const latest = entries[entries.length - 1];
        const delta =
          Math.round((latest.weight - first.weight) * 10) / 10;
        const deltaText =
          entries.length > 1
            ? `，较首次${delta > 0 ? "+" : ""}${weightFormatter.format(delta)} kg`
            : "";

        summary += ` 体重共 ${entries.length} 条记录：最近 ${weightFormatter.format(latest.weight)} kg（${formatShortDate(latest.dateKey)}）${deltaText}${targetWeight === null ? "" : `，目标 ${weightFormatter.format(targetWeight)} kg`}。`;
      } else {
        summary += " 暂无体重记录。";
      }

      showDataEmpty(
        dataElements.weightShell,
        dataElements.weightEmpty,
        summary,
      );
      dataElements.weightTag.textContent = "文字摘要";
      return;
    }

    if (entries.length === 0) {
      showDataEmpty(
        dataElements.weightShell,
        dataElements.weightEmpty,
        EMPTY_WEIGHT_TEXT,
      );
      dataElements.weightTag.textContent = "暂无记录";
      return;
    }

    const targetWeight = profile?.targetWeight ?? null;
    const weights = entries.map(({ weight }) => weight);

    if (targetWeight !== null) {
      weights.push(targetWeight);
    }

    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const padding = Math.max(1, (maxWeight - minWeight) * 0.2);
    const suggestedMin = Math.floor((minWeight - padding) * 10) / 10;
    const suggestedMax = Math.ceil((maxWeight + padding) * 10) / 10;
    const fontFamily = getChartFontFamily();

    showDataContent(dataElements.weightShell, dataElements.weightEmpty);
    dataElements.weightTag.textContent =
      targetWeight === null
        ? `${entries.length} 条记录`
        : `目标 ${weightFormatter.format(targetWeight)} kg`;
    dataElements.weightCanvas.setAttribute(
      "aria-label",
      `体重变化折线图，共 ${entries.length} 条体重记录${targetWeight === null ? "" : `，目标体重 ${weightFormatter.format(targetWeight)} 公斤`}`,
    );

    weightChartInstance = new window.Chart(
      dataElements.weightCanvas.getContext("2d"),
      {
        type: "line",
        data: {
          labels: entries.map(({ dateKey }) => formatAxisDate(dateKey)),
          datasets: [
            {
              label: "体重",
              data: entries.map(({ weight }) => weight),
              borderColor: CHART_INK,
              backgroundColor: "rgba(123, 197, 224, 0.16)",
              borderWidth: 3,
              tension: 0.3,
              fill: true,
              pointRadius: entries.length > 30 ? 0 : 3.5,
              pointHoverRadius: 5.5,
              pointBackgroundColor: CHART_INK_DARK,
              pointBorderColor: "#ffffff",
              pointBorderWidth: 1.5,
            },
          ],
        },
        plugins: targetWeight === null ? [] : [createTargetWeightPlugin(targetWeight)],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: prefersReducedMotion.matches ? false : { duration: 550 },
          interaction: { mode: "index", intersect: false },
          layout: { padding: { top: 8, right: 4 } },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...getChartTooltip(),
              callbacks: {
                title: (items) =>
                  items.length > 0 ? formatLongDate(entries[items[0].dataIndex].dateKey) : "",
                label: (context) =>
                  `体重：${weightFormatter.format(context.parsed.y)} kg`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: {
                color: CHART_MUTED,
                font: { size: 10.5, family: fontFamily },
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 7,
              },
            },
            y: {
              suggestedMin,
              suggestedMax,
              border: { display: false },
              grid: { color: CHART_GRID, drawTicks: false },
              ticks: {
                color: CHART_MUTED,
                font: { size: 10.5, family: fontFamily },
                padding: 8,
                precision: 1,
                callback: (value) => weightFormatter.format(value),
              },
            },
          },
        },
      },
    );
  };

  const getHeatmapWeekStart = (date) => {
    const copy = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
    );
    copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7));
    return copy;
  };

  const getHeatmapDayState = (dateKey, completedDates) => {
    const record = checkinRecords[dateKey];

    if (!record) {
      return completedDates.has(dateKey)
        ? { level: 3, status: "完整打卡" }
        : { level: 0, status: "暂无打卡" };
    }

    const modules = getModuleCompletion(record, dateKey);
    const completedModules = Object.values(modules).filter(Boolean).length;

    if (completedDates.has(dateKey) || completedModules === 3) {
      return { level: 3, status: "完整打卡" };
    }

    if (completedModules > 0) {
      return { level: 2, status: `完成 ${completedModules}/3 项` };
    }

    const hasMealData = MEAL_DEFINITIONS.some(({ key }) => {
      const meal = record.meals[key];
      return meal.food.trim() !== "" || meal.calories !== null;
    });
    const hasExerciseData = Object.values(record.exercises).some(Boolean);

    if (hasMealData || hasExerciseData || record.weight !== null) {
      return { level: 1, status: "有打卡记录" };
    }

    return { level: 0, status: "暂无打卡" };
  };

  const renderHeatmap = () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const currentWeekStart = getHeatmapWeekStart(today);
    const startDate = new Date(currentWeekStart);
    startDate.setDate(startDate.getDate() - 77);
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);
    const todayKey = toDateKey(today);
    const completedDates = new Set(getCheckinDates());
    const fragment = document.createDocumentFragment();
    let activeDays = 0;
    let completedDays = 0;

    for (let week = 0; week < 12; week += 1) {
      for (let day = 0; day < 7; day += 1) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + week * 7 + day);
        const dateKey = toDateKey(date);
        const isFuture = date > today;
        const cell = document.createElement("span");

        cell.className = "heatmap-cell";
        cell.setAttribute("aria-hidden", "true");

        if (isFuture) {
          cell.classList.add("is-future");
        } else {
          const state = getHeatmapDayState(dateKey, completedDates);
          cell.classList.add(`is-level-${state.level}`);
          cell.title = `${formatShortDate(dateKey)} · ${state.status}`;

          if (state.level > 0) {
            activeDays += 1;
          }

          if (completedDates.has(dateKey)) {
            completedDays += 1;
          }

          if (dateKey === todayKey) {
            cell.classList.add("is-today");
          }
        }

        fragment.append(cell);
      }
    }

    if (activeDays === 0) {
      dataElements.heatmapWrap.hidden = true;
      dataElements.heatmapEmpty.hidden = false;
      setDataEmptyMessage(dataElements.heatmapEmpty, EMPTY_HEATMAP_TEXT);
      dataElements.heatmapTag.textContent = "近 12 周";
      return;
    }

    dataElements.heatmapGrid.replaceChildren(fragment);
    dataElements.heatmapGrid.setAttribute(
      "aria-label",
      `最近 12 周打卡热力图，${formatShortDate(toDateKey(startDate))}至${formatShortDate(todayKey)}，完整打卡 ${completedDays} 天，共 ${activeDays} 天有记录。`,
    );
    dataElements.heatmapRange.textContent = `${formatShortDate(toDateKey(startDate))} – ${formatShortDate(todayKey)}`;
    dataElements.heatmapTag.textContent =
      completedDays > 0 ? `完成 ${completedDays} 天` : `${activeDays} 天记录`;
    dataElements.heatmapEmpty.hidden = true;
    dataElements.heatmapWrap.hidden = false;
  };

  const renderCalorieChart = (profile) => {
    if (calorieChartInstance) {
      calorieChartInstance.destroy();
      calorieChartInstance = null;
    }

    const days = [];
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      const dateKey = toDateKey(date);
      const record = checkinRecords[dateKey];
      const calories = record
        ? MEAL_DEFINITIONS.reduce(
            (total, { key }) => total + (record.meals[key].calories ?? 0),
            0,
          )
        : 0;

      days.push({ dateKey, calories: calories > 0 ? calories : null });
    }

    const recordedDays = days.filter(({ calories }) => calories !== null);

    if (!window.Chart) {
      const targetCalories = profile?.dailyCalorieTarget ?? null;
      let summary = DATA_CHART_ERROR_TEXT;

      if (recordedDays.length > 0) {
        const total = recordedDays.reduce(
          (sum, { calories }) => sum + calories,
          0,
        );
        const average = total / recordedDays.length;
        const peak = recordedDays.reduce((best, day) =>
          day.calories > best.calories ? day : best,
        );

        summary += ` 最近 7 天有 ${recordedDays.length} 天记录，日均 ${calorieFormatter.format(average)} kcal，最高 ${calorieFormatter.format(peak.calories)} kcal（${formatShortDate(peak.dateKey)}）${targetCalories === null ? "" : `，目标 ${calorieFormatter.format(targetCalories)} kcal`}。`;
      } else {
        summary += " 最近 7 天暂无饮食热量记录。";
      }

      showDataEmpty(
        dataElements.calorieShell,
        dataElements.calorieEmpty,
        summary,
      );
      dataElements.calorieTag.textContent = "文字摘要";
      return;
    }

    if (days.every(({ calories }) => calories === null)) {
      showDataEmpty(
        dataElements.calorieShell,
        dataElements.calorieEmpty,
        EMPTY_CALORIE_TEXT,
      );
      dataElements.calorieTag.textContent = "近 7 天";
      return;
    }

    const targetCalories = profile?.dailyCalorieTarget ?? null;
    const fontFamily = getChartFontFamily();
    const values = days.map(({ calories }) => calories ?? 0);

    if (targetCalories !== null) {
      values.push(targetCalories);
    }

    const suggestedMax =
      Math.ceil((Math.max(...values) * 1.15) / 100) * 100 || undefined;
    const datasets = [
      {
        label: "摄入热量",
        data: days.map(({ calories }) => calories),
        backgroundColor: CHART_INK,
        hoverBackgroundColor: CHART_INK_DARK,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 18,
        categoryPercentage: 0.72,
        barPercentage: 0.82,
      },
    ];

    if (targetCalories !== null) {
      datasets.push({
        label: "目标热量",
        data: days.map(() => targetCalories),
        backgroundColor: "#D7EDF6",
        hoverBackgroundColor: "#B9DFED",
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 18,
        categoryPercentage: 0.72,
        barPercentage: 0.82,
      });
    } else {
      datasets[0].categoryPercentage = 0.5;
    }

    showDataContent(dataElements.calorieShell, dataElements.calorieEmpty);
    dataElements.calorieTag.textContent =
      targetCalories === null
        ? "未设置目标"
        : `目标 ${calorieFormatter.format(targetCalories)} kcal`;
    dataElements.calorieCanvas.setAttribute(
      "aria-label",
      `最近 7 天热量柱状图${targetCalories === null ? "" : `，每日目标 ${calorieFormatter.format(targetCalories)} 千卡`}`,
    );

    calorieChartInstance = new window.Chart(
      dataElements.calorieCanvas.getContext("2d"),
      {
        type: "bar",
        data: {
          labels: days.map(({ dateKey }) => formatAxisDate(dateKey)),
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: prefersReducedMotion.matches ? false : { duration: 550 },
          interaction: { mode: "index", intersect: false },
          layout: { padding: { top: 8, right: 4 } },
          plugins: {
            legend: {
              position: "top",
              align: "end",
              labels: {
                color: CHART_MUTED,
                boxWidth: 10,
                boxHeight: 10,
                padding: 14,
                font: { size: 10.5, weight: "600", family: fontFamily },
              },
            },
            tooltip: {
              ...getChartTooltip(),
              callbacks: {
                title: (items) =>
                  items.length > 0 ? formatLongDate(days[items[0].dataIndex].dateKey) : "",
                label: (context) => {
                  const label = context.dataset.label;
                  const value =
                    context.parsed.y === null || context.parsed.y === undefined
                      ? "未记录"
                      : `${calorieFormatter.format(context.parsed.y)} kcal`;
                  return `${label}：${value}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: {
                color: CHART_MUTED,
                font: { size: 10.5, family: fontFamily },
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 7,
              },
            },
            y: {
              beginAtZero: true,
              suggestedMax,
              border: { display: false },
              grid: { color: CHART_GRID, drawTicks: false },
              ticks: {
                color: CHART_MUTED,
                font: { size: 10, family: fontFamily },
                padding: 8,
                maxTicksLimit: 5,
                callback: (value) => calorieFormatter.format(value),
              },
            },
          },
        },
      },
    );
  };

  const BODY_METRIC_FIELDS = [
    { key: "waist", label: "腰围", color: CHART_INK },
    { key: "hip", label: "臀围", color: CHART_ACCENT },
    { key: "thigh", label: "大腿围", color: "#C08D5A" },
  ];
  const BODY_METRIC_MIN = 30;
  const BODY_METRIC_MAX = 200;
  const BODY_METRICS_EMPTY_TEXT =
    "还没有围度记录。填写上方表单并保存第一条，折线图就会开始记录。";
  const EMPTY_WEIGHT_TEXT =
    "还没有体重记录。记录一次体重，这里就会开始画出变化曲线。";
  const EMPTY_HEATMAP_TEXT =
    "还没有打卡记录。完成今天的饮食、运动或体重记录，热力图就会亮起。";
  const EMPTY_CALORIE_TEXT =
    "最近 7 天还没有饮食热量。记录一餐后，这里会自动统计每日摄入。";

  const setDataFeedback = (element, message, state = "") => {
    if (!element) {
      return;
    }

    element.textContent = message;

    if (state) {
      element.dataset.state = state;
    } else {
      delete element.dataset.state;
    }

    element.hidden = message === "";
  };

  const normalizeBodyMetricValue = (value) => {
    const number = Number(value);

    if (
      !Number.isFinite(number) ||
      number < BODY_METRIC_MIN ||
      number > BODY_METRIC_MAX
    ) {
      return null;
    }

    return Math.round(number * 10) / 10;
  };

  const normalizeBodyMetrics = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    const entries = new Map();

    value.forEach((source) => {
      if (
        !source ||
        typeof source !== "object" ||
        !isValidDateKey(source.dateKey)
      ) {
        return;
      }

      const entry = { dateKey: source.dateKey };

      BODY_METRIC_FIELDS.forEach(({ key }) => {
        entry[key] = normalizeBodyMetricValue(source[key]);
      });

      if (BODY_METRIC_FIELDS.every(({ key }) => entry[key] === null)) {
        return;
      }

      entry.updatedAt =
        typeof source.updatedAt === "string" ? source.updatedAt : null;
      entries.set(entry.dateKey, entry);
    });

    return [...entries.values()].sort((left, right) =>
      left.dateKey.localeCompare(right.dateKey),
    );
  };

  let bodyMetrics = normalizeBodyMetrics(
    readStorage(STORAGE_KEYS.bodyMetrics, []),
  );

  const persistBodyMetrics = (entries) => {
    try {
      localStorage.setItem(STORAGE_KEYS.bodyMetrics, JSON.stringify(entries));
      bodyMetrics = entries;
      return true;
    } catch {
      return false;
    }
  };

  const setBodyMetricInputs = (entry) => {
    BODY_METRIC_FIELDS.forEach(({ key }) => {
      const input = bodyMetricElements[key];

      if (input) {
        input.value = entry?.[key] ?? "";
        input.removeAttribute("aria-invalid");
      }
    });
  };

  const prefillBodyMetricsForm = (dateKey) => {
    const entry = bodyMetrics.find((item) => item.dateKey === dateKey) ?? null;
    setBodyMetricInputs(entry);

    if (bodyMetricElements.feedback?.dataset.state === "error") {
      setDataFeedback(bodyMetricElements.feedback, "");
    }
  };

  const initializeBodyMetricsForm = () => {
    if (!bodyMetricElements.date) {
      return;
    }

    const todayKey = toDateKey(new Date());
    bodyMetricElements.date.max = todayKey;

    if (!bodyMetricElements.date.value) {
      bodyMetricElements.date.value = todayKey;
    }

    prefillBodyMetricsForm(bodyMetricElements.date.value);
  };

  const renderBodyMetricsChart = () => {
    if (bodyMetricsChartInstance) {
      bodyMetricsChartInstance.destroy();
      bodyMetricsChartInstance = null;
    }

    const latest = bodyMetrics[bodyMetrics.length - 1];

    if (!window.Chart) {
      let summary = DATA_CHART_ERROR_TEXT;

      if (latest) {
        const parts = BODY_METRIC_FIELDS.map(({ key, label }) =>
          latest[key] === null
            ? null
            : `${label} ${weightFormatter.format(latest[key])} cm`,
        )
          .filter(Boolean)
          .join("、");

        summary += ` 共 ${bodyMetrics.length} 条围度记录，最近 ${formatShortDate(latest.dateKey)}：${parts}。`;
      } else {
        summary += " 暂无围度记录。";
      }

      showDataEmpty(
        bodyMetricElements.shell,
        bodyMetricElements.empty,
        summary,
      );
      bodyMetricElements.tag.textContent = "文字摘要";
      return;
    }

    if (bodyMetrics.length === 0) {
      showDataEmpty(
        bodyMetricElements.shell,
        bodyMetricElements.empty,
        BODY_METRICS_EMPTY_TEXT,
      );
      bodyMetricElements.tag.textContent = "暂无记录";
      return;
    }

    const values = bodyMetrics.flatMap((entry) =>
      BODY_METRIC_FIELDS.map(({ key }) => entry[key]).filter(
        (value) => value !== null,
      ),
    );
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const padding = Math.max(1, (maxValue - minValue) * 0.2);
    const suggestedMin = Math.floor((minValue - padding) * 10) / 10;
    const suggestedMax = Math.ceil((maxValue + padding) * 10) / 10;
    const fontFamily = getChartFontFamily();

    showDataContent(bodyMetricElements.shell, bodyMetricElements.empty);
    bodyMetricElements.tag.textContent = `最近 ${formatShortDate(latest.dateKey)}`;
    bodyMetricElements.canvas.setAttribute(
      "aria-label",
      `腰围、臀围和大腿围变化折线图，共 ${bodyMetrics.length} 条围度记录`,
    );

    bodyMetricsChartInstance = new window.Chart(
      bodyMetricElements.canvas.getContext("2d"),
      {
        type: "line",
        data: {
          labels: bodyMetrics.map(({ dateKey }) => formatAxisDate(dateKey)),
          datasets: BODY_METRIC_FIELDS.map(({ key, label, color }) => ({
            label,
            data: bodyMetrics.map((entry) => entry[key]),
            borderColor: color,
            backgroundColor: `${color}1F`,
            borderWidth: 2.5,
            tension: 0.3,
            spanGaps: true,
            fill: false,
            pointRadius: bodyMetrics.length > 30 ? 0 : 3,
            pointHoverRadius: 5,
            pointBackgroundColor: color,
            pointBorderColor: "#ffffff",
            pointBorderWidth: 1.5,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: prefersReducedMotion.matches ? false : { duration: 550 },
          interaction: { mode: "index", intersect: false },
          layout: { padding: { top: 8, right: 4 } },
          plugins: {
            legend: {
              position: "top",
              align: "end",
              labels: {
                color: CHART_MUTED,
                boxWidth: 10,
                boxHeight: 10,
                padding: 14,
                font: { size: 10.5, weight: "600", family: fontFamily },
              },
            },
            tooltip: {
              ...getChartTooltip(),
              callbacks: {
                title: (items) =>
                  items.length > 0
                    ? formatLongDate(bodyMetrics[items[0].dataIndex].dateKey)
                    : "",
                label: (context) => {
                  const value =
                    context.parsed.y === null || context.parsed.y === undefined
                      ? "未记录"
                      : `${weightFormatter.format(context.parsed.y)} cm`;
                  return `${context.dataset.label}：${value}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: {
                color: CHART_MUTED,
                font: { size: 10.5, family: fontFamily },
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 7,
              },
            },
            y: {
              suggestedMin,
              suggestedMax,
              border: { display: false },
              grid: { color: CHART_GRID, drawTicks: false },
              ticks: {
                color: CHART_MUTED,
                font: { size: 10.5, family: fontFamily },
                padding: 8,
                precision: 1,
                callback: (value) => weightFormatter.format(value),
              },
            },
          },
        },
      },
    );
  };

  const handleBodyMetricsSubmit = (event) => {
    event.preventDefault();

    const dateKey = bodyMetricElements.date?.value ?? "";
    const values = {};
    let hasValue = false;
    let invalidInput = null;

    setDataFeedback(bodyMetricElements.feedback, "");

    bodyMetricElements.date?.removeAttribute("aria-invalid");
    BODY_METRIC_FIELDS.forEach(({ key }) => {
      bodyMetricElements[key]?.removeAttribute("aria-invalid");
    });

    if (!isValidDateKey(dateKey)) {
      bodyMetricElements.date?.setAttribute("aria-invalid", "true");
      bodyMetricElements.date?.focus();
      setDataFeedback(bodyMetricElements.feedback, "请选择记录日期。", "error");
      return;
    }

    if (dateKey > toDateKey(new Date())) {
      bodyMetricElements.date?.setAttribute("aria-invalid", "true");
      bodyMetricElements.date?.focus();
      setDataFeedback(
        bodyMetricElements.feedback,
        "记录日期不能晚于今天。",
        "error",
      );
      return;
    }

    BODY_METRIC_FIELDS.forEach(({ key }) => {
      const input = bodyMetricElements[key];
      const raw = readTrimmedString(input?.value);

      if (raw === "") {
        values[key] = null;
        return;
      }

      const number = Number(raw);

      if (
        !Number.isFinite(number) ||
        number < BODY_METRIC_MIN ||
        number > BODY_METRIC_MAX
      ) {
        values[key] = null;
        invalidInput = input;
        return;
      }

      values[key] = Math.round(number * 10) / 10;
      hasValue = true;
    });

    if (invalidInput) {
      invalidInput.setAttribute("aria-invalid", "true");
      invalidInput.focus();
      setDataFeedback(
        bodyMetricElements.feedback,
        "围度请输入 30–200 cm 之间的数值。",
        "error",
      );
      return;
    }

    if (!hasValue) {
      const firstInput = BODY_METRIC_FIELDS.map(
        ({ key }) => bodyMetricElements[key],
      ).find(Boolean);
      firstInput?.focus();
      setDataFeedback(
        bodyMetricElements.feedback,
        "至少填写腰围、臀围或大腿围中的一项。",
        "error",
      );
      return;
    }

    const existed = bodyMetrics.some((entry) => entry.dateKey === dateKey);
    const nextEntries = bodyMetrics.filter((entry) => entry.dateKey !== dateKey);
    nextEntries.push({
      dateKey,
      ...values,
      updatedAt: new Date().toISOString(),
    });
    nextEntries.sort((left, right) => left.dateKey.localeCompare(right.dateKey));

    if (!persistBodyMetrics(nextEntries)) {
      setDataFeedback(
        bodyMetricElements.feedback,
        "保存失败，请检查浏览器存储空间后重试。",
        "error",
      );
      return;
    }

    setBodyMetricInputs({ ...values });
    renderBodyMetricsChart();
    setDataFeedback(
      bodyMetricElements.feedback,
      existed
        ? `${formatShortDate(dateKey)} 的围度已更新。`
        : `${formatShortDate(dateKey)} 的围度已保存。`,
      "success",
    );
  };

  const DORM_CHALLENGE_DAYS = 21;
  const DORM_CHALLENGE_MAX_ROOMMATES = 4;
  const DORM_REPORT_KIND = "slimspark-dorm-challenge-report";
  const DORM_REPORT_VERSION = 1;
  const DORM_REPORT_INVALID_TEXT = "格式不对，请重新复制";
  const SMART_ACTION_ID_PATTERN =
    /^([a-z]{3})-(cardio|strength|stretch|micro)-(.+)$/;

  const normalizeDormChallenge = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }

    const name = readTrimmedString(value.name).slice(0, 20);
    const startDate = isValidDateKey(value.startDate) ? value.startDate : null;

    if (!name || !startDate) {
      return null;
    }

    const selfName = readTrimmedString(value.selfName).slice(0, 12) || "我";
    const seen = new Set([selfName.toLocaleLowerCase("zh-CN")]);
    const roommates = [];

    (Array.isArray(value.roommates) ? value.roommates : []).forEach((source) => {
      const nameValue = readTrimmedString(source).slice(0, 12);
      const key = nameValue.toLocaleLowerCase("zh-CN");

      if (
        !nameValue ||
        seen.has(key) ||
        roommates.length >= DORM_CHALLENGE_MAX_ROOMMATES
      ) {
        return;
      }

      seen.add(key);
      roommates.push(nameValue);
    });

    return {
      version: 1,
      name,
      startDate,
      selfName,
      roommates,
      createdAt:
        typeof value.createdAt === "string" ? value.createdAt : null,
    };
  };

  const addDaysToDateKey = (dateKey, days) => {
    const date = parseDateKey(dateKey);
    date.setDate(date.getDate() + days);
    return toDateKey(date);
  };

  const getDormChallengeEndDate = (challenge) =>
    addDaysToDateKey(challenge.startDate, DORM_CHALLENGE_DAYS - 1);

  const normalizeDormChallengeReports = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    const reports = new Map();

    value.forEach((source) => {
      if (!source || typeof source !== "object") {
        return;
      }

      const challengeName = readTrimmedString(source.challengeName).slice(0, 20);
      const startDate = isValidDateKey(source.startDate)
        ? source.startDate
        : null;
      const member = readTrimmedString(source.member).slice(0, 12);
      const days = Math.round(Number(source.days));
      const minutes = Math.round(Number(source.minutes));

      if (
        !challengeName ||
        !startDate ||
        !member ||
        !Number.isFinite(days) ||
        days < 0 ||
        days > DORM_CHALLENGE_DAYS ||
        !Number.isFinite(minutes) ||
        minutes < 0 ||
        minutes > 100000
      ) {
        return;
      }

      const lastCheckinTime =
        typeof source.lastCheckinAt === "string"
          ? Date.parse(source.lastCheckinAt)
          : Number.NaN;
      const exportedTime =
        typeof source.exportedAt === "string"
          ? Date.parse(source.exportedAt)
          : Number.NaN;
      const key = member.toLocaleLowerCase("zh-CN");
      const report = {
        challengeName,
        startDate,
        member,
        days,
        minutes,
        lastCheckinAt: Number.isFinite(lastCheckinTime)
          ? new Date(lastCheckinTime).toISOString()
          : null,
        exportedAt: Number.isFinite(exportedTime)
          ? new Date(exportedTime).toISOString()
          : null,
        importedAt:
          typeof source.importedAt === "string" ? source.importedAt : null,
      };
      const existing = reports.get(key);

      if (
        !existing ||
        (Date.parse(report.exportedAt) || 0) >=
          (Date.parse(existing.exportedAt) || 0)
      ) {
        reports.set(key, report);
      }
    });

    return [...reports.values()];
  };

  let dormChallenge = normalizeDormChallenge(
    readStorage(STORAGE_KEYS.dormChallenge, null),
  );
  let dormChallengeReports = normalizeDormChallengeReports(
    readStorage(STORAGE_KEYS.dormChallengeReports, []),
  );

  const persistDormChallenge = (challenge) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.dormChallenge,
        JSON.stringify(challenge),
      );
      dormChallenge = challenge;
      return true;
    } catch {
      return false;
    }
  };

  const persistDormChallengeReports = (reports) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.dormChallengeReports,
        JSON.stringify(reports),
      );
      dormChallengeReports = reports;
      return true;
    } catch {
      return false;
    }
  };

  const initializeDormChallengeForm = () => {
    if (!dormChallengeElements.start) {
      return;
    }

    const todayKey = toDateKey(new Date());
    dormChallengeElements.start.max = todayKey;

    if (!dormChallengeElements.start.value) {
      dormChallengeElements.start.value = todayKey;
    }

    if (!dormChallengeElements.selfName?.value) {
      dormChallengeElements.selfName.value = "我";
    }
  };

  const hasCheckinActivity = (record) => {
    if (!record) {
      return false;
    }

    if (record.weight !== null) {
      return true;
    }

    if ((record.motionSessions ?? []).length > 0) {
      return true;
    }

    if (Object.values(record.exercises ?? {}).some(Boolean)) {
      return true;
    }

    return MEAL_DEFINITIONS.some(({ key }) => {
      const meal = record.meals?.[key];
      return (
        meal &&
        (readTrimmedString(meal.food) !== "" || meal.calories !== null)
      );
    });
  };

  const getRecordActivityTimestamp = (record, dateKey) => {
    const updatedTime =
      typeof record.updatedAt === "string" ? Date.parse(record.updatedAt) : NaN;

    if (Number.isFinite(updatedTime)) {
      return new Date(updatedTime).toISOString();
    }

    return new Date(`${dateKey}T12:00:00`).toISOString();
  };

  const getRecordChallengeMinutes = (record, dateKey) => {
    const tasks = [
      ...getExercisePlanForDate(dateKey),
      ...getWeeklyPlanTasksForDate(dateKey),
    ];
    const taskMap = new Map(tasks.map((task) => [task.id, task]));
    let total = 0;

    Object.entries(record.exercises ?? {}).forEach(([id, completed]) => {
      if (!completed) {
        return;
      }

      const task = taskMap.get(id);

      if (!task) {
        return;
      }

      const minutes = Number(getPlanTaskMinutes(task));

      if (Number.isFinite(minutes) && minutes > 0) {
        total += minutes;
      }
    });

    (record.motionSessions ?? []).forEach((session) => {
      const minutes = Number(session.minutes);

      if (Number.isFinite(minutes) && minutes > 0) {
        total += minutes;
      }
    });

    return total;
  };

  const getDormChallengeStats = (challenge) => {
    const startKey = challenge.startDate;
    const endKey = getDormChallengeEndDate(challenge);
    const todayKey = toDateKey(new Date());
    const lastKey = todayKey < endKey ? todayKey : endKey;
    const records = Object.entries(checkinRecords)
      .filter(
        ([dateKey, record]) =>
          dateKey >= startKey &&
          dateKey <= lastKey &&
          hasCheckinActivity(record),
      )
      .sort(([left], [right]) => left.localeCompare(right));
    let minutes = 0;
    let lastCheckinAt = null;
    let lastCheckinTime = Number.NEGATIVE_INFINITY;

    records.forEach(([dateKey, record]) => {
      minutes += getRecordChallengeMinutes(record, dateKey);
      const timestamp = getRecordActivityTimestamp(record, dateKey);
      const time = Date.parse(timestamp);

      if (time > lastCheckinTime) {
        lastCheckinTime = time;
        lastCheckinAt = timestamp;
      }
    });

    return {
      days: records.length,
      minutes: Math.max(0, Math.round(minutes)),
      lastCheckinAt,
    };
  };

  const getActiveDormChallengeReports = (challenge) => {
    const selfKey = challenge.selfName.toLocaleLowerCase("zh-CN");

    return dormChallengeReports.filter(
      (report) =>
        report.challengeName === challenge.name &&
        report.startDate === challenge.startDate &&
        report.member.toLocaleLowerCase("zh-CN") !== selfKey,
    );
  };

  const formatCheckinTimestamp = (value) => {
    if (!value) {
      return "暂无";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "暂无";
    }

    return `${date.getMonth() + 1}/${date.getDate()} ${String(
      date.getHours(),
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const getDormChallengeDayLabel = (challenge) => {
    const today = parseDateKey(toDateKey(new Date()));
    const start = parseDateKey(challenge.startDate);
    const diff = Math.round((today.getTime() - start.getTime()) / 86400000);

    if (diff < 0) {
      return "未开始";
    }

    if (diff >= DORM_CHALLENGE_DAYS) {
      return "已结束";
    }

    return `第 ${diff + 1} / ${DORM_CHALLENGE_DAYS} 天`;
  };

  const getDormLeaderboardRows = (challenge, stats) => {
    const rows = [
      {
        key: "__local__",
        name: challenge.selfName,
        days: stats.days,
        minutes: stats.minutes,
        lastCheckinAt: stats.lastCheckinAt,
        isLocal: true,
      },
      ...getActiveDormChallengeReports(challenge).map((report) => ({
        key: report.member.toLocaleLowerCase("zh-CN"),
        name: report.member,
        days: report.days,
        minutes: report.minutes,
        lastCheckinAt: report.lastCheckinAt,
        isLocal: false,
      })),
    ];

    return rows.sort(
      (left, right) =>
        right.days - left.days ||
        right.minutes - left.minutes ||
        (Date.parse(right.lastCheckinAt) || 0) -
          (Date.parse(left.lastCheckinAt) || 0),
    );
  };

  const renderDormChallengeLeaderboard = (challenge, stats) => {
    const activeReports = getActiveDormChallengeReports(challenge);
    const rows = getDormLeaderboardRows(challenge, stats);
    const fragment = document.createDocumentFragment();

    rows.forEach((row, index) => {
      const item = document.createElement("li");
      const position = document.createElement("span");
      const main = document.createElement("div");
      const nameLine = document.createElement("div");
      const name = document.createElement("strong");
      const time = document.createElement("span");
      const metrics = document.createElement("div");
      const daysMetric = document.createElement("span");
      const daysValue = document.createElement("strong");
      const minutesMetric = document.createElement("span");
      const minutesValue = document.createElement("strong");
      const timeLabel = formatCheckinTimestamp(row.lastCheckinAt);

      item.className = "dorm-rank-row";
      item.classList.toggle("is-local", row.isLocal);
      item.setAttribute(
        "aria-label",
        `第 ${index + 1} 名，${row.name}，坚持 ${row.days} 天，运动 ${row.minutes} 分钟，最近打卡 ${timeLabel}`,
      );

      position.className = "dorm-rank-position";
      position.textContent = String(index + 1);

      nameLine.className = "dorm-rank-name";
      name.textContent = row.name;
      nameLine.append(name);

      if (row.isLocal) {
        const localTag = document.createElement("span");
        localTag.className = "dorm-rank-local";
        localTag.textContent = "本机";
        nameLine.append(localTag);
      }

      time.className = "dorm-rank-time";
      time.textContent = `最近打卡 ${timeLabel}`;

      main.className = "dorm-rank-main";
      main.append(nameLine, time);

      metrics.className = "dorm-rank-metrics";
      daysValue.textContent = String(row.days);
      daysMetric.append(daysValue, " 天");
      minutesValue.textContent = String(row.minutes);
      minutesMetric.append(minutesValue, " 分钟");
      metrics.append(daysMetric, minutesMetric);

      item.append(position, main, metrics);
      fragment.append(item);
    });

    dormChallengeElements.leaderboard.replaceChildren(fragment);
    dormChallengeElements.leaderboardCount.textContent = `${rows.length} 人`;
    dormChallengeElements.leaderboardEmpty.hidden = activeReports.length > 0;
  };

  const renderDormChallenge = () => {
    if (!dormChallenge) {
      dormChallengeElements.setup.hidden = false;
      dormChallengeElements.play.hidden = true;
      dormChallengeElements.tag.textContent = "未创建";
      return;
    }

    const stats = getDormChallengeStats(dormChallenge);
    const endDate = getDormChallengeEndDate(dormChallenge);
    const roommateText =
      dormChallenge.roommates.length > 0
        ? `室友：${dormChallenge.roommates.join("、")}`
        : "单人挑战";

    dormChallengeElements.setup.hidden = true;
    dormChallengeElements.play.hidden = false;
    dormChallengeElements.tag.textContent = "离线挑战";
    dormChallengeElements.nameLabel.textContent = dormChallenge.name;
    dormChallengeElements.meta.textContent = `${formatShortDate(
      dormChallenge.startDate,
    )} – ${formatShortDate(endDate)} · ${DORM_CHALLENGE_DAYS} 天 · ${roommateText}`;
    dormChallengeElements.day.textContent =
      getDormChallengeDayLabel(dormChallenge);
    dormChallengeElements.days.textContent = String(stats.days);
    dormChallengeElements.minutes.textContent = String(stats.minutes);
    dormChallengeElements.last.textContent = formatCheckinTimestamp(
      stats.lastCheckinAt,
    );
    dormChallengeElements.progress.style.width = `${Math.min(
      100,
      (stats.days / DORM_CHALLENGE_DAYS) * 100,
    )}%`;
    dormChallengeElements.progressBar.setAttribute(
      "aria-valuenow",
      String(stats.days),
    );
    renderDormChallengeLeaderboard(dormChallenge, stats);
  };

  const parseRoommateNicknames = (value) =>
    readTrimmedString(value)
      .split(/[,，、\n]/)
      .map((name) => name.trim())
      .filter(Boolean);

  const handleDormChallengeCreate = (event) => {
    event.preventDefault();

    const name = readTrimmedString(dormChallengeElements.name?.value);
    const startDate = dormChallengeElements.start?.value ?? "";
    const selfName = readTrimmedString(dormChallengeElements.selfName?.value) || "我";
    const roommateNames = parseRoommateNicknames(
      dormChallengeElements.roommates?.value,
    );
    const seen = new Set([selfName.toLocaleLowerCase("zh-CN")]);
    const roommates = [];
    let errorMessage = "";

    setDataFeedback(dormChallengeElements.formFeedback, "");

    if (!name) {
      errorMessage = "请填写挑战名。";
      dormChallengeElements.name?.setAttribute("aria-invalid", "true");
      dormChallengeElements.name?.focus();
    } else if (name.length > 20) {
      errorMessage = "挑战名最多 20 个字符。";
      dormChallengeElements.name?.setAttribute("aria-invalid", "true");
      dormChallengeElements.name?.focus();
    } else if (!isValidDateKey(startDate)) {
      errorMessage = "请选择开始日期。";
      dormChallengeElements.start?.setAttribute("aria-invalid", "true");
      dormChallengeElements.start?.focus();
    } else if (startDate > toDateKey(new Date())) {
      errorMessage = "开始日期不能晚于今天。";
      dormChallengeElements.start?.setAttribute("aria-invalid", "true");
      dormChallengeElements.start?.focus();
    } else if (selfName.length > 12) {
      errorMessage = "我的昵称最多 12 个字符。";
      dormChallengeElements.selfName?.setAttribute("aria-invalid", "true");
      dormChallengeElements.selfName?.focus();
    } else {
      for (const roommate of roommateNames) {
        const key = roommate.toLocaleLowerCase("zh-CN");

        if (roommate.length > 12) {
          errorMessage = "单个昵称最多 12 个字符。";
          break;
        }

        if (seen.has(key)) {
          errorMessage = "室友昵称不能重复，也不能和我的昵称相同。";
          break;
        }

        seen.add(key);
        roommates.push(roommate);
      }

      if (!errorMessage && roommates.length > DORM_CHALLENGE_MAX_ROOMMATES) {
        errorMessage = `室友最多 ${DORM_CHALLENGE_MAX_ROOMMATES} 人，请精简后再创建。`;
      }
    }

    if (errorMessage) {
      setDataFeedback(dormChallengeElements.formFeedback, errorMessage, "error");
      return;
    }

    const nextChallenge = {
      version: 1,
      name,
      startDate,
      selfName,
      roommates,
      createdAt: new Date().toISOString(),
    };

    if (!persistDormChallenge(nextChallenge)) {
      setDataFeedback(
        dormChallengeElements.formFeedback,
        "创建失败，请检查浏览器存储空间后重试。",
        "error",
      );
      return;
    }

    dormChallengeReports = [];
    persistDormChallengeReports([]);
    dormChallengeElements.reportPanel.hidden = true;
    dormChallengeElements.reportCode.value = "";
    dormChallengeElements.importInput.value = "";
    setDataFeedback(dormChallengeElements.formFeedback, "");
    renderDormChallenge();
    dormChallengeElements.nameLabel.setAttribute("tabindex", "-1");
    dormChallengeElements.nameLabel.focus({ preventScroll: true });
  };

  const buildDormReport = () => {
    const stats = getDormChallengeStats(dormChallenge);

    return {
      kind: DORM_REPORT_KIND,
      version: DORM_REPORT_VERSION,
      challengeName: dormChallenge.name,
      startDate: dormChallenge.startDate,
      member: dormChallenge.selfName,
      days: stats.days,
      minutes: stats.minutes,
      lastCheckinAt: stats.lastCheckinAt,
      exportedAt: new Date().toISOString(),
    };
  };

  const encodeBase64Utf8 = (value) => {
    const bytes = new TextEncoder().encode(value);
    let binary = "";

    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary);
  };

  const decodeBase64Utf8 = (value) => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded =
      normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    return new TextDecoder().decode(bytes);
  };

  const copyTextToClipboard = async (value) => {
    if (!value) {
      return false;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      // 继续走兼容复制
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.append(textarea);
    textarea.select();
    textarea.setSelectionRange(0, value.length);

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }

    textarea.remove();
    return copied;
  };

  const parseDormReportCode = (rawValue) => {
    const compact = readTrimmedString(rawValue).replace(/\s+/g, "");

    if (!compact || compact.length > 12000) {
      return null;
    }

    let parsed;

    try {
      parsed = JSON.parse(decodeBase64Utf8(compact));
    } catch {
      return null;
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    if (
      parsed.kind !== DORM_REPORT_KIND ||
      parsed.version !== DORM_REPORT_VERSION
    ) {
      return null;
    }

    const challengeName = readTrimmedString(parsed.challengeName);
    const startDate = isValidDateKey(parsed.startDate)
      ? parsed.startDate
      : null;
    const member = readTrimmedString(parsed.member);
    const days = Number(parsed.days);
    const minutes = Number(parsed.minutes);

    if (
      !challengeName ||
      challengeName.length > 20 ||
      !startDate ||
      !member ||
      member.length > 12 ||
      !Number.isFinite(days) ||
      !Number.isInteger(days) ||
      days < 0 ||
      days > DORM_CHALLENGE_DAYS ||
      !Number.isFinite(minutes) ||
      minutes < 0 ||
      minutes > 100000
    ) {
      return null;
    }

    let lastCheckinAt = null;

    if (parsed.lastCheckinAt !== null) {
      if (
        typeof parsed.lastCheckinAt !== "string" ||
        Number.isNaN(Date.parse(parsed.lastCheckinAt))
      ) {
        return null;
      }

      lastCheckinAt = new Date(parsed.lastCheckinAt).toISOString();
    }

    const exportedAt =
      typeof parsed.exportedAt === "string" &&
      !Number.isNaN(Date.parse(parsed.exportedAt))
        ? new Date(parsed.exportedAt).toISOString()
        : new Date().toISOString();

    return {
      challengeName,
      startDate,
      member,
      days,
      minutes: Math.round(minutes),
      lastCheckinAt,
      exportedAt,
    };
  };

  const handleGenerateDormReport = async () => {
    if (!dormChallenge) {
      return;
    }

    let code = "";

    try {
      code = encodeBase64Utf8(JSON.stringify(buildDormReport()));
    } catch {
      setDataFeedback(
        dormChallengeElements.reportFeedback,
        "战报码生成失败，请刷新页面后重试。",
        "error",
      );
      return;
    }

    dormChallengeElements.reportPanel.hidden = false;
    dormChallengeElements.reportCode.value = code;
    const copied = await copyTextToClipboard(code);
    setDataFeedback(
      dormChallengeElements.reportFeedback,
      copied
        ? "战报码已生成并复制，发给室友即可。"
        : "战报码已生成，请点击“复制战报码”或手动复制。",
      copied ? "success" : "warning",
    );
  };

  const handleCopyDormReport = async () => {
    const code = dormChallengeElements.reportCode?.value ?? "";

    if (!code) {
      setDataFeedback(
        dormChallengeElements.reportFeedback,
        "请先生成本机战报码。",
        "error",
      );
      return;
    }

    const copied = await copyTextToClipboard(code);
    setDataFeedback(
      dormChallengeElements.reportFeedback,
      copied ? "战报码已复制，发给室友即可。" : "复制失败，请手动选择战报码复制。",
      copied ? "success" : "error",
    );
  };

  const handleImportDormReport = () => {
    if (!dormChallenge) {
      setDataFeedback(
        dormChallengeElements.importFeedback,
        "请先创建挑战，再导入室友战报。",
        "error",
      );
      return;
    }

    const report = parseDormReportCode(
      dormChallengeElements.importInput?.value ?? "",
    );

    if (!report) {
      setDataFeedback(
        dormChallengeElements.importFeedback,
        DORM_REPORT_INVALID_TEXT,
        "error",
      );
      dormChallengeElements.importInput?.focus();
      return;
    }

    if (
      report.challengeName !== dormChallenge.name ||
      report.startDate !== dormChallenge.startDate
    ) {
      setDataFeedback(
        dormChallengeElements.importFeedback,
        "这份战报不属于当前挑战，请核对挑战名和开始日期。",
        "error",
      );
      return;
    }

    const memberKey = report.member.toLocaleLowerCase("zh-CN");

    if (memberKey === dormChallenge.selfName.toLocaleLowerCase("zh-CN")) {
      setDataFeedback(
        dormChallengeElements.importFeedback,
        "战报署名与我的昵称重复，请室友改一个昵称后重新生成。",
        "error",
      );
      return;
    }

    const existing = dormChallengeReports.some(
      (item) =>
        item.challengeName === report.challengeName &&
        item.startDate === report.startDate &&
        item.member.toLocaleLowerCase("zh-CN") === memberKey,
    );
    const nextReports = [
      ...dormChallengeReports.filter(
        (item) =>
          !(
            item.challengeName === report.challengeName &&
            item.startDate === report.startDate &&
            item.member.toLocaleLowerCase("zh-CN") === memberKey
          ),
      ),
      {
        ...report,
        importedAt: new Date().toISOString(),
      },
    ];

    if (!persistDormChallengeReports(nextReports)) {
      setDataFeedback(
        dormChallengeElements.importFeedback,
        "导入失败，请检查浏览器存储空间后重试。",
        "error",
      );
      return;
    }

    dormChallengeElements.importInput.value = "";
    setDataFeedback(
      dormChallengeElements.importFeedback,
      existing
        ? `已更新 ${report.member} 的战报。`
        : `已导入 ${report.member} 的战报。`,
      "success",
    );
    renderDormChallenge();
  };

  const BADGE_DEFINITIONS = [
    {
      id: "canteen-specialist",
      name: "食堂特种兵",
      icon: "meal",
      statKey: "canteenMeals",
      target: 20,
      unit: "餐",
      condition: "累计记录 20 餐午餐或晚餐。",
    },
    {
      id: "breakfast-hero",
      name: "早八抗饿王",
      icon: "flame",
      statKey: "breakfastDays",
      target: 7,
      unit: "天",
      condition: "累计 7 天在早餐栏留下记录。",
    },
    {
      id: "quiet-king",
      name: "静音卷王",
      icon: "dumbbell",
      statKey: "quietActions",
      target: 10,
      unit: "次",
      condition: "累计完成 10 次静音动作或宿舍静音训练。",
    },
    {
      id: "recess-hunter",
      name: "课间猎手",
      icon: "chart",
      statKey: "recessActions",
      target: 10,
      unit: "次",
      condition: "累计完成 10 次智能计划里的课间微运动，或课间 5 分钟训练。",
    },
    {
      id: "twenty-one-days",
      name: "21 天坚持",
      icon: "check",
      statKey: "completedDays",
      target: DORM_CHALLENGE_DAYS,
      unit: "天",
      condition: "累计完成 21 天完整打卡（饮食、运动和体重都有记录）。",
    },
  ];

  let badgeEntries = [];
  let activeBadgeId = null;

  const getWeeklyPlanActionMeta = () => {
    const actions = new Map();

    (smartWeekState?.days ?? []).forEach((day) => {
      (day.actions ?? []).forEach((action) => {
        if (action?.id) {
          actions.set(action.id, action);
        }
      });
    });

    (smartWeekState?.adjustments ?? []).forEach((record) => {
      (record.carryOverTasks ?? []).forEach((task) => {
        if (task?.id && !actions.has(task.id)) {
          actions.set(task.id, task);
        }
      });
      (record.assignments ?? []).forEach((assignment) => {
        (assignment.tasks ?? []).forEach((task) => {
          if (task?.id && !actions.has(task.id)) {
            actions.set(task.id, task);
          }
        });
      });
    });

    return actions;
  };

  const computeBadgeStats = () => {
    const stats = {
      canteenMeals: 0,
      breakfastDays: 0,
      quietActions: 0,
      recessActions: 0,
      completedDays: 0,
    };
    const breakfastDates = new Set();
    const todayKey = toDateKey(new Date());
    const weeklyActionMeta = getWeeklyPlanActionMeta();

    Object.entries(checkinRecords).forEach(([dateKey, record]) => {
      if (dateKey > todayKey) {
        return;
      }

      const breakfast = record.meals?.breakfast;

      if (breakfast && readTrimmedString(breakfast.food) !== "") {
        breakfastDates.add(dateKey);
      }

      ["lunch", "dinner"].forEach((mealKey) => {
        const meal = record.meals?.[mealKey];

        if (meal && readTrimmedString(meal.food) !== "") {
          stats.canteenMeals += 1;
        }
      });

      if (record.completed === true) {
        stats.completedDays += 1;
      }

      const quietIds = new Set();
      const recessIds = new Set();
      let quietSessions = 0;
      let recessSessions = 0;

      Object.entries(record.exercises ?? {}).forEach(([id, completed]) => {
        if (!completed) {
          return;
        }

        const directExercise = exerciseById.get(id);

        if (directExercise?.quiet) {
          quietIds.add(id);
        }

        const action = weeklyActionMeta.get(id);

        if (action) {
          if (action.slot === "micro" || action.tag === "课间") {
            recessIds.add(id);
          }

          if (action.exerciseId) {
            const actionExercise = exerciseById.get(action.exerciseId);

            if (actionExercise?.quiet) {
              quietIds.add(action.exerciseId);
            }
          }

          return;
        }

        const idMatch = id.match(SMART_ACTION_ID_PATTERN);

        if (!idMatch) {
          return;
        }

        const [, , slot, exerciseId] = idMatch;

        if (slot === "micro") {
          recessIds.add(id);
        } else if (exerciseById.get(exerciseId)?.quiet) {
          quietIds.add(exerciseId);
        }
      });

      (record.motionSessions ?? []).forEach((session) => {
        if (session.workoutId === "dorm-quiet") {
          quietSessions += 1;
        }

        if (session.workoutId === "recess-5") {
          recessSessions += 1;
        }

        if (session.workoutId.startsWith("action-timer-")) {
          const exerciseId = session.workoutId.slice("action-timer-".length);

          if (exerciseById.get(exerciseId)?.quiet) {
            quietIds.add(exerciseId);
          }
        }
      });

      stats.quietActions += quietIds.size + quietSessions;
      stats.recessActions += recessIds.size + recessSessions;
    });

    stats.breakfastDays = breakfastDates.size;
    return stats;
  };

  const getBadgeEntries = () => {
    const stats = computeBadgeStats();

    return BADGE_DEFINITIONS.map((definition) => {
      const current = Math.max(0, Math.round(stats[definition.statKey] ?? 0));
      const progress = Math.min(current, definition.target);

      return {
        ...definition,
        current,
        progress,
        remaining: Math.max(0, definition.target - current),
        lit: current >= definition.target,
      };
    });
  };

  const updateBadgeDetail = () => {
    const entry = badgeEntries.find(({ id }) => id === activeBadgeId);

    if (!entry) {
      badgeElements.detail.hidden = true;
      return;
    }

    badgeElements.detail.hidden = false;
    badgeElements.detailName.textContent = entry.name;
    badgeElements.detailState.textContent = entry.lit ? "已点亮" : "进行中";
    badgeElements.detailState.dataset.state = entry.lit ? "lit" : "progress";
    badgeElements.detailCondition.textContent = `条件：${entry.condition}`;
    badgeElements.detailCount.textContent = entry.lit
      ? `已达成 ${entry.target} / ${entry.target} ${entry.unit}`
      : `当前进度 ${entry.current} / ${entry.target} ${entry.unit}，还差 ${entry.remaining} ${entry.unit}`;
    badgeElements.detailBar.style.width = `${
      (entry.progress / entry.target) * 100
    }%`;
    badgeElements.detailProgressBar.setAttribute(
      "aria-valuemax",
      String(entry.target),
    );
    badgeElements.detailProgressBar.setAttribute(
      "aria-valuenow",
      String(entry.progress),
    );
    badgeElements.detailProgressBar.setAttribute(
      "aria-label",
      `${entry.name}进度`,
    );
  };

  const selectBadge = (badgeId) => {
    if (!badgeEntries.some(({ id }) => id === badgeId)) {
      return;
    }

    activeBadgeId = badgeId;
    badgeElements.grid.querySelectorAll("[data-badge-id]").forEach((button) => {
      const active = button.dataset.badgeId === badgeId;

      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    updateBadgeDetail();
  };

  const renderBadgeWall = () => {
    badgeEntries = getBadgeEntries();

    if (!badgeEntries.some(({ id }) => id === activeBadgeId)) {
      activeBadgeId = badgeEntries[0]?.id ?? null;
    }

    const litCount = badgeEntries.filter(({ lit }) => lit).length;
    const fragment = document.createDocumentFragment();

    badgeEntries.forEach((entry) => {
      const button = document.createElement("button");
      const icon = document.createElement("span");
      const name = document.createElement("strong");
      const state = document.createElement("span");
      const track = document.createElement("span");
      const fill = document.createElement("span");
      const active = entry.id === activeBadgeId;

      button.type = "button";
      button.className = "badge-tile";
      button.dataset.badgeId = entry.id;
      button.classList.toggle("is-lit", entry.lit);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute(
        "aria-label",
        `${entry.name}，${entry.lit ? "已点亮" : "未点亮"}，进度 ${entry.current}/${entry.target}${entry.unit}，查看条件和进度`,
      );

      icon.className = "badge-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.append(createIcon(entry.icon));

      name.className = "badge-name";
      name.textContent = entry.name;

      state.className = "badge-state";
      state.textContent = entry.lit
        ? "已点亮"
        : `${entry.current}/${entry.target} ${entry.unit}`;

      track.className = "badge-mini-track";
      track.setAttribute("aria-hidden", "true");
      fill.style.width = `${(entry.progress / entry.target) * 100}%`;
      track.append(fill);

      button.append(icon, name, state, track);
      fragment.append(button);
    });

    badgeElements.grid.replaceChildren(fragment);
    badgeElements.tag.textContent = `${litCount} / ${badgeEntries.length} 点亮`;
    badgeElements.hint.hidden = litCount > 0;
    updateBadgeDetail();
  };

  const renderDataPage = () => {
    const profile = getProfile();

    renderAdjustmentStats();
    renderWeightChart(profile);
    renderHeatmap();
    renderCalorieChart(profile);
    renderBodyMetricsChart();
    renderDormChallenge();
    renderBadgeWall();
  };

  const renderChartsWhenLoaded = () => {
    const chartScript = document.querySelector("script[data-chartjs]");

    if (!chartScript || window.Chart) {
      return;
    }

    chartScript.addEventListener(
      "load",
      () => {
        if (activePageName === "data") {
          renderDataPage();
        }
      },
      { once: true },
    );
  };

  const activatePage = (
    pageName,
    { focusHeading = false, scrollToTop = true } = {},
  ) => {
    const targetPage = pages.find((page) => page.dataset.page === pageName);

    if (!targetPage) {
      return;
    }

    pages.forEach((page) => {
      const isActive = page === targetPage;
      page.hidden = !isActive;
      page.classList.toggle("is-active", isActive);
    });

    navItems.forEach((item) => {
      const isActive = item.dataset.pageTarget === pageName;
      item.classList.toggle("is-active", isActive);

      if (isActive) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    const isRecordCenter = pageName === "checkin";
    document.body.classList.toggle("is-record-center", isRecordCenter);
    elements.bottomNav.hidden = isRecordCenter;
    elements.recordFab.hidden = isRecordCenter;
    activePageName = pageName;

    if (pageName === "home") {
      renderDashboard();
    }

    if (pageName === "checkin") {
      activeCheckinDate = toDateKey(new Date());
      renderCheckin();
    }

    if (pageName === "exercise") {
      refreshExerciseLibraryPlanState();
    }

    if (pageName === "data") {
      renderDataPage();
    }

    if (focusHeading) {
      const heading = targetPage.querySelector("h1");
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }

    if (scrollToTop) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      });
    }
  };

  const RECORD_TARGETS = {
    breakfast: {
      scrollSelector: '[data-meal-item="breakfast"]',
      headingId: "meal-breakfast-title",
    },
    exercise: {
      scrollSelector: ".exercise-checkin-card",
      headingId: "exercise-checkin-title",
    },
    weight: {
      scrollSelector: ".weight-card",
      headingId: "weight-checkin-title",
    },
  };

  const openRecordCenter = ({ target = null, focusHeading = false } = {}) => {
    if (activePageName !== "checkin") {
      recordReturnPage = activePageName || "home";
      recordReturnScrollY = window.scrollY;
    }

    activatePage("checkin", { focusHeading: false, scrollToTop: false });

    const behavior = prefersReducedMotion.matches ? "auto" : "smooth";
    const targetConfig = target ? RECORD_TARGETS[target] : null;
    const targetElement = targetConfig
      ? document.querySelector(targetConfig.scrollSelector)
      : null;

    if (targetElement) {
      targetElement.scrollIntoView({ behavior, block: "start" });

      const heading = document.getElementById(targetConfig.headingId);
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
      return;
    }

    if (focusHeading) {
      const heading = document.getElementById("page-checkin-title");
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }

    window.scrollTo({ top: 0, behavior });
  };

  const closeRecordCenter = () => {
    if (activePageName !== "checkin") {
      return;
    }

    activatePage(recordReturnPage || "home", {
      focusHeading: true,
      scrollToTop: false,
    });

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: recordReturnScrollY, behavior: "auto" });
    });
  };

  let motionTimerState = null;

  const formatMotionClock = (totalSeconds) => {
    const seconds = Math.max(0, Math.round(totalSeconds));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60,
    ).padStart(2, "0")}`;
  };

  const stopMotionTicker = () => {
    if (motionTimerState?.timerId) {
      window.clearInterval(motionTimerState.timerId);
      motionTimerState.timerId = null;
    }
  };

  const renderMotionSequence = () => {
    if (!motionTimerState) {
      return;
    }

    const { workout, stepIndex, finished } = motionTimerState;
    const fragment = document.createDocumentFragment();

    workout.steps.forEach((step, index) => {
      const item = document.createElement("li");
      const marker = document.createElement("span");
      const copy = document.createElement("span");
      const name = document.createElement("strong");
      const duration = document.createElement("span");
      const isDone = finished || index < stepIndex;
      const isCurrent = !finished && index === stepIndex;

      item.className = "motion-timer-sequence-item";
      item.classList.toggle("is-done", isDone);
      item.classList.toggle("is-current", isCurrent);

      if (isCurrent) {
        item.setAttribute("aria-current", "step");
      }

      marker.className = "motion-timer-sequence-mark";
      marker.setAttribute("aria-hidden", "true");
      marker.textContent = isDone ? "✓" : String(index + 1);
      copy.className = "motion-timer-sequence-copy";
      name.textContent = step.name;
      duration.textContent = `${step.seconds} 秒`;
      copy.append(name, duration);
      item.append(marker, copy);
      fragment.append(item);
    });

    elements.motionSequence.replaceChildren(fragment);
  };

  const updateMotionTimerUI = ({ updateSequence = false } = {}) => {
    if (!motionTimerState) {
      return;
    }

    const { workout, stepIndex, remaining, paused, finished } = motionTimerState;
    const step = workout.steps[Math.min(stepIndex, workout.steps.length - 1)];
    const totalSeconds = workout.steps.reduce((total, item) => total + item.seconds, 0);
    const consumedSeconds = workout.steps.reduce((total, item, index) => {
      if (index < stepIndex) {
        return total + item.seconds;
      }

      if (!finished && index === stepIndex) {
        return total + (item.seconds - remaining);
      }

      return total;
    }, 0);
    const progress = finished
      ? 100
      : Math.min(100, Math.max(0, (consumedSeconds / totalSeconds) * 100));

    elements.motionTitle.textContent = workout.title;
    elements.motionTime.textContent = formatMotionClock(remaining);
    elements.motionRound.textContent = finished
      ? `${workout.steps.length} / ${workout.steps.length}`
      : `${stepIndex + 1} / ${workout.steps.length}`;
    elements.motionStep.textContent = finished ? "全部动作完成" : step.name;
    elements.motionTip.textContent = finished
      ? "计时已完成，点击“完成”写入今天的运动记录。"
      : step.tip;
    elements.motionProgress.style.width = `${progress}%`;
    elements.motionToggle.textContent = paused ? "继续" : "暂停";
    elements.motionToggle.setAttribute(
      "aria-label",
      `${paused ? "继续" : "暂停"}${workout.title}计时`,
    );
    elements.motionToggle.disabled = finished;
    elements.motionSkip.disabled = finished;
    elements.motionComplete.disabled = !finished;
    elements.motionFeedback.hidden = !finished;

    if (finished) {
      elements.motionFeedback.textContent =
        "本次运动已计时完成，点击“完成”写入今天的运动记录。";
      elements.motionFeedback.dataset.state = "success";
    } else {
      elements.motionFeedback.textContent = "";
      delete elements.motionFeedback.dataset.state;
    }

    if (updateSequence) {
      renderMotionSequence();

      const currentItem = elements.motionSequence.querySelector(".is-current");
      const listRect = elements.motionSequence.getBoundingClientRect();
      const currentRect = currentItem?.getBoundingClientRect();

      if (currentRect && currentRect.bottom > listRect.bottom) {
        elements.motionSequence.scrollTop +=
          currentRect.bottom - listRect.bottom + 4;
      } else if (currentRect && currentRect.top < listRect.top) {
        elements.motionSequence.scrollTop -= listRect.top - currentRect.top + 4;
      }
    }
  };

  const finishMotionTimer = () => {
    if (!motionTimerState) {
      return;
    }

    stopMotionTicker();
    motionTimerState.paused = false;
    motionTimerState.finished = true;
    motionTimerState.remaining = 0;
    motionTimerState.stepIndex = motionTimerState.workout.steps.length;
    updateMotionTimerUI({ updateSequence: true });
  };

  const advanceMotionStep = () => {
    if (!motionTimerState || motionTimerState.finished) {
      return;
    }

    motionTimerState.stepIndex += 1;

    if (motionTimerState.stepIndex >= motionTimerState.workout.steps.length) {
      finishMotionTimer();
      return;
    }

    motionTimerState.remaining =
      motionTimerState.workout.steps[motionTimerState.stepIndex].seconds;
    updateMotionTimerUI({ updateSequence: true });
  };

  const startMotionTicker = () => {
    if (!motionTimerState || motionTimerState.paused || motionTimerState.finished) {
      return;
    }

    stopMotionTicker();
    motionTimerState.timerId = window.setInterval(() => {
      if (!motionTimerState || motionTimerState.paused || motionTimerState.finished) {
        return;
      }

      motionTimerState.elapsedSeconds += 1;
      motionTimerState.remaining -= 1;

      if (motionTimerState.remaining <= 0) {
        advanceMotionStep();
        return;
      }

      updateMotionTimerUI();
    }, 1000);
  };

  const openMotionTimer = (workoutId, trigger) => {
    const workout = MOTION_WORKOUTS[workoutId];

    if (!workout || elements.motionDialog.open) {
      return;
    }

    motionTimerState = {
      workout,
      stepIndex: 0,
      remaining: workout.steps[0].seconds,
      elapsedSeconds: 0,
      paused: false,
      finished: false,
      timerId: null,
      trigger,
    };

    elements.motionDialog.showModal();
    updateMotionTimerUI({ updateSequence: true });
    elements.motionToggle.focus({ preventScroll: true });
    startMotionTicker();
  };

  const closeMotionTimer = () => {
    if (elements.motionDialog.open) {
      elements.motionDialog.close();
    }
  };

  const completeMotionSession = () => {
    if (!motionTimerState?.finished) {
      return;
    }

    refreshCheckinDate();

    const dateKey = toDateKey(new Date());
    const record =
      checkinRecords[dateKey] ?? createEmptyCheckinRecord(dateKey);
    const previousSessions = record.motionSessions;
    const minutes = Math.max(1, Math.round(motionTimerState.elapsedSeconds / 60));

    checkinRecords[dateKey] = record;
    record.motionSessions = normalizeMotionSessions([
      ...(record.motionSessions ?? []),
      {
        workoutId: motionTimerState.workout.id,
        name: motionTimerState.workout.title,
        minutes,
        completedAt: new Date().toISOString(),
      },
    ]);

    if (!writeCheckinRecord(dateKey, record)) {
      record.motionSessions = previousSessions;
      elements.motionFeedback.textContent =
        "写入失败，请检查浏览器存储权限后重试。";
      elements.motionFeedback.dataset.state = "error";
      return;
    }

    closeMotionTimer();
    renderDashboard();
    renderExerciseSummary(record);
    renderDailyProgress(record);
  };

  elements.motionCards.forEach((card) => {
    card.addEventListener("click", () => {
      openMotionTimer(card.dataset.motionWorkout, card);
    });
  });

  elements.motionToggle.addEventListener("click", () => {
    if (!motionTimerState || motionTimerState.finished) {
      return;
    }

    motionTimerState.paused = !motionTimerState.paused;
    updateMotionTimerUI();

    if (motionTimerState.paused) {
      stopMotionTicker();
    } else {
      startMotionTicker();
    }
  });

  elements.motionSkip.addEventListener("click", () => {
    advanceMotionStep();
  });

  elements.motionComplete.addEventListener("click", completeMotionSession);
  elements.motionClose.addEventListener("click", closeMotionTimer);

  elements.motionDialog.addEventListener("click", (event) => {
    if (event.target === elements.motionDialog) {
      closeMotionTimer();
    }
  });

  elements.motionDialog.addEventListener("close", () => {
    const trigger = motionTimerState?.trigger;

    stopMotionTicker();
    motionTimerState = null;

    window.setTimeout(() => {
      if (trigger && document.contains(trigger)) {
        trigger.focus({ preventScroll: true });
      }
    }, 0);
  });

  const ACTION_TIMER_SECONDS = 5 * 60;
  let actionTimerState = null;

  const setActionTimerFeedback = (message, state = "") => {
    elements.actionTimerFeedback.textContent = message;

    if (state) {
      elements.actionTimerFeedback.dataset.state = state;
    } else {
      delete elements.actionTimerFeedback.dataset.state;
    }

    elements.actionTimerFeedback.hidden = message === "";
  };

  const stopActionTimerTicker = () => {
    if (actionTimerState?.timerId) {
      window.clearInterval(actionTimerState.timerId);
      actionTimerState.timerId = null;
    }
  };

  const updateActionTimerUI = () => {
    if (!actionTimerState) {
      return;
    }

    const {
      exercise,
      exercises,
      index,
      remaining,
      started,
      paused,
      finished,
      totalElapsedSeconds,
    } = actionTimerState;
    const progress = Math.min(
      100,
      Math.max(0, ((ACTION_TIMER_SECONDS - remaining) / ACTION_TIMER_SECONDS) * 100),
    );
    const toggleLabel = finished
      ? "已结束"
      : !started
        ? "开始"
        : paused
          ? "继续"
          : "暂停";
    const nextExercise = exercises[(index + 1) % exercises.length];

    elements.actionTimerTitle.textContent = exercise.name;
    elements.actionTimerEmoji.textContent = exercise.emoji;
    elements.actionTimerCategory.textContent =
      `${exerciseCategoryLabels.get(exercise.category) ?? "其他"} · ${exercise.space}`;
    elements.actionTimerStep.textContent = finished
      ? "时间到，可以完成记录"
      : !started
        ? "准备好后开始"
        : paused
          ? "已暂停，休息一下"
          : "保持节奏，跟着呼吸";
    elements.actionTimerClock.textContent = formatMotionClock(remaining);
    elements.actionTimerTags.textContent =
      `${exercise.space} · ${exercise.quiet ? "静音" : "有声音"} · ${exercise.duration} 分钟`;
    elements.actionTimerProgress.style.width = `${finished ? 100 : progress}%`;
    elements.actionTimerToggle.textContent = toggleLabel;
    elements.actionTimerToggle.disabled = finished;
    elements.actionTimerToggle.setAttribute(
      "aria-label",
      `${toggleLabel}${exercise.name}计时`,
    );
    elements.actionTimerNext.disabled = exercises.length <= 1;
    elements.actionTimerNext.setAttribute(
      "aria-label",
      exercises.length > 1
        ? `切换到下一个动作：${nextExercise.name}`
        : "当前没有其他可选动作",
    );
    elements.actionTimerComplete.disabled = totalElapsedSeconds <= 0;

    if (finished) {
      setActionTimerFeedback(
        "计时结束，点击“完成”写入今天的运动记录。",
        "success",
      );
    } else {
      setActionTimerFeedback("");
    }
  };

  const finishActionTimer = () => {
    if (!actionTimerState) {
      return;
    }

    stopActionTimerTicker();
    actionTimerState.paused = true;
    actionTimerState.finished = true;
    actionTimerState.remaining = 0;
    updateActionTimerUI();
  };

  const startActionTimerTicker = () => {
    if (!actionTimerState || actionTimerState.paused || actionTimerState.finished) {
      return;
    }

    stopActionTimerTicker();
    actionTimerState.timerId = window.setInterval(() => {
      if (!actionTimerState || actionTimerState.paused || actionTimerState.finished) {
        return;
      }

      const exerciseId = actionTimerState.exercise.id;
      actionTimerState.elapsedSeconds += 1;
      actionTimerState.totalElapsedSeconds += 1;
      actionTimerState.remaining -= 1;
      actionTimerState.visited.set(
        exerciseId,
        (actionTimerState.visited.get(exerciseId) ?? 0) + 1,
      );

      if (actionTimerState.remaining <= 0) {
        finishActionTimer();
        return;
      }

      updateActionTimerUI();
    }, 1000);
  };

  const openActionTimer = (exerciseId, trigger) => {
    const exercise = exerciseById.get(exerciseId);

    if (!exercise || elements.actionTimerDialog.open) {
      return;
    }

    const visibleExercises = exerciseCatalog.filter(exerciseMatchesFilters);
    const exercises =
      visibleExercises.length > 0 ? visibleExercises : [exercise];

    actionTimerState = {
      exercises,
      index: Math.max(0, exercises.findIndex((item) => item.id === exercise.id)),
      exercise,
      remaining: ACTION_TIMER_SECONDS,
      elapsedSeconds: 0,
      totalElapsedSeconds: 0,
      visited: new Map(),
      started: false,
      paused: true,
      finished: false,
      timerId: null,
      trigger,
    };

    elements.actionTimerDialog.showModal();
    updateActionTimerUI();
    elements.actionTimerToggle.focus({ preventScroll: true });
  };

  const closeActionTimer = () => {
    if (elements.actionTimerDialog.open) {
      elements.actionTimerDialog.close();
    }
  };

  const advanceActionTimer = () => {
    if (!actionTimerState) {
      return;
    }

    const wasRunning =
      actionTimerState.started &&
      !actionTimerState.paused &&
      !actionTimerState.finished;

    actionTimerState.index =
      (actionTimerState.index + 1) % actionTimerState.exercises.length;
    actionTimerState.exercise = actionTimerState.exercises[actionTimerState.index];
    actionTimerState.remaining = ACTION_TIMER_SECONDS;
    actionTimerState.elapsedSeconds = 0;
    actionTimerState.finished = false;
    actionTimerState.paused = !wasRunning;
    updateActionTimerUI();

    if (wasRunning) {
      startActionTimerTicker();
    }
  };

  const completeActionTimerSession = () => {
    if (!actionTimerState || actionTimerState.totalElapsedSeconds <= 0) {
      return;
    }

    refreshCheckinDate();

    const dateKey = toDateKey(new Date());
    const record =
      checkinRecords[dateKey] ?? createEmptyCheckinRecord(dateKey);
    const previousSessions = record.motionSessions;
    const previousExercises = { ...record.exercises };
    const completedAt = new Date().toISOString();
    const completedExercises = [];
    const sessions = [];

    actionTimerState.visited.forEach((seconds, exerciseId) => {
      const exercise = exerciseById.get(exerciseId);

      if (!exercise || seconds <= 0) {
        return;
      }

      completedExercises.push(exercise);
      sessions.push({
        workoutId: `action-timer-${exercise.id}`,
        name: `${exercise.name} · 动作计时`,
        minutes: Math.max(1, Math.round(seconds / 60)),
        completedAt,
      });
    });

    if (sessions.length === 0) {
      setActionTimerFeedback(
        "还没有计时记录，先开始并完成一小段动作。",
        "error",
      );
      return;
    }

    checkinRecords[dateKey] = record;
    record.motionSessions = normalizeMotionSessions([
      ...(record.motionSessions ?? []),
      ...sessions,
    ]);

    if (!writeCheckinRecord(dateKey, record)) {
      record.motionSessions = previousSessions;
      record.exercises = previousExercises;
      setActionTimerFeedback(
        "写入失败，请检查浏览器存储权限后重试。",
        "error",
      );
      return;
    }

    const summaryMessage =
      completedExercises.length === 1
        ? `已将「${completedExercises[0].name}」的动作计时写入今天的运动记录。`
        : `已将 ${completedExercises.length} 个动作的计时写入今天的运动记录。`;

    closeActionTimer();
    refreshExerciseCheckinViews(record);
    setExerciseLibraryStatus(summaryMessage);
  };

  elements.actionTimerToggle.addEventListener("click", () => {
    if (!actionTimerState || actionTimerState.finished) {
      return;
    }

    if (!actionTimerState.started) {
      actionTimerState.started = true;
      actionTimerState.paused = false;
    } else {
      actionTimerState.paused = !actionTimerState.paused;
    }

    updateActionTimerUI();

    if (actionTimerState.paused) {
      stopActionTimerTicker();
    } else {
      startActionTimerTicker();
    }
  });

  elements.actionTimerNext.addEventListener("click", advanceActionTimer);
  elements.actionTimerComplete.addEventListener(
    "click",
    completeActionTimerSession,
  );
  elements.actionTimerClose.addEventListener("click", closeActionTimer);

  elements.actionTimerDialog.addEventListener("click", (event) => {
    if (event.target === elements.actionTimerDialog) {
      closeActionTimer();
    }
  });

  elements.actionTimerDialog.addEventListener("close", () => {
    const trigger = actionTimerState?.trigger;

    stopActionTimerTicker();
    actionTimerState = null;
    setActionTimerFeedback("");

    window.setTimeout(() => {
      if (trigger && document.contains(trigger)) {
        trigger.focus({ preventScroll: true });
      }
    }, 0);
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (!item.classList.contains("is-active")) {
        activatePage(item.dataset.pageTarget);
      }
    });
  });

  elements.quickCheckin.addEventListener("click", () => {
    openRecordCenter({ focusHeading: true });
  });

  elements.recordFab.addEventListener("click", () => {
    openRecordCenter({ focusHeading: true });
  });

  elements.recordBack.addEventListener("click", closeRecordCenter);

  elements.recordShortcutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openRecordCenter({ target: button.dataset.recordTarget });
    });
  });

  bodyMetricElements.form?.addEventListener("submit", handleBodyMetricsSubmit);
  bodyMetricElements.date?.addEventListener("change", () => {
    prefillBodyMetricsForm(bodyMetricElements.date.value);
  });

  BODY_METRIC_FIELDS.forEach(({ key }) => {
    const input = bodyMetricElements[key];

    input?.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
      setDataFeedback(bodyMetricElements.feedback, "");
    });
  });

  dormChallengeElements.form?.addEventListener(
    "submit",
    handleDormChallengeCreate,
  );
  dormChallengeElements.importInput?.addEventListener("input", () => {
    if (dormChallengeElements.importFeedback?.dataset.state === "error") {
      setDataFeedback(dormChallengeElements.importFeedback, "");
    }
  });

  badgeElements.grid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-badge-id]");

    if (button) {
      selectBadge(button.dataset.badgeId);
    }
  });

  document.getElementById("page-data")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.dataAction;

    if (action === "record-weight") {
      openRecordCenter({ target: "weight", focusHeading: true });
      return;
    }

    if (action === "record-breakfast") {
      openRecordCenter({ target: "breakfast" });
      return;
    }

    if (action === "open-checkin") {
      openRecordCenter({ focusHeading: true });
      return;
    }

    if (action === "focus-body-metrics") {
      const target =
        bodyMetricElements.waist ?? bodyMetricElements.date ?? null;
      target?.focus({ preventScroll: true });
      bodyMetricElements.form?.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "center",
      });
      return;
    }

    if (action === "focus-challenge-import") {
      dormChallengeElements.importInput?.focus({ preventScroll: true });
      dormChallengeElements.importInput?.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "center",
      });
      return;
    }

    if (action === "generate-dorm-report") {
      void handleGenerateDormReport();
      return;
    }

    if (action === "copy-dorm-report") {
      void handleCopyDormReport();
      return;
    }

    if (action === "import-dorm-report") {
      handleImportDormReport();
    }
  });

  elements.carryoverButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleCarryoverAction(button.dataset.carryoverAction);
    });
  });

  elements.profileGuide.addEventListener("click", (event) => {
    event.preventDefault();
    activatePage("plan", { focusHeading: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      refreshCheckinDate();
    }
  });

  scheduleState = readSavedSchedule();
  renderChartsWhenLoaded();
  renderScheduleGrid();
  restoreSavedWeeklyPlan();
  initializeBodyMetricsForm();
  initializeDormChallengeForm();

  updateGreeting();
  renderExerciseLibrary();
  renderCanteen();
  setExerciseView(activeExerciseView);
  renderDashboard();
  renderCheckin();
  window.setInterval(() => {
    updateGreeting();
    refreshCheckinDate();
  }, 60 * 1000);
})();
