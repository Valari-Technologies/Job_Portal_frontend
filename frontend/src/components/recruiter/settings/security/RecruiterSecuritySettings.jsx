import RecruiterPasswordForm from './RecruiterPasswordForm';
import RecruiterTwoFactorSettings from './RecruiterTwoFactorSettings';

export default function RecruiterSecuritySettings({
  twoFactorSupported = true,
  twoFactorEnabled = true,
  onUpdatePassword,
  onManage2FA
}) {
  return (
    <div className="space-y-6 flex-1">
      <RecruiterPasswordForm onUpdatePassword={onUpdatePassword} />
      <RecruiterTwoFactorSettings
        twoFactorSupported={twoFactorSupported}
        twoFactorEnabled={twoFactorEnabled}
        onManage2FA={onManage2FA}
      />
    </div>
  );
}
