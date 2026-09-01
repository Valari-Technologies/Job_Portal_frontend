import { useState } from 'react';
import EmployerLayout from '../../../components/employer/common/EmployerLayout';
import MessagesSidebar from '../../../components/employer/employerMessages/MessagesSidebar';
import MessagesChatThread from '../../../components/employer/employerMessages/MessagesChatThread';
import MessagesContext from '../../../components/employer/employerMessages/MessagesContext';

// Future Django API:
// GET /api/employer/application-messages/
// Data will replace the empty state after authenticated Employer data is available.

export default function EmployerMessages() {
  const [conversationsList] = useState([]); // Initial empty state
  const [selectedConv, setSelectedConv] = useState(null); // No selected conversation initially

  // Filters state mapping (UI only)
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <EmployerLayout activeTab="messages" breadcrumbTitle="Messages">
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
        
        {/* Page Heading */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Messages</h1>
          <p className="text-sm md:text-base font-bold text-slate-500 mt-1">Communicate with candidates about their applications.</p>
        </div>

        {/* 3-Column Desktop Layout Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Column 1: Conversations List & Search Filters */}
          <MessagesSidebar 
            conversationsList={conversationsList}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            jobFilter={jobFilter}
            setJobFilter={setJobFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            selectedConv={selectedConv}
            setSelectedConv={setSelectedConv}
          />

          {/* Column 2: Selected Conversation Thread Box */}
          <MessagesChatThread 
            selectedConv={selectedConv}
            setSelectedConv={setSelectedConv}
          />

          {/* Column 3: Selected Application Context Details */}
          <MessagesContext selectedConv={selectedConv} />

        </div>

      </main>
    </EmployerLayout>
  );
}
