# 5.4 การจัดเตรียมข้อมูล (Data Preparation)

## 5.4.1 แหล่งข้อมูลและการรวบรวม

### แหล่งข้อมูลหลัก:

**ระบบ TacticalFitAI ใช้ข้อมูลจาก 2 แหล่งหลัก:**

1. **ข้อมูลสถิติผู้เล่น:**
   - ใช้ข้อมูล**จำลองจากการวิเคราะห์** (Simulated/Synthetic Data)
   - อ้างอิงจาก **Football Manager 2024** attributes
   - ครอบคลุม **11 attributes หลัก**:
     - `Finishing` - ความแม่นยำในการยิงประตู (0-100)
     - `xG` - Expected Goals per 90 minutes (0-5.0)
     - `Positioning` - การวางตัวในสนาม (0-100)
     - `Speed` - ความเร็ว (0-100)
     - `Strength` - พลังกาย (0-100)
     - `Passing` - ความแม่นยำในการส่งบอล (0-100)
     - `Vision` - การมองเกม (0-100)
     - `Aggression` - ความดุดัน/การกดดัน (0-100)
     - `Composure` - ความสงบใจ (0-100)
     - `OffTheBall` - การเคลื่อนไหวนอกลูกบอล (0-100)
     - `PressActions` - การกดดันคู่แข่งต่อ 90 นาที (0-20)

2. **ข้อมูลมูลค่าตลาด:**
   - `MarketValue` - มูลค่าตลาดหน่วย €Million (0-200)
   - อ้างอิงจาก **Transfermarkt** และ **Football Manager 2024**

### เหตุผลที่ใช้ข้อมูลจำลอง:

1. **ความครบถ้วน**: สามารถควบคุม attributes ทั้งหมดที่ต้องการ
2. **ความสม่ำเสมอ**: ข้อมูลมีรูปแบบเดียวกันทุกผู้เล่น ไม่มีค่าหายหาย (No Missing Values)
3. **การทดสอบ**: เหมาะสำหรับการพิสูจน์ Proof of Concept
4. **ความเป็นจริง**: Attributes ตรงกับระบบที่ใช้จริงใน FM24 Simulation

---

## 5.4.2 โครงสร้างข้อมูล (Data Schema)

### ไฟล์: `data/players.csv`

**Columns (14 คอลัมน์):**

| Column | Type | Range | Description |
|--------|------|-------|-------------|
| `Player` | String | - | ชื่อผู้เล่น |
| `Position` | String | ST, CAM, CM, CDM, CB, GK, LW, RW, LWB, RWB | ตำแหน่งหลัก |
| `Finishing` | Float | 0-100 | ความแม่นยำในการยิง |
| `xG` | Float | 0-5.0 | Expected Goals ต่อ 90 นาที |
| `Positioning` | Float | 0-100 | การวางตัว |
| `Speed` | Float | 0-100 | ความเร็ว |
| `Strength` | Float | 0-100 | พลังกาย |
| `Passing` | Float | 0-100 | ความแม่นยำการส่งบอล |
| `Vision` | Float | 0-100 | การมองเกม |
| `Aggression` | Float | 0-100 | ความดุดัน |
| `Composure` | Float | 0-100 | ความสงบใจ |
| `OffTheBall` | Float | 0-100 | การเคลื่อนไหวนอกลูก |
| `PressActions` | Float | 0-20 | การกดดันต่อ 90 นาที |
| `MarketValue` | Float | 0-200 | มูลค่าตลาด (€M) |

### ตัวอย่างข้อมูล:

```csv
Player,Position,Finishing,xG,Positioning,Speed,Strength,Passing,Vision,Aggression,Composure,OffTheBall,PressActions,MarketValue
Terem Moffi,ST,92.0,3.53,95.0,75.0,75.0,65.0,64.0,81.0,65.0,65.0,7.6,73.8
Edson Álvarez,CDM,64.0,0.05,85.0,83.0,86.0,84.0,82.0,88.0,82.0,84.0,16.2,46.2
Amadou Onana,CDM,64.0,0.04,86.0,82.0,88.0,80.0,78.0,86.0,78.0,80.0,15.5,52.3
```

---

## 5.4.3 การทำความสะอาดข้อมูล (Data Cleaning)

### ขั้นตอนการทำความสะอาด:

#### 1. **ตรวจสอบค่าหายหาย (Missing Values)**
```python
# ตรวจสอบ missing values
missing_check = df.isnull().sum()

# กรณีมี missing values
if missing_check.sum() > 0:
    # ลบแถวที่มี missing values
    df = df.dropna()
```

**ผลลัพธ์**: ข้อมูลปัจจุบัน**ไม่มี missing values**

---

#### 2. **ตรวจสอบค่าผิดปกติ (Outlier Detection)**
```python
# ตรวจสอบค่าที่อยู่นอกช่วง
for col in ['Finishing', 'Positioning', 'Speed', 'Strength', 'Passing',
            'Vision', 'Aggression', 'Composure', 'OffTheBall']:
    # ค่าควรอยู่ใน 0-100
    df[col] = df[col].clip(0, 100)

# xG ควรอยู่ใน 0-5.0
df['xG'] = df['xG'].clip(0, 5.0)

# PressActions ควรอยู่ใน 0-20
df['PressActions'] = df['PressActions'].clip(0, 20)

# MarketValue ควรเป็นบวก
df['MarketValue'] = df['MarketValue'].clip(0, None)
```

---

#### 3. **ตรวจสอบตำแหน่ง (Position Validation)**
```python
# ตำแหน่งที่รองรับ
valid_positions = ['ST', 'CAM', 'CM', 'CDM', 'CB', 'GK', 'LW', 'RW', 'LWB', 'RWB']

# กรองเฉพาะตำแหน่งที่ถูกต้อง
df = df[df['Position'].isin(valid_positions)]
```

---

#### 4. **การจัดการข้อมูลซ้ำ (Duplicate Handling)**
```python
# ตรวจสอบผู้เล่นซ้ำ
duplicates = df.duplicated(subset=['Player'], keep='first')

# ลบข้อมูลซ้ำ
df = df[~duplicates]
```

---

## 5.4.4 การสร้างฟีเจอร์ (Feature Engineering)

### ระบบ TacticalFitAI ใช้ 2 แนวทาง:

#### **แนวทางที่ 1: Weighted Attribute Scoring (หลัก)**

**ใช้ attributes เดิมทั้ง 11 ตัว** กับ **position-specific weights**

**สูตร FitScore:**
```
FitScore = Σ (Attribute_i × Weight_i)

โดยที่:
- Attribute_i = ค่าคุณสมบัติที่ i (normalized 0-100)
- Weight_i = น้ำหนักของคุณสมบัติที่ i (0-1)
- Σ Weight_i = 1.0
```

**ตัวอย่าง Position-Specific Weights (ST):**
```python
weights_ST = {
    'Finishing': 0.25,      # 25%
    'Positioning': 0.20,    # 20%
    'xG': 0.15,            # 15%
    'Speed': 0.12,         # 12%
    'OffTheBall': 0.10,    # 10%
    'Composure': 0.08,     # 8%
    'Strength': 0.05,      # 5%
    'Aggression': 0.03,    # 3%
    'Vision': 0.02,        # 2%
    'Passing': 0.0,        # 0%
    'PressActions': 0.0    # 0%
}
```

---

#### **แนวทางที่ 2: Composite Features (เสริม)**

**สร้างฟีเจอร์รวม (Composite Features)** สำหรับการวิเคราะห์เชิงลึก:

##### 1. **GoalThreat (ภัยคุกคามประตู)**
```python
GoalThreat = (Finishing × 0.4) + (Positioning × 0.35) + (xG × 20 × 0.25)

# xG × 20 เพื่อ normalize จาก 0-5.0 → 0-100
```

**ความหมาย**: ความสามารถในการยิงประตูโดยรวม

**ใช้กับ**: ST, CAM, LW, RW

---

##### 2. **Physical (ความสามารถทางกาย)**
```python
Physical = (Speed × 0.5) + (Strength × 0.5)
```

**ความหมาย**: พลังกายและความเร็วรวม

**ใช้กับ**: ST, CDM, CB, LWB, RWB

---

##### 3. **Technical (ทักษะเทคนิค)**
```python
Technical = (Passing × 0.35) + (Vision × 0.35) + (Composure × 0.30)
```

**ความหมาย**: ความสามารถในการเล่นบอลและการมองเกม

**ใช้กับ**: CAM, CM, CDM, CB

---

##### 4. **WorkRate (อัตราการทำงาน)**
```python
WorkRate = (PressActions × 5 × 0.4) + (Aggression × 0.35) + (OffTheBall × 0.25)

# PressActions × 5 เพื่อ normalize จาก 0-20 → 0-100
```

**ความหมาย**: ความขยันและการกดดันคู่แข่ง

**ใช้กับ**: CDM, CM, ST, LWB, RWB

---

### **สรุปการใช้งานทั้ง 2 แนวทาง:**

| แนวทาง | การใช้งาน | ข้อดี |
|--------|----------|-------|
| **Weighted Attributes** | คำนวณ FitScore หลัก | ปรับแต่งได้ละเอียด ตรงตามตำแหน่ง |
| **Composite Features** | การวิเคราะห์เพิ่มเติม, Data Visualization | เข้าใจง่าย สื่อสารได้ชัดเจน |

---

## 5.4.5 การ Normalize ข้อมูล (Data Normalization)

### MinMax Normalization สำหรับ Cosine Similarity:

```python
from sklearn.preprocessing import MinMaxScaler

# Attributes ที่ต้อง normalize
features = ['Finishing', 'xG', 'Positioning', 'Speed', 'Strength',
            'Passing', 'Vision', 'Aggression', 'Composure',
            'OffTheBall', 'PressActions']

# MinMax Scaler (0-1)
scaler = MinMaxScaler()
df[features] = scaler.fit_transform(df[features])
```

**วัตถุประสงค์**: ทำให้ attributes ทุกตัวอยู่ในช่วง 0-1 สำหรับการคำนวณ Cosine Similarity

---

## 5.4.6 สรุปขั้นตอน Data Pipeline

```
1. Load CSV
   ↓
2. Data Cleaning
   - ตรวจสอบ Missing Values
   - ตรวจสอบ Outliers
   - Validate Positions
   - ลบข้อมูลซ้ำ
   ↓
3. Feature Engineering (Optional)
   - GoalThreat
   - Physical
   - Technical
   - WorkRate
   ↓
4. Data Normalization (สำหรับ Cosine Similarity)
   - MinMax Scaling (0-1)
   ↓
5. Ready for Analysis
   - Weighted Scoring
   - Cosine Similarity
   - Alpha Blending
```

---

## 5.4.7 สถิติข้อมูลที่ใช้

### ข้อมูลผู้เล่นในระบบ:

| Position | จำนวนผู้เล่น |
|----------|------------|
| ST | 30 คน |
| CAM | 20 คน |
| CM | 100 คน |
| CDM | 51 คน |
| CB | 20 คน |
| GK | 20 คน |
| LW | 20 คน |
| RW | 20 คน |
| LWB | 20 คน |
| RWB | 20 คน |
| **รวม** | **321 คน** |

---

## 5.4.8 Data Quality Assurance

### การตรวจสอบคุณภาพข้อมูล:

1. ✅ **Completeness**: ไม่มี missing values
2. ✅ **Accuracy**: ค่าอยู่ในช่วงที่กำหนด (0-100, 0-5.0, etc.)
3. ✅ **Consistency**: รูปแบบข้อมูลสม่ำเสมอ
4. ✅ **Uniqueness**: ไม่มีผู้เล่นซ้ำ
5. ✅ **Validity**: ตำแหน่งถูกต้องตามที่กำหนด

---

# สิ้นสุดส่วน 5.4 การจัดเตรียมข้อมูล
