import type { StudyRecord } from '../types';
import { formatMinutes, formatDate, groupByDate } from '../utils';

type Props = {
  records: StudyRecord[];
  loading: boolean;
  error: string | null;
  onEdit: (record: StudyRecord) => void;
  onDelete: (id: string) => Promise<void>;
};

// 学習記録を日付別にまとめて表示し、編集・削除を行う
export function RecordList({ records, loading, error, onEdit, onDelete }: Props) {
  if (loading) return <div className="card"><p className="state">読み込み中…</p></div>;
  if (error) return <div className="card"><p className="state state--error">{error}</p></div>;

  const groups = groupByDate(records);

  const handleDelete = async (r: StudyRecord) => {
    if (!window.confirm(`「${r.subject}」の記録を削除しますか？`)) return;
    try {
      await onDelete(r.id);
    } catch (e) {
      console.error(e);
      window.alert('削除に失敗しました。');
    }
  };

  if (groups.length === 0) {
    return (
      <div className="card">
        <p className="empty">まだ記録がありません。左のフォームから追加してください。</p>
      </div>
    );
  }

  return (
    <div className="list">
      {groups.map((g) => (
        <section key={g.date} className="card daygroup">
          <header className="daygroup__head">
            <h2 className="daygroup__date">{formatDate(g.date)}</h2>
            <span className="daygroup__total">計 {formatMinutes(g.totalMinutes)}</span>
          </header>
          <ul className="records">
            {g.records.map((r) => (
              <li key={r.id} className="rec">
                <div className="rec__main">
                  <span className="rec__subject">{r.subject}</span>
                  <span className="rec__minutes">{formatMinutes(r.minutes)}</span>
                </div>
                {r.memo && <p className="rec__memo">{r.memo}</p>}
                <div className="rec__actions">
                  <button className="link-btn" type="button" onClick={() => onEdit(r)}>編集</button>
                  <button
                    className="link-btn link-btn--danger"
                    type="button"
                    onClick={() => handleDelete(r)}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
