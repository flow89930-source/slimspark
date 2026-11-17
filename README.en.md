<div align="center">

# SlimSpark (轻燃计划)

**Make weight change part of a sustainable routine.**

A pure frontend weight management and habit tracker. No account, no backend, and no personal data leaves your browser.

[Live Demo](https://flow89930-source.github.io/slimspark/) · [简体中文](README.md)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-3D8FAA?style=flat-square&logo=githubpages&logoColor=white)](https://flow89930-source.github.io/slimspark/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=111111)](https://github.com/flow89930-source/slimspark)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4.7-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Local Data](https://img.shields.io/badge/Storage-localStorage-111827?style=flat-square)](https://github.com/flow89930-source/slimspark)
[![Mobile First](https://img.shields.io/badge/Responsive-Mobile%20First-3D8FAA?style=flat-square)](https://github.com/flow89930-source/slimspark)

</div>

| Home | Exercise library |
|:---:|:---:|
| <img src="docs/screenshots/home.png" width="380" alt="SlimSpark home dashboard with weight progress, streak, and today's plan"> | <img src="docs/screenshots/exercises.png" width="380" alt="SlimSpark exercise library with category filters and 18 exercises"> |

## Overview

SlimSpark is a mobile-first single-page app that brings goal planning, daily food and exercise logging, weight tracking, and progress review into one lightweight interface. The UI is currently in Simplified Chinese.

- **Dual-direction planning**: supports both weight loss and weight gain. If a user with an underweight BMI sets a loss target, the app warns against further loss and guides them toward a healthy gain plan.
- **Local-first**: no backend, account, or cloud sync. Height, weight, meals, workouts, and check-ins stay in the browser's `localStorage`.
- **Zero build**: no framework, no build step, and no npm dependencies. Clone the repository and serve the files.
- **Mobile experience**: designed for phone-sized screens, with narrow-screen layouts, safe-area handling, and reduced-motion support.

> BMI, BMR, TDEE, and calorie targets in this app are general estimates, not medical advice. If you have a health condition, consult a doctor or registered dietitian.

## Features

### Planning and goals

- Collects sex, age, height, current weight, target weight, weekly exercise days, and desired timeframe.
- Calculates BMI, basal metabolic rate (BMR), total daily energy expenditure (TDEE), and a daily calorie target.
- Builds a 4-, 8-, or 12-week plan and warns when the requested loss or gain pace exceeds common healthy guidance.
- The gain path includes a calorie surplus, protein guidance, strength-training suggestions, and a sample gain-focused day of meals.
- Produces a week-by-week weight and exercise schedule.

### Dashboard and check-ins

- Shows weight-goal progress, the current check-in streak, and today's planned workouts on the home screen.
- Food logging for breakfast, lunch, dinner, and snacks, with food names and calories.
- Workout check-ins with selectable exercises, duration, and editable custom items for today's routine.
- Weight entries feed the home progress view and the trend chart on the data page.
- Status feedback and a celebration animation after completing check-ins.

### Food and exercise libraries

- 44 common dishes across 7 categories with calorie references, name/alias search, and recommendations.
- Per-meal quick presets for frequently logged foods.
- 18 exercises covering cardio, core, glutes and legs, upper body, and stretching.
- Expandable exercise cards with steps, breathing cues, common mistakes, and a shortcut to add the move to today's workout.
- Goal-aware, locally generated exercise recommendations based on the current goal, weight stage, and recent records.

### Progress review

- Weight trend line chart with the target weight marked.
- 12-week check-in heatmap showing completed and active days.
- Seven-day intake-versus-target calorie bar chart.
- Meaningful empty states when there is not enough data.

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | HTML5 + CSS3 (custom properties, Grid, Flexbox, media queries) |
| Logic | Vanilla JavaScript (ES6) |
| Charts | Chart.js 4.4.7 via jsDelivr CDN |
| Storage | Browser `localStorage` |
| Motion | CSS animations + Intersection Observer |
| Hosting | GitHub Pages (`main` branch, repository root) |

There is no frontend framework, package manager, or bundler. Chart.js is loaded from a CDN; every other asset is a static file in this repository.

## Project structure

```text
.
├── index.html              # SPA entry point and all page markup
├── css/
│   └── style.css           # Design system, responsive layout, and motion
├── js/
│   ├── app.js              # Planning, check-ins, charts, and interactions
│   ├── data.js             # Dish and exercise data
│   └── motion.js           # Scroll reveals and celebration animation
├── docs/
│   └── screenshots/        # README screenshots
├── README.md               # Chinese README
└── README.en.md            # This file
```

## Run locally

Use a local static server rather than opening the HTML file directly:

```bash
git clone https://github.com/flow89930-source/slimspark.git
cd slimspark

# macOS / Linux
python3 -m http.server 4173

# Windows
py -3 -m http.server 4173
```

Then open <http://localhost:4173/>. No install or build step is required.

## Deployment

The current version is published with GitHub Pages:

- Source branch: `main`
- Publish directory: repository root `/`
- Live URL: <https://flow89930-source.github.io/slimspark/>

The root-level `.nojekyll` file disables Jekyll processing so static assets are served as-is. Each push to `main` triggers a Pages rebuild.

## Data and privacy

- There is no backend, account system, cloud sync, analytics script, or advertising SDK.
- All app data is stored only in the current browser's `localStorage`.
- Clearing site data, using private browsing, or switching devices will not restore or sync records.
- Export, import, and cross-device migration are not currently built in.
- Dish calories are common reference values, and exercise suggestions are general guidance for everyday estimation.

## Health disclaimer

Weight management should prioritize safety and sustainability. BMI, BMR, TDEE, calorie targets, and training suggestions in this app are for general information only and are not a substitute for individualized advice from a doctor, registered dietitian, or qualified coach. Minors, pregnant or breastfeeding people, and people with chronic conditions or a history of disordered eating should use the app under professional guidance.

## License

No open-source license has been added yet. All rights are reserved by default; please contact the author before redistribution or commercial use.

## Acknowledgements

- [Chart.js](https://www.chartjs.org/) for the progress charts
- [GitHub Pages](https://pages.github.com/) for static hosting
- All UI icons are inline SVGs in this project; exercise and dish data are maintained with the app