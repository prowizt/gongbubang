import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import StudentPage from './pages/StudentPage';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="/students" element={<StudentPage />} />
          <Route path="/enrollment" element={<PlaceholderPage title="수강 신청" />} />
          <Route path="/grades" element={<PlaceholderPage title="성적 관리" />} />
          <Route path="/payments" element={<PlaceholderPage title="등록금 납부" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
