import { useState } from 'react';
import type { StudyRecord, StudyRecordInput } from '../types';
import { RecordForm } from './RecordForm';
import { RecordList } from './RecordList';

type Props = {
  records: StudyRecord[];
  loading: boolean;
  error: string | null;
  onAdd: (input: StudyRecordInput) => Promise<void>;
  onEdit: (id: string, input: StudyRecordInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

// 記録の追加/編集フォームと、日付別の一覧をまとめるページ
export function Records({ records, loading, error, onAdd, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState<StudyRecord | null>(null);

  const handleSubmit = async (input: StudyRecordInput) => {
    if (editing) {
      await onEdit(editing.id, input);
      setEditing(null);
    } else {
      await onAdd(input);
    }
  };

  return (
    <div>
      <header className="page-head">
        <h1 className="page-head__title">学習記録</h1>
        <p className="page-head__sub">記録の追加・編集・削除（日付別に表示）</p>
      </header>

      <div className="grid-form">
        {/* key を変えることで、編集対象が変わったらフォームを作り直す */}
        <RecordForm
          key={editing?.id ?? 'new'}
          editing={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
        <RecordList
          records={records}
          loading={loading}
          error={error}
          onEdit={setEditing}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
