// ============================================================
// 学習記録の取得と CRUD をまとめて扱うカスタムフック
// 取得後は API を都度呼ばず、ローカル state を更新して即時反映する
// ============================================================
import { useCallback, useEffect, useState } from 'react';
import type { StudyRecord, StudyRecordInput } from '../types';
import { createRecord, deleteRecord, fetchRecords, updateRecord } from '../api';

export function useStudyRecords() {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRecords(await fetchRecords());
    } catch (e) {
      console.error(e);
      setError('データの取得に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (input: StudyRecordInput) => {
    const created = await createRecord(input);
    setRecords((prev) => [created, ...prev]);
  }, []);

  const edit = useCallback(async (id: string, input: StudyRecordInput) => {
    const updated = await updateRecord(id, input);
    setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { records, loading, error, reload: load, add, edit, remove };
}
