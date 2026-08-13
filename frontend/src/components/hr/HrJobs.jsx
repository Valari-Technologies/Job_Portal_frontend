import React, { useState, useEffect } from 'react';
import CustomSelect from '../CustomSelect';
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Copy, 
  XCircle, 
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Building,
  Briefcase,
  Calendar,
  Eye,
  Info,
  Settings,
  GitBranch,
  Pencil,
  PlusCircle,
  FileText,
  User,
  Users,
  Send,
  Lock,
  ArrowRight
} from 'lucide-react';
import hrSecondaryBg from '../../assets/hr/hr-secondary-bg.png';

export default function HrJobs() {
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Senior Frontend Developer', department: 'IT & Software', type: 'Full Time', status: 'Active', applications: 15, date: 'Oct 10, 2023' },
    { id: 2, title: 'HR Manager', department: 'Human Resources', type: 'Full Time', status: 'Active', applications: 8, date: 'Oct 08, 2023' },
    { id: 3, title: 'UI/UX Designer', department: 'Design', type: 'Part Time', status: 'Draft', applications: 0, date: 'Oct 05, 2023' },
    { id: 4, title: 'QA Engineer', department: 'QA & Testing', type: 'Contract', status: 'Closed', applications: 22, date: 'Sep 20, 2023' },
    { id: 5, title: 'Backend Developer', department: 'IT & Software', type: 'Full Time', status: 'Active', applications: 12, date: 'Sep 18, 2023' },
    { id: 6, title: 'DevOps Engineer', department: 'IT & Software', type: 'Full Time', status: 'Active', applications: 7, date: 'Sep 15, 2023' },
    { id: 7, title: 'Product Manager', department: 'Design', type: 'Full Time', status: 'Draft', applications: 0, date: 'Sep 10, 2023' },
    { id: 8, title: 'Technical Writer', department: 'Human Resources', type: 'Part Time', status: 'Active', applications: 4, date: 'Sep 05, 2023' },
    { id: 9, title: 'Scrum Master', department: 'Human Resources', type: 'Contract', status: 'Active', applications: 9, date: 'Aug 28, 2023' },
    { id: 10, title: 'Data Scientist', department: 'IT & Software', type: 'Full Time', status: 'Closed', applications: 31, date: 'Aug 20, 2023' },
    { id: 11, title: 'iOS Developer', department: 'IT & Software', type: 'Full Time', status: 'Active', applications: 14, date: 'Aug 18, 2023' },
    { id: 12, title: 'Android Developer', department: 'IT & Software', type: 'Part Time', status: 'Active', applications: 11, date: 'Aug 15, 2023' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Form State
  const [formJob, setFormJob] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    experience: '',
    openings: '2',
    // Step 2
    description: '',
    requiredSkills: '',
    responsibilities: '',
    preferredSkills: '',
    requirements: '',
    // Step 3
    deadline: '2025-05-31',
    status: 'Active',
    hiringManager: 'Rahul Sharma',
    interviewProcess: 'Standard Interview Process',
    workLocation: 'Bengaluru, India (On-site)',
    expLevel: '2 - 5 Years',
    noticePeriod: '15 - 30 Days',
    salaryMin: '8,00,000',
    salaryMax: '12,00,000',
    visibility: 'Visible to all employees',
    allowReferrals: true,
    sendConfirmation: true
  });

  const [stages, setStages] = useState([
    { id: 1, title: 'Screening', subtitle: 'HR Screening' },
    { id: 2, title: 'Assessment', subtitle: 'Technical Assessment' },
    { id: 3, title: 'Interview', subtitle: 'Technical Interview' },
    { id: 4, title: 'HR Interview', subtitle: 'HR Round' },
    { id: 5, title: 'Final Review', subtitle: 'Final Decision' }
  ]);
  const [isAddingStageModalOpen, setIsAddingStageModalOpen] = useState(false);
  const [stageInput, setStageInput] = useState({
    title: '',
    type: 'Screening',
    subtitle: '',
    mode: 'Online',
    duration: '30 min',
    assignTo: 'Rahul Sharma',
    documents: '',
    feedback: true,
    notification: true
  });

  const handleNextStep = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit / Create Job
      const jobToAdd = {
        id: Date.now(),
        title: formJob.title || 'Untitled Role',
        department: formJob.department || 'IT & Software',
        type: formJob.type || 'Full Time',
        status: formJob.status || 'Active',
        applications: 0,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };

      setJobs([jobToAdd, ...jobs]);
      // Reset form
      setFormJob({
        title: '', department: '', location: '', type: '', experience: '', openings: '2',
        description: '', requiredSkills: '', responsibilities: '', preferredSkills: '', requirements: '',
        deadline: '2025-05-31', status: 'Active', hiringManager: 'Rahul Sharma', interviewProcess: 'Standard Interview Process',
        workLocation: 'Bengaluru, India (On-site)', expLevel: '2 - 5 Years', noticePeriod: '15 - 30 Days',
        salaryMin: '8,00,000', salaryMax: '12,00,000', visibility: 'Visible to all employees',
        allowReferrals: true, sendConfirmation: true
      });
      setIsCreating(false);
      setCurrentStep(1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const handleDuplicate = (job) => {
    const duplicated = {
      ...job,
      id: Date.now(),
      title: `${job.title} (Copy)`,
      applications: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setJobs([...jobs, duplicated]);
  };

  const handleCloseJob = (id) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: 'Closed' } : job));
  };

  const handleAddStage = () => {
    setStageInput({
      title: '',
      type: 'Screening',
      subtitle: '',
      mode: 'Online',
      duration: '30 min',
      assignTo: 'Rahul Sharma',
      documents: '',
      feedback: true,
      notification: true
    });
    setIsAddingStageModalOpen(true);
  };

  const handleSubmitStage = (e) => {
    e.preventDefault();
    if (!stageInput.title) return;
    const newStage = {
      id: Date.now(),
      title: stageInput.title,
      subtitle: stageInput.subtitle || `${stageInput.type} - ${stageInput.mode} (${stageInput.duration})`
    };
    setStages([...stages, newStage]);
    setIsAddingStageModalOpen(false);
  };

  const handleDeleteStage = (id) => {
    setStages(stages.filter(s => s.id !== id));
  };

  // Filters logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || job.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All Departments' || job.department === deptFilter;
    const matchesType = typeFilter === 'All Types' || job.type === typeFilter;
    const matchesStatus = statusFilter === 'All Status' || job.status === statusFilter;
    return matchesSearch && matchesDept && matchesType && matchesStatus;
  });

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredJobs.length, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredJobs.length);
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6 w-full text-left relative">
      
      {isCreating ? (
        /* Create New Job Wizard Screen */
        <div className="flex flex-col gap-6 w-full">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create New Job</h1>
          </div>

          {/* Steps Indicator Progress Row - occupy full width */}
          <div className="flex items-center gap-4 w-full my-4 select-none">
            {/* Step 1 */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`flex items-center justify-center w-7 h-7 rounded-full font-extrabold text-xs transition-colors bg-[#8CC63F] text-white`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span className="text-[#8CC63F] font-black text-xs sm:text-sm">
                Basic Information
              </span>
            </div>
            <div className="flex-grow h-px bg-[#8CC63F]" />

            {/* Step 2 */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`flex items-center justify-center w-7 h-7 rounded-full font-extrabold text-xs transition-colors ${
                currentStep >= 2 
                  ? 'bg-[#8CC63F] text-white' 
                  : 'border border-[#8CC63F] bg-[#8CC63F]/10 text-[#8CC63F]'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <span className={`font-black text-xs sm:text-sm transition-colors ${
                currentStep >= 2 ? 'text-[#8CC63F]' : 'text-slate-400 font-bold'
              }`}>
                Job Description
              </span>
            </div>
            <div className="flex-grow h-px bg-[#8CC63F]" />

            {/* Step 3 */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`flex items-center justify-center w-7 h-7 rounded-full font-extrabold text-xs transition-colors ${
                currentStep === 3 
                  ? 'bg-[#8CC63F] text-white' 
                  : 'border border-[#8CC63F] bg-[#8CC63F]/10 text-[#8CC63F]'
              }`}>
                3
              </span>
              <span className={`font-black text-xs sm:text-sm transition-colors ${
                currentStep === 3 ? 'text-[#8CC63F]' : 'text-slate-400 font-bold'
              }`}>
                Recruitment Settings
              </span>
            </div>
          </div>

          {/* Form Card Layout wrapper */}
          <div className="relative bg-white/70 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-xs overflow-hidden">
            {/* Blurred Illustration Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden rounded-[32px]">
              <img 
                src={hrSecondaryBg} 
                alt="" 
                className="w-full h-full object-cover object-center scale-105 filter blur-[6px] select-none mix-blend-multiply" 
              />
            </div>

            <form onSubmit={handleNextStep} className="relative z-10 flex flex-col gap-6 text-xs font-bold text-slate-500">
              
              {currentStep === 1 && (
                /* Step 1: Basic Information */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  {/* Job Title */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-600 font-black">Job Title</label>
                    <select 
                      value={formJob.title}
                      onChange={(e) => setFormJob({ ...formJob, title: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 cursor-pointer appearance-none animate-fadeIn"
                    >
                      <option value="">Enter job title</option>
                      <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="QA Engineer">QA Engineer</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-600 font-black">Department</label>
                    <select 
                      value={formJob.department}
                      onChange={(e) => setFormJob({ ...formJob, department: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 cursor-pointer appearance-none"
                    >
                      <option value="">Select department</option>
                      <option value="IT & Software">IT & Software</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Design">Design</option>
                      <option value="QA & Testing">QA & Testing</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-600 font-black">Location</label>
                    <select 
                      value={formJob.location}
                      onChange={(e) => setFormJob({ ...formJob, location: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 cursor-pointer appearance-none"
                    >
                      <option value="">Select location</option>
                      <option value="San Francisco, CA">San Francisco, CA</option>
                      <option value="Remote">Remote</option>
                      <option value="New York, NY">New York, NY</option>
                    </select>
                  </div>

                  {/* Employment Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-600 font-black">Employment Type</label>
                    <select 
                      value={formJob.type}
                      onChange={(e) => setFormJob({ ...formJob, type: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 cursor-pointer appearance-none"
                    >
                      <option value="">Select type</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  {/* Experience Required */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-600 font-black">Experience Required</label>
                    <select 
                      value={formJob.experience}
                      onChange={(e) => setFormJob({ ...formJob, experience: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 cursor-pointer appearance-none"
                    >
                      <option value="">Select experience</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                    </select>
                  </div>

                  {/* Number of Openings */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-600 font-black">Number of Openings</label>
                    <input 
                      type="number"
                      placeholder="Enter number of openings"
                      value={formJob.openings}
                      onChange={(e) => setFormJob({ ...formJob, openings: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                /* Step 2: Job Description */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  {/* Job Description (Left Col) */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-600 font-black">Job Description</label>
                      <textarea 
                        rows="3"
                        placeholder="Enter job description..."
                        value={formJob.description}
                        onChange={(e) => setFormJob({ ...formJob, description: e.target.value })}
                        className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-600 font-black">Responsibilities</label>
                      <textarea 
                        rows="3"
                        placeholder="Enter key responsibilities..."
                        value={formJob.responsibilities}
                        onChange={(e) => setFormJob({ ...formJob, responsibilities: e.target.value })}
                        className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-600 font-black">Requirements</label>
                      <textarea 
                        rows="3"
                        placeholder="Enter requirements..."
                        value={formJob.requirements}
                        onChange={(e) => setFormJob({ ...formJob, requirements: e.target.value })}
                        className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 resize-none"
                      />
                    </div>
                  </div>

                  {/* Skills (Right Col) */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-600 font-black">Required Skills</label>
                      <textarea 
                        rows="4"
                        placeholder="Add required skills..."
                        value={formJob.requiredSkills}
                        onChange={(e) => setFormJob({ ...formJob, requiredSkills: e.target.value })}
                        className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-600 font-black">Preferred Skills</label>
                      <textarea 
                        rows="4"
                        placeholder="Add preferred skills..."
                        value={formJob.preferredSkills}
                        onChange={(e) => setFormJob({ ...formJob, preferredSkills: e.target.value })}
                        className="w-full px-4 py-3 bg-white/80 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                /* Step 3: Recruitment Settings (3-column layout) */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn items-start">
                  
                  {/* Column 1: Application & Deadline */}
                  <div className="bg-white/90 p-5 rounded-[24px] border border-slate-100 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[#8CC63F] font-black text-sm pb-2 border-b border-slate-50">
                      <Calendar className="w-4 h-4" />
                      <span>1. Application & Deadline</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 font-black text-[11px]">Application Deadline *</label>
                      <div className="relative">
                        <input 
                          type="date"
                          value={formJob.deadline}
                          onChange={(e) => setFormJob({ ...formJob, deadline: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 font-black text-[11px]">Job Status *</label>
                      <select 
                        value={formJob.status}
                        onChange={(e) => setFormJob({ ...formJob, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 font-black text-[11px]">Number of Openings *</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <select 
                          value={formJob.openings}
                          onChange={(e) => setFormJob({ ...formJob, openings: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs cursor-pointer"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 font-black text-[11px]">Hiring Manager *</label>
                      <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
                          alt="Rahul Sharma" 
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div className="leading-tight text-left">
                          <p className="text-xs font-black text-slate-700">Rahul Sharma</p>
                          <p className="text-[10px] text-slate-400">Head of Product</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 font-black text-[11px]">Interview Process *</label>
                      <select 
                        value={formJob.interviewProcess}
                        onChange={(e) => setFormJob({ ...formJob, interviewProcess: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs cursor-pointer"
                      >
                        <option value="Standard Interview Process">Standard Interview Process</option>
                        <option value="Fast Track Process">Fast Track Process</option>
                      </select>
                    </div>

                    <a href="#" onClick={(e) => { e.preventDefault(); alert("Process details modal"); }} className="text-[#8CC63F] hover:underline flex items-center gap-1 text-[10px] mt-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View process details</span>
                    </a>

                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-emerald-700 mt-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-bold leading-normal text-left">Candidates will be able to apply until the deadline.</p>
                    </div>
                  </div>

                  {/* Column 2: Interview Process */}
                  <div className="bg-white/90 p-5 rounded-[24px] border border-slate-100 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[#8CC63F] font-black text-sm pb-2 border-b border-slate-50">
                      <GitBranch className="w-4 h-4" />
                      <span>2. Interview Process</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 font-black text-[11px]">Select Interview Process *</label>
                      <select 
                        value={formJob.interviewProcess}
                        onChange={(e) => setFormJob({ ...formJob, interviewProcess: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs cursor-pointer"
                      >
                        <option value="Standard Interview Process">Standard Interview Process</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-400 text-[10px] tracking-wide uppercase">Process Stages</label>
                      <div className="flex flex-col gap-2">
                        {stages.map((stage, idx) => (
                          <div key={stage.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl hover:shadow-xs transition-shadow">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#8CC63F]/20 flex items-center justify-center text-[10px] text-[#8CC63F] font-black">
                                ⋮⋮
                              </span>
                              <div className="leading-tight text-left">
                                <p className="text-xs font-black text-slate-700">{idx + 1}. {stage.title}</p>
                                <p className="text-[9px] text-slate-400">{stage.subtitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button type="button" onClick={() => alert(`Edit stage ${stage.title}`)} className="text-slate-400 hover:text-slate-600 p-1">
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button type="button" onClick={() => handleDeleteStage(stage.id)} className="text-rose-400 hover:text-rose-600 p-1">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button 
                        type="button" 
                        onClick={handleAddStage}
                        className="w-full py-2 border border-dashed border-[#8CC63F] rounded-xl text-[#8CC63F] hover:bg-[#8CC63F]/5 font-black text-xs mt-2 transition-colors cursor-pointer"
                      >
                        + Add Stage
                      </button>
                    </div>
                  </div>

                  {/* Column 3: Additional Settings */}
                  <div className="bg-white/90 p-5 rounded-[24px] border border-slate-100 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[#8CC63F] font-black text-sm pb-2 border-b border-slate-50">
                      <Settings className="w-4 h-4" />
                      <span>3. Additional Settings</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 font-black text-[11px]">Work Location</label>
                      <select 
                        value={formJob.workLocation}
                        onChange={(e) => setFormJob({ ...formJob, workLocation: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs cursor-pointer"
                      >
                        <option value="Bengaluru, India (On-site)">Bengaluru, India (On-site)</option>
                        <option value="Remote">Remote</option>
                        <option value="San Francisco, CA (Hybrid)">San Francisco, CA (Hybrid)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 font-black text-[11px]">Experience Level</label>
                      <select 
                        value={formJob.expLevel}
                        onChange={(e) => setFormJob({ ...formJob, expLevel: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs cursor-pointer"
                      >
                        <option value="2 - 5 Years">2 - 5 Years</option>
                        <option value="0 - 2 Years">0 - 2 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 font-black text-[11px]">Notice Period</label>
                      <select 
                        value={formJob.noticePeriod}
                        onChange={(e) => setFormJob({ ...formJob, noticePeriod: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs cursor-pointer"
                      >
                        <option value="15 - 30 Days">15 - 30 Days</option>
                        <option value="Immediate">Immediate</option>
                        <option value="30 - 60 Days">30 - 60 Days</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-slate-600 font-black text-[11px]">Salary Range</label>
                        <span className="text-[10px] text-slate-400 font-bold">(Optional)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                          <input 
                            type="text" 
                            value={formJob.salaryMin}
                            onChange={(e) => setFormJob({ ...formJob, salaryMin: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs"
                          />
                        </div>
                        <span className="text-slate-400">to</span>
                        <div className="relative flex-grow">
                          <input 
                            type="text" 
                            value={formJob.salaryMax}
                            onChange={(e) => setFormJob({ ...formJob, salaryMax: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs"
                          />
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 text-right">Per Annum</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-600 font-black text-[11px]">Job Visibility *</label>
                      <select 
                        value={formJob.visibility}
                        onChange={(e) => setFormJob({ ...formJob, visibility: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-slate-700 text-xs cursor-pointer"
                      >
                        <option value="Visible to all employees">Visible to all employees</option>
                        <option value="Private Posting">Private Posting</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="leading-tight text-left">
                        <p className="text-xs font-black text-slate-700">Allow Internal Referrals</p>
                        <p className="text-[9px] text-slate-400">Employees can refer candidates</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormJob({ ...formJob, allowReferrals: !formJob.allowReferrals })}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${formJob.allowReferrals ? 'bg-[#8CC63F]' : 'bg-slate-200'}`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${formJob.allowReferrals ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="leading-tight text-left">
                        <p className="text-xs font-black text-slate-700">Send Application Confirmation Email</p>
                        <p className="text-[9px] text-slate-400">Send email to candidates after application</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormJob({ ...formJob, sendConfirmation: !formJob.sendConfirmation })}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${formJob.sendConfirmation ? 'bg-[#8CC63F]' : 'bg-slate-200'}`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${formJob.sendConfirmation ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                  </div>

                </div>
              )}

              {/* Bottom Form Actions */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50 z-10 relative">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 font-extrabold rounded-full transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsCreating(false); setCurrentStep(1); }}
                    className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 font-extrabold rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  {currentStep === 3 ? (
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#8CC63F] hover:bg-[#7bc034] text-white font-extrabold rounded-full transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Publish Job</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#8CC63F] hover:bg-[#7bc034] text-white font-extrabold rounded-full transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Jobs List Screen */
        <div className="flex flex-col gap-6 w-full">
          {/* Header and Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-5xl font-black text-slate-800 tracking-tight">Jobs</h1>
              <p className="text-lg font-bold text-slate-400 mt-1">Manage and track your active job listings</p>
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#84A43C] hover:bg-[#729033] text-white font-extrabold text-base rounded-full transition-colors shadow-md shadow-[#84A43C]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Job</span>
            </button>
          </div>

          {/* Statistics Cards Row */}
          <div className="grid grid-cols-1 min-[375px]:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'TOTAL JOBS', val: jobs.length, label: 'Active & Drafts', color: 'border-slate-200' },
              { title: 'ACTIVE JOBS', val: jobs.filter(j => j.status === 'Active').length, label: 'Live on portal', color: 'border-emerald-200 text-emerald-600' },
              { title: 'DRAFT JOBS', val: jobs.filter(j => j.status === 'Draft').length, label: 'Not published', color: 'border-amber-200 text-amber-600' },
              { title: 'CLOSED JOBS', val: jobs.filter(j => j.status === 'Closed').length, label: 'Expired postings', color: 'border-rose-200 text-rose-600' }
            ].map((c, i) => (
              <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-xs flex flex-col justify-between">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{c.title}</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black text-slate-800">{c.val}</span>
                  <span className="text-xs font-bold text-slate-400 ml-1.5">{c.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filter and Search controls */}
          <div className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-xs flex flex-col md:flex-row items-center gap-4 w-full">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-full focus:outline-none focus:border-[#84A43C] transition-colors"
              />
            </div>

            {/* Filter dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <CustomSelect 
                value={deptFilter} 
                onChange={(val) => setDeptFilter(val)}
                options={['All Departments', 'IT & Software', 'Human Resources', 'Design', 'QA & Testing']}
                placeholder="All Departments"
                className="flex-grow md:flex-grow-0"
                buttonClassName="rounded-full bg-slate-50 border-slate-100 text-xs px-4 h-8"
              />

              <CustomSelect 
                value={typeFilter} 
                onChange={(val) => setTypeFilter(val)}
                options={['All Types', 'Full Time', 'Part Time', 'Contract']}
                placeholder="All Types"
                className="flex-grow md:flex-grow-0"
                buttonClassName="rounded-full bg-slate-50 border-slate-100 text-xs px-4 h-8"
              />

              <CustomSelect 
                value={statusFilter} 
                onChange={(val) => setStatusFilter(val)}
                options={['All Status', 'Active', 'Draft', 'Closed']}
                placeholder="All Status"
                className="flex-grow md:flex-grow-0"
                buttonClassName="rounded-full bg-slate-50 border-slate-100 text-xs px-4 h-8"
              />
            </div>
          </div>

          {/* Jobs Table Container */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xs overflow-hidden">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">JOB TITLE</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">DEPARTMENT</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">TYPE</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">STATUS</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider text-center">APPLICATIONS</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">POSTED DATE</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedJobs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-sm font-bold text-slate-400">
                        No jobs found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 font-black text-slate-700 text-base whitespace-nowrap">{job.title}</td>
                        <td className="px-6 py-4 font-bold text-slate-500 text-base whitespace-nowrap">{job.department}</td>
                        <td className="px-6 py-4 font-bold text-slate-500 text-base whitespace-nowrap">{job.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-black uppercase ${
                            job.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                            job.status === 'Draft' ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-700 text-base text-center whitespace-nowrap">{job.applications}</td>
                        <td className="px-6 py-4 font-bold text-slate-400 text-base whitespace-nowrap">{job.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {job.status === 'Active' && (
                              <button 
                                onClick={() => handleCloseJob(job.id)}
                                title="Close Posting"
                                className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-600 transition-colors cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(job.id)}
                              title="Delete Listing"
                              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden flex flex-col divide-y divide-slate-100">
              {paginatedJobs.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm font-bold text-slate-400">
                  No jobs found matching your filters.
                </div>
              ) : (
                paginatedJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="p-5 flex flex-col gap-3 text-left"
                  >
                    <div className="flex items-center justify-between gap-3 min-w-0">
                      <span className="text-base font-black text-slate-700 block truncate flex-grow min-w-0">{job.title}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase shrink-0 ${
                        job.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                        job.status === 'Draft' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-1 text-sm font-bold text-slate-500 items-start">
                      <div className="min-w-0">
                        <span className="text-slate-400 block text-[11px] uppercase font-black truncate">Department</span>
                        <span className="text-slate-600 block truncate">{job.department}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-slate-400 block text-[11px] uppercase font-black truncate">Type</span>
                        <span className="text-slate-600 block truncate">{job.type}</span>
                      </div>
                      <div className="text-right min-w-0">
                        <span className="text-slate-400 block text-[11px] uppercase font-black truncate">Applications</span>
                        <span className="text-slate-700 font-extrabold block text-right">{job.applications}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-2.5 mt-1">
                      <span className="text-xs font-bold text-slate-400">Posted: {job.date}</span>
                      <div className="flex items-center gap-2">
                        {job.status === 'Active' && (
                          <button 
                            onClick={() => handleCloseJob(job.id)}
                            title="Close Posting"
                            className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-600 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(job.id)}
                          title="Delete Listing"
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Pagination Row - Centered Buttons Only (Outside Card) */}
          <div className="flex items-center justify-center text-xs font-bold text-slate-400 mt-6 select-none">
            <div className="flex items-center gap-1.5 select-none">
              <button 
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-xl border border-slate-200/60 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>

              {(() => {
                const pages = [];
                if (totalPages <= 6) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  if (currentPage <= 3) {
                    pages.push(1, 2, 3, 4, '...', totalPages);
                  } else if (currentPage >= totalPages - 2) {
                    pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                  } else {
                    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                  }
                }
                return pages.map((pageNum, idx) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 font-bold">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer text-sm ${
                        currentPage === pageNum 
                          ? 'bg-[#84A43C] text-white font-extrabold' 
                          : 'border border-slate-200/60 hover:bg-slate-50 text-slate-600 bg-white font-bold'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}

              <button 
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-xl border border-slate-200/60 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styled Add Stage Modal Popup */}
      {isAddingStageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#8CC63F]" />
                <h3 className="text-base font-black text-slate-800">Add Interview Stage</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddingStageModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitStage} className="p-6 overflow-y-auto max-h-[75vh] flex flex-col gap-5 text-xs font-bold text-slate-500">
              
              {/* Row 1: Stage Name & Stage Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-600 font-black flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8CC63F]" />
                    <span>Stage Name *</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. System Design Interview"
                    value={stageInput.title}
                    onChange={(e) => setStageInput({ ...stageInput, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-600 font-black flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-[#8CC63F]" />
                    <span>Stage Type</span>
                  </label>
                  <select
                    value={stageInput.type}
                    onChange={(e) => setStageInput({ ...stageInput, type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 cursor-pointer"
                  >
                    <option value="Screening">Screening</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Managerial">Managerial</option>
                    <option value="Final Review">Final Review</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Description / Instructions */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-600 font-black flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#8CC63F]" />
                  <span>Description / Instructions</span>
                </label>
                <textarea 
                  rows="2"
                  placeholder="Describe the instructions for this interview round..."
                  value={stageInput.subtitle}
                  onChange={(e) => setStageInput({ ...stageInput, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 resize-none font-semibold"
                />
              </div>

              {/* Row 3: Interview Mode & Estimated Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-600 font-black flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#8CC63F]" />
                    <span>Interview Mode</span>
                  </label>
                  <select
                    value={stageInput.mode}
                    onChange={(e) => setStageInput({ ...stageInput, mode: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 cursor-pointer"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-600 font-black flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8CC63F]" />
                    <span>Estimated Duration</span>
                  </label>
                  <select
                    value={stageInput.duration}
                    onChange={(e) => setStageInput({ ...stageInput, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 cursor-pointer"
                  >
                    <option value="15 min">15 min</option>
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Assign To & Required Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-600 font-black flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8CC63F]" />
                    <span>Assign To (Interviewer)</span>
                  </label>
                  <select
                    value={stageInput.assignTo}
                    onChange={(e) => setStageInput({ ...stageInput, assignTo: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 cursor-pointer"
                  >
                    <option value="Rahul Sharma">Rahul Sharma</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Neha Gupta">Neha Gupta</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-600 font-black flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#8CC63F]" />
                    <span>Required Documents (Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Govt ID, Portfolio link"
                    value={stageInput.documents}
                    onChange={(e) => setStageInput({ ...stageInput, documents: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#8CC63F] text-slate-700 font-semibold"
                  />
                </div>
              </div>

              {/* Row 5: Switches Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <div className="leading-tight text-left">
                    <p className="text-xs font-black text-slate-700">Enable Candidate Feedback</p>
                    <p className="text-[9px] text-slate-400">Allow ratings/feedback from candidate</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setStageInput({ ...stageInput, feedback: !stageInput.feedback })}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${stageInput.feedback ? 'bg-[#8CC63F]' : 'bg-slate-200'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${stageInput.feedback ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="leading-tight text-left">
                    <p className="text-xs font-black text-slate-700">Enable Auto Notification</p>
                    <p className="text-[9px] text-slate-400">Alert candidate when entering stage</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setStageInput({ ...stageInput, notification: !stageInput.notification })}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${stageInput.notification ? 'bg-[#8CC63F]' : 'bg-slate-200'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${stageInput.notification ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Stage Card Preview Section */}
              <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl flex flex-col gap-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left">Stage Preview</p>
                <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8CC63F]/20 flex items-center justify-center text-[10px] text-[#8CC63F] font-black">
                      ⋮⋮
                    </span>
                    <div className="leading-tight text-left">
                      <p className="text-xs font-black text-slate-700">{stages.length + 1}. {stageInput.title || 'Untitled Stage'}</p>
                      <p className="text-[9px] text-slate-400">{stageInput.subtitle || `${stageInput.type} - ${stageInput.mode} (${stageInput.duration})`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-50">
                    <button type="button" className="text-slate-400 p-1" disabled>
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button type="button" className="text-rose-400 p-1" disabled>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingStageModalOpen(false)}
                  className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 font-extrabold rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8CC63F] hover:bg-[#7bc034] text-white font-extrabold rounded-full transition-colors cursor-pointer"
                >
                  Add Stage
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
