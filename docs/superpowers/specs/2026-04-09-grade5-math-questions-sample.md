# 5年级数学题目样例
> 基于知识点清单生成，每道题标注关联知识点ID

## 题目格式说明

```typescript
interface Question {
  id: string;              // 题目ID，格式：g5_q_序号
  content: string;         // 题目内容
  type: 'single' | 'multiple' | 'fill' | 'image';
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: 'math' | 'chinese' | 'english' | 'science';
  grade: number;           // 年级：5
  knowledgePoints: string[];// 关联知识点ID数组
  options: QuestionOption[];
  imageUrl?: string;       // 图片URL（可选）
  explanation?: string;    // 解析（可选）
}
```

---

## 一、小数题目

### 1.1 小数认识与比较

**g5_q_001**
```json
{
  "id": "g5_q_001",
  "content": "0.75读作（ ）。",
  "type": "single",
  "difficulty": 1,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n1_001"],
  "options": [
    { "text": "零点七十五", "isCorrect": false },
    { "text": "零点七五", "isCorrect": true },
    { "text": "七十五", "isCorrect": false },
    { "text": "零点七十五零", "isCorrect": false }
  ],
  "explanation": "小数0.75读作：零点七五"
}
```

**g5_q_002**
```json
{
  "id": "g5_q_002",
  "content": "比较大小：3.27 ○ 3.272（填>、<或=）",
  "type": "single",
  "difficulty": 2,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n1_002"],
  "options": [
    { "text": ">", "isCorrect": false },
    { "text": "<", "isCorrect": true },
    { "text": "=", "isCorrect": false }
  ],
  "explanation": "3.27和3.272比较：3.27=3.270，3.270<3.272"
}
```

### 1.2 小数乘法

**g5_q_003**
```json
{
  "id": "g5_q_003",
  "content": "0.3 × 4 =（ ）",
  "type": "single",
  "difficulty": 1,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n1_005"],
  "options": [
    { "text": "0.12", "isCorrect": false },
    { "text": "1.2", "isCorrect": true },
    { "text": "12", "isCorrect": false },
    { "text": "0.012", "isCorrect": false }
  ],
  "explanation": "0.3×4=1.2，先按3×4=12，然后数小数位数"
}
```

**g5_q_004**
```json
{
  "id": "g5_q_004",
  "content": "0.25 × 0.4 =（ ）",
  "type": "single",
  "difficulty": 3,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n1_005", "g5_n1_006"],
  "options": [
    { "text": "0.1", "isCorrect": true },
    { "text": "0.01", "isCorrect": false },
    { "text": "1", "isCorrect": false },
    { "text": "0.001", "isCorrect": false }
  ],
  "explanation": "0.25×0.4=0.1，0.25有两位小数，0.4有一位，共三位，25×4=100，所以是0.100=0.1"
}
```

**g5_q_005**
```json
{
  "id": "g5_q_005",
  "content": "小明买了3本笔记本，每本2.5元，他应付（ ）元。",
  "type": "single",
  "difficulty": 2,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n1_010"],
  "options": [
    { "text": "6.5", "isCorrect": false },
    { "text": "7.5", "isCorrect": true },
    { "text": "75", "isCorrect": false },
    { "text": "0.75", "isCorrect": false }
  ],
  "explanation": "2.5×3=7.5（元）"
}
```

### 1.3 小数巧算

**g5_q_006**
```json
{
  "id": "g5_q_006",
  "content": "0.25 × 4.4 =（ ）（用巧算方法计算）",
  "type": "single",
  "difficulty": 4,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n1_009"],
  "options": [
    { "text": "1.1", "isCorrect": true },
    { "text": "0.11", "isCorrect": false },
    { "text": "11", "isCorrect": false },
    { "text": "0.011", "isCorrect": false }
  ],
  "explanation": "0.25×4.4=0.25×(4+0.4)=0.25×4+0.25×0.4=1+0.1=1.1"
}
```

---

## 二、分数题目

### 2.1 分数认识

**g5_q_007**
```json
{
  "id": "g5_q_007",
  "content": "把一个蛋糕平均分成8份，每份是这个蛋糕的（ ）。",
  "type": "single",
  "difficulty": 1,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n2_001"],
  "options": [
    { "text": "1/8", "isCorrect": true },
    { "text": "1/7", "isCorrect": false },
    { "text": "8/8", "isCorrect": false },
    { "text": "8/1", "isCorrect": false }
  ],
  "explanation": "平均分成8份，每份就是1/8"
}
```

### 2.2 分数加减

**g5_q_008**
```json
{
  "id": "g5_q_008",
  "content": "3/7 + 2/7 =（ ）",
  "type": "single",
  "difficulty": 1,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n2_007"],
  "options": [
    { "text": "5/7", "isCorrect": true },
    { "text": "5/14", "isCorrect": false },
    { "text": "5/49", "isCorrect": false },
    { "text": "1", "isCorrect": false }
  ],
  "explanation": "同分母分数相加，分母不变，分子相加：3/7+2/7=5/7"
}
```

**g5_q_009**
```json
{
  "id": "g5_q_009",
  "content": "1/2 + 1/3 =（ ）",
  "type": "single",
  "difficulty": 2,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n2_008"],
  "options": [
    { "text": "2/5", "isCorrect": false },
    { "text": "5/6", "isCorrect": true },
    { "text": "2/6", "isCorrect": false },
    { "text": "1/5", "isCorrect": false }
  ],
  "explanation": "异分母分数相加，先通分：1/2=3/6，1/3=2/6，3/6+2/6=5/6"
}
```

### 2.3 分数应用题

**g5_q_010**
```json
{
  "id": "g5_q_010",
  "content": "一项工程，甲单独做需要4天完成，乙单独做需要6天完成。两人合作（ ）天可以完成。",
  "type": "single",
  "difficulty": 4,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n2_011"],
  "options": [
    { "text": "2.4", "isCorrect": true },
    { "text": "5", "isCorrect": false },
    { "text": "10", "isCorrect": false },
    { "text": "2", "isCorrect": false }
  ],
  "explanation": "工程问题：甲效率1/4，乙效率1/6，合作效率1/4+1/6=5/12，需要12/5=2.4天"
}
```

---

## 三、因数与倍数

### 3.1 基础概念

**g5_q_011**
```json
{
  "id": "g5_q_011",
  "content": "12的因数有（ ）。",
  "type": "single",
  "difficulty": 1,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n3_001"],
  "options": [
    { "text": "1、2、3、6、12", "isCorrect": false },
    { "text": "1、2、3、4、6、12", "isCorrect": true },
    { "text": "2、3、4、6", "isCorrect": false },
    { "text": "1、2、6、12", "isCorrect": false }
  ],
  "explanation": "12的因数：1×12=12，2×6=12，3×4=12，所以是1、2、3、4、6、12"
}
```

**g5_q_012**
```json
{
  "id": "g5_q_012",
  "content": "既是2的倍数又是5的倍数的最小三位数是（ ）。",
  "type": "single",
  "difficulty": 2,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n3_003"],
  "options": [
    { "text": "100", "isCorrect": true },
    { "text": "110", "isCorrect": false },
    { "text": "120", "isCorrect": false },
    { "text": "200", "isCorrect": false }
  ],
  "explanation": "2和5的最小公倍数是10，最小三位数是100"
}
```

### 3.2 质数与分解质因数

**g5_q_013**
```json
{
  "id": "g5_q_013",
  "content": "下列数中，（ ）是质数。",
  "type": "single",
  "difficulty": 2,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n3_004"],
  "options": [
    { "text": "21", "isCorrect": false },
    { "text": "23", "isCorrect": true },
    { "text": "25", "isCorrect": false },
    { "text": "27", "isCorrect": false }
  ],
  "explanation": "质数是只有1和它本身两个因数的数。21=3×7，23只有1和23，25=5×5，27=3×9"
}
```

**g5_q_014**
```json
{
  "id": "g5_q_014",
  "content": "把60分解质因数是（ ）。",
  "type": "single",
  "difficulty": 3,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n3_006"],
  "options": [
    { "text": "60=2×3×10", "isCorrect": false },
    { "text": "60=2×2×3×5", "isCorrect": true },
    { "text": "60=4×3×5", "isCorrect": false },
    { "text": "60=6×10", "isCorrect": false }
  ],
  "explanation": "短除法：60÷2=30，30÷2=15，15÷3=5，5÷5=1，所以60=2×2×3×5"
}
```

---

## 四、简易方程

### 4.1 解方程

**g5_q_015**
```json
{
  "id": "g5_q_015",
  "content": "x + 3.5 = 7，x =（ ）",
  "type": "single",
  "difficulty": 1,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n4_003"],
  "options": [
    { "text": "10.5", "isCorrect": false },
    { "text": "3.5", "isCorrect": true },
    { "text": "4.5", "isCorrect": false },
    { "text": "2.5", "isCorrect": false }
  ],
  "explanation": "x=7-3.5=3.5"
}
```

**g5_q_016**
```json
{
  "id": "g5_q_016",
  "content": "3x - 6 = 12，x =（ ）",
  "type": "single",
  "difficulty": 2,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n4_004"],
  "options": [
    { "text": "2", "isCorrect": false },
    { "text": "6", "isCorrect": true },
    { "text": "18", "isCorrect": false },
    { "text": "4", "isCorrect": false }
  ],
  "explanation": "3x-6=12 → 3x=18 → x=6"
}
```

### 4.2 列方程解应用题

**g5_q_017**
```json
{
  "id": "g5_q_017",
  "content": "鸡和兔子共有8只，它们共有22只脚。鸡有（ ）只。",
  "type": "single",
  "difficulty": 4,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n4_008"],
  "options": [
    { "text": "4", "isCorrect": false },
    { "text": "5", "isCorrect": true },
    { "text": "6", "isCorrect": false },
    { "text": "3", "isCorrect": false }
  ],
  "explanation": "设鸡x只，兔(8-x)只。2x+4(8-x)=22，解得x=5"
}
```

---

## 五、面积与体积（含图片）

### 5.1 平行四边形面积

**g5_q_018** (带图片)
```json
{
  "id": "g5_q_018",
  "content": "如图，平行四边形底6cm，高4cm，面积是（ ）cm²。",
  "type": "image",
  "difficulty": 1,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_g1_002"],
  "imageUrl": "/images/math/g5/parallelogram_6x4.svg",
  "options": [
    { "text": "24", "isCorrect": true },
    { "text": "10", "isCorrect": false },
    { "text": "20", "isCorrect": false },
    { "text": "12", "isCorrect": false }
  ],
  "explanation": "平行四边形面积=底×高=6×4=24cm²"
}
```

**g5_q_018b** (带图片)
```json
{
  "id": "g5_q_018b",
  "content": "如图，一个平行四边形的底是8cm，高是5cm，它的面积是（ ）cm²。",
  "type": "image",
  "difficulty": 2,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_g1_002"],
  "imageUrl": "/images/math/g5/parallelogram_8x5.svg",
  "options": [
    { "text": "40", "isCorrect": true },
    { "text": "13", "isCorrect": false },
    { "text": "26", "isCorrect": false },
    { "text": "80", "isCorrect": false }
  ],
  "explanation": "平行四边形面积=底×高=8×5=40cm²"
}
```

### 5.2 三角形面积

**g5_q_018c** (带图片)
```json
{
  "id": "g5_q_018c",
  "content": "如图，三角形底6cm，高4cm，面积是（ ）cm²。",
  "type": "image",
  "difficulty": 2,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_g1_004"],
  "imageUrl": "/images/math/g5/triangle_6x4.svg",
  "options": [
    { "text": "12", "isCorrect": true },
    { "text": "24", "isCorrect": false },
    { "text": "10", "isCorrect": false },
    { "text": "48", "isCorrect": false }
  ],
  "explanation": "三角形面积=底×高÷2=6×4÷2=12cm²"
}
```

### 5.3 梯形面积

**g5_q_019** (带图片)
```json
{
  "id": "g5_q_019",
  "content": "如图，梯形上底3cm，下底7cm，高4cm，面积是（ ）cm²。",
  "type": "image",
  "difficulty": 3,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_g1_005"],
  "imageUrl": "/images/math/g5/trapezoid_3x7x4.svg",
  "options": [
    { "text": "20", "isCorrect": true },
    { "text": "10", "isCorrect": false },
    { "text": "40", "isCorrect": false },
    { "text": "14", "isCorrect": false }
  ],
  "explanation": "梯形面积=(上底+下底)×高÷2=(3+7)×4÷2=20cm²"
}
```

### 5.4 组合图形

**g5_q_019b** (带图片)
```json
{
  "id": "g5_q_019b",
  "content": "如图，长方形长10cm，宽6cm，剪去一个最大的正方形后，剩余部分的面积是（ ）cm²。",
  "type": "image",
  "difficulty": 3,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_g1_006"],
  "imageUrl": "/images/math/g5/rectangle_cut.svg",
  "options": [
    { "text": "24", "isCorrect": true },
    { "text": "36", "isCorrect": false },
    { "text": "60", "isCorrect": false },
    { "text": "30", "isCorrect": false }
  ],
  "explanation": "最大正方形边长6cm。剩余面积=10×6-6×6=60-36=24cm²"
}
```

### 5.5 体积

**g5_q_020**
```json
{
  "id": "g5_q_020",
  "content": "长方体长8cm，宽5cm，高3cm，体积是（ ）cm³。",
  "type": "single",
  "difficulty": 2,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_g2_004"],
  "options": [
    { "text": "120", "isCorrect": true },
    { "text": "80", "isCorrect": false },
    { "text": "40", "isCorrect": false },
    { "text": "16", "isCorrect": false }
  ],
  "explanation": "长方体体积=长×宽×高=8×5×3=120cm³"
}
```

---

## 六、统计与概率

**g5_q_021**
```json
{
  "id": "g5_q_021",
  "content": "盒子里有3个红球和2个黄球，任意摸出一个球，摸到红球的可能性（ ）摸到黄球的可能性。",
  "type": "single",
  "difficulty": 1,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_s2_002"],
  "options": [
    { "text": "大于", "isCorrect": true },
    { "text": "小于", "isCorrect": false },
    { "text": "等于", "isCorrect": false }
  ],
  "explanation": "红球3个，黄球2个，红球数量多，所以摸到红球的可能性大于摸到黄球的可能性"
}
```

---

## 七、难度5题目（奥数专题）

### 7.1 小数与分数综合

**g5_q_022**
```json
{
  "id": "g5_q_022",
  "content": "计算：0.1 + 0.2 + 0.3 + ... + 0.9 =（ ）",
  "type": "single",
  "difficulty": 5,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n1_007", "g5_n1_009"],
  "options": [
    { "text": "4.5", "isCorrect": true },
    { "text": "0.9", "isCorrect": false },
    { "text": "9", "isCorrect": false },
    { "text": "0.45", "isCorrect": false }
  ],
  "explanation": "等差数列求和：(0.1+0.9)×9÷2=4.5"
}
```

**g5_q_023**
```json
{
  "id": "g5_q_023",
  "content": "1/2 + 1/6 + 1/12 + 1/20 + 1/30 =（ ）",
  "type": "single",
  "difficulty": 5,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n2_010"],
  "options": [
    { "text": "5/6", "isCorrect": true },
    { "text": "1", "isCorrect": false },
    { "text": "4/5", "isCorrect": false },
    { "text": "6/7", "isCorrect": false }
  ],
  "explanation": "裂项法：1/2=1-1/2, 1/6=1/2-1/3, 1/12=1/3-1/4... 相互抵消得5/6"
}
```

### 7.2 奥数：图形计数

**g5_q_024** (带图片)
```json
{
  "id": "g5_q_024",
  "content": "如图，图中有（ ）个三角形。",
  "type": "image",
  "difficulty": 5,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_m1_001"],
  "imageUrl": "/images/math/g5/triangle_count.svg",
  "options": [
    { "text": "10", "isCorrect": true },
    { "text": "8", "isCorrect": false },
    { "text": "12", "isCorrect": false },
    { "text": "15", "isCorrect": false }
  ],
  "explanation": "单个三角形4个，两个组合2个，三个组合1个，共7个基本单元"
}
```

### 7.3 奥数：面积综合

**g5_q_025** (带图片)
```json
{
  "id": "g5_q_025",
  "content": "如图，正方形ABCD边长8cm，E是AB中点，F是BC中点。阴影部分面积是（ ）cm²。",
  "type": "image",
  "difficulty": 5,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_g1_007", "g5_m1_001"],
  "imageUrl": "/images/math/g5/square_shadow.svg",
  "options": [
    { "text": "32", "isCorrect": true },
    { "text": "48", "isCorrect": false },
    { "text": "24", "isCorrect": false },
    { "text": "16", "isCorrect": false }
  ],
  "explanation": "三角形AEF面积=8×4÷2=16，剩余两个三角形各8cm²，共32cm²"
}
```

### 7.4 奥数：逻辑推理

**g5_q_026**
```json
{
  "id": "g5_q_026",
  "content": "甲、乙、丙三人中有一人做了一件好事。老师询问时：甲说'是乙做的'；乙说'不是我做的'；丙说'也不是我做的'。已知三人中只有一人说了真话。（ ）做了这件好事。",
  "type": "single",
  "difficulty": 5,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_m1_001"],
  "options": [
    { "text": "甲", "isCorrect": false },
    { "text": "乙", "isCorrect": false },
    { "text": "丙", "isCorrect": true },
    { "text": "无法确定", "isCorrect": false }
  ],
  "explanation": "假设法：如果甲真，则乙假丙真(矛盾)；如果乙真，则甲假丙真(矛盾)；如果丙真，则甲乙都假，成立。所以是丙做的。"
}
```

### 7.5 奥数：优化问题

**g5_q_027**
```json
{
  "id": "g5_q_027",
  "content": "烤一只鱼需要6分钟（正反各3分钟），一次只能烤2只。如果要烤3只鱼，最少需要（ ）分钟。",
  "type": "single",
  "difficulty": 5,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_m3_001"],
  "options": [
    { "text": "12", "isCorrect": true },
    { "text": "9", "isCorrect": false },
    { "text": "18", "isCorrect": false },
    { "text": "15", "isCorrect": false }
  ],
  "explanation": "优化策略：第一次烤1号和2号(各正面3分钟)，第二次烤1号反面和3号正面(3分钟)，第三次烤2号反面和3号反面(3分钟)，共9分钟...不对。正确：第一次2只6分钟，第二次1只6分钟，共12分钟。"
}
```

### 7.6 奥数：不定方程

**g5_q_028**
```json
{
  "id": "g5_q_028",
  "content": "小明用10元钱买了8角和5角的铅笔共15支，8角铅笔买了（ ）支。",
  "type": "single",
  "difficulty": 5,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n4_007"],
  "options": [
    { "text": "5", "isCorrect": false },
    { "text": "10", "isCorrect": false },
    { "text": "3", "isCorrect": true },
    { "text": "7", "isCorrect": false }
  ],
  "explanation": "设8角x支，5角y支。x+y=15, 0.8x+0.5y=10 → x=3, y=12"
}
```

### 7.7 奥数：排列组合

**g5_q_029**
```json
{
  "id": "g5_q_029",
  "content": "用1、2、3、4四个数字可以组成（ ）个不同的三位数。（数字不能重复使用）",
  "type": "single",
  "difficulty": 5,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_n3_010", "g5_s2_006"],
  "options": [
    { "text": "24", "isCorrect": true },
    { "text": "12", "isCorrect": false },
    { "text": "6", "isCorrect": false },
    { "text": "18", "isCorrect": false }
  ],
  "explanation": "排列公式：4×3×2=24（百位4选1，十位3选1，个位2选1）"
}
```

### 7.8 奥数：皮克定理初步

**g5_q_030** (带图片)
```json
{
  "id": "g5_q_030",
  "content": "如图，每个小方格的边长是1cm，格点三角形ABC的面积是（ ）cm²。",
  "type": "image",
  "difficulty": 5,
  "category": "math",
  "grade": 5,
  "knowledgePoints": ["g5_g1_009"],
  "imageUrl": "/images/math/g5/pick_theorem.svg",
  "options": [
    { "text": "6", "isCorrect": true },
    { "text": "5", "isCorrect": false },
    { "text": "7", "isCorrect": false },
    { "text": "8", "isCorrect": false }
  ],
  "explanation": "皮克定理：S = N + M/2 - 1（内格点数N=4，边界格点数M=6）"
}
```

---

## 题目统计

| 难度 | 题目数量 |
|------|---------|
| 难度1 | 8 |
| 难度2 | 9 |
| 难度3 | 5 |
| 难度4 | 3 |
| 难度5 | 9 |
| **总计** | **34** |

---

## 图片资源清单

需要生成的几何图片（SVG格式）：
- `/images/math/g5/parallelogram_6x4.svg` - 平行四边形，底6高4
- `/images/math/g5/parallelogram_8x5.svg` - 平行四边形，底8高5
- `/images/math/g5/triangle_6x4.svg` - 三角形，底6高4
- `/images/math/g5/trapezoid_3x7x4.svg` - 梯形，上底3下底7高4
- `/images/math/g5/rectangle_cut.svg` - 长方形剪去正方形
- `/images/math/g5/triangle_count.svg` - 数三角形个数
- `/images/math/g5/square_shadow.svg` - 正方形内阴影
- `/images/math/g5/pick_theorem.svg` - 皮克定理格点图

---

## 后续工作

1. 为所有知识点生成足够数量的题目
2. 补充语文、英语、物理、化学科目
3. 生成所有几何图片资源
4. 完善题目解析
