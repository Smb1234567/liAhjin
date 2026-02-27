import ProfileLocalView from '../../../components/ProfileLocalView';

export default function ProfilePage({ params }: { params: { username: string } }) {
  return <ProfileLocalView username={params.username} />;
}
