import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';

const items = [
  { k: '대시보드', icon: '◐', path: '/' },
  { k: '심사 대기', icon: '☰', path: '/' },
  { k: '진행 상품', icon: '◇', path: '/products' },
  { k: '회원 관리', icon: '◯', path: '/users' },
  { k: '리스크', icon: '⚠', path: '/risk' },
  { k: '시스템 설정', icon: '⚙', path: '/settings' },
];

export function Sidebar({ active }) {
  const navigate = useNavigate();
  return (
    <div style={{ width: 240, padding: '32px 16px', flexShrink: 0 }}>
      <div style={{ fontSize: 12, color: T.ink3, padding: '0 16px', marginBottom: 14, fontWeight: 500 }}>관리자</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(it => {
          const isActive = it.k === active;
          return (
            <div key={it.k} onClick={() => navigate(it.path)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: T.rMd,
              background: isActive ? T.card : 'transparent',
              color: isActive ? T.ink : T.ink2,
              fontSize: 14, fontWeight: isActive ? 600 : 500, cursor: 'pointer',
            }}>
              <span style={{ width: 16, color: isActive ? T.ink : T.ink3 }}>{it.icon}</span>
              {it.k}
            </div>
          );
        })}
      </div>
    </div>
  );
}
