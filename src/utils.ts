// ============================================================
// 表示用フォーマット & 集計（ダッシュボード用の計算）
// ============================================================
import type { StudyRecord, SubjectTotal, DayGroup } from './types';

// 分 → "1h 30m" / "45m" / "2h"
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

const WEEK = ['日', '月', '火', '水', '木', '金', '土'];

// 'YYYY-MM-DD' → "2026/06/11 (木)"
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}/${mm}/${dd} (${WEEK[d.getDay()]})`;
}

// 今日の日付 'YYYY-MM-DD'（フォームの初期値用）
export function today(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// 合計学習時間（分）
export function sumMinutes(records: StudyRecord[]): number {
  return records.reduce((sum, r) => sum + r.minutes, 0);
}

// 科目別の合計時間（多い順）
export function subjectTotals(records: StudyRecord[]): SubjectTotal[] {
  const map = new Map<string, number>();
  for (const r of records) {
    map.set(r.subject, (map.get(r.subject) ?? 0) + r.minutes);
  }
  return [...map.entries()]
    .map(([subject, totalMinutes]) => ({ subject, totalMinutes }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes);
}

// 日付別の学習履歴（新しい日付順）
export function groupByDate(records: StudyRecord[]): DayGroup[] {
  const map = new Map<string, StudyRecord[]>();
  for (const r of records) {
    const list = map.get(r.studied_on) ?? [];
    list.push(r);
    map.set(r.studied_on, list);
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, list]) => ({
      date,
      records: list,
      totalMinutes: sumMinutes(list),
    }));
}
