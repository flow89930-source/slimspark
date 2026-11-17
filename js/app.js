(() => {
  const STORAGE_KEYS = {
    profile: "slimspark.profile",
    checkins: "slimspark.checkins",
    checkinRecords: "slimspark.checkinRecords",
    exercisePlans: "slimspark.exercisePlans",
    exerciseRoutine: "slimspark.exerciseRoutine",
    mealPresets: "slimspark.mealPresets",
  };
  // checkins: 已完成三项的日期；checkinRecords: 按日期保存的完整打卡明细
  // exercisePlans: 按日期保存从动作库额外加入的今日计划
  // exerciseRoutine: 用户维护的每日训练清单
  // mealPresets: 每个餐次由用户维护的快捷菜品
  const weightFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 });
  const calorieFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
  const weeklyRateFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 });
  const dateFormatter = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric" });
  const weekdayFormatter = new Intl.DateTimeFormat("zh-CN", { weekday: "long" });
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
    quickCheckin: document.getElementById("quick-checkin"),
  };
  const planElements = {
    steps: [...document.querySelectorAll("[data-plan-step]")],
    formPanel: document.getElementById("plan-step-form"),
    resultPanel: document.getElementById("plan-step-result"),
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
  };
  let weightChartInstance = null;
  let calorieChartInstance = null;
  const navItems = [...document.querySelectorAll("[data-page-target]")];
  const pages = [...document.querySelectorAll(".page[data-page]")];

  let generatedPlan = null;

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

    exerciseIds.add(id);
    exerciseCatalog.push({
      id,
      name,
      category,
      difficulty,
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

  let mealPresetState = createMealPresetState();
  let selectedDishMeal = getDefaultDishMeal();
  let dishSearchQuery = "";
  let activePresetMeal = null;
  let editingPresetId = null;

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

  const renderTodayPlan = () => {
    const plan = getExercisePlanForDate(toDateKey(new Date()));
    const fragment = document.createDocumentFragment();

    plan.forEach((exercise, index) => {
      const item = document.createElement("li");
      const number = document.createElement("span");
      const copy = document.createElement("span");
      const name = document.createElement("strong");
      const meta = document.createElement("span");
      const amount = document.createElement("span");

      item.className = "exercise-item";
      number.className = "exercise-number";
      number.setAttribute("aria-hidden", "true");
      number.textContent = String(index + 1).padStart(2, "0");
      copy.className = "exercise-copy";
      name.textContent = exercise.name;
      meta.textContent = exercise.meta;
      amount.className = "exercise-time";
      amount.textContent = exercise.amount;
      copy.append(name, meta);
      item.append(number, copy, amount);
      fragment.append(item);
    });

    elements.todayPlanList.replaceChildren(fragment);
    elements.todayPlanCount.textContent = `${plan.length} 项`;
  };

  const renderDashboard = () => {
    const profile = getProfile();
    const progress = calculateProgress(profile);
    const streak = getStreakSummary(getCheckinDates());

    renderTodayPlan();
    elements.profileGuide.hidden = profile !== null;
    elements.streakCount.textContent = String(streak.count);
    elements.streakNote.textContent = streak.checkedToday
      ? "今天的火焰已点亮，保持这份节奏。"
      : streak.count > 0
        ? "今天再打卡，就能延续连续记录。"
        : "今天打卡，开启你的连续记录。";

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

  const createCheckinExerciseItem = (exercise) => {
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
    input.dataset.exerciseId = exercise.id;
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
    copy.append(metaLine, name, prescription);
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

    addButton.className = "movement-add";
    addButton.type = "button";
    addButton.setAttribute("aria-pressed", "false");
    addButton.append(addIcon, addLabel);
    detail.append(addButton);

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

    card.append(summary, detail);
    updateMovementPlanButton(view);
    return { card, view };
  };

  const updateExerciseFilter = (filterId) => {
    if (!exerciseCategories.some(({ id }) => id === filterId)) {
      return;
    }

    activeExerciseFilter = filterId;
    let visibleCount = 0;

    exerciseElements.filters
      .querySelectorAll("[data-exercise-filter]")
      .forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.exerciseFilter === filterId),
        );
      });

    movementCardViews.forEach((view) => {
      const isVisible =
        filterId === "all" || view.exercise.category === filterId;
      view.card.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      } else if (view.card.classList.contains("is-open")) {
        setMovementCardOpen(view, false);
      }
    });

    const filterLabel =
      exerciseCategories.find(({ id }) => id === filterId)?.label ?? "全部";
    exerciseElements.resultCount.textContent = `${filterLabel} · ${visibleCount} 个动作`;
    exerciseElements.empty.hidden = visibleCount !== 0;
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
    planElements.resultPanel.hidden = step !== 2;

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
    setPlanStep(2);
    focusPlanStep(planElements.resultTitle);
  });

  planElements.form.addEventListener("input", () => {
    planElements.formError.hidden = true;
    updatePlanGoalHint();
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
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
      renderDashboard();
      planElements.saveButton.disabled = true;
      planElements.saveButton.textContent = "计划已保存";
      planElements.saveStatus.dataset.state = "success";
      planElements.saveStatus.textContent = "保存成功，计划已存入当前浏览器。";
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
  });

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

  checkinElements.exercisePlanManage.addEventListener("click", openExerciseEditor);
  checkinElements.exerciseDialogClose.addEventListener("click", closeExerciseEditor);
  checkinElements.exerciseDone.addEventListener("click", closeExerciseEditor);
  checkinElements.exerciseCancel.addEventListener("click", resetExerciseForm);
  checkinElements.exerciseDialog.addEventListener("click", (event) => {
    if (event.target === checkinElements.exerciseDialog) {
      closeExerciseEditor();
    }
  });
  checkinElements.exerciseDialog.addEventListener("close", resetExerciseForm);

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

    const button = event.target.closest("[data-exercise-filter]");

    if (!button || !exerciseElements.filters.contains(button)) {
      return;
    }

    updateExerciseFilter(button.dataset.exerciseFilter);
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

    if (!window.Chart) {
      showDataEmpty(
        dataElements.weightShell,
        dataElements.weightEmpty,
        DATA_CHART_ERROR_TEXT,
      );
      dataElements.weightTag.textContent = "图表未加载";
      return;
    }

    const entries = getWeightEntries();

    if (entries.length === 0) {
      showDataEmpty(dataElements.weightShell, dataElements.weightEmpty);
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
      setDataEmptyMessage(dataElements.heatmapEmpty);
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

    if (!window.Chart) {
      showDataEmpty(
        dataElements.calorieShell,
        dataElements.calorieEmpty,
        DATA_CHART_ERROR_TEXT,
      );
      dataElements.calorieTag.textContent = "图表未加载";
      return;
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

    if (days.every(({ calories }) => calories === null)) {
      showDataEmpty(dataElements.calorieShell, dataElements.calorieEmpty);
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

  const renderDataPage = () => {
    const profile = getProfile();

    renderWeightChart(profile);
    renderHeatmap();
    renderCalorieChart(profile);
  };

  const activatePage = (pageName, { focusHeading = false } = {}) => {
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

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  };

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (!item.classList.contains("is-active")) {
        activatePage(item.dataset.pageTarget);
      }
    });
  });

  elements.quickCheckin.addEventListener("click", () => {
    activatePage("checkin", { focusHeading: true });
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

  updateGreeting();
  renderExerciseLibrary();
  renderDashboard();
  renderCheckin();
  window.setInterval(() => {
    updateGreeting();
    refreshCheckinDate();
  }, 60 * 1000);
})();
