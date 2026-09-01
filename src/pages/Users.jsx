import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, Btn, Tag } from '../tokens';
import { AdminLayout } from '../components/AdminLayout';
import { apiGet, apiPost } from '../api';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState(null);

  function load() {
    apiGet('/api/auth/admin/users/')
      .then(data => setUsers(data.results))
      .catch(err => {
        if (err.status === 401 || err.status === 403) navigate('/login');
        else setLoadError('회원 목록을 불러오지 못했습니다.');
      });
  }

  useEffect(load, [navigate]);

  async function handleToggle(user) {
    const action = user.is_active ? '비활성화' : '활성화';
    if (!window.confirm(`${user.username} 계정을 ${action}할까요?`)) return;
    setBusyId(user.id);
    try {
      await apiPost(`/api/auth/admin/users/${user.id}/toggle-active/`, {});
      load();
    } catch {
      setLoadError('처리에 실패했습니다.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminLayout active="회원 관리">
      <div style={{ fontSize: 13, color: T.ink2, marginBottom: 8 }}>운영 / 회원 관리</div>
      <h1 style={{ fontFamily: T.fDisp, fontSize: 36, fontWeight: 600, letterSpacing: -1.2, margin: 0 }}>
        회원 {users ? <span style={{ color: T.ink3 }}>{users.length}</span> : null}
      </h1>

      {loadError && <div style={{ fontSize: 13, color: '#c0392b', marginTop: 16 }}>{loadError}</div>}

      <div style={{ background: T.card, borderRadius: T.rLg, marginTop: 24 }}>
        {users && users.length === 0 && (
          <div style={{ padding: '32px', fontSize: 13, color: T.ink2 }}>등록된 회원이 없습니다.</div>
        )}
        {users?.map((u, i) => (
          <div key={u.id} style={{ padding: '18px 32px', borderBottom: i < users.length - 1 ? `1px solid ${T.line}` : 'none', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 120px 100px 110px', gap: 20, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{u.first_name || u.username} <span style={{ color: T.ink3, fontWeight: 400 }}>@{u.username}</span></div>
              <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>{u.email}</div>
            </div>
            <div style={{ fontFamily: T.fDisp, fontSize: 14, fontWeight: 600 }}>{Number(u.balance).toLocaleString()}원</div>
            <div style={{ fontSize: 12, color: T.ink2 }}>{new Date(u.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })} 가입</div>
            <div>{u.is_staff && <Tag tone="dark">관리자</Tag>}</div>
            <div><Tag tone={u.is_active ? 'green' : 'red'}>{u.is_active ? '활성' : '비활성'}</Tag></div>
            <Btn size="sm" variant="secondary" disabled={busyId === u.id} onClick={() => handleToggle(u)}>
              {u.is_active ? '비활성화' : '활성화'}
            </Btn>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
