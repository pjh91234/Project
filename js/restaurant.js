// 샘플 데이터 (나중에 data/restaurants.json으로 분리 가능)
const restaurants = [
  { id:1, name:"홍성 마라미방", category:["중식"], rating:4.5, reviews:18, desc:"사천요리 전문점", img:"../images/홍성 마라미방.jpg", lat:37.299670, lng:126.838343 },
  { id:2, name:"은화수 식당", category:["돈까스"], rating:4.1, reviews:64, desc:"경양식 돈까스 맛집", img:"../images/은화수 식당.webp", lat:37.300241, lng:126.838662 },
  { id:3, name:"자이카", category:["인도 요리"], rating:4.1, reviews:7, desc:"이색적인 인도 전통음식", img:"../images/자이카.jpg", lat:37.300278, lng:126.838680 },
  { id:4, name:"대홍 훠궈 샤브샤브", category:["중식"], rating:5.0, reviews:4, desc:"샤브샤브 무한리필", img:"../images/대홍 훠궈 샤브샤브.jpg", lat:37.300203, lng:126.838548 },
  { id:5, name:"미쳐버린파닭", category:["치킨"], rating:4.3, reviews:16, desc:"다양한 메뉴, 푸짐한 양", img:"../images/미쳐버린파닭.webp", lat:37.299862, lng:126.838422 },
  { id:6, name:"앤의 식탁", category:["유러피안"], rating:4.3, reviews:48, desc:"유럽 가정식 맛집", img:"../images/앤의 식탁.jpg", lat:37.301106, lng:126.838682 },
  { id:7, name:"일미닭갈비파전", category:["닭갈비"], rating:4.5, reviews:90, desc:"우동사리+볶음밥 강추", img:"../images/일미닭갈비파전.webp", lat:37.299490, lng:126.838412 },
  { id:8, name:"카바레 식당", category:["일식"], rating:4.0, reviews:226, desc:"카레 중심, 덮밥도 인기", img:"../images/카바레 식당.webp", lat:37.301082, lng:126.837393 },
  { id:9, name:"한그릇", category:["일식"], rating:4.3, reviews:33, desc:"다양한 해산물 덮밥", img:"../images/한그릇.webp", lat:37.300086, lng:126.839320 },
  { id:10, name:"에비수", category:["일식"], rating:4.1, reviews:323, desc:"맛있는 초밥", img:"../images/에비수.webp", lat:37.301435, lng:126.839541 },
  { id:11, name:"남월", category:["베트남 요리"], rating:4.2, reviews:481, desc:"분위기 좋은 쌀국수 맛집", img:"../images/남월.webp", lat:37.301380, lng:126.838333 },
  { id:12, name:"젤리 팩토리", category:["족발"], rating:4.2, reviews:34, desc:"밑반찬이 푸짐한 족발집", img:"../images/젤리 팩토리.webp", lat:37.300250, lng:126.839763 },
  { id:13, name:"밀플랜비", category:["부리또"], rating:4.4, reviews:296, desc:"포장이 간편한 부리또 세트", img:"../images/밀플랜비.webp", lat:37.300224, lng:126.839283 },
  { id:14, name:"코운즈", category:["일식"], rating:4.5, reviews:2, desc:"생면이 일품인 라멘/돈카츠 맛집", img:"../images/코운즈.webp", lat:37.301889, lng:126.838621 }
];

// DOM 요소
const listEl = document.getElementById('list');
const searchEl = document.getElementById('search');
const catEl = document.getElementById('category');
const sortEl = document.getElementById('sort');
// --- DOM 요소 추가 참조 (파일 상단에 이미 선언돼 있지 않다면 선언)
const favPriorityEl = document.getElementById('favPriority');
const favOnlyBtn = document.getElementById('favOnlyBtn');

let map, markersGroup;
const markerById = new Map();

// 로컬 저장된 restaurants 덮어쓰기(옵션)
(function loadSavedData(){
  const saved = localStorage.getItem('restaurants_data');
  if(saved){
    try{
      const parsed = JSON.parse(saved);
      if(Array.isArray(parsed) && parsed.length) {
        restaurants.splice(0, restaurants.length, ...parsed);
      }
    }catch(e){ console.warn('saved parse error', e); }
  }
})();

function init(){
  // 1) 지도 및 기본 초기화
  initMap();
  populateCategories();

  // 2) DOM 필수 요소가 있는지 빠른 검사(디버깅용)
  if(!listEl || !searchEl || !catEl || !sortEl){
    console.error('초기화 실패: 필수 DOM 요소가 없습니다.', { listEl, searchEl, catEl, sortEl });
    return;
  }

  // 3) 정렬 기본값 복원 또는 기본값 설정
  const savedSort = localStorage.getItem('sortPref');
  sortEl.value = savedSort || 'reviews';

  // 4) 이벤트 바인딩 (한 번만)
  attachEvents();

  // 5) 즐겨찾기 컨트롤 연결 (favOnly 상태 복원 포함)
  attachFavoriteControls();

  // 6) 초기 렌더: 필터 + 즐겨찾기 옵션 적용
  const initial = getFiltered();
  const initialOut = applyFavoriteOptions(initial);
  render(initialOut);
  refreshMarkersByFiltered ? refreshMarkersByFiltered(initialOut) : addMarkers(initialOut);

  // 7) (선택) 콘솔로 로딩 완료 알림
  console.log('init complete — restaurants:', restaurants.length);
}

// --- 파일 맨 아래에 한 번만 호출 ---
init();

// 카테고리 채우기 (단일선택)
function populateCategories(){
  const cats = [...new Set(restaurants.flatMap(r=>r.category || []))];
  cats.forEach(c=>{
    const opt = document.createElement('option'); opt.value = c; opt.textContent = c;
    catEl.appendChild(opt);
  });
}

function render(data){
  listEl.innerHTML = '';
  data.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.dataset.id = r.id; // ← 여기 꼭 필요함

    card.innerHTML = `
      <img src="${r.img}" alt="${r.name}" />
      <div class="meta">
        <h3>${r.name} <span class="restaurant-badge">${(r.category||[]).join(' · ')}</span></h3>
        <p>평점: <strong class="rating-value">${Number(r.rating).toFixed(1)}</strong> <small>(${r.reviews ?? 0}명)</small> · ${r.desc}</p>
      </div>
      <div class="restaurant-actions">
        <button type="button" class="restaurant-btn">상세보기</button>
        <button type="button" class="restaurant-fav">${isFav(r.id) ? '♥' : '♡'} 즐겨찾기</button>
      </div>
    `;
    listEl.appendChild(card);
  });
}

// 필터링 & 정렬
function getFiltered(){
  const q = searchEl?.value.trim().toLowerCase() || '';
  const cat = catEl?.value || '';
  let data = (restaurants || []).filter(r=>{
    const text = ((r.name||'') + ' ' + (r.desc||'') + ' ' + ((r.category||[]).join(' '))).toLowerCase();
    const matchQ = !q || text.includes(q);
    const matchCat = !cat || (r.category || []).includes(cat);
    return matchQ && matchCat;
  });

  // 정렬 처리
  const sortVal = sortEl?.value || 'default';
  if (sortVal === 'rating') {
    data.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  } else if (sortVal === 'reviews') {
    data.sort((a, b) => {
      const ra = Number(a.reviews) || 0;
      const rb = Number(b.reviews) || 0;
      if (rb !== ra) return rb - ra;
      return (Number(b.rating) || 0) - (Number(a.rating) || 0);
    });
  }

  return data; // ← 꼭 반환
}

function attachEvents(){
  searchEl.addEventListener('input', ()=> { const f = getFiltered(); const out = applyFavoriteOptions ? applyFavoriteOptions(f) : f; render(out); refreshMarkersByFiltered(out); });
  catEl.addEventListener('change', ()=> { const f = getFiltered(); const out = applyFavoriteOptions ? applyFavoriteOptions(f) : f; render(out); refreshMarkersByFiltered(out); });
  sortEl.addEventListener('change', ()=> { const f = getFiltered(); const out = applyFavoriteOptions ? applyFavoriteOptions(f) : f; render(out); refreshMarkersByFiltered(out); });

listEl.addEventListener('click', e=>{
  const cardEl = e.target.closest('.restaurant-card');
  if(!cardEl) return;
  const id = Number(cardEl.dataset.id);

  const btnDetail = e.target.closest('.restaurant-btn');
  const btnFav = e.target.closest('.restaurant-fav');
  const btnEdit = e.target.closest('.restaurant-edit');

  if(btnDetail){
    const r = restaurants.find(x=>x.id===id);
    if(r) alert(`${r.name}\n평점: ${Number(r.rating).toFixed(1)} (${r.reviews ?? 0}명)\n${r.desc}`);
    return;
  }

  if(btnEdit){
    editRating(id);
    return;
  }

  if(btnFav){
    const newState = toggleFav(id); // toggleFav이 boolean 반환하도록 수정 권장
    btnFav.textContent = newState ? '♥ 즐겨찾기' : '♡ 즐겨찾기';
    const f = getFiltered();
    const out = applyFavoriteOptions ? applyFavoriteOptions(f) : f;
    render(out);
    refreshMarkersByFiltered(out);
    return;
  }

  // 카드 본문 클릭 → 지도 이동
  panToRestaurant(id);
});
}

function getFavs(){ 
  try { return JSON.parse(localStorage.getItem('favs') || '[]'); }
  catch(e){ return []; }
}
function isFav(id){ return getFavs().includes(id); }

function toggleFav(id){
  let favs = getFavs();
  if(favs.includes(id)) favs = favs.filter(x=>x!==id);
  else favs.push(id);
  localStorage.setItem('favs', JSON.stringify(favs));
  return favs.includes(id);
}

// ========== Leaflet 지도 초기화 & 마커 관리 ==========
function initMap(){
  // 초기 중심(필요에 따라 변경)
  map = L.map('map').setView([37.5665, 126.9780], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  if(typeof L.markerClusterGroup === 'function'){
    markersGroup = L.markerClusterGroup();
  } else {
    markersGroup = L.layerGroup();
  }
  markersGroup.addTo(map);
}

// 마커 추가 (주어진 데이터로)
function addMarkers(data){
  markersGroup.clearLayers?.();
  markerById.clear();
  data.forEach(r=>{
    if(!r.lat || !r.lng) return;
    const marker = L.marker([r.lat, r.lng]);
    const popupHtml = `
      <div style="min-width:180px">
        <strong>${r.name}</strong><br/>
        평점: ${Number(r.rating).toFixed(1)} (${r.reviews ?? 0}명)<br/>
        ${r.desc}<br/>
        <button onclick="openDetailFromPopup(${r.id})">상세보기</button>
      </div>`;
    marker.bindPopup(popupHtml);
    markersGroup.addLayer(marker);
    markerById.set(r.id, marker);
  });
  // 마커가 하나 이상이면 화면 맞춤
  const latlngs = Array.from(markerById.values()).map(m=>m.getLatLng());
  if(latlngs.length) map.fitBounds(latlngs, {padding:[40,40]});
}

// 카드 클릭 시 지도 이동/팝업 열기
function panToRestaurant(id){
  const marker = markerById.get(id);
  if(!marker) return;
  map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15), { animate:true });
  marker.openPopup();
}

// 팝업 내부 버튼용 전역 함수
window.openDetailFromPopup = function(id){
  const r = restaurants.find(x=>x.id===id);
  if(!r) return;
  alert(`상세보기: ${r.name}\n평점: ${r.rating.toFixed(1)} (${r.reviews ?? 0}명)\n${r.desc}`);
};

// 필터된 데이터로 마커 갱신
function refreshMarkersByFiltered(filtered){
  addMarkers(filtered);
}

// 초기 실행
init();

// 즐겨찾기만 보기 상태 저장(선택사항: 페이지 재방문시 기억)
function setFavOnlyState(state){
  if(state) localStorage.setItem('favOnly', '1');
  else localStorage.removeItem('favOnly');
}
function getFavOnlyState(){
  return localStorage.getItem('favOnly') === '1';
}

function applyFavoriteOptions(data){
  const arr = Array.isArray(data) ? [...data] : [];
  // 즐겨찾기만 보기 모드가 켜져 있으면 그 조건으로 필터
  if(favOnlyBtn && favOnlyBtn.classList.contains('active')){
    return arr.filter(r => isFav(r.id));
  }
  // 즐겨찾기 우선 체크박스가 있으면 우선정렬
  if(favPriorityEl && favPriorityEl.checked){
    const favs = [], others = [];
    arr.forEach(r => {
      if(isFav(r.id)) favs.push(r);
      else others.push(r);
    });
    return [...favs, ...others];
  }
  return arr;
}

function attachFavoriteControls(){
  if(favPriorityEl){
    favPriorityEl.addEventListener('change', ()=>{
      const f = getFiltered();
      const out = applyFavoriteOptions(f);
      render(out);
      refreshMarkersByFiltered(out);
    });
  }

  if(favOnlyBtn){
    favOnlyBtn.addEventListener('click', ()=>{
      favOnlyBtn.classList.toggle('active');
      // 상태 저장(선택적)
      if(favOnlyBtn.classList.contains('active')) localStorage.setItem('favOnly','1');
      else localStorage.removeItem('favOnly');

      const f = getFiltered();
      const out = applyFavoriteOptions(f);
      render(out);
      refreshMarkersByFiltered(out);
    });

    // 페이지 로드 시 이전 상태 복원
    if(localStorage.getItem('favOnly') === '1'){
      favOnlyBtn.classList.add('active');
    }
  }
}

// 기존 attachEvents() 끝이나 init()에서 attachFavoriteControls() 호출해줘
// 예: function init(){ ... attachEvents(); attachFavoriteControls(); ... }
