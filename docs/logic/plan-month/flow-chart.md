# Plan Month Creation Flow Chart

This flow chart illustrates the complete process of creating a monthly meal plan.

```mermaid
flowchart TD
    A[Start: createPlan] --> B[Fetch Roadmap by roadmapId]
    B --> C{Roadmap Found?}
    C -->|No| D[Throw Error: Roadmap not found]
    C -->|Yes| E[Extract milestone data]

    E --> F[Get milestone: onGoingMonth - 1]
    F --> G[Extract: startDate, endDate, targetCalories, macrosRatio]

    G --> H[Step 1: Calculate Plan Duration]
    H --> I[calcPlanDuration]
    I --> J[Calculate totalDays = differenceInCalendarDays]
    J --> K[Calculate totalWeeks = Math.ceil totalDays / 7]

    K --> L[Step 2: Calculate Weeks Data]
    L --> M[calcWeeksData]
    M --> N[Initialize weeksData array]
    N --> O[Loop: week = 1 to totalWeeks]

    O --> P[calcWeekData for current week]
    P --> Q[Initialize weekData object]
    Q --> R[Set weekNumber, startDate, endDate]

    R --> S[Loop: day = 0 to 6 AND totalDays > 0]
    S --> T[calcDayData for current day]

    T --> U[calcMealsAndSnacksCount]
    U --> V{Calories <= 1500?}
    V -->|Yes| W[mealsCount=3, snacksCount=1]
    V -->|No| X{Calories <= 2500?}
    X -->|Yes| Y[mealsCount=3, snacksCount=2]
    X -->|No| Z{Calories <= 3000?}
    Z -->|Yes| AA[mealsCount=4, snacksCount=2]
    Z -->|No| BB{Calories <= 3500?}
    BB -->|Yes| CC[mealsCount=4, snacksCount=3]
    BB -->|No| DD[mealsCount=5, snacksCount=3]

    W --> EE[Create planDay object]
    Y --> EE
    AA --> EE
    CC --> EE
    DD --> EE

    EE --> FF[Call planDayService.createPlan]
    FF --> GG[Save planDay to database]
    GG --> HH[Return planDay with id, name, date, number]

    HH --> II[Add day to weekData.days array]
    II --> JJ{More days in week?}
    JJ -->|Yes| S
    JJ -->|No| KK[Add weekData to weeksData array]

    KK --> LL{More weeks?}
    LL -->|Yes| O
    LL -->|No| MM[Step 3: Combine Data]

    MM --> NN[Create plan object]
    NN --> OO[Set: userId, roadmapId, milestoneId, totalDays, totalWeeks, startDate, endDate, data]

    OO --> PP[Create PlanMonth in database]
    PP --> QQ[Update Roadmap with planId]
    QQ --> RR[Return created plan]
    RR --> SS[End]

    D --> SS

```

## Key Components

### 1. Plan Duration Calculation

- Calculates total days between start and end dates
- Determines total weeks needed (rounded up)

### 2. Weeks Data Generation

- Creates week templates for the entire plan duration
- Each week contains 7 days (or remaining days for the last week)

### 3. Day Data Creation

- For each day, calculates meals and snacks count based on calories
- Creates individual PlanDay documents in the database
- Returns day metadata (id, name, date, number)

### 4. Data Combination

- Combines all calculated data into a PlanMonth object
- Saves the plan to the database
- Updates the roadmap with the new plan ID

## Meal/Snack Count Logic

| Calories Range | Meals Count | Snacks Count |
| -------------- | ----------- | ------------ |
| ≤ 1500         | 3           | 1            |
| 1501-2500      | 3           | 2            |
| 2501-3000      | 4           | 2            |
| 3001-3500      | 4           | 3            |
| > 3500         | 5           | 3            |
