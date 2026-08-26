import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, Btn } from '../tokens';
import { BrandWordmark } from '../components/Brand';
import { apiGet, apiPost, cacheUser, saveTokens, logout } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await apiPost('/api/auth/login/', { username, password });
      saveTokens(tokens);
      const profile = await apiGet('/api/auth/me/');
      if (!profile.is_staff) {
        await logout();
        setError('관리자 계정이 아닙니다.');
        return;
      }
      cacheUser(profile);
      navigate('/');
    } catch (err) {
      setError(err.data?.detail || '아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: T.ink, fontFamily: T.fSans, color: T.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 380 }}>
        <div style={{ marginBottom: 40 }}>
          <BrandWordmark size={26} wordSize={18} gap={10} color={T.card} />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>관리자 콘솔</div>
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="아이디" value={username} onChange={e => setUsername(e.target.value)} />
          <Field label="비밀번호" type="password" value={password} onChange={e => setPassword(e.target.value)} />

          {error && <div style={{ fontSize: 12, color: '#e08070', marginTop: 4 }}>{error}</div>}

          <Btn size="lg" type="submit" disabled={loading} style={{ width: '100%', marginTop: 20 }}>
            {loading ? '로그인 중...' : '로그인'}
          </Btn>
        </form>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>{label}</div>
      <input
        type={type} value={value} onChange={onChange} required
        style={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 16px', fontSize: 14, color: '#fff', border: '1px solid rgba(255,255,255,0.16)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  );
}
