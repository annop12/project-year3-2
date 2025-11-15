# รายการสูตรทั้งหมดที่ใช้ใน TacticalFitAI (ครบถ้วน)

## สารบัญสูตร (25+ สูตร)

### A. Core Scoring Algorithms (5 สูตร)
1. Weighted FitScore
2. Cosine Similarity
3. Alpha Blending
4. Value for Money
5. Composite Features

### B. Normalization & Scaling (4 สูตร)
6. MinMax Normalization
7. StandardScaler (Z-Score)
8. Feature Scaling for xG
9. Feature Scaling for PressActions

### C. Statistical Measures (6 สูตร)
10. Mean (Average)
11. Standard Deviation
12. Variance
13. Percentile Ranking
14. Correlation Coefficient
15. Covariance

### D. Distance & Similarity Metrics (4 สูตร)
16. Euclidean Distance
17. Manhattan Distance
18. Dot Product
19. Vector Magnitude (Norm)

### E. Validation Metrics (5 สูตร)
20. Mean Absolute Error (MAE)
21. Root Mean Square Error (RMSE)
22. R² Score
23. Accuracy Rate
24. Precision & Recall

### F. Advanced Calculations (6 สูตร)
25. Player Synergy Score
26. Team Balance Score
27. Position Coverage Score
28. Budget Efficiency Ratio
29. Expected Performance Score
30. Transfer ROI Calculation

---

## A. Core Scoring Algorithms

### 1. Weighted FitScore (การให้คะแนนแบบถ่วงน้ำหนัก)

```
         n
FitScore = Σ (wi × Ai)
        i=1

โดยที่:
- n = 11 (จำนวน attributes)
- wi = น้ำหนักของ attribute i (0 ≤ wi ≤ 1, Σwi = 1)
- Ai = ค่าของ attribute i (normalized 0-100)

ข้อจำกัด (Constraints):
  n
  Σ wi = 1
 i=1

0 ≤ Ai ≤ 100 สำหรับทุก i
```

**ตัวอย่างสำหรับ ST:**
```
FitScore(ST) = 0.25×Finishing + 0.20×Positioning + 0.15×(xG×20) +
               0.12×Speed + 0.10×OffTheBall + 0.08×Composure +
               0.05×Strength + 0.03×Aggression + 0.02×Vision +
               0.00×Passing + 0.00×PressActions
```

---

### 2. Cosine Similarity (ความคล้ายคลึงเชิงมุม)

```
                A · B
cos(θ) = ─────────────────
         ||A|| × ||B||

              n
             Σ (Ai × Bi)
            i=1
       = ─────────────────────
         √(Σ Ai²) × √(Σ Bi²)

โดยที่:
- A = [A1, A2, ..., An] = player vector (normalized)
- B = [B1, B2, ..., Bn] = ideal profile vector (normalized)
- A · B = dot product
- ||A|| = √(Σ Ai²) = magnitude ของ A
- ||B|| = √(Σ Bi²) = magnitude ของ B
- -1 ≤ cos(θ) ≤ 1 (ในระบบใช้ 0 ≤ cos(θ) ≤ 1)

SimilarityScore = cos(θ) × 100
```

**ขั้นตอนการคำนวณ:**

```
1. คำนวณ Dot Product:
        n
   A·B = Σ (Ai × Bi)
       i=1

2. คำนวณ Magnitude ของ A:
             ___________
            │  n
   ||A|| = │  Σ Ai²
          ╲╱  i=1

3. คำนวณ Magnitude ของ B:
             ___________
            │  n
   ||B|| = │  Σ Bi²
          ╲╱  i=1

4. คำนวณ Cosine:
        A·B
   cos = ─────────
        ||A||×||B||

5. แปลงเป็นเปอร์เซ็นต์:
   SimilarityScore = cos × 100
```

---

### 3. Alpha Blending (การผสมคะแนน)

```
OverallScore = α × FitScore + (1-α) × SimilarityScore

โดยที่:
- 0 ≤ α ≤ 1 (default: α = 0.7)
- FitScore ∈ [0, 100]
- SimilarityScore ∈ [0, 100]
- OverallScore ∈ [0, 100]

เงื่อนไข:
α + (1-α) = 1 (sum to 1)
```

**สูตรทั่วไป (Generalized):**
```
         k
Score = Σ (βi × Scorei)
       i=1

โดยที่:
- k = จำนวน score components
- βi = น้ำหนักของ component i
- Σβi = 1
```

---

### 4. Value for Money (คุ้มค่าเงิน)

```
                OverallScore
ValueForMoney = ────────────
                MarketValue

โดยที่:
- OverallScore ∈ [0, 100]
- MarketValue ∈ (0, ∞) (หน่วย: €Million)
- ValueForMoney = คุณภาพต่อราคา (score/€M)

เงื่อนไข:
MarketValue > 0 (ต้องไม่เท่ากับ 0)
```

**สูตรย่อย - Value Rating:**
```
           ⎧ "Excellent"     if VFM > 2.5
           │ "Good"          if 1.5 ≤ VFM ≤ 2.5
ValueRate =│ "Fair"          if 1.0 ≤ VFM < 1.5
           │ "Overpriced"    if 0.5 ≤ VFM < 1.0
           ⎩ "Very Overpriced" if VFM < 0.5
```

---

### 5. Composite Features (ฟีเจอร์รวม)

#### 5.1 GoalThreat (ภัยคุกคามประตู)
```
GoalThreat = w1×Finishing + w2×Positioning + w3×(xG×20)

โดยที่:
- w1 = 0.40 (40% for Finishing)
- w2 = 0.35 (35% for Positioning)
- w3 = 0.25 (25% for xG)
- xG normalized: xG × 20 (0-5 → 0-100)
- GoalThreat ∈ [0, 100]
```

#### 5.2 Physical (ความสามารถทางกาย)
```
Physical = 0.5×Speed + 0.5×Strength

โดยที่:
- Speed ∈ [0, 100]
- Strength ∈ [0, 100]
- Physical ∈ [0, 100]
```

#### 5.3 Technical (ทักษะเทคนิค)
```
Technical = 0.35×Passing + 0.35×Vision + 0.30×Composure

โดยที่:
- Passing, Vision, Composure ∈ [0, 100]
- Technical ∈ [0, 100]
```

#### 5.4 WorkRate (อัตราการทำงาน)
```
WorkRate = 0.40×(PressActions×5) + 0.35×Aggression + 0.25×OffTheBall

โดยที่:
- PressActions normalized: ×5 (0-20 → 0-100)
- Aggression, OffTheBall ∈ [0, 100]
- WorkRate ∈ [0, 100]
```

---

## B. Normalization & Scaling

### 6. MinMax Normalization

```
            X - Xmin
X_norm = ─────────────
         Xmax - Xmin

โดยที่:
- X = ค่าที่ต้องการ normalize
- Xmin = ค่าต่ำสุดใน dataset
- Xmax = ค่าสูงสุดใน dataset
- X_norm ∈ [0, 1]

สำหรับช่วง [a, b]:
X_scaled = a + (b-a) × X_norm
```

**ตัวอย่าง:**
```
Finishing: [60, 65, 70, ..., 95]
Xmin = 60, Xmax = 95

For X = 85:
X_norm = (85-60)/(95-60) = 25/35 = 0.714
```

---

### 7. StandardScaler (Z-Score Normalization)

```
       X - μ
z = ─────────
        σ

โดยที่:
- X = ค่าที่ต้องการ standardize
- μ = mean (ค่าเฉลี่ย) ของ attribute
- σ = standard deviation (ส่วนเบี่ยงเบนมาตรฐาน)
- z = z-score (normalized value)

Properties:
- E[z] = 0 (mean = 0)
- Var[z] = 1 (variance = 1)
```

**สูตรย่อย - Mean:**
```
    1  n
μ = ─  Σ Xi
    n i=1
```

**สูตรย่อย - Standard Deviation:**
```
     _______________
    │  1   n
σ = │  ─   Σ (Xi - μ)²
  ╲╱  n  i=1
```

---

### 8. Feature Scaling for xG

```
xG_scaled = xG × 20

โดยที่:
- xG ∈ [0, 5.0] (original range)
- xG_scaled ∈ [0, 100] (scaled range)
- Scaling factor = 20

เหตุผล:
xG max ≈ 1.0 for elite strikers
xG × 20 → [0, 20] typical
xG × 20 → up to 100 for exceptional cases
```

---

### 9. Feature Scaling for PressActions

```
Press_scaled = PressActions × 5

โดยที่:
- PressActions ∈ [0, 20] (original range)
- Press_scaled ∈ [0, 100] (scaled range)
- Scaling factor = 5

เหตุผล:
Typical pressing: 8-12 actions/90min
Elite pressing: 15-18 actions/90min
20 × 5 = 100 (maximum scale)
```

---

## C. Statistical Measures

### 10. Mean (ค่าเฉลี่ย)

```
    1  n
μ = ─  Σ Xi
    n i=1

โดยที่:
- n = จำนวนข้อมูล
- Xi = ค่าของข้อมูลตัวที่ i
- μ = ค่าเฉลี่ย
```

**ใช้ใน:**
- คำนวณ average FitScore
- คำนวณ average MarketValue
- StandardScaler normalization

---

### 11. Standard Deviation (ส่วนเบี่ยงเบนมาตรฐาน)

```
     _______________
    │  1   n
σ = │  ─   Σ (Xi - μ)²
  ╲╱  n  i=1

หรือ

     ______________
    │  1   n           n
σ = │  ─   Σ Xi² - (Σ Xi)²/n
  ╲╱  n  i=1        i=1
```

**ใช้ใน:**
- StandardScaler normalization
- วัดความกระจายของคะแนน
- Outlier detection

---

### 12. Variance (ความแปรปรวน)

```
       1  n
σ² = ─  Σ (Xi - μ)²
      n i=1
```

---

### 13. Percentile Ranking (อันดับเปอร์เซ็นไทล์)

```
              Number of values below X
Percentile = ──────────────────────── × 100
              Total number of values

โดยที่:
- X = ค่าที่ต้องการหา percentile
- Percentile ∈ [0, 100]
```

**ตัวอย่าง:**
```
Scores: [65, 70, 75, 80, 85, 90, 95]
Player X score: 85

Values below 85: 5 players
Percentile = (5/7) × 100 = 71.4th percentile
```

---

### 14. Correlation Coefficient (สัมประสิทธิ์สหสัมพันธ์)

```
              Σ(Xi - X̄)(Yi - Ȳ)
r = ────────────────────────────────
    √(Σ(Xi - X̄)²) × √(Σ(Yi - Ȳ)²)

โดยที่:
- r ∈ [-1, 1]
- r = 1: perfect positive correlation
- r = 0: no correlation
- r = -1: perfect negative correlation
```

**ใช้ใน:**
- วิเคราะห์ความสัมพันธ์ระหว่าง attributes
- เช่น: Finishing vs Goals scored

---

### 15. Covariance (ความแปรปรวนร่วม)

```
              1   n
Cov(X,Y) = ─  Σ (Xi - X̄)(Yi - Ȳ)
           n  i=1
```

---

## D. Distance & Similarity Metrics

### 16. Euclidean Distance (ระยะทางยุคลิด)

```
            ____________
           │  n
d(A, B) = │  Σ (Ai - Bi)²
        ╲╱  i=1

โดยที่:
- A, B = vectors ของผู้เล่น 2 คน
- n = จำนวน dimensions (attributes)
- d(A, B) ∈ [0, ∞)
- d(A, B) = 0 เมื่อ A = B
```

**แปลงเป็น Similarity:**
```
                    1
Similarity = ─────────────
             1 + d(A, B)

หรือ

Similarity = e^(-d(A, B))
```

---

### 17. Manhattan Distance (ระยะทาง Manhattan)

```
         n
d_M = Σ |Ai - Bi|
       i=1

โดยที่:
- d_M = Manhattan distance
- |·| = absolute value
```

---

### 18. Dot Product (ผลคูณจุด)

```
      n
A·B = Σ (Ai × Bi)
     i=1

โดยที่:
- A·B = scalar value
- ใช้ในการคำนวณ cosine similarity
```

**Properties:**
```
A·B = ||A|| × ||B|| × cos(θ)

โดยที่:
- θ = มุมระหว่าง vector A และ B
```

---

### 19. Vector Magnitude (Norm) (ความยาวเวกเตอร์)

```
        ___________
       │  n
||A|| =│  Σ Ai²
     ╲╱  i=1

โดยที่:
- ||A|| = L2 norm (Euclidean norm)
- ||A|| ∈ [0, ∞)
```

**L1 Norm (Manhattan Norm):**
```
       n
||A||₁ = Σ |Ai|
       i=1
```

---

## E. Validation Metrics

### 20. Mean Absolute Error (MAE)

```
       1  n
MAE = ─  Σ |yi - ŷi|
      n i=1

โดยที่:
- yi = ค่าจริง (actual)
- ŷi = ค่าทำนาย (predicted)
- n = จำนวนตัวอย่าง
```

**ใช้ใน:**
- Validate FitScore predictions
- เปรียบเทียบ predicted goals vs actual goals

---

### 21. Root Mean Square Error (RMSE)

```
        _______________
       │  1  n
RMSE =│  ─  Σ (yi - ŷi)²
     ╲╱  n i=1
```

**Properties:**
- RMSE ≥ MAE เสมอ
- ให้ penalty สูงกับ outliers

---

### 22. R² Score (Coefficient of Determination)

```
       SS_res
R² = 1 - ──────
        SS_tot

โดยที่:
    n
SS_res = Σ (yi - ŷi)²  (residual sum of squares)
       i=1

    n
SS_tot = Σ (yi - ȳ)²   (total sum of squares)
       i=1

ȳ = ค่าเฉลี่ยของ y

R² ∈ (-∞, 1]
- R² = 1: perfect fit
- R² = 0: no better than mean
- R² < 0: worse than mean
```

---

### 23. Accuracy Rate (อัตราความแม่นยำ)

```
              Number of correct predictions
Accuracy = ──────────────────────────────── × 100%
              Total number of predictions

โดยที่:
- Accuracy ∈ [0, 100]%
```

**ใช้ใน:**
- Validate TacticalFitAI predictions
- เช่น: Salah vs Brandt case (100% accurate)

---

### 24. Precision & Recall

**Precision:**
```
              True Positives
Precision = ─────────────────────────
            True Positives + False Positives
```

**Recall:**
```
           True Positives
Recall = ─────────────────────────
         True Positives + False Negatives
```

**F1 Score:**
```
       2 × Precision × Recall
F1 = ───────────────────────
      Precision + Recall
```

---

## F. Advanced Calculations

### 25. Player Synergy Score (คะแนนการเข้ากัน)

```
                  k
Synergy(A, B) = Σ wi × similarity(Ai, Bi)
               i=1

โดยที่:
- A, B = ผู้เล่น 2 คน
- k = จำนวน attributes ที่พิจารณา
- wi = น้ำหนักของ attribute i
- similarity(Ai, Bi) = 1 - |Ai - Bi| / 100
```

**ตัวอย่าง:**
```
Player A: Finishing = 90, Speed = 85
Player B: Finishing = 85, Speed = 90

Synergy_Finishing = 1 - |90-85|/100 = 0.95
Synergy_Speed = 1 - |85-90|/100 = 0.95

Overall Synergy = 0.5×0.95 + 0.5×0.95 = 0.95 (95%)
```

---

### 26. Team Balance Score (คะแนนความสมดุลของทีม)

```
                     1   n
TeamBalance = 1 - ───  Σ |Pi - P̄|
                   n  i=1

โดยที่:
- Pi = จำนวนผู้เล่นในตำแหน่ง i
- P̄ = จำนวนผู้เล่นเฉลี่ยต่อตำแหน่ง
- n = จำนวนตำแหน่ง
- TeamBalance ∈ [0, 1]
```

---

### 27. Position Coverage Score (คะแนนครอบคลุมตำแหน่ง)

```
              Number of positions filled
Coverage = ──────────────────────────── × 100%
              Total positions needed
```

**ตัวอย่างสำหรับ 3-4-2-1:**
```
Positions needed: GK(1), CB(3), CDM(2), CAM(2), ST(1) = 9
Filled: 8/9
Coverage = (8/9) × 100 = 88.9%
```

---

### 28. Budget Efficiency Ratio (อัตราประสิทธิภาพงบประมาณ)

```
                   Σ(OverallScore_i)
Efficiency = ───────────────────────
                  Total Budget

โดยที่:
- OverallScore_i = คะแนนของผู้เล่น i
- Total Budget = งบประมาณรวม (€M)
- Efficiency = คุณภาพต่อเงินที่ใช้
```

**ตัวอย่าง:**
```
Budget: €170M
Players bought:
- Moffi: 87.3, €37M
- Scamacca: 85.0, €27.5M
- Álvarez: 86.8, €46.2M
- Onana: 86.9, €52.3M

Total Score = 87.3 + 85.0 + 86.8 + 86.9 = 346.0
Efficiency = 346.0 / 163.0 = 2.12
```

---

### 29. Expected Performance Score (คะแนนผลงานที่คาดหวัง)

```
ExpectedPerf = β₀ + β₁×FitScore + β₂×Similarity + β₃×Age + β₄×Experience

โดยที่:
- β₀, β₁, β₂, β₃, β₄ = regression coefficients
- Age = อายุผู้เล่น
- Experience = จำนวนปีที่เล่นมืออาชีพ
```

**Simplified version (ใช้ในระบบ):**
```
ExpectedGoals = (OverallScore / 100) × xG × 38

โดยที่:
- OverallScore = คะแนนรวม (0-100)
- xG = Expected Goals per 90 minutes
- 38 = จำนวนเกมในฤดูกาล
```

---

### 30. Transfer ROI Calculation (ผลตอบแทนจากการซื้อขาย)

```
           (Value_after - Value_before) - Transfer_fee
ROI = ───────────────────────────────────────────── × 100%
                    Transfer_fee

โดยที่:
- Value_after = มูลค่าหลังซื้อมา
- Value_before = ราคาที่ซื้อ (transfer fee)
- ROI ∈ (-100%, ∞)
```

**ตัวอย่าง (Salah case):**
```
Transfer fee: €42M
Value after 1 year: €200M

ROI = (200 - 42 - 42) / 42 × 100%
    = 116 / 42 × 100%
    = 276% (หรือ +376% จากมูลค่าเริ่มต้น)
```

---

## สรุปสูตรทั้งหมดตามหมวดหมู่

### Core Algorithms (5 สูตร):
1. ✅ Weighted FitScore
2. ✅ Cosine Similarity
3. ✅ Alpha Blending
4. ✅ Value for Money
5. ✅ Composite Features (4 sub-formulas)

### Normalization (4 สูตร):
6. ✅ MinMax Normalization
7. ✅ StandardScaler (Z-Score)
8. ✅ xG Scaling
9. ✅ PressActions Scaling

### Statistics (6 สูตร):
10. ✅ Mean
11. ✅ Standard Deviation
12. ✅ Variance
13. ✅ Percentile Ranking
14. ✅ Correlation Coefficient
15. ✅ Covariance

### Distance & Similarity (4 สูตร):
16. ✅ Euclidean Distance
17. ✅ Manhattan Distance
18. ✅ Dot Product
19. ✅ Vector Magnitude

### Validation (5 สูตร):
20. ✅ MAE
21. ✅ RMSE
22. ✅ R² Score
23. ✅ Accuracy Rate
24. ✅ Precision & Recall

### Advanced (6 สูตร):
25. ✅ Player Synergy
26. ✅ Team Balance
27. ✅ Position Coverage
28. ✅ Budget Efficiency
29. ✅ Expected Performance
30. ✅ Transfer ROI

**รวม: 30+ สูตรที่ใช้ในระบบ TacticalFitAI**

---

# สิ้นสุดรายการสูตรครบถ้วน
