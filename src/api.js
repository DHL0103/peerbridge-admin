// ?? 사용: 빈 문자열은 "같은 origin으로 상대경로 호출"이라는 의도된 값이라
// ||였다면 falsy라서 fallback으로 덮였을 것 — 프로덕션 배포 시 실제로 겪은 버그.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

function authHeaders() {
  const token = localStorage.getItem('pb_access');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export function saveTokens({ access, refresh }) {
  localStorage.setItem('pb_access', access);
  localStorage.setItem('pb_refresh', refresh);
}

// refresh 토큰을 서버에서 블랙리스트 처리한다. 이미 무효화됐거나 네트워크가
// 실패해도 로컬 세션은 항상 정리해야 하므로 결과와 무관하게 finally에서 클리어한다.
export async function logout() {
  const refresh = localStorage.getItem('pb_refresh');
  try {
    if (refresh) await apiPost('/api/auth/logout/', { refresh });
  } catch {
    // 이미 로그아웃된 토큰이거나 네트워크 오류 — 로컬 세션 정리는 계속 진행한다.
  } finally {
    localStorage.removeItem('pb_access');
    localStorage.removeItem('pb_refresh');
    localStorage.removeItem('pb_user');
  }
}

// 로그인 직후 받아온 프로필을 저장해서, 페이지 이동마다 /api/auth/me/ 를 다시 안 부르고
// AppNav 같은 곳에서 바로 표시할 수 있게 한다.
export function cacheUser(profile) {
  localStorage.setItem('pb_user', JSON.stringify(profile));
}

export function getCachedUser() {
  try {
    return JSON.parse(localStorage.getItem('pb_user'));
  } catch {
    return null;
  }
}

// 필드별 에러({username: [...], email: [...]}) 중 첫 메시지 하나만 뽑아온다.
export function fieldError(errData, field) {
  return errData?.[field]?.[0];
}
