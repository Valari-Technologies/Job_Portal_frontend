import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MapPin, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import { scheduleInterviewService } from '../../../services/recruiter/recruiterInterviewsService';

export default function RecruiterInterviewForm({ eligibleApplications = [], preselectedApplicationId }) {
  const navigate = useNavigate();

  const [selectedAppId, setSelectedAppId] = useState(preselectedApplicationId || '');
  const [interviewType, setInterviewType] = useState('ONLINE');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [timezone] = useState('Asia/Kolkata (IST)');
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const selectedApp = eligibleApplications.find(app => String(app.id) === String(selectedAppId));

  const validate = () => {
    const errs = {};
    if (!selectedAppId && eligibleApplications.length > 0) {
      errs.application = 'Please select a candidate application.';
    }
    if (!scheduledDate) errs.scheduledDate = 'Date is required.';
    if (!scheduledTime) errs.scheduledTime = 'Time is required.';

    if (interviewType === 'ONLINE' && !meetingLink.trim()) {
      errs.meetingLink = 'Meeting link is required for online interviews.';
    }
    if (interviewType === 'IN_PERSON' && !location.trim()) {
      errs.location = 'Physical location is required for in-person interviews.';
    }
    if (interviewType === 'PHONE' && !phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required for phone interviews.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await scheduleInterviewService({
        application_id: selectedAppId,
        interview_type: interviewType,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        timezone,
        meeting_link: meetingLink,
        location,
        phone_number: phoneNumber,
        notes
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to schedule interview", err);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-150 p-8 text-center space-y-4 max-w-md mx-auto shadow-xs">
        <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Interview Scheduled</h2>
        <p className="text-xs font-medium text-slate-500">
          The interview schedule has been recorded. Candidate notification will be dispatched automatically once the Django API connects.
        </p>
        <button
          type="button"
          onClick={() => navigate('/recruiter/interviews')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
        >
          Return to Schedule
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs max-w-2xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-150 pb-4">
        <button
          type="button"
          onClick={() => navigate('/recruiter/interviews')}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Schedule Interview</h1>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Configure interview schedule and details for a shortlisted candidate.</p>
        </div>
      </div>

      {/* Candidate Application Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Candidate Application *</label>
        {eligibleApplications.length > 0 ? (
          <select
            value={selectedAppId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedAppId(val);
              const found = eligibleApplications.find(a => String(a.id) === String(val));
              if (found && found.candidate?.phone && !phoneNumber) {
                setPhoneNumber(found.candidate.phone);
              }
            }}
            disabled={Boolean(preselectedApplicationId)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">-- Select Shortlisted Application --</option>
            {eligibleApplications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.candidate?.full_name} ({app.job?.title})
              </option>
            ))}
          </select>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <p className="text-xs font-medium text-slate-500">
              No shortlisted candidates are available for interview scheduling.
            </p>
            <button
              type="button"
              onClick={() => navigate('/recruiter/applications')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>→ Go to Applications to review & shortlist candidates</span>
            </button>
          </div>
        )}
        {errors.application && <p className="text-xs font-bold text-red-500 mt-1">{errors.application}</p>}
      </div>

      {selectedApp && (
        <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-100 space-y-1">
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">Applicant Context</span>
          <p className="text-xs font-black text-slate-900">{selectedApp.candidate?.full_name} — {selectedApp.job?.title}</p>
        </div>
      )}

      {/* Interview Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700">Interview Type *</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setInterviewType('ONLINE')}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              interviewType === 'ONLINE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            <Video className="h-4 w-4" />
            <span>Online</span>
          </button>
          <button
            type="button"
            onClick={() => setInterviewType('IN_PERSON')}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              interviewType === 'IN_PERSON' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>In Person</span>
          </button>
          <button
            type="button"
            onClick={() => setInterviewType('PHONE')}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              interviewType === 'PHONE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            <Phone className="h-4 w-4" />
            <span>Phone</span>
          </button>
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Interview Date *</label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          />
          {errors.scheduledDate && <p className="text-xs font-bold text-red-500 mt-1">{errors.scheduledDate}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Scheduled Time *</label>
          <input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          />
          {errors.scheduledTime && <p className="text-xs font-bold text-red-500 mt-1">{errors.scheduledTime}</p>}
        </div>
      </div>

      {/* Conditional Inputs */}
      {interviewType === 'ONLINE' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Meeting Link (e.g. Google Meet / Zoom) *</label>
          <input
            type="url"
            placeholder="https://meet.google.com/xyz"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          />
          {errors.meetingLink && <p className="text-xs font-bold text-red-500 mt-1">{errors.meetingLink}</p>}
        </div>
      )}

      {interviewType === 'IN_PERSON' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Physical Location Address *</label>
          <input
            type="text"
            placeholder="Building name, Floor, Street, City"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          />
          {errors.location && <p className="text-xs font-bold text-red-500 mt-1">{errors.location}</p>}
        </div>
      )}

      {interviewType === 'PHONE' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Interviewer Phone Number *</label>
          <input
            type="tel"
            placeholder="+91 9876543210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          />
          {errors.phoneNumber && <p className="text-xs font-bold text-red-500 mt-1">{errors.phoneNumber}</p>}
        </div>
      )}

      {/* Internal Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Internal Recruiter Notes (Optional)</label>
        <textarea
          rows={3}
          placeholder="Additional interview instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150">
        <button
          type="button"
          onClick={() => navigate('/recruiter/interviews')}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Schedule Interview
        </button>
      </div>

    </form>
  );
}
