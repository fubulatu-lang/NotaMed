import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiMicrophone, HiClipboardList, HiTemplate } from 'react-icons/hi';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'New Recording',
      description: 'Start a new clinical dictation',
      icon: HiMicrophone,
      action: () => navigate('/record'),
      color: 'bg-primary text-white',
    },
    {
      title: 'Recent Notes',
      description: 'View your session notes',
      icon: HiClipboardList,
      action: () => navigate('/history'),
      color: 'bg-secondary text-white',
    },
    {
      title: 'Templates',
      description: 'Manage note templates',
      icon: HiTemplate,
      action: () => navigate('/settings'),
      color: 'bg-tertiary text-white',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card">
        <h2 className="text-headline-sm">
          Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
        </h2>
        <p className="text-body-md text-on-surface-variant mt-2">
          Start a new dictation or access your recent clinical notes.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map(({ title, description, icon: Icon, action, color }) => (
          <button
            key={title}
            onClick={action}
            className="card text-left hover:shadow-elevation-3 transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-title-md mb-1">{title}</h3>
            <p className="text-body-sm text-on-surface-variant">{description}</p>
          </button>
        ))}
      </div>

      {/* Getting Started */}
      <div className="card">
        <h3 className="text-title-md mb-4">Getting Started</h3>
        <ol className="space-y-3 text-body-md text-on-surface-variant">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            Tap the <strong className="text-primary">Record</strong> button or navigate to the Record tab
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            Speak your clinical notes clearly into the microphone
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            Review the AI-generated formatted note
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              4
            </span>
            Copy to your EMR with one tap
          </li>
        </ol>
      </div>
    </div>
  );
}
