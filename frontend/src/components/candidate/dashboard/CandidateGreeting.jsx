import { useCandidateUser } from '../../../context/CandidateUserContext';

export default function CandidateGreeting() {
  const { profile } = useCandidateUser();
  const firstName = profile?.firstName || (profile?.fullName ? profile.fullName.split(' ')[0] : 'Candidate');

  return (
    <div className="space-y-1 font-sans">
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
        Hello, {firstName}!
      </h1>
      <p className="text-xs sm:text-sm font-extrabold text-slate-500">
        Let's find your next great opportunity.
      </p>
    </div>
  );
}
