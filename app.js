async function loadData(){
  const res = await fetch('data.json?_=' + Date.now());
  return await res.json();
}
function uniq(arr){ return [...new Set(arr.filter(Boolean))]; }
(async()=>{
  const data = await loadData();
  const posts = data.catalogs || [];
  const courses = data.courses || [];
  document.getElementById('siteLogo').textContent = data.siteName || '熊猫哥情感';
  document.getElementById('heroTitle').textContent = data.heroTitle || '';
  document.getElementById('heroDesc').textContent = data.heroDesc || '';
  document.getElementById('footerText').textContent = data.footerText || '';
  document.getElementById('heroChips').innerHTML = (data.heroChips||[]).map(x=>`<span>${x}</span>`).join('');
  document.getElementById('heroBullets').innerHTML = (data.heroBullets||[]).map(x=>`<li>${x}</li>`).join('');

  const postList = document.getElementById('postList');
  postList.innerHTML = posts.map(p=>`<article class="post"><h3>${p.title}</h3><p class="meta">${p.date||''}</p><p>${p.excerpt||''}</p></article>`).join('');

  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  uniq(courses.map(c=>c.category)).forEach(v=>categoryFilter.insertAdjacentHTML('beforeend',`<option value="${v}">${v}</option>`));
  uniq(courses.map(c=>c.priceType)).forEach(v=>priceFilter.insertAdjacentHTML('beforeend',`<option value="${v}">${v}</option>`));

  const courseList = document.getElementById('courseList');
  function renderCourses(){
    const c = categoryFilter.value, p = priceFilter.value;
    const list = courses.filter(i => (c==='all'||i.category===c) && (p==='all'||i.priceType===p));
    courseList.innerHTML = list.map(i=>`<article class="course"><h3>${i.title}</h3><p class="meta">${i.category} ｜ ${i.priceType} ｜ ${i.price}</p><p>${i.summary||''}</p><a class="btn" href="course.html?id=${i.id}">查看详情</a></article>`).join('');
  }
  renderCourses();
  categoryFilter.addEventListener('change', renderCourses);
  priceFilter.addEventListener('change', renderCourses);
})();