// ============================================================
// study_records テーブルに対する CRUD（Supabase）
// 画面側はこの関数だけを呼び、SQL は意識しないようにしている
// ============================================================
import { supabase } from './lib/supabase';
import type { StudyRecord, StudyRecordInput } from './types';

const TABLE = 'study_records';

// Read: 一覧取得（学習日の新しい順）
export async function fetchRecords(): Promise<StudyRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('studied_on', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Create: 追加
export async function createRecord(input: StudyRecordInput): Promise<StudyRecord> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      subject: input.subject,
      minutes: input.minutes,
      studied_on: input.studied_on,
      memo: input.memo.trim() === '' ? null : input.memo,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update: 編集
export async function updateRecord(
  id: string,
  input: StudyRecordInput,
): Promise<StudyRecord> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      subject: input.subject,
      minutes: input.minutes,
      studied_on: input.studied_on,
      memo: input.memo.trim() === '' ? null : input.memo,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete: 削除
export async function deleteRecord(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
