import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminTopbar from './AdminTopbar.jsx';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#080c10] transition-colors font-manrope selection:bg-blue-100 selection:text-blue-900">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full " />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-violet-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar - Fixed Glass */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pl-[280px]">
          {/* Topbar - Glass Header */}
          <AdminTopbar />

          {/* Page Content with Entrance Animation */}
          <main className="flex-1 px-8 py-8 relative">
            <div className="max-w-[1600px] mx-auto">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;



