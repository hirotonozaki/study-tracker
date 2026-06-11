// DB の study_records 1行に対応する型
export type StudyRecord = {
  id: string;
  subject: string;
  minutes: number;
  studied_on: string; // 'YYYY-MM-DD'
  memo: string | null;
  created_at: string;
};

// 追加・編集フォームの入力値（id / created_at は DB 側で付与）
export type StudyRecordInput = {
  subject: string;
  minutes: number;
  studied_on: string;
  memo: string;
};

// 科目別の合計時間（集計結果）
export type SubjectTotal = {
  subject: string;
  totalMinutes: number;
};

// 日付別にまとめた学習履歴（集計結果）
export type DayGroup = {
  date: string;
  records: StudyRecord[];
  totalMinutes: number;
};
