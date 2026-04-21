import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { ToastContainer } from "./components/ui/Toast";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import RegisterStep1 from "./pages/auth/RegisterStep1";
import RegisterStep2 from "./pages/auth/RegisterStep2";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ExamConfig from "./pages/ExamConfig";
import ExamSession from "./pages/ExamSession";
import ExamResult from "./pages/ExamResult";
import PracticeConfig from "./pages/PracticeConfig";
import AiChat from "./pages/AiChat";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import FormulaSheet from "./pages/FormulaSheet";
import Achievements from "./pages/Achievements";
import Bookmarks from "./pages/Bookmarks";

function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<RegisterStep1 />} />
          <Route path="/auth/register/account" element={<RegisterStep2 />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/exam/select" element={<ExamConfig />} />
              <Route path="/exam/session" element={<ExamSession />} />
              <Route path="/exam/result" element={<ExamResult />} />
              <Route path="/practice/select" element={<PracticeConfig />} />
              <Route path="/practice/session" element={<ExamSession />} />
              <Route path="/practice/result" element={<ExamResult />} />
              <Route path="/ai-chat" element={<AiChat />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/formula-sheet" element={<FormulaSheet />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </BrowserRouter>
  );
}
