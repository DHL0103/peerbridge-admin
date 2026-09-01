import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, Tag } from '../tokens';
import { AdminLayout } from '../components/AdminLayout';
import { apiGet } from '../api';

const STATUS_LABEL = { OVERDUE_1: '연체 1단계', OVERDUE_2: '연체 2단계', DEFAULT: '부실' };
const STATUSES = ['OVERDUE_1', 'OVERDUE_2', 'DEFAULT'];

export default function Risk() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    Promise.all(STATUSES.map(s => apiGet(`/api/loans/?status=${s}`)))
      .then(results => {
        const merged = results.flatMap(r => r.results);
        merged.sort((a, b) => STATUSES.indexOf(b.status) - STATUSES.indexOf(a.status));
        setLoans(merged);
      })
      .catch(err => {
        if (err.status === 401) navigate('/login');
        else setLoadError('연체 대출 목록을 불러오지 못했습니다.');
      });
  }, [navigate]);

  return (
    <AdminLayout active="리스크">
      <div style={{ fontSize: 13, color: T.ink2, marginBottom: 8 }}>운영 / 리스크</div>
      <h1 style={{ fontFamily: T.fDisp, fontSize: 36, fontWeight: 600, letterSpacing: -1.2, margin: 0 }}>
        연체 대출 {loans ? <span style={{ color: T.ink3 }}>{loans.length}</span> : null}
      </h1>
      <div style={{ fontSize: 13, color: T.ink2, marginTop: 8 }}>연체 단계는 상환일 경과 일수 기준(1~30일/31~90일/91일+)으로 매일 자동 승급됩니다.</div>

      {loadError && <div style={{ fontSize: 13, color: '#c0392b', marginTop: 16 }}>{loadError}</div>}

      <div style={{ background: T.card, borderRadius: T.rLg, marginTop: 24 }}>
        {loans && loans.length === 0 && (
          <div style={{ padding: '32px', fontSize: 13, color: T.ink2 }}>연체 중인 대출이 없습니다.</div>
        )}
        {loans?.map((l, i) => (
          <div key={l.id} style={{ padding: '20px 32px', borderBottom: i < loans.length - 1 ? `1px solid ${T.line}` : 'none', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 20, alignItems: 'center' }}>
            <div>
              <div style={{ marginBottom: 6 }}><Tag tone="red">{STATUS_LABEL[l.status]}</Tag></div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{l.purpose}</div>
              <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>#{l.id}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.ink2 }}>모집 금액</div>
              <div style={{ fontFamily: T.fDisp, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{Number(l.funded_amount).toLocaleString()}원</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.ink2 }}>차주 금리(연체가산 전)</div>
              <div style={{ fontFamily: T.fDisp, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{Number(l.interest_rate).toFixed(1)}%</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.ink2 }}>약정 기간</div>
              <div style={{ fontFamily: T.fDisp, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{l.term_months}개월</div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
