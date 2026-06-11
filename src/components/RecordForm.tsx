import { useState, type FormEvent } from 'react';
import type { StudyRecord, StudyRecordInput } from '../types';
import { today } from '../utils';

type Props = {
  editing: StudyRecord | null;
  onSubmit: (input: StudyRecordInput) => Promise<void>;
  onCancel: () => void;
};

// 学習記録の追加・編集フォーム（入力バリデーション付き）
export function RecordForm({ editing, onSubmit, onCancel }: Props) {
  const [subject, setSubject] = useState(editing?.subject ?? '');
  const [minutes, setMinutes] = useState(editing ? String(editing.minutes) : '');
  const [studiedOn, setStudiedOn] = useState(editing?.studied_on ?? today());
  const [memo, setMemo] = useState(editing?.memo ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const mins = Number(minutes);
    if (subject.trim() === '') {
      setError('科目を入力してください。');
      return;
    }
    if (!Number.isFinite(mins) || mins <= 0) {
      setError('学習時間は1以上の数値で入力してください。');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        subject: subject.trim(),
        minutes: Math.round(mins),
        studied_on: studiedOn,
        memo,
      });
      if (!editing) {
        setSubject('');
        setMinutes('');
        setMemo('');
      }
    } catch (err) {
      console.error(err);
      setError('保存に失敗しました。もう一度お試しください。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2 className="card__title">{editing ? '記録を編集' : '記録を追加'}</h2>

      <label className="field">
        <span className="field__label">科目</span>
        <input
          className="field__input"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="例：React"
        />
      </label>

      <label className="field">
        <span className="field__label">学習時間（分）</span>
        <input
          className="field__input"
          type="number"
          min="1"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="例：60"
        />
      </label>

      <label className="field">
        <span className="field__label">学習日</span>
        <input
          className="field__input"
          type="date"
          value={studiedOn}
          onChange={(e) => setStudiedOn(e.target.value)}
        />
      </label>

      <label className="field">
        <span className="field__label">メモ（任意）</span>
        <textarea
          className="field__input field__input--area"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          placeholder="やったこと・気づきなど"
        />
      </label>

      {error && <p className="form__error">{error}</p>}

      <div className="form__actions">
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {saving ? '保存中…' : editing ? '更新する' : '追加する'}
        </button>
        {editing && (
          <button className="btn btn--ghost" type="button" onClick={onCancel} disabled={saving}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
