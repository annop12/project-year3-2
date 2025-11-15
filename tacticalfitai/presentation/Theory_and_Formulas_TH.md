# ทฤษฎีและสูตรทางคณิตศาสตร์ - TacticalFitAI

## สารบัญ
1. Weighted Attribute Scoring
2. MinMax Normalization
3. Cosine Similarity
4. Alpha Blending
5. Value for Money Calculation
6. Position-Specific Weight Configuration

---

## 1. Weighted Attribute Scoring (การให้คะแนนแบบถ่วงน้ำหนัก)

### ทฤษฎี:
การประเมินความเหมาะสมของนักเตะกับตำแหน่งเฉพาะโดยการให้น้ำหนักความสำคัญกับแต่ละ attribute ที่แตกต่างกัน

### สูตร:

```
FitScore = Σ(wi × Ai)
         i=1

โดยที่:
- n = จำนวน attributes ทั้งหมด (11 attributes)
- wi = น้ำหนักของ attribute ที่ i (0 ≤ wi ≤ 1)
- Ai = ค่าของ attribute ที่ i (0-100)
- Σwi = 1 (ผลรวมของน้ำหนักทั้งหมดต้องเท่ากับ 1)
```

### ตัวอย่างการคำนวณสำหรับ Striker (ST):

**Attributes และ Weights:**
- Finishing (w₁ = 0.25): 92
- Positioning (w₂ = 0.20): 95
- xG (w₃ = 0.15): 3.53
- Speed (w₄ = 0.12): 75
- OffTheBall (w₅ = 0.10): 65
- Composure (w₆ = 0.08): 65
- Strength (w₇ = 0.05): 75
- Aggression (w₈ = 0.03): 81
- Vision (w₉ = 0.02): 64
- Passing (w₁₀ = 0.00): 65
- PressActions (w₁₁ = 0.00): 7.6

**การคำนวณ:**

```
FitScore = (0.25 × 92) + (0.20 × 95) + (0.15 × 3.53 × 20) + (0.12 × 75) +
           (0.10 × 65) + (0.08 × 65) + (0.05 × 75) + (0.03 × 81) +
           (0.02 × 64) + (0.00 × 65) + (0.00 × 7.6)

         = 23.00 + 19.00 + 10.59 + 9.00 + 6.50 + 5.20 + 3.75 + 2.43 + 1.28 + 0 + 0

         = 80.75 / 100
```

**หมายเหตุ**: xG ถูกคูณด้วย 20 เพื่อ normalize จาก scale 0-5 เป็น 0-100

---

## 2. MinMax Normalization (การทำให้ข้อมูลเป็นมาตรฐาน)

### ทฤษฎี:
การแปลงค่าให้อยู่ในช่วง 0-1 เพื่อให้ attributes ที่มี scale ต่างกันสามารถเปรียบเทียบกันได้

### สูตร:

```
X_normalized = (X - X_min) / (X_max - X_min)

โดยที่:
- X = ค่าที่ต้องการ normalize
- X_min = ค่าต่ำสุดของ attribute นั้น ๆ ในทั้ง dataset
- X_max = ค่าสูงสุดของ attribute นั้น ๆ ในทั้ง dataset
- X_normalized = ค่าหลัง normalize (0 ≤ X_normalized ≤ 1)
```

### ตัวอย่างการคำนวณ:

**Normalize Finishing attribute (Scale: 60-95)**

```
Player A: Finishing = 85

X_normalized = (85 - 60) / (95 - 60)
             = 25 / 35
             = 0.714

ค่าหลัง normalize: 0.714 (หรือ 71.4%)
```

### การใช้งานใน TacticalFitAI:

```python
from sklearn.preprocessing import MinMaxScaler

# Attributes ที่ต้อง normalize
features = ['Finishing', 'xG', 'Positioning', 'Speed', 'Strength',
            'Passing', 'Vision', 'Aggression', 'Composure',
            'OffTheBall', 'PressActions']

# สร้าง scaler
scaler = MinMaxScaler()

# Normalize
df_normalized = scaler.fit_transform(df[features])
```

---

## 3. Cosine Similarity (ความคล้ายคลึงเชิงมุม)

### ทฤษฎี:
วัดความคล้ายคลึงระหว่าง 2 vectors โดยคำนวณจาก cosine ของมุมระหว่าง vectors

### สูตร:

```
cos(θ) = (A · B) / (||A|| × ||B||)

       = Σ(Ai × Bi) / (√Σ(Ai²) × √Σ(Bi²))
         i=1

โดยที่:
- A = vector ของผู้เล่น (attributes ที่ normalize แล้ว)
- B = vector ของ ideal profile (profile ในอุดมคติ)
- A · B = dot product ของ A และ B
- ||A|| = magnitude (ความยาว) ของ vector A
- ||B|| = magnitude (ความยาว) ของ vector B
- θ = มุมระหว่าง A และ B
- ผลลัพธ์: -1 ≤ cos(θ) ≤ 1 (ใน TacticalFitAI จะอยู่ใน 0-1)
```

### ตัวอย่างการคำนวณ:

**Player Vector (normalized):**
```
A = [0.92, 0.71, 0.95, 0.75, 0.75, 0.65, 0.64, 0.81, 0.65, 0.65, 0.38]
```

**Ideal Striker Profile (normalized):**
```
B = [1.00, 0.80, 1.00, 0.85, 0.80, 0.70, 0.70, 0.75, 0.70, 0.70, 0.40]
```

**การคำนวณ:**

1. **Dot Product (A · B):**
```
A · B = (0.92×1.00) + (0.71×0.80) + (0.95×1.00) + (0.75×0.85) + ... + (0.38×0.40)
      = 0.920 + 0.568 + 0.950 + 0.638 + 0.600 + 0.455 + 0.448 + 0.608 + 0.455 + 0.455 + 0.152
      = 6.249
```

2. **Magnitude ||A||:**
```
||A|| = √(0.92² + 0.71² + 0.95² + ... + 0.38²)
      = √(0.8464 + 0.5041 + 0.9025 + ... + 0.1444)
      = √6.845
      = 2.616
```

3. **Magnitude ||B||:**
```
||B|| = √(1.00² + 0.80² + 1.00² + ... + 0.40²)
      = √(1.00 + 0.64 + 1.00 + ... + 0.16)
      = √7.185
      = 2.681
```

4. **Cosine Similarity:**
```
cos(θ) = 6.249 / (2.616 × 2.681)
       = 6.249 / 7.012
       = 0.891

Similarity Score = 89.1%
```

### การใช้งานใน TacticalFitAI:

```python
from sklearn.metrics.pairwise import cosine_similarity

# Normalize data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[features])

# Create ideal profile
ideal_profile = create_ideal_profile(position)  # e.g., [1.0, 0.8, 1.0, ...]

# Calculate similarity
similarity_matrix = cosine_similarity(X_scaled, [ideal_profile])
```

---

## 4. Alpha Blending (การผสมคะแนน)

### ทฤษฎี:
การรวมคะแนน 2 ตัวด้วยน้ำหนักที่กำหนด เพื่อให้ได้คะแนนรวมที่สมดุล

### สูตร:

```
OverallScore = α × FitScore + (1 - α) × SimilarityScore

โดยที่:
- α = น้ำหนักสำหรับ FitScore (0 ≤ α ≤ 1)
- (1 - α) = น้ำหนักสำหรับ SimilarityScore
- FitScore = คะแนนจาก weighted attributes (0-100)
- SimilarityScore = คะแนนจาก cosine similarity (0-100)
- OverallScore = คะแนนรวมสุดท้าย (0-100)
```

### ค่า α ที่แนะนำ:

| α | การใช้งาน | ผลลัพธ์ |
|---|----------|---------|
| 0.7 | แนะนำ (default) | เน้น FitScore 70%, Similarity 30% |
| 0.5 | สมดุล | ให้ความสำคัญเท่า ๆ กัน |
| 0.3 | เน้น Similarity | เน้นหาผู้เล่นที่สไตล์คล้ายกัน |
| 1.0 | เฉพาะ FitScore | ไม่สนใจ similarity |
| 0.0 | เฉพาะ Similarity | ไม่สนใจ weighted attributes |

### ตัวอย่างการคำนวณ (α = 0.7):

```
FitScore = 86.5
SimilarityScore = 89.1
α = 0.7

OverallScore = 0.7 × 86.5 + (1 - 0.7) × 89.1
             = 0.7 × 86.5 + 0.3 × 89.1
             = 60.55 + 26.73
             = 87.28 / 100
```

### การปรับ α ตามกรณีใช้งาน:

1. **α = 0.7-0.8**: เหมาะสำหรับการหาผู้เล่นที่เข้ากับระบบ
2. **α = 0.5**: เหมาะสำหรับการเปรียบเทียบผู้เล่นทั่วไป
3. **α = 0.2-0.3**: เหมาะสำหรับการหาผู้เล่นทดแทน (similar style)

---

## 5. Value for Money Calculation (คุ้มค่าเงิน)

### ทฤษฎี:
การคำนวณความคุ้มค่าโดยเทียบระหว่างคุณภาพ (OverallScore) กับราคา (MarketValue)

### สูตร:

```
ValueForMoney = OverallScore / MarketValue

โดยที่:
- OverallScore = คะแนนรวม (0-100)
- MarketValue = มูลค่าตลาด (€Million)
- ValueForMoney = คุณภาพต่อราคา (คะแนน/€M)
```

### ตัวอย่างการคำนวณ:

**Player A:**
```
OverallScore = 87.3
MarketValue = €42M

ValueForMoney = 87.3 / 42 = 2.08
```

**Player B:**
```
OverallScore = 85.0
MarketValue = €80M

ValueForMoney = 85.0 / 80 = 1.06
```

**ผลการเปรียบเทียบ:**
- Player A มี Value for Money สูงกว่า (2.08 > 1.06)
- แม้ Player A จะมีคะแนนรวมใกล้เคียงกับ Player B (87.3 vs 85.0)
- แต่ Player A ถูกกว่าเกือบครึ่งหนึ่ง (€42M vs €80M)
- **สรุป**: Player A คุ้มค่ากว่า

### การแบ่งระดับ Value for Money:

| Value for Money | ระดับ | ความหมาย |
|----------------|-------|----------|
| > 2.5 | Excellent | คุ้มค่ามาก (แนะนำซื้อ) |
| 1.5 - 2.5 | Good | คุ้มค่า |
| 1.0 - 1.5 | Fair | ราคาพอสมควร |
| 0.5 - 1.0 | Overpriced | แพงเกินไป |
| < 0.5 | Very Overpriced | แพงมาก (ไม่แนะนำ) |

---

## 6. Position-Specific Weight Configuration

### ทฤษฎี:
แต่ละตำแหน่งต้องการ attributes ที่แตกต่างกัน ดังนั้นต้องกำหนดน้ำหนักเฉพาะ

### สูตรทั่วไป:

```
Σ wi = 1
i=1

โดยที่:
- n = จำนวน attributes ที่ใช้สำหรับตำแหน่งนั้น
- wi = น้ำหนักของ attribute ที่ i
```

### ตัวอย่าง Position-Specific Weights:

#### **1. Striker (ST) - กองหน้า**

| Attribute | Weight | เหตุผล |
|-----------|--------|--------|
| Finishing | 0.25 | ความแม่นยำในการยิง - สำคัญที่สุด |
| Positioning | 0.20 | การวางตัวในกรอบเขตโทษ |
| xG | 0.15 | โอกาสยิงประตู |
| Speed | 0.12 | ความเร็วในการวิ่งขึ้นโจมตี |
| OffTheBall | 0.10 | การเคลื่อนไหวนอกลูก |
| Composure | 0.08 | ความสงบใจในการยิง |
| Strength | 0.05 | พลังกายในการแย่งลูก |
| Aggression | 0.03 | ความดุดัน |
| Vision | 0.02 | การมองเกม |
| **รวม** | **1.00** | |

**สูตรสำหรับ ST:**
```
FitScore(ST) = 0.25×Finishing + 0.20×Positioning + 0.15×(xG×20) +
               0.12×Speed + 0.10×OffTheBall + 0.08×Composure +
               0.05×Strength + 0.03×Aggression + 0.02×Vision
```

---

#### **2. Central Defensive Midfielder (CDM) - กองกลางรับ**

| Attribute | Weight | เหตุผล |
|-----------|--------|--------|
| Positioning | 0.25 | การวางตัวในการรับ |
| Aggression | 0.20 | การกดดันและตัดบอล |
| Strength | 0.18 | พลังกายในการแย่งลูก |
| PressActions | 0.15 | การกดดันคู่แข่ง |
| Composure | 0.10 | ความสงบในการส่งบอล |
| Passing | 0.07 | ความแม่นยำในการส่ง |
| Speed | 0.05 | ความเร็วในการกลับมารับ |
| **รวม** | **1.00** | |

**สูตรสำหรับ CDM:**
```
FitScore(CDM) = 0.25×Positioning + 0.20×Aggression + 0.18×Strength +
                0.15×(PressActions×5) + 0.10×Composure + 0.07×Passing +
                0.05×Speed
```

---

#### **3. Right Winger (RW) - ปีกขวา**

| Attribute | Weight | เหตุผล |
|-----------|--------|--------|
| Speed | 0.25 | ความเร็วสำคัญที่สุด |
| Finishing | 0.20 | ยิงประตูจากปีก |
| OffTheBall | 0.18 | การวิ่งเข้าช่อง |
| Positioning | 0.15 | การวางตัว |
| Vision | 0.10 | การส่งบอล |
| Passing | 0.07 | ความแม่นยำ |
| Composure | 0.05 | ความสงบ |
| **รวม** | **1.00** | |

---

## 7. การคำนวณ Ideal Profile

### ทฤษฎี:
สร้าง "นักเตะในอุดมคติ" สำหรับแต่ละตำแหน่งเพื่อใช้เปรียบเทียบ

### สูตร:

```
IdealProfile = [A₁*, A₂*, A₃*, ..., Aₙ*]

โดยที่:
- Aᵢ* = ค่า attribute ที่ i ในอุดมคติ
- สามารถกำหนดได้ 2 วิธี:
  1. ใช้ค่าสูงสุดจาก dataset
  2. กำหนดค่าตามความรู้ทางยุทธวิธี
```

### ตัวอย่าง Ideal Striker Profile:

```python
ideal_striker = {
    'Finishing': 95,        # ดีที่สุด
    'Positioning': 95,      # ดีที่สุด
    'xG': 1.0,             # สูงมาก
    'Speed': 90,           # เร็วมาก
    'OffTheBall': 90,      # ดีมาก
    'Composure': 85,       # ดี
    'Strength': 80,        # ปานกลาง-ดี
    'Aggression': 75,      # ปานกลาง
    'Vision': 70,          # พอใช้
    'Passing': 70,         # พอใช้
    'PressActions': 8      # ปานกลาง
}
```

### การใช้งาน:

```python
def create_ideal_profile(position):
    if position == "ST":
        return [95, 1.0, 95, 90, 80, 70, 70, 75, 85, 90, 8]
    elif position == "CDM":
        return [60, 0.05, 90, 85, 88, 85, 80, 92, 85, 85, 16]
    # ... other positions
```

---

## 8. Standard Score (Z-Score) - สำหรับ Cosine Similarity

### ทฤษฎี:
การทำให้ข้อมูลมี mean = 0 และ standard deviation = 1

### สูตร:

```
z = (X - μ) / σ

โดยที่:
- X = ค่าที่ต้องการ standardize
- μ = ค่าเฉลี่ย (mean) ของ attribute นั้น
- σ = ส่วนเบี่ยงเบนมาตรฐาน (standard deviation)
- z = ค่า z-score
```

### ตัวอย่างการคำนวณ:

**Finishing attribute: μ = 78, σ = 12**

```
Player A: Finishing = 92

z = (92 - 78) / 12
  = 14 / 12
  = 1.17

ความหมาย: Player A มี Finishing สูงกว่าค่าเฉลี่ย 1.17 standard deviations
```

### การใช้งานใน TacticalFitAI:

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[features])

# ผลลัพธ์: X_scaled มี mean ≈ 0, std ≈ 1
```

---

## 9. Euclidean Distance (ระยะทางยุคลิด) - Alternative to Cosine Similarity

### ทฤษฎี:
วัดระยะทางระหว่าง 2 points ใน n-dimensional space

### สูตร:

```
d(A, B) = √(Σ(Ai - Bi)²)
           i=1

โดยที่:
- A, B = vectors ของผู้เล่น 2 คน
- n = จำนวน dimensions (attributes)
- d(A, B) = ระยะทาง (0 = เหมือนกันทุกอย่าง)
```

### ตัวอย่างการคำนวณ:

```
Player A: [0.92, 0.71, 0.95]
Player B: [0.88, 0.75, 0.90]

d(A, B) = √((0.92-0.88)² + (0.71-0.75)² + (0.95-0.90)²)
        = √(0.04² + 0.04² + 0.05²)
        = √(0.0016 + 0.0016 + 0.0025)
        = √0.0057
        = 0.075

Similarity = 1 - 0.075 = 0.925 (92.5%)
```

**หมายเหตุ**: TacticalFitAI ใช้ Cosine Similarity แทนเพราะไม่ขึ้นกับ magnitude

---

## 10. สรุปสูตรทั้งหมดที่ใช้ใน TacticalFitAI

### Pipeline การคำนวณ:

```
1. Input: Player Attributes (11 attributes)
   ↓
2. Weighted Scoring:
   FitScore = Σ(wi × Ai)
   ↓
3. Normalization (สำหรับ Similarity):
   X_norm = (X - μ) / σ
   ↓
4. Cosine Similarity:
   sim(A, B) = (A · B) / (||A|| × ||B||)
   ↓
5. Alpha Blending:
   OverallScore = α × FitScore + (1-α) × Similarity
   ↓
6. Value for Money:
   VFM = OverallScore / MarketValue
   ↓
7. Ranking: Sort by OverallScore (descending)
```

---

## 11. ค่าคงที่และพารามิเตอร์

### ค่าเริ่มต้น (Default Values):

| Parameter | Value | ความหมาย |
|-----------|-------|----------|
| α (alpha) | 0.7 | น้ำหนักของ FitScore |
| Top N | 10 | จำนวนผู้เล่นที่แสดง |
| MinMax Range | [0, 100] | ช่วงของ attributes |
| xG Multiplier | 20 | แปลง xG (0-5) → (0-100) |
| PressActions Multiplier | 5 | แปลง Press (0-20) → (0-100) |

---

## 12. Error Metrics (สำหรับ Validation)

### Mean Absolute Error (MAE):

```
MAE = (1/n) × Σ|yi - ŷi|
              i=1

โดยที่:
- n = จำนวนตัวอย่าง
- yi = ค่าจริง
- ŷi = ค่าทำนาย
```

### Root Mean Square Error (RMSE):

```
RMSE = √((1/n) × Σ(yi - ŷi)²)
                i=1
```

### R² Score (Coefficient of Determination):

```
R² = 1 - (SS_res / SS_tot)

โดยที่:
- SS_res = Σ(yi - ŷi)² (residual sum of squares)
- SS_tot = Σ(yi - ȳ)² (total sum of squares)
- ȳ = ค่าเฉลี่ย
```

---

## 13. ตัวอย่างการคำนวณครบวงจร

### Input Data:

```
Player: Terem Moffi (ST)
Attributes:
- Finishing: 92
- xG: 3.53
- Positioning: 95
- Speed: 75
- Strength: 75
- Passing: 65
- Vision: 64
- Aggression: 81
- Composure: 65
- OffTheBall: 65
- PressActions: 7.6
- MarketValue: €73.8M
```

### Step 1: Weighted FitScore (α=0.7)

```
Weights (ST):
w = [0.25, 0.20, 0.15, 0.12, 0.05, 0.00, 0.02, 0.03, 0.08, 0.10, 0.00]

FitScore = 0.25×92 + 0.20×95 + 0.15×(3.53×20) + 0.12×75 + 0.05×75 +
           0.00×65 + 0.02×64 + 0.03×81 + 0.08×65 + 0.10×65 + 0.00×7.6
         = 23.0 + 19.0 + 10.6 + 9.0 + 3.8 + 0 + 1.3 + 2.4 + 5.2 + 6.5 + 0
         = 80.8
```

### Step 2: Cosine Similarity

```
Player (normalized): [0.92, 0.71, 0.95, 0.75, 0.75, 0.65, 0.64, 0.81, 0.65, 0.65, 0.38]
Ideal ST: [1.00, 0.80, 1.00, 0.90, 0.80, 0.70, 0.70, 0.75, 0.85, 0.90, 0.40]

cos(θ) = 0.89
Similarity = 89.0
```

### Step 3: Alpha Blending (α=0.7)

```
OverallScore = 0.7 × 80.8 + 0.3 × 89.0
             = 56.56 + 26.70
             = 83.26
```

### Step 4: Value for Money

```
ValueForMoney = 83.26 / 73.8
              = 1.13
```

### ผลลัพธ์สุดท้าย:

```
Player: Terem Moffi
- FitScore: 80.8 / 100
- SimilarityScore: 89.0 / 100
- OverallScore: 83.26 / 100
- MarketValue: €73.8M
- ValueForMoney: 1.13 (Fair value)
- Ranking: #4 among strikers
```

---

# สิ้นสุดเอกสารทฤษฎีและสูตร
