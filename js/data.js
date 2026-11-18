// 步骤、呼吸与错误提示为占位文案，后续可直接替换对应字段。
window.SLIMSPARK_EXERCISE_DATA = {
  "categories": [
    { "id": "all", "label": "全部" },
    { "id": "cardio", "label": "燃脂有氧" },
    { "id": "core", "label": "核心" },
    { "id": "lower", "label": "臀腿" },
    { "id": "upper", "label": "上肢" },
    { "id": "stretch", "label": "拉伸" }
  ],
  "exercises": [
    {
      "id": "jumping-jack",
      "name": "开合跳",
      "category": "cardio",
      "difficulty": 2,
      "dorm": true,
      "quiet": false,
      "bedtime": false,
      "space": "宿舍空地",
      "equipment": "无器械",
      "duration": 5,
      "sets": "3 组 × 30 秒",
      "emoji": "🤸",
      "intro": "快速升温的全身有氧，适合作为训练开场。",
      "steps": [
        "双脚并拢站立，核心收紧，双臂自然垂于体侧。",
        "轻轻起跳，双脚向两侧打开至略宽于肩。",
        "同时双臂从体侧上举至头顶，手掌在头顶上方靠近。",
        "再次轻跳回到并腿姿势，双臂回落。",
        "以稳定节奏连续完成，落地时保持膝盖微屈。"
      ],
      "breathing": "保持均匀呼吸，让开合节奏与呼吸形成稳定节拍，不要憋气。",
      "mistakes": [
        "落地时膝盖僵直，脚跟重重砸地。",
        "膝盖向内扣，脚尖与膝盖方向不一致。",
        "全程耸肩，颈肩过度紧张。"
      ]
    },
    {
      "id": "high-knees",
      "name": "高抬腿",
      "category": "cardio",
      "difficulty": 2,
      "dorm": true,
      "quiet": false,
      "bedtime": false,
      "space": "宿舍空地",
      "equipment": "无器械",
      "duration": 5,
      "sets": "3 组 × 30 秒",
      "emoji": "🏃",
      "intro": "短时高效的心率提升动作，重点在抬膝高度与节奏。",
      "steps": [
        "双脚与髋同宽站立，挺胸收腹，视线平视前方。",
        "重心放在前脚掌，交替快速抬起膝盖至髋部高度。",
        "双臂自然屈肘前后摆动，帮助维持节奏。",
        "躯干保持直立，前脚掌轻柔落地。",
        "按设定时间连续交替完成。"
      ],
      "breathing": "采用短而有节奏的呼吸，不要因为提速而屏住呼吸。",
      "mistakes": [
        "上身后仰，用腰部代偿抬腿。",
        "脚掌重重落地，膝盖承受额外冲击。",
        "只踢脚而不提膝，动作幅度不足。"
      ]
    },
    {
      "id": "jump-rope",
      "name": "跳绳",
      "category": "cardio",
      "difficulty": 3,
      "dorm": false,
      "quiet": false,
      "bedtime": false,
      "space": "走廊/空地",
      "equipment": "跳绳",
      "duration": 5,
      "sets": "4 组 × 60 秒",
      "emoji": "🪢",
      "intro": "经典有氧动作，用小幅度弹跳建立轻快节奏。",
      "steps": [
        "调整绳长，双脚踩住绳中点时手柄约到胸腹位置。",
        "大臂贴近身体，主要用手腕带动绳子旋转。",
        "前脚掌轻跳，离地约 2–3 厘米即可。",
        "膝盖保持微屈，落地时用脚踝和膝盖缓冲。",
        "维持稳定节奏，尽量不中断连续跳跃。"
      ],
      "breathing": "保持自然均匀的呼吸，按自己的节奏跳，不必追求过快速度。",
      "mistakes": [
        "大臂外张、用整条手臂抡绳。",
        "跳得过高，落地冲击过大。",
        "全脚掌或脚跟落地，缺少缓冲。"
      ]
    },
    {
      "id": "burpee",
      "name": "波比跳",
      "category": "cardio",
      "difficulty": 5,
      "dorm": true,
      "quiet": false,
      "bedtime": false,
      "space": "宿舍空地",
      "equipment": "无器械",
      "duration": 5,
      "sets": "3 组 × 10 次",
      "emoji": "🔥",
      "intro": "全身参与的进阶燃脂动作，强度较高，注意控制节奏。",
      "steps": [
        "站姿开始，双脚与髋同宽，核心收紧。",
        "屈髋下蹲，双手撑在双脚前方地面。",
        "双脚向后跳成高位平板，保持头、背、髋一条直线。",
        "双脚跳回双手旁，起身向上跳，双臂自然上举。",
        "轻落地缓冲后再次下蹲，连续完成。"
      ],
      "breathing": "下蹲撑地时吸气，收腿起身跳跃时呼气，避免长时间憋气。",
      "mistakes": [
        "后跳成平板时塌腰，腰椎压力增加。",
        "后跳或落地时膝盖内扣。",
        "起身时弓背，没有先稳定核心。"
      ]
    },
    {
      "id": "plank",
      "name": "平板支撑",
      "category": "core",
      "difficulty": 3,
      "dorm": true,
      "quiet": true,
      "bedtime": false,
      "space": "瑜伽垫",
      "equipment": "瑜伽垫",
      "duration": 5,
      "sets": "3 组 × 30 秒",
      "emoji": "🧱",
      "intro": "基础核心等长训练，用稳定呼吸对抗身体下沉。",
      "steps": [
        "俯卧，前臂撑地，手肘位于肩膀正下方。",
        "脚尖踩地，收紧腹部和臀部，让身体离开地面。",
        "保持头、背、髋和脚跟大致在一条直线上。",
        "目视前下方，肩膀远离耳朵，均匀呼吸。",
        "保持设定时间；若姿势变形，可改为跪姿平板。"
      ],
      "breathing": "用鼻子吸气、嘴巴呼气，保持呼吸连续，不要为了坚持而憋气。",
      "mistakes": [
        "腰部下塌，腹部没有持续收紧。",
        "臀部抬得过高，核心参与减少。",
        "耸肩或抬头过高，颈肩紧张。"
      ]
    },
    {
      "id": "crunch",
      "name": "卷腹",
      "category": "core",
      "difficulty": 2,
      "dorm": true,
      "quiet": true,
      "bedtime": false,
      "space": "瑜伽垫",
      "equipment": "瑜伽垫",
      "duration": 5,
      "sets": "3 组 × 15 次",
      "emoji": "🌀",
      "intro": "针对腹直肌的基础动作，重点在缓慢卷起而非坐起。",
      "steps": [
        "仰卧屈膝，双脚踩地，双手轻扶耳侧或放在胸前。",
        "下巴微收，腹部发力抬起肩胛骨离开地面。",
        "腰部保持贴地，不需要完全坐起。",
        "顶端稍停一秒，再缓慢下放肩背。",
        "保持控制，连续完成设定次数。"
      ],
      "breathing": "卷起时呼气，下放时吸气，动作速度跟随呼吸。",
      "mistakes": [
        "双手抱头用力拉扯脖子。",
        "借助惯性快速起落，腹部没有持续发力。",
        "下放时腰部离地，核心放松。"
      ]
    },
    {
      "id": "russian-twist",
      "name": "俄罗斯转体",
      "category": "core",
      "difficulty": 3,
      "dorm": true,
      "quiet": true,
      "bedtime": false,
      "space": "瑜伽垫",
      "equipment": "瑜伽垫",
      "duration": 5,
      "sets": "3 组 × 20 次",
      "emoji": "🔄",
      "intro": "训练腹斜肌的旋转动作，保持背部挺直是关键。",
      "steps": [
        "坐姿屈膝，双脚踩地，上身后仰约 45 度。",
        "背部保持挺直，双手在胸前交握。",
        "腹部带动躯干向一侧旋转，不只是转动手臂。",
        "回到中间，再转向另一侧。",
        "熟练后可抬离双脚增加难度，全程保持稳定。"
      ],
      "breathing": "转体时呼气，回到中间时吸气，避免憋气旋转。",
      "mistakes": [
        "含胸弓背，腰部承受过多压力。",
        "只摆动双手，躯干几乎没有旋转。",
        "速度过快，失去腹部控制。"
      ]
    },
    {
      "id": "dead-bug",
      "name": "死虫式",
      "category": "core",
      "difficulty": 2,
      "dorm": true,
      "quiet": true,
      "bedtime": false,
      "space": "瑜伽垫",
      "equipment": "瑜伽垫",
      "duration": 5,
      "sets": "3 组 × 12 次",
      "emoji": "🪲",
      "intro": "低冲击核心稳定动作，重点保持腰部贴地。",
      "steps": [
        "仰卧，双臂伸向天花板，髋膝各屈约 90 度。",
        "腰部轻贴地面，收紧腹部。",
        "缓慢伸出一侧手臂过头，同时伸直另一侧腿。",
        "手脚接近地面但不触地，控制身体不晃动。",
        "回到起始位置，换边完成，双腿交替进行。"
      ],
      "breathing": "伸展手脚时呼气，回到中间时吸气，保持节奏稳定。",
      "mistakes": [
        "腰部拱起离开地面。",
        "动作过快，借助惯性甩动手脚。",
        "屏住呼吸，腹部无法持续收紧。"
      ]
    },
    {
      "id": "squat",
      "name": "深蹲",
      "category": "lower",
      "difficulty": 2,
      "dorm": true,
      "quiet": true,
      "bedtime": false,
      "space": "宿舍空地",
      "equipment": "无器械",
      "duration": 5,
      "sets": "3 组 × 15 次",
      "emoji": "🦵",
      "intro": "下肢基础动作，兼顾臀腿力量与髋膝控制。",
      "steps": [
        "双脚与肩同宽站立，脚尖略微外展。",
        "屈髋屈膝下蹲，想象臀部向后坐向椅子。",
        "膝盖与脚尖保持同一方向，蹲至大腿接近平行地面。",
        "脚跟踩稳，臀腿发力站起。",
        "顶端收紧臀部，但不要过度锁死膝盖。"
      ],
      "breathing": "下蹲时吸气，站起时呼气，保持核心稳定。",
      "mistakes": [
        "膝盖向内扣，没有跟随脚尖方向。",
        "脚跟离地，重心过度前移。",
        "弓背下蹲或站起时膝盖向内夹。"
      ]
    },
    {
      "id": "lunge",
      "name": "弓步蹲",
      "category": "lower",
      "difficulty": 3,
      "dorm": true,
      "quiet": true,
      "bedtime": false,
      "space": "宿舍空地",
      "equipment": "无器械",
      "duration": 5,
      "sets": "3 组 × 12 次/侧",
      "emoji": "🚶",
      "intro": "单侧下肢训练，帮助改善左右力量与稳定性。",
      "steps": [
        "站直，双脚与髋同宽，双手叉腰或自然下垂。",
        "一侧腿向前迈出一大步，双膝屈曲下蹲。",
        "前膝约呈 90 度并对齐脚尖，后膝接近地面。",
        "前脚发力站起回到起始位置，换另一侧。",
        "两侧交替完成，保持躯干稳定。"
      ],
      "breathing": "下蹲时吸气，起身时呼气，动作全程保持均匀。",
      "mistakes": [
        "前膝内扣或超过脚尖过多。",
        "步幅过小，前腿膝盖压力增大。",
        "上身过度前倾或后膝重重撞地。"
      ]
    },
    {
      "id": "glute-bridge",
      "name": "臀桥",
      "category": "lower",
      "difficulty": 2,
      "dorm": true,
      "quiet": true,
      "bedtime": false,
      "space": "瑜伽垫",
      "equipment": "瑜伽垫",
      "duration": 5,
      "sets": "3 组 × 15 次",
      "emoji": "🌉",
      "intro": "激活臀部的基础动作，避免用腰部代偿发力。",
      "steps": [
        "仰卧屈膝，双脚踩地与髋同宽，脚跟靠近臀部。",
        "收紧腹部，臀部发力将髋部抬离地面。",
        "肩到膝大致成一条直线，顶端夹紧臀部一秒。",
        "缓慢下放髋部，但不要完全放松。",
        "按节奏重复，保持膝盖朝前。"
      ],
      "breathing": "抬髋时呼气，下放时吸气，顶端不要憋气。",
      "mistakes": [
        "过度挺腰，用腰部代替臀部发力。",
        "膝盖向外打开或向内夹。",
        "双脚离臀部太远，腘绳肌代偿明显。"
      ]
    },
    {
      "id": "side-lunge",
      "name": "侧弓步",
      "category": "lower",
      "difficulty": 2,
      "dorm": true,
      "quiet": true,
      "bedtime": false,
      "space": "宿舍空地",
      "equipment": "无器械",
      "duration": 5,
      "sets": "3 组 × 12 次/侧",
      "emoji": "↔️",
      "intro": "侧向移动的臀腿动作，提升髋部灵活与单腿控制。",
      "steps": [
        "双脚并拢站立，双手在胸前交握。",
        "一侧腿向旁迈出一大步，脚尖朝前。",
        "屈髋屈膝向迈出的一侧下蹲，另一条腿保持伸直。",
        "支撑脚发力回到中间，换另一侧完成。",
        "保持膝盖与脚尖同向，躯干稳定。"
      ],
      "breathing": "下蹲时吸气，回到中间时呼气。",
      "mistakes": [
        "下蹲侧膝盖内扣。",
        "直腿膝盖锁死，髋部无法下沉。",
        "上身前倾过多，重心失控。"
      ]
    },
    {
      "id": "knee-pushup",
      "name": "跪姿俯卧撑",
      "category": "upper",
      "difficulty": 2,
      "dorm": true,
      "quiet": true,
      "bedtime": false,
      "space": "瑜伽垫",
      "equipment": "瑜伽垫",
      "duration": 5,
      "sets": "3 组 × 10 次",
      "emoji": "💪",
      "intro": "俯卧撑的友好版本，适合先建立推力与核心控制。",
      "steps": [
        "跪姿准备，双膝着地，双手略宽于肩膀。",
        "肩、髋、膝保持一条直线，核心收紧。",
        "屈肘下降，肘部与身体约呈 45 度。",
        "胸部接近地面后，手掌发力推起还原。",
        "全程保持颈部自然，身体整体移动。"
      ],
      "breathing": "下降时吸气，推起时呼气，避免耸肩憋气。",
      "mistakes": [
        "腰部下塌，核心没有收紧。",
        "肘部完全向外打开，肩关节压力增加。",
        "头部前伸，颈部紧张。"
      ]
    },
    {
      "id": "pushup",
      "name": "标准俯卧撑",
      "category": "upper",
      "difficulty": 4,
      "dorm": true,
      "quiet": true,
      "bedtime": false,
      "space": "瑜伽垫",
      "equipment": "瑜伽垫",
      "duration": 5,
      "sets": "3 组 × 12 次",
      "emoji": "🫳",
      "intro": "上肢与核心协同的基础推力动作，重视身体整体性。",
      "steps": [
        "双手略宽于肩撑地，双脚向后伸成高位平板。",
        "收紧腹部和臀部，身体保持一条直线。",
        "屈肘下降，肘部与躯干约呈 45 度。",
        "胸部接近地面，手掌发力推起身体。",
        "顶端保持肩胛稳定，不塌腰也不撅臀。"
      ],
      "breathing": "下降时吸气，推起时呼气，保持呼吸与动作同步。",
      "mistakes": [
        "塌腰或撅臀，身体没有保持整体。",
        "肘部完全外展，肩膀前侧压力过大。",
        "下降幅度不足或只低头不降身体。"
      ]
    },
    {
      "id": "bench-dip",
      "name": "凳上臂屈伸",
      "category": "upper",
      "difficulty": 3,
      "dorm": false,
      "quiet": true,
      "bedtime": false,
      "space": "宿舍椅子旁",
      "equipment": "稳固椅子",
      "duration": 5,
      "sets": "3 组 × 12 次",
      "emoji": "🪑",
      "intro": "针对肱三头肌的支撑动作，肩部稳定优先于下降深度。",
      "steps": [
        "背对稳固的凳子或椅子，双手撑住边缘，手指朝前。",
        "臀部离开凳面，双腿前伸，屈膝或伸直均可。",
        "屈肘让身体缓慢下降，肘部约到 90 度。",
        "肱三头肌发力推起身体，肩膀保持远离耳朵。",
        "全程控制速度，不要借助惯性。"
      ],
      "breathing": "下降时吸气，推起时呼气，保持肩颈放松。",
      "mistakes": [
        "耸肩，肩膀向耳朵方向移动。",
        "臀部离凳子太远，肩关节过度前移。",
        "下降过深或速度过快，肩部压力增大。"
      ]
    },
    {
      "id": "cat-cow",
      "name": "猫式伸展",
      "category": "stretch",
      "difficulty": 1,
      "dorm": true,
      "quiet": true,
      "bedtime": true,
      "space": "瑜伽垫",
      "equipment": "瑜伽垫",
      "duration": 5,
      "sets": "2 组 × 8 次呼吸",
      "emoji": "🐈",
      "intro": "温和活动整条脊柱，适合久坐后放松背部。",
      "steps": [
        "四足跪姿，手腕位于肩膀下方，膝盖位于髋部下方。",
        "吸气时抬头、胸口向前，让腰部自然下沉。",
        "呼气时拱背低头，尾骨内收，感受背部延展。",
        "随着呼吸缓慢交替，动作连贯但不急躁。",
        "完成设定的呼吸次数后回到中立位。"
      ],
      "breathing": "吸气进入伸展位，呼气进入拱背位，让呼吸带动脊柱活动。",
      "mistakes": [
        "只转动脖子，脊柱没有参与动作。",
        "手肘锁死，肩膀和手腕过度受压。",
        "动作过快，没有跟随呼吸。"
      ]
    },
    {
      "id": "standing-forward-fold",
      "name": "站姿体前屈",
      "category": "stretch",
      "difficulty": 1,
      "dorm": true,
      "quiet": true,
      "bedtime": true,
      "space": "宿舍空地",
      "equipment": "无器械",
      "duration": 5,
      "sets": "2 组 × 30 秒",
      "emoji": "🙇",
      "intro": "放松腿后侧与下背部的静态拉伸，量力而为。",
      "steps": [
        "双脚与髋同宽站立，膝盖保持微屈。",
        "吸气延展脊柱，呼气从髋部向前折叠。",
        "双手自然触地、扶小腿或放在瑜伽砖上。",
        "头部自然放松，保持深长呼吸。",
        "结束时屈膝，缓慢卷起身体回到站姿。"
      ],
      "breathing": "保持深长呼吸，每次呼气时让身体多放松一点，不要憋气。",
      "mistakes": [
        "膝盖完全锁死，强行下压。",
        "弓背够手，而不是从髋部折叠。",
        "起身过快，容易头晕。"
      ]
    },
    {
      "id": "child-pose",
      "name": "婴儿式",
      "category": "stretch",
      "difficulty": 1,
      "dorm": true,
      "quiet": true,
      "bedtime": true,
      "space": "瑜伽垫",
      "equipment": "瑜伽垫",
      "duration": 5,
      "sets": "2 组 × 45 秒",
      "emoji": "🧘",
      "intro": "舒缓背部与髋部的静态休息姿势，适合训练收尾。",
      "steps": [
        "跪坐，大脚趾相触，膝盖打开至与髋同宽。",
        "臀部慢慢坐向脚跟，上身向前俯卧。",
        "双臂向前伸展或放在身体两侧，额头触地。",
        "保持深长呼吸，让背部和肩颈逐渐放松。",
        "结束时用手撑地，缓慢回到跪坐。"
      ],
      "breathing": "采用自然的腹式呼吸，吸气让背部扩张，呼气时放松下沉。",
      "mistakes": [
        "勉强坐向脚跟，造成膝盖疼痛。",
        "耸肩缩脖，肩颈无法放松。",
        "屏住呼吸或在起身时动作过快。"
      ]
    }
  ]
};

window.SLIMSPARK_DISH_DATA = {
  "dishes": [
    {
      "id": "oat-milk",
      "name": "燕麦牛奶",
      "aliases": ["燕麦粥", "牛奶燕麦"],
      "category": "早餐",
      "portion": "1 碗",
      "calories": 320,
      "meals": ["breakfast"],
      "recommended": true
    },
    {
      "id": "boiled-egg",
      "name": "水煮蛋",
      "aliases": ["白煮蛋", "鸡蛋"],
      "category": "早餐",
      "portion": "1 个",
      "calories": 75,
      "meals": ["breakfast"],
      "recommended": true
    },
    {
      "id": "whole-wheat-egg-sandwich",
      "name": "全麦鸡蛋三明治",
      "aliases": ["鸡蛋三明治", "全麦三明治", "三明治"],
      "category": "早餐",
      "portion": "1 份",
      "calories": 340,
      "meals": ["breakfast"],
      "recommended": true
    },
    {
      "id": "millet-congee",
      "name": "小米粥",
      "aliases": ["小米稀饭"],
      "category": "早餐",
      "portion": "1 碗",
      "calories": 140,
      "meals": ["breakfast"],
      "recommended": true
    },
    {
      "id": "veggie-meat-baozi",
      "name": "菜肉包子",
      "aliases": ["包子", "肉包"],
      "category": "早餐",
      "portion": "1 个",
      "calories": 230,
      "meals": ["breakfast"],
      "recommended": true
    },
    {
      "id": "yogurt-fruit-cup",
      "name": "酸奶水果杯",
      "aliases": ["水果酸奶", "酸奶杯"],
      "category": "早餐",
      "portion": "1 杯",
      "calories": 210,
      "meals": ["breakfast"],
      "recommended": true
    },
    {
      "id": "soy-milk",
      "name": "无糖豆浆",
      "aliases": ["豆浆"],
      "category": "早餐",
      "portion": "300 ml",
      "calories": 120,
      "meals": ["breakfast"],
      "recommended": false
    },
    {
      "id": "youtiao-soy-milk",
      "name": "豆浆油条",
      "aliases": ["油条"],
      "category": "早餐",
      "portion": "1 份",
      "calories": 430,
      "meals": ["breakfast"],
      "recommended": false
    },
    {
      "id": "jianbing",
      "name": "煎饼果子",
      "aliases": ["煎饼"],
      "category": "早餐",
      "portion": "1 套",
      "calories": 480,
      "meals": ["breakfast"],
      "recommended": false
    },
    {
      "id": "century-egg-congee",
      "name": "皮蛋瘦肉粥",
      "aliases": ["瘦肉粥", "皮蛋粥"],
      "category": "早餐",
      "portion": "1 碗",
      "calories": 260,
      "meals": ["breakfast"],
      "recommended": false
    },
    {
      "id": "tomato-egg",
      "name": "番茄炒蛋",
      "aliases": ["西红柿炒鸡蛋", "番茄炒鸡蛋"],
      "category": "家常菜",
      "portion": "1 盘",
      "calories": 200,
      "meals": ["lunch", "dinner"],
      "recommended": true
    },
    {
      "id": "pepper-pork",
      "name": "青椒肉丝",
      "aliases": ["尖椒肉丝"],
      "category": "家常菜",
      "portion": "1 盘",
      "calories": 260,
      "meals": ["lunch", "dinner"],
      "recommended": true
    },
    {
      "id": "steamed-fish",
      "name": "清蒸鲈鱼",
      "aliases": ["清蒸鱼", "鲈鱼"],
      "category": "家常菜",
      "portion": "1 份",
      "calories": 220,
      "meals": ["lunch", "dinner"],
      "recommended": true
    },
    {
      "id": "shrimp-broccoli",
      "name": "西兰花炒虾仁",
      "aliases": ["虾仁西兰花"],
      "category": "家常菜",
      "portion": "1 盘",
      "calories": 210,
      "meals": ["lunch", "dinner"],
      "recommended": true
    },
    {
      "id": "brown-rice",
      "name": "糙米饭",
      "aliases": ["糙米"],
      "category": "主食",
      "portion": "1 碗",
      "calories": 220,
      "meals": ["lunch"],
      "recommended": true
    },
    {
      "id": "chicken-salad",
      "name": "鸡胸肉沙拉",
      "aliases": ["鸡胸沙拉", "沙拉"],
      "category": "轻食",
      "portion": "1 份",
      "calories": 350,
      "meals": ["lunch"],
      "recommended": true
    },
    {
      "id": "mapo-tofu",
      "name": "麻婆豆腐",
      "aliases": ["豆腐"],
      "category": "家常菜",
      "portion": "1 盘",
      "calories": 290,
      "meals": ["lunch", "dinner"],
      "recommended": true
    },
    {
      "id": "tomato-tofu-soup",
      "name": "番茄豆腐汤",
      "aliases": ["豆腐汤"],
      "category": "汤羹",
      "portion": "1 碗",
      "calories": 140,
      "meals": ["lunch", "dinner"],
      "recommended": true
    },
    {
      "id": "garlic-broccoli",
      "name": "蒜蓉西兰花",
      "aliases": ["西兰花", "清炒西兰花"],
      "category": "家常菜",
      "portion": "1 盘",
      "calories": 120,
      "meals": ["lunch", "dinner"],
      "recommended": true
    },
    {
      "id": "soba-chicken",
      "name": "荞麦鸡丝面",
      "aliases": ["鸡丝面", "荞麦面"],
      "category": "主食",
      "portion": "1 碗",
      "calories": 410,
      "meals": ["lunch", "dinner"],
      "recommended": true
    },
    {
      "id": "white-rice",
      "name": "白米饭",
      "aliases": ["米饭", "大米饭"],
      "category": "主食",
      "portion": "1 碗",
      "calories": 230,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "multigrain-rice",
      "name": "杂粮饭",
      "aliases": ["杂粮米饭"],
      "category": "主食",
      "portion": "1 碗",
      "calories": 210,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "kungpao-chicken",
      "name": "宫保鸡丁",
      "aliases": ["宫爆鸡丁"],
      "category": "家常菜",
      "portion": "1 盘",
      "calories": 330,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "fish-fragrant-pork",
      "name": "鱼香肉丝",
      "aliases": ["鱼香猪肉"],
      "category": "家常菜",
      "portion": "1 盘",
      "calories": 320,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "braised-pork",
      "name": "红烧肉",
      "aliases": ["五花肉"],
      "category": "家常菜",
      "portion": "1 小盘",
      "calories": 480,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "potato-shreds",
      "name": "酸辣土豆丝",
      "aliases": ["土豆丝"],
      "category": "家常菜",
      "portion": "1 盘",
      "calories": 170,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "garlic-greens",
      "name": "蒜蓉油麦菜",
      "aliases": ["油麦菜", "青菜"],
      "category": "家常菜",
      "portion": "1 盘",
      "calories": 100,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "di-san-xian",
      "name": "地三鲜",
      "aliases": ["茄子土豆"],
      "category": "家常菜",
      "portion": "1 盘",
      "calories": 360,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "dumplings",
      "name": "饺子",
      "aliases": ["水饺", "猪肉饺子"],
      "category": "主食",
      "portion": "12 个",
      "calories": 420,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "egg-fried-rice",
      "name": "蛋炒饭",
      "aliases": ["炒饭"],
      "category": "主食",
      "portion": "1 盘",
      "calories": 520,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "beef-noodle",
      "name": "牛肉面",
      "aliases": ["红烧牛肉面"],
      "category": "主食",
      "portion": "1 碗",
      "calories": 560,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "huangmenji-rice",
      "name": "黄焖鸡米饭",
      "aliases": ["黄焖鸡"],
      "category": "快餐",
      "portion": "1 份",
      "calories": 720,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "malatang",
      "name": "麻辣烫",
      "aliases": ["冒菜"],
      "category": "快餐",
      "portion": "1 份",
      "calories": 650,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "lanzhou-noodle",
      "name": "兰州拉面",
      "aliases": ["拉面"],
      "category": "快餐",
      "portion": "1 碗",
      "calories": 540,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "burger-meal",
      "name": "汉堡套餐",
      "aliases": ["汉堡", "薯条"],
      "category": "快餐",
      "portion": "1 份",
      "calories": 780,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "pizza",
      "name": "披萨",
      "aliases": ["比萨"],
      "category": "快餐",
      "portion": "2 片",
      "calories": 680,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "winter-melon-rib-soup",
      "name": "冬瓜排骨汤",
      "aliases": ["排骨汤"],
      "category": "汤羹",
      "portion": "1 碗",
      "calories": 210,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "seaweed-egg-soup",
      "name": "紫菜蛋花汤",
      "aliases": ["蛋花汤"],
      "category": "汤羹",
      "portion": "1 碗",
      "calories": 80,
      "meals": ["lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "corn",
      "name": "煮玉米",
      "aliases": ["玉米"],
      "category": "主食",
      "portion": "1 根",
      "calories": 140,
      "meals": ["breakfast", "lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "sweet-potato",
      "name": "蒸红薯",
      "aliases": ["红薯", "地瓜"],
      "category": "主食",
      "portion": "1 个",
      "calories": 180,
      "meals": ["breakfast", "lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "apple",
      "name": "苹果",
      "aliases": ["红富士"],
      "category": "加餐",
      "portion": "1 个",
      "calories": 90,
      "meals": ["breakfast", "lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "banana",
      "name": "香蕉",
      "aliases": [],
      "category": "加餐",
      "portion": "1 根",
      "calories": 105,
      "meals": ["breakfast", "lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "mixed-nuts",
      "name": "每日坚果",
      "aliases": ["坚果"],
      "category": "加餐",
      "portion": "1 小把",
      "calories": 180,
      "meals": ["breakfast", "lunch", "dinner"],
      "recommended": false
    },
    {
      "id": "plain-yogurt",
      "name": "无糖酸奶",
      "aliases": ["酸奶"],
      "category": "加餐",
      "portion": "1 杯",
      "calories": 100,
      "meals": ["breakfast", "lunch", "dinner"],
      "recommended": false
    }
  ]
};

window.SLIMSPARK_CANTEEN_DATA = [
  {
    "id": "canteen-steamed-perch",
    "name": "清蒸鲈鱼",
    "aliases": ["清蒸鱼", "鲈鱼", "Steamed Perch"],
    "meal": ["lunch", "dinner"],
    "calories": 220,
    "level": "red",
    "tags": ["高蛋白", "低油", "清蒸"],
    "reason": "清蒸少油，鱼肉提供优质蛋白，一份约 220 kcal，适合作为午晚餐主菜。",
    "swap": "豉油少量淋在鱼肉上，盘底汤汁不拌饭。",
    "pairing": "配半份杂粮饭和一份白灼青菜。"
  },
  {
    "id": "canteen-shrimp-broccoli",
    "name": "西兰花炒虾仁",
    "aliases": ["虾仁西兰花", "Shrimp Broccoli"],
    "meal": ["lunch", "dinner"],
    "calories": 210,
    "level": "red",
    "tags": ["高蛋白", "高纤维", "低油"],
    "reason": "虾仁高蛋白，西兰花补充膳食纤维，整体油量较低。",
    "swap": "让师傅少放油，虾仁和西兰花比例尽量各半。",
    "pairing": "配一小碗米饭，再来一碗紫菜蛋花汤。"
  },
  {
    "id": "canteen-blanched-choy-sum",
    "name": "白灼菜心",
    "aliases": ["菜心", "白灼青菜", "Blanched Choy Sum"],
    "meal": ["lunch", "dinner"],
    "calories": 90,
    "level": "red",
    "tags": ["高纤维", "低油", "低热量"],
    "reason": "蔬菜份量足、热量低，能增加一餐的纤维和饱腹感。",
    "swap": "蚝油放旁边蘸着吃，比整盘淋汁更控盐。",
    "pairing": "搭配清蒸鱼和半份米饭。"
  },
  {
    "id": "canteen-garlic-broccoli",
    "name": "蒜蓉西兰花",
    "aliases": ["西兰花", "Garlic Broccoli"],
    "meal": ["lunch", "dinner"],
    "calories": 120,
    "level": "red",
    "tags": ["高纤维", "蔬菜", "少油"],
    "reason": "以蔬菜为主，蒜蓉清炒比干锅做法用油少。",
    "swap": "请少油快炒，不吃盘底菜汁。",
    "pairing": "配鸡胸肉或豆腐，补足蛋白。"
  },
  {
    "id": "canteen-tomato-tofu-soup",
    "name": "番茄豆腐汤",
    "aliases": ["豆腐汤", "Tomato Tofu Soup"],
    "meal": ["lunch", "dinner"],
    "calories": 140,
    "level": "red",
    "tags": ["植物蛋白", "低热量", "汤羹"],
    "reason": "豆腐提供植物蛋白，番茄增加蔬菜摄入，汤品热量较低。",
    "swap": "少盐少油，连豆腐和番茄一起吃，不只喝汤。",
    "pairing": "配一份青菜和半碗杂粮饭。"
  },
  {
    "id": "canteen-chicken-salad",
    "name": "鸡胸肉沙拉",
    "aliases": ["鸡胸沙拉", "Chicken Salad"],
    "meal": ["lunch", "dinner"],
    "calories": 330,
    "level": "red",
    "tags": ["高蛋白", "高纤维", "轻食"],
    "reason": "鸡胸肉高蛋白，蔬菜量足，适合作为轻负担的一餐。",
    "swap": "沙拉酱分装，先吃菜和肉，酱只蘸一半。",
    "pairing": "加一个水煮蛋和一小根玉米。"
  },
  {
    "id": "canteen-mushroom-chicken",
    "name": "香菇滑鸡",
    "aliases": ["香菇鸡", "Mushroom Chicken"],
    "meal": ["lunch", "dinner"],
    "calories": 280,
    "level": "red",
    "tags": ["高蛋白", "少油", "菌菇"],
    "reason": "鸡肉蛋白充足，香菇增香，清蒸或少油滑炒的比例更稳。",
    "swap": "去皮吃鸡肉，让汤汁留在盘里。",
    "pairing": "配白灼青菜和半份米饭。"
  },
  {
    "id": "canteen-celery-dried-tofu",
    "name": "芹菜香干",
    "aliases": ["香干芹菜", "Celery Tofu"],
    "meal": ["lunch", "dinner"],
    "calories": 190,
    "level": "red",
    "tags": ["植物蛋白", "高纤维", "适中"],
    "reason": "香干补充植物蛋白，芹菜带来纤维，整体热量适中。",
    "swap": "选少油版，避免额外加辣油。",
    "pairing": "配番茄豆腐汤和一小份主食。"
  },
  {
    "id": "canteen-steamed-tofu-egg",
    "name": "豆腐蒸蛋",
    "aliases": ["蒸蛋豆腐", "Steamed Egg Tofu"],
    "meal": ["lunch", "dinner"],
    "calories": 180,
    "level": "red",
    "tags": ["高蛋白", "清蒸", "低油"],
    "reason": "蒸制少油，鸡蛋和豆腐双重蛋白，口感软、份量友好。",
    "swap": "少淋生抽，不额外加香油。",
    "pairing": "配一份深色蔬菜和半碗饭。"
  },
  {
    "id": "canteen-steamed-sweet-potato",
    "name": "蒸红薯",
    "aliases": ["红薯", "地瓜", "Sweet Potato"],
    "meal": ["lunch", "dinner"],
    "calories": 180,
    "level": "red",
    "tags": ["高纤维", "粗粮", "无额外油"],
    "reason": "粗粮纤维丰富，蒸制无额外油脂，适合替代部分精制主食。",
    "swap": "作为主食吃，不再叠加米饭或面食。",
    "pairing": "配鸡胸肉或鱼虾，再来一份蔬菜。"
  },
  {
    "id": "canteen-tomato-egg",
    "name": "番茄炒蛋",
    "aliases": ["西红柿炒鸡蛋", "番茄炒鸡蛋", "Tomato Egg"],
    "meal": ["lunch", "dinner"],
    "calories": 220,
    "level": "yellow",
    "tags": ["家常菜", "适量", "下饭"],
    "reason": "蛋白质和蔬菜都有，但食堂版常多油多糖，先控制份量。",
    "swap": "要求少油少糖，番茄汁不拌饭。",
    "pairing": "配半碗米饭和一份清炒青菜。"
  },
  {
    "id": "canteen-kung-pao-chicken",
    "name": "宫保鸡丁",
    "aliases": ["宫爆鸡丁", "Kung Pao Chicken"],
    "meal": ["lunch", "dinner"],
    "calories": 340,
    "level": "yellow",
    "tags": ["蛋白质", "适量", "花生"],
    "reason": "鸡肉提供蛋白，但花生和酱汁带来额外油糖，适合少量吃。",
    "swap": "少要花生和汤汁，鸡肉优先。",
    "pairing": "配白灼蔬菜，主食减半。"
  },
  {
    "id": "canteen-pepper-pork",
    "name": "青椒肉丝",
    "aliases": ["尖椒肉丝", "Pepper Pork"],
    "meal": ["lunch", "dinner"],
    "calories": 270,
    "level": "yellow",
    "tags": ["蛋白质", "蔬菜", "控油"],
    "reason": "蛋白质和蔬菜兼有，肉丝过油后热量会上升。",
    "swap": "选少油版，肉丝和青椒一起吃。",
    "pairing": "配半碗米饭和一碗清汤。"
  },
  {
    "id": "canteen-yuxiang-pork",
    "name": "鱼香肉丝",
    "aliases": ["鱼香猪肉", "Yu Xiang Pork"],
    "meal": ["lunch", "dinner"],
    "calories": 330,
    "level": "yellow",
    "tags": ["下饭", "油糖汁", "适量"],
    "reason": "下饭但酱汁油糖偏高，容易在不知不觉中多吃主食。",
    "swap": "少浇鱼香汁，把菜在盘边沥一下油。",
    "pairing": "配白灼青菜，米饭只取半份。"
  },
  {
    "id": "canteen-mapo-tofu",
    "name": "麻婆豆腐",
    "aliases": ["豆腐", "Mapo Tofu"],
    "meal": ["lunch", "dinner"],
    "calories": 300,
    "level": "yellow",
    "tags": ["植物蛋白", "红油", "适量"],
    "reason": "豆腐本身高蛋白，红油和汁料让油盐偏高。",
    "swap": "要少辣少油版，不拿汤汁拌饭。",
    "pairing": "配一碗清汤和一份绿叶菜。"
  },
  {
    "id": "canteen-hot-sour-potato",
    "name": "酸辣土豆丝",
    "aliases": ["土豆丝", "Potato Shreds"],
    "meal": ["lunch", "dinner"],
    "calories": 180,
    "level": "yellow",
    "tags": ["主食蔬菜", "适量", "控油"],
    "reason": "土豆可当主食，酸辣做法常额外用油，注意别重复点米饭。",
    "swap": "少油快炒，当作主食的一半。",
    "pairing": "配鸡胸肉或豆腐和一份蔬菜。"
  },
  {
    "id": "canteen-beef-noodle",
    "name": "牛肉面",
    "aliases": ["红烧牛肉面", "Beef Noodle"],
    "meal": ["lunch", "dinner"],
    "calories": 560,
    "level": "yellow",
    "tags": ["面食", "汤底偏咸", "控量"],
    "reason": "一碗能吃饱，蛋白质不错，但面量大、汤底偏咸。",
    "swap": "面只吃三分之二，汤不喝。",
    "pairing": "加一份青菜或一个水煮蛋。"
  },
  {
    "id": "canteen-pork-cabbage-dumplings",
    "name": "猪肉白菜饺子",
    "aliases": ["饺子", "水饺", "Dumplings"],
    "meal": ["lunch", "dinner"],
    "calories": 420,
    "level": "yellow",
    "tags": ["主食", "蛋白质", "控量"],
    "reason": "有主食也有肉和菜，但一份容易超过需要的份量。",
    "swap": "吃 8-10 个就停，蘸醋少蘸辣油。",
    "pairing": "配一碗蔬菜汤，不再加主食。"
  },
  {
    "id": "canteen-lanzhou-noodle",
    "name": "兰州拉面",
    "aliases": ["拉面", "Lanzhou Noodles"],
    "meal": ["lunch", "dinner"],
    "calories": 540,
    "level": "yellow",
    "tags": ["面食", "高盐汤底", "控量"],
    "reason": "热量主要在面条和汤底，牛肉蛋白份量有限。",
    "swap": "少面多菜，汤只喝几口。",
    "pairing": "加一个鸡蛋和一份小份青菜。"
  },
  {
    "id": "canteen-dry-fried-beans",
    "name": "干煸豆角",
    "aliases": ["豆角", "Dry Fried Beans"],
    "meal": ["lunch", "dinner"],
    "calories": 300,
    "level": "yellow",
    "tags": ["蔬菜", "吸油", "适量"],
    "reason": "豆角本身是蔬菜，干煸做法吸油较多，适合偶尔吃。",
    "swap": "选少油版，吃前在盘边沥油。",
    "pairing": "配清蒸鱼或豆腐，主食减半。"
  },
  {
    "id": "canteen-braised-pork",
    "name": "红烧肉",
    "aliases": ["五花肉", "Braised Pork"],
    "meal": ["lunch", "dinner"],
    "calories": 480,
    "level": "black",
    "tags": ["高油", "高糖", "高热量"],
    "reason": "五花肉脂肪高，糖色和酱汁让热量密度进一步升高。",
    "swap": "只尝 2-3 块，去掉肥肉，不拿汤汁拌饭。",
    "pairing": "配大量白灼蔬菜和清汤，主食减半。"
  },
  {
    "id": "canteen-mala-xiangguo",
    "name": "麻辣香锅",
    "aliases": ["香锅", "Mala Xiangguo", "Spicy Pot"],
    "meal": ["lunch", "dinner"],
    "calories": 850,
    "level": "black",
    "tags": ["高油", "高盐", "热量密度高"],
    "reason": "食材过油后再炒，油盐和热量都很高，一份容易超出一餐预算。",
    "swap": "选清汤少油版，多点蔬菜和豆制品，不配米饭。",
    "pairing": "先吃一份白灼青菜，再两人分食一份。"
  },
  {
    "id": "canteen-malatang",
    "name": "麻辣烫",
    "aliases": ["冒菜", "Malatang"],
    "meal": ["lunch", "dinner"],
    "calories": 650,
    "level": "black",
    "tags": ["高油", "高盐", "加工食材"],
    "reason": "汤底油盐重，丸子、方便面等食材会继续拉高热量。",
    "swap": "选清汤，多菜少丸，不喝汤，主食选粉丝半份。",
    "pairing": "加足绿叶菜和豆腐，避免再配饮料。"
  },
  {
    "id": "canteen-sweet-sour-pork",
    "name": "糖醋里脊",
    "aliases": ["糖醋肉", "Sweet and Sour Pork"],
    "meal": ["lunch", "dinner"],
    "calories": 520,
    "level": "black",
    "tags": ["油炸", "高糖", "高热量"],
    "reason": "油炸加糖醋汁，油脂和添加糖都偏高。",
    "swap": "只吃一半，外层面糊厚的话去掉一部分。",
    "pairing": "配白灼青菜和清汤，不再加甜饮。"
  },
  {
    "id": "canteen-fried-chicken-cutlet",
    "name": "炸鸡排",
    "aliases": ["鸡排", "Fried Chicken"],
    "meal": ["lunch", "dinner"],
    "calories": 650,
    "level": "black",
    "tags": ["油炸", "高油", "高热量"],
    "reason": "裹粉油炸让脂肪和热量密度升高，蛋白质伴随大量油。",
    "swap": "去皮去厚面衣，切一半分享。",
    "pairing": "配无糖茶和一份蔬菜沙拉。"
  },
  {
    "id": "canteen-twice-cooked-pork",
    "name": "回锅肉",
    "aliases": ["Twice Cooked Pork"],
    "meal": ["lunch", "dinner"],
    "calories": 540,
    "level": "black",
    "tags": ["高油", "高盐", "五花肉"],
    "reason": "五花肉加豆瓣酱和油炒，脂肪、盐分都偏高。",
    "swap": "只夹瘦肉，少蘸盘底红油。",
    "pairing": "配清炒时蔬，主食半份。"
  },
  {
    "id": "canteen-egg-fried-rice",
    "name": "蛋炒饭",
    "aliases": ["炒饭", "Egg Fried Rice"],
    "meal": ["lunch", "dinner"],
    "calories": 560,
    "level": "black",
    "tags": ["高油", "主食量大", "热量密度高"],
    "reason": "米饭吸油，一盘的主食量和油脂都不低。",
    "swap": "两人分食，或只吃半盘，不再配油条或炸物。",
    "pairing": "配紫菜蛋花汤和一份青菜。"
  },
  {
    "id": "canteen-braised-chicken-rice",
    "name": "黄焖鸡米饭",
    "aliases": ["黄焖鸡", "Braised Chicken Rice"],
    "meal": ["lunch", "dinner"],
    "calories": 720,
    "level": "black",
    "tags": ["高油", "高盐", "主食量大"],
    "reason": "鸡肉份量不小，酱汁浓、米饭多，一份整体热量偏高。",
    "swap": "米饭减半，酱汁不拌饭，鸡皮少吃。",
    "pairing": "加一份青菜，饮料选无糖。"
  },
  {
    "id": "canteen-burger-combo",
    "name": "汉堡套餐",
    "aliases": ["汉堡", "薯条", "Burger Set"],
    "meal": ["lunch", "dinner"],
    "calories": 820,
    "level": "black",
    "tags": ["高油", "高糖", "热量密度高"],
    "reason": "汉堡、薯条和含糖饮料组合后脂肪与热量密度很高。",
    "swap": "汉堡吃一半、薯条换沙拉、饮料换无糖。",
    "pairing": "配一份蔬菜沙拉，不再加甜品。"
  },
  {
    "id": "canteen-luosifen",
    "name": "螺蛳粉",
    "aliases": ["螺狮粉", "Luosifen"],
    "meal": ["lunch", "dinner"],
    "calories": 620,
    "level": "black",
    "tags": ["高油", "高盐", "油炸配料"],
    "reason": "汤底油盐重，炸腐竹和花生增加脂肪，米粉份量也足。",
    "swap": "少喝汤，炸物减半，加一份青菜。",
    "pairing": "配一个水煮蛋，避免再点炸物。"
  }
];
