<div align="center">

# 轻燃计划 SlimSpark

**把减重或增重，变成可持续的日常。**

一个纯前端、无需注册、数据只留在本机的体重管理与健康打卡应用。

[在线体验](https://flow89930-source.github.io/slimspark/) · [English](README.en.md)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-3D8FAA?style=flat-square&logo=githubpages&logoColor=white)](https://flow89930-source.github.io/slimspark/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=111111)](https://github.com/flow89930-source/slimspark)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4.7-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Local Data](https://img.shields.io/badge/Storage-localStorage-111827?style=flat-square)](https://github.com/flow89930-source/slimspark)
[![Mobile First](https://img.shields.io/badge/Responsive-Mobile%20First-3D8FAA?style=flat-square)](https://github.com/flow89930-source/slimspark)

</div>

| 首页 | 动作库 |
|:---:|:---:|
| <img src="docs/screenshots/home.png" width="380" alt="轻燃计划首页：体重进度、连续打卡与今日计划"> | <img src="docs/screenshots/exercises.png" width="380" alt="轻燃计划动作库：分类筛选与 18 个动作"> |

## 项目简介

轻燃计划是一款面向手机使用的体重管理单页应用（SPA），把目标设定、每日饮食、运动、体重记录和数据回顾放进同一个轻量界面。

- **双向目标**：同时支持减重和增重。BMI 偏低时，如果仍设置减重目标，应用会提示健康风险并引导开启增重计划。
- **本地优先**：没有后端、账号或云端同步，身高、体重、饮食、运动和打卡记录全部保存在浏览器 `localStorage`。
- **开箱即用**：无框架、无构建步骤、无 npm 依赖，克隆后即可运行。
- **移动端体验**：以手机屏幕为主要设计场景，适配窄屏、安全区和减少动态效果的系统设置。

> 应用中的 BMI、BMR、TDEE 和热量目标属于通用估算，不构成医疗建议。如有特殊健康状况，请咨询医生或注册营养师。

## 功能一览

### 计划与目标

- 输入性别、年龄、身高、当前体重、目标体重、每周运动天数和期望周期。
- 自动计算 BMI、基础代谢（BMR）、每日总消耗（TDEE）和建议每日热量。
- 根据目标方向生成 4 / 8 / 12 周计划，并针对过快的减重或增重节奏给出提醒。
- 增重模式提供热量盈余、蛋白质摄入、力量训练建议和一日增重餐示例。
- 输出按周推进的体重目标与运动安排。

### 首页与打卡

- 首页展示体重目标进度、连续打卡天数和今日运动安排。
- 饮食打卡支持早餐、午餐、晚餐和加餐，可记录食物与热量。
- 运动打卡支持选择动作、记录时长，并允许自定义今日训练项目。
- 体重记录会同步到首页进度和数据页趋势图。
- 完成打卡后有状态反馈与庆祝动画。

### 饮食与动作库

- 内置 44 道常见菜品、7 个分类及热量参考，支持按名称和别名搜索，并提供推荐菜品。
- 每个餐次都可以维护自己的快捷项，常用食物不必重复输入。
- 动作库包含 18 个动作，覆盖燃脂有氧、核心、臀腿、上肢和拉伸。
- 动作卡片可展开查看步骤、呼吸提示和常见错误，并可直接加入今日训练。
- 根据目标、BMI、运动频率和近期记录，在本地推荐适合今天的动作。

### 数据回顾

- 体重变化折线图，并标记目标体重。
- 最近 12 周打卡热力图，展示完整打卡与有记录的天数。
- 最近 7 天摄入热量与目标热量对比柱状图。
- 没有足够数据时显示明确的空状态，而不是空白图表。

## 技术栈

| 层级 | 方案 |
| --- | --- |
| 界面 | HTML5 + CSS3（自定义属性、Grid、Flexbox、媒体查询） |
| 逻辑 | 原生 JavaScript（ES6） |
| 图表 | Chart.js 4.4.7（jsDelivr CDN） |
| 存储 | 浏览器 `localStorage` |
| 动效 | CSS 动画 + Intersection Observer |
| 部署 | GitHub Pages（`main` 分支根目录） |

项目没有使用前端框架、包管理器或打包工具。图表脚本外链自 CDN，其余资源均为本仓库静态文件。

## 项目结构

```text
.
├── index.html              # 单页应用入口与全部页面结构
├── css/
│   └── style.css           # 设计系统、响应式布局与动效
├── js/
│   ├── app.js              # 计划、打卡、图表与交互逻辑
│   ├── data.js             # 菜品与动作数据
│   └── motion.js           # 滚动显现与庆祝动画
├── docs/
│   └── screenshots/        # README 展示截图
├── README.md               # 中文说明
└── README.en.md            # English README
```

## 本地运行

建议通过本地静态服务器访问，而不是直接双击 HTML 文件：

```bash
git clone https://github.com/flow89930-source/slimspark.git
cd slimspark

# macOS / Linux
python3 -m http.server 4173

# Windows
py -3 -m http.server 4173
```

然后打开 <http://localhost:4173/>。不需要安装依赖或执行构建命令。

## 部署

当前版本通过 GitHub Pages 发布：

- 源码分支：`main`
- 发布目录：仓库根目录 `/`
- 线上地址：<https://flow89930-source.github.io/slimspark/>

根目录的 `.nojekyll` 用于关闭 Jekyll 处理，保证静态资源原样发布。每次向 `main` 推送后，GitHub Pages 会自动重新构建。

## 数据与隐私

- 应用没有后端、账号系统、云同步、统计脚本或广告 SDK。
- 所有业务数据只保存在当前浏览器的 `localStorage` 中。
- 清除浏览器站点数据、使用无痕模式或更换设备后，记录不会自动恢复或同步。
- 目前没有内置导出、导入或跨设备迁移功能。
- 菜品热量为常见参考值，训练建议为通用建议，均用于日常估算。

## 健康提示

体重管理应优先保证安全和可持续性。应用给出的 BMI、BMR、TDEE、热量缺口或盈余、训练建议仅用于一般信息参考，不能替代医生、注册营养师或专业教练的个体化评估。未成年人、孕期或哺乳期人群、存在慢性疾病或进食障碍风险的人群，请在专业指导下使用。

## 许可证

本仓库暂未添加开源许可证。默认保留所有权利；如需转载、分发或商用，请先联系作者。

## 致谢

- [Chart.js](https://www.chartjs.org/)：数据页图表
- [GitHub Pages](https://pages.github.com/)：静态站点托管
- 页面图标与动作分镜均为项目内联 SVG，动作与菜品数据随项目维护