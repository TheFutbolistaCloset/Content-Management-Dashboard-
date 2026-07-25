# Content-Management-Dashboard-

ריפו מאורכב. לא מתוחזק יותר.

פרוטוטייפ Next.js של דשבורד ניהול תוכן לרשתות חברתיות (אינסטגרם וכו') - סקדולינג פוסטים, אנליטיקס, לוח שנה לתוכן, מעקב מתחרים, וריכוז חדשות. נבנה מרץ 2026; שכבת הנתונים (`metricool.ts`) היא סימולציה בלבד ("Simulates data from the Metricool API... Replace with real Metricool API calls when connecting your account") - לא היה מחובר בפועל למקור נתונים חי.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4

## Structure
- `src/app/` - עמודי App Router: `page.tsx` (בית), `instagram/`, `analytics/`, `calendar/`, `competitors/`, `news/`
- `src/components/sidebar.tsx` - ניווט צד משותף; `src/components/ui/card.tsx` - רכיבי UI בסיסיים בסגנון shadcn/ui
- `src/lib/metricool.ts` - שכבת נתונים מדומה (mock) בהשראת Metricool API
- `src/lib/utils.ts` - עזר `cn()` למיזוג classes

## Run locally
```bash
npm run dev
```

## Notes
- כל הנתונים בדשבורד (אנליטיקס, חדשות RSS) הם מוק - אין חיבור אמיתי ל-Metricool או למקור חדשות חי.
- עיצוב כהה בלבד (dark theme קבוע), Tailwind v4 עם `@theme` ב-`globals.css` במקום `tailwind.config.js`.
