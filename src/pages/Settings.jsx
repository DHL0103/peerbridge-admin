import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, Btn } from '../tokens';
import { AdminLayout } from '../components/AdminLayout';
import { apiPost } from '../api';

const BATCHES = [
  {
    key: 'expire-loans',
    title: '모집 마감 자동 취소',
    desc: '마감일이 지났는데 목표 금액을 못 채운 대출을 취소하고 투자자에게 전액 환불합니다. 매일 00:10 cron으로도 자동 실행됩니다.',
    path: '/api/loans/admin/run-expire-loans/',
    resultKey: 'cancelled_count',
    resultLabel: '취소된 대출',
  },
  {
    key: 'mark-overdue',
    title: '연체 자동 승급',
    desc: '상환일이 지난 대출을 연체 일수에 따라 OVERDUE_1 → OVERDUE_2 → DEFAULT로 승급합니다. 매일 00:10 cron으로도 자동 실행됩니다.',
    path: '/api/loans/admin/run-mark-overdue/',
    resultKey: 'updated_count',
    resultLabel: '갱신된 대출',
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const [results, setResults] = useState({});
  const [running, setRunning] = useState(null);
  const [error, setError] = useState('');

  async function run(batch) {
    setRunning(batch.key);
    setError('');
    try {
      const data = await apiPost(batch.path, {});
      setResults(prev => ({ ...prev, [batch.key]: { count: data[batch.resultKey], at: new Date() } }));
    } catch (err) {
      if (err.status === 401 || err.status === 403) navigate('/login');
      else setError('배치 실행에 실패했습니다.');
    } finally {
      setRunning(null);
    }
  }

  return (
    <AdminLayout active="시스템 설정">
      <div style={{ fontSize: 13, color: T.ink2, marginBottom: 8 }}>운영 / 시스템 설정</div>
      <h1 style={{ fontFamily: T.fDisp, fontSize: 36, fontWeight: 600, letterSpacing: -1.2, margin: 0 }}>시스템 설정</h1>
      <div style={{ fontSize: 13, color: T.ink2, marginTop: 8 }}>정기 배치를 예정보다 앞당겨 수동으로 실행할 수 있습니다.</div>

      {error && <div style={{ fontSize: 13, color: '#c0392b', marginTop: 16 }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: T.gap, marginTop: 24 }}>
        {BATCHES.map(batch => {
          const result = results[batch.key];
          return (
            <div key={batch.key} style={{ background: T.card, borderRadius: T.rLg, padding: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3 }}>{batch.title}</div>
                <div style={{ fontSize: 12, color: T.ink2, marginTop: 6, lineHeight: 1.6, maxWidth: 560 }}>{batch.desc}</div>
                {result && (
                  <div style={{ fontSize: 12, color: T.green, marginTop: 10 }}>
                    마지막 실행: {result.at.toLocaleTimeString('ko-KR')} · {batch.resultLabel} {result.count}건
                  </div>
                )}
              </div>
              <Btn disabled={running === batch.key} onClick={() => run(batch)}>
                {running === batch.key ? '실행 중...' : '지금 실행'}
              </Btn>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
