// API 客户端 - 连接后端
// 注意: 将 BASE_URL 改为你部署后端的实际地址
// 本地测试可用电脑IP: http://192.168.x.x:8000
const BASE_URL = 'http://10.0.2.2:8000/api/v1'; // Android 模拟器访问宿主机

let _token = null;

export function setToken(token) {
  _token = token;
}

export function getToken() {
  return _token;
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }
  const res = await fetch(url, {
    ...options,
    headers,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || '请求失败');
  }
  return data;
}

// ===== 认证 =====
export function register(phone, password, nickname, socialPref, visibility) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      phone,
      password,
      nickname,
      social_pref: socialPref || 'pet_only',
      visibility: visibility || 'pet_card_only',
    }),
  });
}

export function login(phone, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({phone, password}),
  });
}

// ===== 用户 =====
export function getMe() {
  return request('/users/me');
}

// ===== 品种 =====
export function getBreeds() {
  return request('/pets/breeds');
}

// ===== 宠物 =====
export function createPet(data) {
  return request('/pets/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getMyPets() {
  return request('/pets/my');
}

export function getNearbyPets(page = 1) {
  return request(`/pets/nearby/list?page=${page}&page_size=20`);
}

export function matchPet(targetPetId, message = '') {
  return request('/pets/match', {
    method: 'POST',
    body: JSON.stringify({target_pet_id: targetPetId, message}),
  });
}

// ===== 消息 =====
export function sendMessage(receiverId, content) {
  return request('/messages/send', {
    method: 'POST',
    body: JSON.stringify({receiver_id: receiverId, content}),
  });
}

export function getConversations() {
  return request('/messages/conversations');
}

export function getMessages(otherUserId) {
  return request(`/messages/conversation/${otherUserId}`);
}

// ===== 动态 =====
export function createMoment(content, images = []) {
  return request('/moments/create', {
    method: 'POST',
    body: JSON.stringify({content, images}),
  });
}

export function getMoments(page = 1) {
  return request(`/moments/list?page=${page}&page_size=20`);
}
