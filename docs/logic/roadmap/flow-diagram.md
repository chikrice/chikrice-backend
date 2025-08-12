# Roadmap Feature Logic Flow Diagram

## 1. ROADMAP CREATION FLOW

```
User Input (userDetails)
├── age, height, gender, userId
├── startWeight, targetWeight
├── activityLevel, isWeightLifting
└── goalAchievementSpeed
    ↓
VALIDATION & SAFETY CHECKS
├── User exists?
├── All required fields present?
└── All required fields present?

    ↓
ROADMAP OVERVIEW GENERATION
├── Calculate totalDays, totalMonths
├── Determine isGainWeight (target > start)
├── Calculate weightChange = |target - start|
└── Generate monthlyCalorieAdjustment array
    ↓
WEIGHT PROGRESSION CALCULATION
├── For each month (1 to totalMonths)
├── Calculate monthFactor (progress factor)
├── Calculate monthWeightChange
├── Calculate currentWeight for each month
└── Create weightProgression array
    ↓
FIRST MILESTONE CREATION
├── Calculate BMR (Basal Metabolic Rate)
├── Calculate activityMultiplier
├── Calculate baseCalories and targetCalories
├── Calculate milestone dates
├── Calculate macrosRatio (protein, carb, fat)
└── Create milestone object
    ↓
ROADMAP DOCUMENT CREATION
├── userId, overview, milestones
├── onGoingMonth: 1, onGoingDay: 1
├── activityLog: [{date: startDate, active: false}]
└── isWeightChangeOverLimit
    ↓
SAVE & LINK TO USER
├── Save roadmap to database
├── Link roadmapId to user
└── Return roadmapId
```

## 2. ROADMAP UPDATE FLOW

```
Update Request (roadmapId, updateBody)
├── userId, currentWeight, newTargetWeight
    ↓
FETCH DATA
├── Get user data (goalAchievementSpeed)
├── Get roadmap data
└── Extract current progress (onGoingMonth, onGoingDay)
    ↓
CHANGE POINT CALCULATION
├── Calculate changeIndex = onGoingMonth
├── Calculate leftDays = (month * 30) - onGoingDay
├── Calculate changePointDay = 30 - leftDays
└── Calculate changePointTargetWeight
    ↓
NEW ROADMAP OVERVIEW
├── Generate new overview from change point
├── Calculate new totalDays, totalMonths
├── Calculate new weightProgression
└── Calculate new monthlyCalorieAdjustment
    ↓
WEIGHT PROGRESSION COMBINATION
├── Combine old progression (before change)
├── Add changePointWeightProgression
├── Add new progression (after change)
└── Create updatedWeightProgression
    ↓
MILESTONE UPDATE
├── Update change point milestone
├── Recalculate calories and macros
└── Update milestone data
    ↓
SAVE UPDATED ROADMAP
└── Save roadmap with new data
```

## 3. ROADMAP RETRIEVAL FLOW

```
Get Roadmap Request (roadmapId)
    ↓
FETCH ROADMAP
├── Find roadmap by ID
├── Extract roadmap data
└── Get user data
    ↓
CURRENT MILESTONE CHECK
├── Get currentMilestone = milestones[onGoingMonth - 1]
├── Does currentMilestone exist?
└── If not, create new milestone
    ↓
MILESTONE CREATION (if needed)
├── Calculate milestone data
├── Add to milestones array
└── Update roadmap
    ↓
PLAN ASSOCIATION CHECK
├── Does currentMilestone.planId exist?
├── If not, create new plan
└── Associate plan with milestone
    ↓
RETURN ROADMAP
└── Return complete roadmap with current milestone and plan
```

## 4. DATA STRUCTURES

### Roadmap Document Structure

```
Roadmap {
  userId: ObjectId,
  overview: {
    startWeight: Number,
    currentWeight: Number,
    targetWeight: Number,
    startDate: Date,
    endDate: Date,
    totalDays: Number,
    totalMonths: Number,
    weightProgression: [WeightProgression],
    monthlyCalorieAdjustment: [Number]
  },
  milestones: [Milestone],
  onGoingMonth: Number,
  onGoingDay: Number,
  activityLog: [ActivityLog],
  isWeightChangeOverLimit: Boolean
}
```

### Milestone Structure

```
Milestone {
  month: Number,
  planId: ObjectId (optional),
  startWeight: Number,
  targetWeight: Number,
  baseCalories: Number,
  targetCalories: Number,
  startDate: Date,
  endDate: Date,
  macrosRatio: {
    pro: Number,
    carb: Number,
    fat: Number
  },
  calorieAdjustment: {
    type: 'deficit' | 'surplus',
    day: Number,
    month: Number
  },
  changePoint: {
    baseCalories: Number,
    targetCalories: Number,
    date: Date,
    newStartWeight: Number,
    newTargetWeight: Number
  }
}
```

### Weight Progression Structure

```
WeightProgression {
  month: Number,
  targetWeight: Number,
  weightChange: Number
}
```

## 5. CALCULATION FORMULAS

### BMR (Basal Metabolic Rate)

```
Male: 10 × weight + 6.25 × height - 5 × age + 5
Female: 10 × weight + 6.25 × height - 5 × age - 161
```

### Calories Calculation

```
baseCalories = BMR × activityMultiplier
targetCalories = baseCalories + monthlyCalorieAdjustment[month-1]
```

### Weight Change Calculation

```
weightChange = |targetWeight - startWeight|
totalCaloriesNeeded = weightChange × 7700 (calories per kg)
```

### Monthly Progress Factor

```
monthFactor = calcMonthProgressFactor(month, totalMonths)
monthWeightChange = weightChange × monthFactor
```

## 6. INTEGRATION POINTS

### With User System

- Roadmap linked to user via userId
- User updates trigger roadmap recalculations
- User preferences affect milestone calculations

### With Meal Planning System

- Milestones can have associated meal plans (planId)
- Calorie targets from roadmap guide meal planning
- Macro ratios from roadmap determine meal composition

### With Activity Tracking

- Activity logs track daily progress
- Activity level affects calorie calculations
- Progress updates can trigger roadmap adjustments

## 7. SAFETY MECHANISMS

### Weight Change Limits

- Maximum 12kg weight change enforced
- isWeightChangeOverLimit flag for tracking

### Validation Checks

- Required user data validation
- User existence verification
- Roadmap existence checks

### Error Handling

- Graceful handling of missing data
- Fallback to null roadmapId if data insufficient
- Console logging for debugging (with linter warnings)
