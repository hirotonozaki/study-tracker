import type { StudyRecord } from '../types';
import { formatMinutes, formatDate, sumMinutes, subjectTotals } from '../utils';

type Props = {
  records: StudyRecord[];
  loading: boolean;
  error: string | null;
};

// 合計時間・科目別内訳・最近の記録を表示するダッシュボード
export function Dashboard({ records, loading, error }: Props) {
  if (loading) return <p className="state">読み込み中…</p>;
  if (error) return <p className="state state--error">{error}</p>;

  const total = sumMinutes(records);
  const subjects = subjectTotals(records);
  const days = new Set(records.map((r) => r.studied_on)).size;
  const recent = records.slice(0, 5);
  const maxSubject = subjects[0]?.totalMinutes ?? 1;

  return (
    <div>
      <header className="page-head">
        <h1 className="page-head__title">ダッシュボード</h1>
        <p className="page-head__sub">学習の合計時間・科目別の内訳・最近の記録</p>
      </header>

      <section className="stats">
        <div className="stat">
          <p className="stat__label">合計学習時間</p>
          <p className="stat__value">{formatMinutes(total)}</p>
        </div>
        <div className="stat">
          <p className="stat__label">記録数</p>
          <p className="stat__value">{records.length}<span className="stat__unit">件</span></p>
        </div>
        <div className="stat">
          <p className="stat__label">科目数</p>
          <p className="stat__value">{subjects.length}<span className="stat__unit">科目</span></p>
        </div>
        <div className="stat">
          <p className="stat__label">学習した日数</p>
          <p className="stat__value">{days}<span className="stat__unit">日</span></p>
        </div>
      </section>

      <div className="grid2">
        <section className="card">
          <h2 className="card__title">科目別の合計時間</h2>
          {subjects.length === 0 ? (
            <p className="empty">まだ記録がありません。</p>
          ) : (
            <ul className="bars">
              {subjects.map((s) => (
                <li key={s.subject} className="bar">
                  <div className="bar__head">
                    <span className="bar__name">{s.subject}</span>
                    <span className="bar__value">{formatMinutes(s.totalMinutes)}</span>
                  </div>
                  <div className="bar__track">
                    <div
                      className="bar__fill"
                      style={{ width: `${(s.totalMinutes / maxSubject) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2 className="card__title">最近の記録</h2>
          {recent.length === 0 ? (
            <p className="empty">まだ記録がありません。</p>
          ) : (
            <ul className="recent">
              {recent.map((r) => (
                <li key={r.id} className="recent__item">
                  <div>
                    <p className="recent__subject">{r.subject}</p>
                    <p className="recent__date">{formatDate(r.studied_on)}</p>
                  </div>
                  <span className="recent__minutes">{formatMinutes(r.minutes)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
