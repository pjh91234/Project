// 샘플 데이터 (나중에 data/restaurants.json으로 분리 가능)
const restaurants = [
  { id:1, name:"홍성 마라미방", category:"중식", rating:4.5, reviews:18, desc:"사천요리 전문점", img:"../images/홍성 마라미방.jpg" },
  { id:2, name:"은화수 식당", category:"돈까스", rating:4.1, reviews:64, desc:"경양식 돈까스 맛집", img:"../images/은화수 식당.webp" },
  { id:3, name:"자이카", category:"인도 요리", rating:4.1, reviews:7, desc:"이색적인 인도 전통음식", img:"../images/자이카.jpg" },
  { id:4, name:"대홍 훠궈 샤브샤브", category:"중식", rating:5.0, reviews:4, desc:"샤브샤브 무한리필", img:"../images/대홍 훠궈 샤브샤브.jpg" },
  { id:5, name:"미쳐버린파닭", category:"치킨", rating:4.3, reviews:16, desc:"다양한 메뉴, 푸짐한 양", img:"../images/미쳐버린파닭.webp" },
  { id:6, name:"앤의 식탁", category:"유러피안", rating:4.3, reviews:48, desc:"유럽 가정식 맛집", img:"../images/앤의 식탁.jpg" }
  { id:7, name:"일미닭갈비파전", category:"닭갈비", rating:4.5, reviews:90, desc:"우동사리+볶음밥 강추", img:"../images/일미닭갈비파전.webp" },
  { id:8, name:"카바레 식당", category:"일식", rating:4.0, reviews:226, desc:"카레 중심, 덮밥도 인기", img:"../images/카바레 식당.webp" },
  { id:9, name:"한그릇", category:"일식", rating:4.3, reviews:33, desc:"다양한 해산물 덮밥", img:"../images/한그릇.webp" },
  { id:10, name:"에비수", category:"일식", rating:4.1, reviews:323, desc:"맛있는 초밥", img:"../images/에비수.webp" },
  { id:11, name:"남월", category:"베트남 요리", rating:4.2, reviews:481, desc:"분위기 좋은 쌀국수 맛집", img:"../images/남월.webp" },
  { id:12, name:"젤리 팩토리", category:"족발", rating:4.2, reviews:34, desc:"밑반찬이 푸짐한 족발집", img:"../images/젤리 팩토리.webp" },
  { id:13, name:"밀플랜비", category:"부리또", rating:4.4, reviews:296, desc:"포장이 간편한 부리또 세트", img:"../images/밀플랜비.webp" },
  { id:14, name:"코운즈", category:"일식", rating:4.5, reviews:2, desc:"생면이 일품인 라멘/돈카츠 맛집", img:"../images/코운즈.webp" }
];

const listEl = document.getElementById('list');
const searchEl = document.getElementById('search');
const catEl = document.getElementById('category');
const sortEl = document.getElementById('sort');

function init(){
  populateCategories();
  render(restaurants);
  attachEvents();
}

function populateCategories(){
  const cats = [...new Set(restaurants.map(r=>r.category))];
  cats.forEach(c=>{
    const o = document.createElement('option'); o.value=c; o.textContent=c;
    catEl.appendChild(o);
  });
}

function render(data){
  listEl.innerHTML = '';
  data.forEach(r=>{
    const card = document.createElement('div'); card.className='restaurant-card';
    card.innerHTML = `
      <img src="${r.img}" alt="${r.name}" />
      <div class="meta">
        <h3>${r.name} <span class="restaurant-badge">${r.category}</span></h3>
        <p>평점: ${r.rating.toFixed(1)} <span class="review-count">(${r.reviews})</span> · ${r.desc}</p>
      </div>
      <div class="restaurant-actions">
        <button class="restaurant-btn" data-id="${r.id}">상세보기</button>
        <button class="restaurant-fav" data-id="${r.id}">${isFav(r.id) ? '♥' : '♡'} 즐겨찾기</button>
      </div>
    `;
    listEl.appendChild(card);
  });
}

function getFiltered(){
  const q = searchEl.value.trim().toLowerCase();
  const cat = catEl.value;
  let data = restaurants.filter(r=>{
    const matchQ = r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    const matchCat = cat ? r.category === cat : true;
    return matchQ && matchCat;
  });
  if(sortEl.value === 'rating') data.sort((a,b)=>b.rating - a.rating);
  return data;
}

function attachEvents(){
  searchEl.addEventListener('input', ()=> render(getFiltered()));
  catEl.addEventListener('change', ()=> render(getFiltered()));
  sortEl.addEventListener('change', ()=> render(getFiltered()));
  listEl.addEventListener('click', e=>{
    const id = e.target.dataset.id && Number(e.target.dataset.id);
    if(!id) return;
    if(e.target.classList.contains('restaurant-btn')){
      alert('상세보기: ' + id); // 나중에 모달로 대체
    } else if(e.target.classList.contains('restaurant-fav')){
      toggleFav(id);
      e.target.textContent = isFav(id) ? '♥ 즐겨찾기' : '♡ 즐겨찾기';
    }
  });
}

// 즐겨찾기(localStorage)
function getFavs(){ return JSON.parse(localStorage.getItem('favs')||'[]'); }
function isFav(id){ return getFavs().includes(id); }
function toggleFav(id){
  let favs = getFavs();
  if(favs.includes(id)) favs = favs.filter(x=>x!==id); else favs.push(id);
  localStorage.setItem('favs', JSON.stringify(favs));
}


init();
