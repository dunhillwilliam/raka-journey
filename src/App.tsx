import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { DailyReportView } from './components/views/DailyReportView';
import { ProgressView } from './components/views/ProgressView';
import { CuriosityView } from './components/views/CuriosityView';
import { ParentCornerView } from './components/views/ParentCornerView';
import { MonthlyReportView } from './components/views/MonthlyReportView';
import { GalleryView } from './components/views/GalleryView';
import { SettingsView } from './components/views/SettingsView';
import { NewSessionModal } from './components/modals/NewSessionModal';
import { NewCuriosityModal } from './components/modals/NewCuriosityModal';
import { NewFeedbackModal } from './components/modals/NewFeedbackModal';
import { UploadArtworkModal } from './components/modals/UploadArtworkModal';
import { PdfPreviewModal } from './components/modals/PdfPreviewModal';
import ParentPage from './pages/ParentPage';
import RakaPage from './pages/RakaPage';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-4 md:p-4 pb-12 overflow-y-auto">
          {activeTab === 'beranda' && <DashboardView />}
          {activeTab === 'daily-report' && <DailyReportView />}
          {activeTab === 'progress' && <ProgressView />}
          {activeTab === 'curiosity' && <CuriosityView />}
          {activeTab === 'parent-corner' && <ParentCornerView />}
          {activeTab === 'monthly-report' && <MonthlyReportView />}
          {activeTab === 'galeri-karya' && <GalleryView />}
          {activeTab === 'pengaturan' && <SettingsView />}
        </main>
      </div>

      <NewSessionModal />
      <NewCuriosityModal />
      <NewFeedbackModal />
      <UploadArtworkModal />
      <PdfPreviewModal />
    </div>
  );
};

function useViewParam(): 'mentor' | 'parent' | 'raka' {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  if (view === 'parent') return 'parent';
  if (view === 'raka') return 'raka';
  return 'mentor';
}

export default function App() {
  const view = useViewParam();

  if (view === 'parent') {
    return <ParentPage />;
  }

  if (view === 'raka') {
    return <RakaPage />;
  }

  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}