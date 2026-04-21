# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: activities.spec.ts >> pause and resume activity
- Location: tests/activities.spec.ts:48:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="activity-card"]').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e6]:
      - button [ref=e7]:
        - img [ref=e8]
      - generic [ref=e10]:
        - img [ref=e12]
        - heading "Wellness Activities" [level=1] [ref=e14]
    - generic [ref=e16]:
      - generic [ref=e18]:
        - heading "How are you feeling?" [level=2] [ref=e20]
        - generic [ref=e21]:
          - button "Anxious Anxious" [ref=e22]:
            - img "Anxious" [ref=e24]
            - generic [ref=e26]:
              - img [ref=e27]
              - generic [ref=e29]: Anxious
          - button "Stressed Stressed" [ref=e30]:
            - img "Stressed" [ref=e32]
            - generic [ref=e34]:
              - img [ref=e35]
              - generic [ref=e37]: Stressed
          - button "Sad Sad" [ref=e38]:
            - img "Sad" [ref=e40]
            - generic [ref=e42]:
              - img [ref=e43]
              - generic [ref=e46]: Sad
          - button "Tired Tired" [ref=e47]:
            - img "Tired" [ref=e49]
            - generic [ref=e51]:
              - img [ref=e52]
              - generic [ref=e54]: Tired
          - button "Lonely Lonely" [ref=e55]:
            - img "Lonely" [ref=e57]
            - generic [ref=e59]:
              - img [ref=e60]
              - generic [ref=e62]: Lonely
          - button "Calm Calm" [ref=e63]:
            - img "Calm" [ref=e65]
            - generic [ref=e67]:
              - img [ref=e68]
              - generic [ref=e74]: Calm
          - button "Happy Happy" [ref=e75]:
            - img "Happy" [ref=e77]
            - generic [ref=e79]:
              - img [ref=e80]
              - generic [ref=e83]: Happy
          - button "Overwhelmed Overwhelmed" [ref=e84]:
            - img "Overwhelmed" [ref=e86]
            - generic [ref=e88]:
              - img [ref=e89]
              - generic [ref=e91]: Overwhelmed
        - generic [ref=e92]:
          - generic [ref=e93]: Category
          - generic [ref=e94]:
            - button "All Activities" [ref=e95]:
              - img [ref=e96]
              - generic [ref=e98]: All Activities
            - button "Mindfulness" [ref=e99]:
              - img [ref=e100]
              - generic [ref=e104]: Mindfulness
            - button "Physical" [ref=e105]:
              - img [ref=e106]
              - generic [ref=e112]: Physical
            - button "Creative" [ref=e113]:
              - img [ref=e114]
              - generic [ref=e119]: Creative
            - button "Social" [ref=e120]:
              - img [ref=e121]
              - generic [ref=e126]: Social
            - button "Relaxation" [ref=e127]:
              - img [ref=e128]
              - generic [ref=e130]: Relaxation
        - generic [ref=e131]:
          - generic [ref=e132]: Duration
          - combobox [ref=e133]:
            - option "Any Duration" [selected]
            - option "5-10 min"
            - option "15-20 min"
            - option "30+ min"
        - generic [ref=e134]:
          - generic [ref=e135]: Search
          - generic [ref=e136]:
            - img [ref=e137]
            - textbox "Search activities..." [ref=e140]
        - generic [ref=e142] [cursor=pointer]:
          - generic [ref=e143]: Quick Start Mode
          - button "Quick Start Mode" [ref=e144]
      - generic [ref=e147]:
        - generic [ref=e148] [cursor=pointer]:
          - generic [ref=e149]:
            - img "5-Minute Breathing Exercise" [ref=e150]
            - generic [ref=e152]: mindfulness
          - generic [ref=e153]:
            - heading "5-Minute Breathing Exercise" [level=3] [ref=e154]
            - paragraph [ref=e155]: Simple breathing technique to calm your mind and reduce anxiety
            - generic [ref=e156]:
              - generic [ref=e157]: Anxious
              - generic [ref=e158]: Stressed
              - generic [ref=e159]: Overwhelmed
            - generic [ref=e160]:
              - generic [ref=e161]:
                - img [ref=e162]
                - text: 5 min
              - generic [ref=e165]:
                - img [ref=e166]
                - generic [ref=e168]: Quick Start
        - generic [ref=e169] [cursor=pointer]:
          - generic [ref=e170]:
            - img "Gratitude Journaling" [ref=e171]
            - generic [ref=e173]: creative
          - generic [ref=e174]:
            - heading "Gratitude Journaling" [level=3] [ref=e175]
            - paragraph [ref=e176]: Write down three things you're grateful for today
            - generic [ref=e177]:
              - generic [ref=e178]: Sad
              - generic [ref=e179]: Lonely
            - generic [ref=e180]:
              - generic [ref=e181]:
                - img [ref=e182]
                - text: 10 min
              - generic [ref=e185]:
                - img [ref=e186]
                - generic [ref=e188]: Quick Start
        - generic [ref=e189] [cursor=pointer]:
          - generic [ref=e190]:
            - img "Quick Stretch Break" [ref=e191]
            - generic [ref=e193]: physical
          - generic [ref=e194]:
            - heading "Quick Stretch Break" [level=3] [ref=e195]
            - paragraph [ref=e196]: Simple stretches to release tension and boost energy
            - generic [ref=e197]:
              - generic [ref=e198]: Tired
              - generic [ref=e199]: Stressed
            - generic [ref=e200]:
              - generic [ref=e201]:
                - img [ref=e202]
                - text: 7 min
              - generic [ref=e205]:
                - img [ref=e206]
                - generic [ref=e208]: Quick Start
        - generic [ref=e209] [cursor=pointer]:
          - generic [ref=e210]:
            - img "Push-up Challenge" [ref=e211]
            - generic [ref=e213]: physical
          - generic [ref=e214]:
            - heading "Push-up Challenge" [level=3] [ref=e215]
            - paragraph [ref=e216]: Build strength with guided push-ups
            - generic [ref=e218]: Stressed
            - generic [ref=e219]:
              - generic [ref=e220]:
                - img [ref=e221]
                - text: 5 min
              - generic [ref=e224]:
                - img [ref=e225]
                - generic [ref=e227]: Quick Start
        - generic [ref=e228] [cursor=pointer]:
          - generic [ref=e229]:
            - img "Call a Friend" [ref=e230]
            - generic [ref=e232]: social
          - generic [ref=e233]:
            - heading "Call a Friend" [level=3] [ref=e234]
            - paragraph [ref=e235]: Connect with someone you trust
            - generic [ref=e236]:
              - generic [ref=e237]: Lonely
              - generic [ref=e238]: Sad
            - generic [ref=e239]:
              - generic [ref=e240]:
                - img [ref=e241]
                - text: 15 min
              - generic [ref=e244]:
                - img [ref=e245]
                - generic [ref=e247]: Quick Start
        - generic [ref=e248] [cursor=pointer]:
          - generic [ref=e249]:
            - img "Creative Drawing" [ref=e250]
            - generic [ref=e252]: creative
          - generic [ref=e253]:
            - heading "Creative Drawing" [level=3] [ref=e254]
            - paragraph [ref=e255]: Express your feelings through art
            - generic [ref=e257]: Calm
            - generic [ref=e258]:
              - generic [ref=e259]:
                - img [ref=e260]
                - text: 20 min
              - generic [ref=e263]:
                - img [ref=e264]
                - generic [ref=e266]: Quick Start
        - generic [ref=e267] [cursor=pointer]:
          - generic [ref=e268]:
            - img "Nature Walk" [ref=e269]
            - generic [ref=e271]: physical
          - generic [ref=e272]:
            - heading "Nature Walk" [level=3] [ref=e273]
            - paragraph [ref=e274]: Take a mindful walk in nature
            - generic [ref=e275]:
              - generic [ref=e276]: Stressed
              - generic [ref=e277]: Anxious
              - generic [ref=e278]: Tired
            - generic [ref=e279]:
              - generic [ref=e280]:
                - img [ref=e281]
                - text: 30 min
              - generic [ref=e284]:
                - img [ref=e285]
                - generic [ref=e287]: Quick Start
        - generic [ref=e288] [cursor=pointer]:
          - generic [ref=e289]:
            - img "Progressive Muscle Relaxation" [ref=e290]
            - generic [ref=e292]: relaxation
          - generic [ref=e293]:
            - heading "Progressive Muscle Relaxation" [level=3] [ref=e294]
            - paragraph [ref=e295]: Release tension from head to toe
            - generic [ref=e296]:
              - generic [ref=e297]: Stressed
              - generic [ref=e298]: Anxious
            - generic [ref=e299]:
              - generic [ref=e300]:
                - img [ref=e301]
                - text: 15 min
              - generic [ref=e304]:
                - img [ref=e305]
                - generic [ref=e307]: Quick Start
        - generic [ref=e308] [cursor=pointer]:
          - generic [ref=e309]:
            - img "Listen to Calming Music" [ref=e310]
            - generic [ref=e312]: relaxation
          - generic [ref=e313]:
            - heading "Listen to Calming Music" [level=3] [ref=e314]
            - paragraph [ref=e315]: Soothing playlist for relaxation
            - generic [ref=e316]:
              - generic [ref=e317]: Anxious
              - generic [ref=e318]: Stressed
              - generic [ref=e319]: Tired
            - generic [ref=e320]:
              - generic [ref=e321]:
                - img [ref=e322]
                - text: 20 min
              - generic [ref=e325]:
                - img [ref=e326]
                - generic [ref=e328]: Quick Start
        - generic [ref=e329] [cursor=pointer]:
          - generic [ref=e330]:
            - img "Jumping Jacks" [ref=e331]
            - generic [ref=e333]: physical
          - generic [ref=e334]:
            - heading "Jumping Jacks" [level=3] [ref=e335]
            - paragraph [ref=e336]: Get your heart rate up with jumping jacks
            - generic [ref=e337]:
              - generic [ref=e338]: Tired
              - generic [ref=e339]: Stressed
            - generic [ref=e340]:
              - generic [ref=e341]:
                - img [ref=e342]
                - text: 3 min
              - generic [ref=e345]:
                - img [ref=e346]
                - generic [ref=e348]: Quick Start
  - button "Open Next.js Dev Tools" [ref=e354] [cursor=pointer]:
    - img [ref=e355]
  - alert [ref=e358]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('activities page loads', async ({ page }) => {
  4  |   await page.goto('http://localhost:3000/ActivityPage');
  5  | 
  6  |   await expect(page.locator('text=Wellness Activities')).toBeVisible();
  7  | });
  8  | test('user selects a mood', async ({ page }) => {
  9  |   await page.goto('http://localhost:3000/ActivityPage');
  10 | 
  11 |   await page.click('[data-testid="mood-happy"]');
  12 | 
  13 |   // Expect suggestion section to appear
  14 |   await expect(page.locator('text=Feeling Happy')).toBeVisible();
  15 | });
  16 | test('filter by category', async ({ page }) => {
  17 |   await page.goto('http://localhost:3000/ActivityPage');
  18 | 
  19 |   await page.click('[data-testid="category-physical"]');
  20 | 
  21 |   // Check at least one activity is shown
  22 |   await expect(page.locator('[data-testid="activity-card"]').first()).toBeVisible();
  23 | });
  24 | test('search activity', async ({ page }) => {
  25 |   await page.goto('http://localhost:3000/ActivityPage');
  26 | 
  27 |   await page.fill('[data-testid="search-input"]', 'breathing');
  28 | 
  29 |   await expect(page.locator('text=Breathing')).toBeVisible();
  30 | });
  31 | test('open activity detail', async ({ page }) => {
  32 |   await page.goto('http://localhost:3000/ActivityPage');
  33 | 
  34 |   await page.locator('[data-testid="activity-card"]').first().click();
  35 | 
  36 |   await expect(page.locator('text=Start Activity')).toBeVisible();
  37 | });
  38 | test('start activity', async ({ page }) => {
  39 |   await page.goto('http://localhost:3000/ActivityPage');
  40 | 
  41 |   await page.locator('[data-testid="activity-card"]').first().click();
  42 | 
  43 |   await page.click('[data-testid="start-activity"]');
  44 | 
  45 |   // Expect pause button after starting
  46 |   await expect(page.locator('text=Pause')).toBeVisible();
  47 | });
  48 | test('pause and resume activity', async ({ page }) => {
  49 |   await page.goto('http://localhost:3000/ActivityPage');
  50 | 
> 51 |   await page.locator('[data-testid="activity-card"]').first().click();
     |                                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  52 | 
  53 |   await page.click('[data-testid="start-activity"]');
  54 | 
  55 |   await page.click('text=Pause');
  56 |   await expect(page.locator('text=Resume')).toBeVisible();
  57 | 
  58 |   await page.click('text=Resume');
  59 |   await expect(page.locator('text=Pause')).toBeVisible();
  60 | });
  61 | test('clear filters', async ({ page }) => {
  62 |   await page.goto('http://localhost:3000/ActivityPage');
  63 | 
  64 |   await page.click('[data-testid="mood-happy"]');
  65 | 
  66 |   await page.click('text=Clear all filters');
  67 | 
  68 |   // Expect filters reset
  69 |   await expect(page.locator('text=Feeling Happy')).not.toBeVisible();
  70 | });
```