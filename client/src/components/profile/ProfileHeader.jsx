import { Avatar } from '../ui/index.jsx';

export function ProfileHeader({ profile }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-10">
      <Avatar src={profile.avatarUrl} name={profile.fullName} size={96} />
      <div>
        <h1 className="text-2xl font-bold">{profile.fullName}</h1>
        <p className="text-text-muted">@{profile.username}</p>
      </div>
      {profile.bio && <p className="max-w-xl text-text-muted">{profile.bio}</p>}
      <div className="flex items-center gap-4 text-sm text-text-muted">
        {profile.location && <span>📍 {profile.location}</span>}
        {profile.websiteUrl && (
          <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="text-brand">
            {profile.websiteUrl.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>
    </div>
  );
}
