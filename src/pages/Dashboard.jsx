import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, Btn, Tag } from '../tokens';
import { Sidebar } from '../components/Sidebar';
import { apiGet, apiPost, getCachedUser, fieldError } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [approving, setApproving] = useState(null);

  function load() {
    apiGet('/api/loans/applications/pending/')
      .then(data => setApplications(data.results))
      .catch(err => {
        if (err.status === 401 || err.status === 403) navigate('/login');
        else setLoadError('심사 대기 목록을 불러오지 못했습니다.');
      });
  }

  useEffect(load, [navigate]);

  async function handleReject(id) {
    if (!window.confirm('이 신청서를 거절할까요?')) return;
    try {
      await apiPost(`/api/loans/applications/${id}/reject/`, {});
      load();
    } catch {
      setLoadError('거절 처리에 실패했습니다.');
    }
  }

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
        <Sidebar active="심사 대기" />
        <div style={{ flex: 1, padding: '32px 56px 0 0' }}>
          <div style={{ fontSize: 13, color: T.ink2, marginBottom: 8 }}>운영 / 심사 대기</div>
          <h1 style={{ fontFamily: T.fDisp, fontSize: 36, fontWeight: 600, letterSpacing: -1.2, margin: 0 }}>
            심사 대기 신청서 {applications ? <span style={{ color: T.ink3 }}>{applications.length}</span> : null}
          </h1>

          {loadError && <div style={{ fontSize: 13, color: '#c0392b', marginTop: 16 }}>{loadError}</div>}

          <div style={{ background: T.card, borderRadius: T.rLg, marginTop: 24 }}>
            {applications && applications.length === 0 && (
              <div style={{ padding: '32px', fontSize: 13, color: T.ink2 }}>심사 대기 중인 신청서가 없습니다.</div>
            )}
            {applications?.map((a, i) => (
              <div key={a.id} style={{ padding: '20px 32px', borderBottom: i < applications.length - 1 ? `1px solid ${T.line}` : 'none', display: 'grid', gridTemplateColumns: '1fr 160px 100px 120px 200px', gap: 20, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{a.purpose}</div>
                  <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>신청 #{a.id}</div>
                </div>
                <div style={{ fontFamily: T.fDisp, fontWeight: 600 }}>{Number(a.amount).toLocaleString()}원</div>
                <Tag>{a.term_months}개월</Tag>
                <div style={{ fontSize: 12, color: T.ink2 }}>{new Date(a.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })} 신청</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn size="sm" onClick={() => setApproving(a)}>승인</Btn>
                  <Btn size="sm" variant="secondary" onClick={() => handleReject(a.id)}>거절</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {approving && (
        <ApproveModal
          application={approving}
          onClose={() => setApproving(null)}
          onDone={() => { setApproving(null); load(); }}
        />
      )}
    </div>
  );
}

const RATE_PRESETS = [
  { grade: 'A (우량)', interest: '7.0', investor: '5.0' },
  { grade: 'B (일반)', interest: '11.0', investor: '8.5' },
  { grade: 'C (중위험)', interest: '15.0', investor: '12.0' },
  { grade: 'D (고위험)', interest: '19.0', investor: '15.5' },
];

function defaultFundingDeadline(termMonths) {
  const d = new Date();
  d.setMonth(d.getMonth() + termMonths);
  return d.toISOString().slice(0, 10);
}

function ApproveModal({ application, onClose, onDone }) {
  const [interestRate, setInterestRate] = useState('');
  const [investorRate, setInvestorRate] = useState('');
  const [fundingDeadline, setFundingDeadline] = useState(() => defaultFundingDeadline(application.term_months));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function applyPreset(preset) {
    setInterestRate(preset.interest);
    setInvestorRate(preset.investor);
  }

  async function handleConfirm() {
    setErrors({});
    setLoading(true);
    try {
      await apiPost(`/api/loans/applications/${application.id}/approve/`, {
        interest_rate: interestRate, investor_rate: investorRate, funding_deadline: fundingDeadline,
      });
      onDone();
    } catch (err) {
      setErrors(err.data || { _general: ['승인 처리에 실패했습니다.'] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(22,20,15,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 440, background: T.card, borderRadius: T.rXl, padding: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: T.ink2 }}>신청서 승인</span>
          <span onClick={onClose} style={{ fontSize: 18, color: T.ink2, cursor: 'pointer' }}>×</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.4, marginBottom: 24 }}>{application.purpose} · {Number(application.amount).toLocaleString()}원</div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: T.ink2, marginBottom: 8 }}>등급별 프리셋 (차주 / 투자자)</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {RATE_PRESETS.map(preset => (
              <span key={preset.grade} onClick={() => applyPreset(preset)} style={{ padding: '6px 12px', background: T.bgSoft, borderRadius: T.rPill, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                {preset.grade} {preset.interest}/{preset.investor}%
              </span>
            ))}
          </div>
        </div>

        <Field label="차주 이율 (연 %, 법정 최고 20%)" value={interestRate} onChange={setInterestRate} error={fieldError(errors, 'interest_rate')} />
        <Field label="투자자 수익률 (연 %, 차주 이율보다 낮아야 함)" value={investorRate} onChange={setInvestorRate} error={fieldError(errors, 'investor_rate')} />
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: T.ink2, marginBottom: 8 }}>모집 마감일</div>
          <input
            type="date" value={fundingDeadline} onChange={e => setFundingDeadline(e.target.value)}
            style={{ width: '100%', background: T.bgSoft, borderRadius: T.rMd, padding: '14px 16px', fontSize: 14, border: `1px solid ${fieldError(errors, 'funding_deadline') ? '#c0392b' : T.line}`, fontFamily: T.fSans, outline: 'none', boxSizing: 'border-box' }}
          />
          {fieldError(errors, 'funding_deadline') && <div style={{ fontSize: 12, color: '#c0392b', marginTop: 6 }}>{fieldError(errors, 'funding_deadline')}</div>}
        </div>

        {errors._general && <div style={{ fontSize: 12, color: '#c0392b', marginBottom: 12 }}>{errors._general[0]}</div>}

        <Btn size="lg" style={{ width: '100%', marginTop: 8 }} disabled={loading || !interestRate || !investorRate || !fundingDeadline} onClick={handleConfirm}>
          {loading ? '처리 중...' : '승인 확정'}
        </Btn>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: T.ink2, marginBottom: 8 }}>{label}</div>
      <input
        type="number" min="0.01" max="20" step="0.1" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', background: T.bgSoft, borderRadius: T.rMd, padding: '14px 16px', fontSize: 14, border: `1px solid ${error ? '#c0392b' : T.line}`, fontFamily: T.fSans, outline: 'none', boxSizing: 'border-box' }}
      />
      {error && <div style={{ fontSize: 12, color: '#c0392b', marginTop: 6 }}>{error}</div>}
    </div>
  );
}
