import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, Tag } from '../tokens';
import { AdminLayout } from '../components/AdminLayout';
import { apiGet } from '../api';

const STATUS_LABEL = {
  FUNDRAISING: '모집중', ACTIVE: '실행중', OVERDUE_1: '연체 1단계', OVERDUE_2: '연체 2단계',
  DEFAULT: '부실', WRITTEN_OFF: '상각', COMPLETED: '완료', CANCELLED: '모집취소',
};
const STATUS_TONE = {
  FUNDRAISING: 'neutral', ACTIVE: 'green', OVERDUE_1: 'red', OVERDUE_2: 'red',
  DEFAULT: 'red', WRITTEN_OFF: 'red', COMPLETED: 'neutral', CANCELLED: 'neutral',
};
const FILTERS = ['전체', 'FUNDRAISING', 'ACTIVE', 'OVERDUE_1', 'OVERDUE_2', 'DEFAULT', 'COMPLETED', 'CANCELLED'];

export default function Products() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('전체');

  useEffect(() => {
    const query = filter === '전체' ? '' : `?status=${filter}`;
    apiGet(`/api/loans/${query}`)
      .then(data => setLoans(data.results))
      .catch(err => {
        if (err.status === 401) navigate('/login');
        else setLoadError('대출 상품 목록을 불러오지 못했습니다.');
      });
  }, [navigate, filter]);

  return (
    <AdminLayout active="진행 상품">
      <div style={{ fontSize: 13, color: T.ink2, marginBottom: 8 }}>운영 / 진행 상품</div>
      <h1 style={{ fontFamily: T.fDisp, fontSize: 36, fontWeight: 600, letterSpacing: -1.2, margin: 0 }}>
        대출 상품 {loans ? <span style={{ color: T.ink3 }}>{loans.length}</span> : null}
      </h1>

      <div style={{ display: 'flex', gap: 8, marginTop: 24, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <span key={f} onClick={() => setFilter(f)} style={{ padding: '8px 14px', borderRadius: T.rPill, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: filter === f ? T.ink : T.card, color: filter === f ? T.card : T.ink2 }}>
            {f === '전체' ? '전체' : STATUS_LABEL[f]}
          </span>
        ))}
      </div>

      {loadError && <div style={{ fontSize: 13, color: '#c0392b', marginBottom: 16 }}>{loadError}</div>}

      <div style={{ background: T.card, borderRadius: T.rLg }}>
        {loans && loans.length === 0 && (
          <div style={{ padding: '32px', fontSize: 13, color: T.ink2 }}>해당하는 대출 상품이 없습니다.</div>
        )}
        {loans?.map((l, i) => {
          const progress = Number(l.target_amount) > 0 ? Number(l.funded_amount) / Number(l.target_amount) : 0;
          return (
            <div key={l.id} style={{ padding: '20px 32px', borderBottom: i < loans.length - 1 ? `1px solid ${T.line}` : 'none', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 100px', gap: 20, alignItems: 'center' }}>
              <div>
                <div style={{ marginBottom: 6 }}><Tag tone={STATUS_TONE[l.status]}>{STATUS_LABEL[l.status]}</Tag></div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{l.purpose}</div>
                <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>#{l.id} · 마감 {l.funding_deadline}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.ink2 }}>목표 / 모집</div>
                <div style={{ fontFamily: T.fDisp, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{Number(l.target_amount).toLocaleString()}원</div>
                <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>{Number(l.funded_amount).toLocaleString()}원 모집</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.ink2, marginBottom: 6 }}>모집률 {Math.round(progress * 1000) / 10}%</div>
                <div style={{ height: 4, background: T.bg, borderRadius: T.rPill, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(progress * 100, 100)}%`, height: '100%', background: T.ink }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.ink2 }}>금리(차주/투자자)</div>
                <div style={{ fontFamily: T.fDisp, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{Number(l.interest_rate).toFixed(1)}% / {Number(l.investor_rate).toFixed(1)}%</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 13, color: T.ink2 }}>{l.term_months}개월</div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
