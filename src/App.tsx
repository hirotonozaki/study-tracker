import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Records } from './components/Records';
import { useStudyRecords } from './hooks/useStudyRecords';

// アプリ全体で1つの学習記録ストアを共有し、各ページに渡す
export function App() {
  const store = useStudyRecords();

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <Dashboard
                records={store.records}
                loading={store.loading}
                error={store.error}
              />
            }
          />
          <Route
            path="records"
            element={
              <Records
                records={store.records}
                loading={store.loading}
                error={store.error}
                onAdd={store.add}
                onEdit={store.edit}
                onDelete={store.remove}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
