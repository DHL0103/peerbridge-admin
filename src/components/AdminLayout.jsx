import { T } from '../tokens';
import { Sidebar } from './Sidebar';
import { getCachedUser } from '../api';

export function AdminLayout({ active, children }) {
  const user = getCachedUser();
  return (
    <div style={{ background: T.bg, fontFamily: T.fSans, color: T.ink, paddingBottom: 80, minHeight: '100vh' }}>
      <div style={{ padding: '12px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.ink, color: T.card, fontSize: 12 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontWeight: 700 }}>peerbridge ADMIN</span>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>/ 운영자: {user?.first_name || user?.username}</span>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <Sidebar active={active} />
        <div style={{ flex: 1, padding: '32px 56px 0 0' }}>{children}</div>
      </div>
    </div>
  );
}
