async function getJson(path){ const r = await fetch(path + '?_=' + Date.now()); return r.json(); }
function uniq(arr){ return [...new Set(arr.filter(Boolean))]; }
function esc(s=''){return s.replace(/[&<>\"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]));}
(async()=>{
  const data = await getJson('data.json');
  const posts = await getJson('posts.json').catch(()=>({items:[]}));
  const courses = data.courses || [];
  const categories = data.categories || [];

  document.getElementById('siteLogo').textContent = data.siteName || '熊猫哥情感';
  document.getElementById('footerText').textContent = data.footerText || '';

  // Contact banner
  if(data.wechat){
    const contactHtml = `<div class="contact-banner">📢 ${data.contactText||'买课程'}：${data.wechat}</div>`;
    document.body.insertAdjacentHTML('afterbegin', contactHtml);
  }

  // Hero section
  const hero = document.querySelector('.hero');
  if(hero && data.showHero===false){ hero.style.display='none'; }
  document.getElementById('heroTitle').textContent = data.heroTitle || '';
  document.getElementById('heroDesc').textContent = data.heroDesc || '';
  document.getElementById('heroChips').innerHTML = (data.heroChips||[]).map(x=>`<span>${esc(x)}</span>`).join('');
  document.getElementById('heroBullets').innerHTML = (data.heroBullets||[]).map(x=>`<li>${esc(x)}</li>`).join('');

  // Articles section
  const articlesSec = document.getElementById('articles');
  if(articlesSec && data.showArticles===false){ articlesSec.style.display='none'; }
  
  // Sort: pinned categories first, then by date
  const pinnedIds = categories.filter(c=>c.pinned).map(c=>c.id);
  const sortedPosts = [...posts.items].sort((a,b)=>{
    const aPinned = pinnedIds.includes(a.category);
    const bPinned = pinnedIds.includes(b.category);
    if(aPinned && !bPinned) return -1;
    if(!aPinned && bPinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  // Group by category (only course and update)
  const coursePosts = sortedPosts.filter(p=>p.category==='course');
  const updatePosts = sortedPosts.filter(p=>p.category==='update');

  let html = '';
  
  // Course category (pinned)
  if(coursePosts.length){
    html += `<div class="category-section"><h2>📚 课程目录与详情</h2><div class="grid posts">`;
    html += coursePosts.map(p=>`<article class="post">${p.cover?`<img class="cover" src="${esc(p.cover)}" alt="cover">`:''}<h3>${esc(p.title)}</h3><p class="meta">${esc(p.date||'')}</p><p>${esc(p.excerpt||'')}</p><a class="btn" href="article.html?id=${encodeURIComponent(p.id)}">阅读</a></article>`).join('');
    html += `</div></div>`;
  }
  
  // Update category
  if(updatePosts.length){
    html += `<div class="category-section"><h2>📢 课程更新</h2><div class="grid posts">`;
    html += updatePosts.map(p=>`<article class="post">${p.cover?`<img class="cover" src="${esc(p.cover)}" alt="cover">`:''}<h3>${esc(p.title)}</h3><p class="meta">${esc(p.date||'')}</p><p>${esc(p.excerpt||'')}</p><a class="btn" href="article.html?id=${encodeURIComponent(p.id)}">阅读</a></article>`).join('');
    html += `</div></div>`;
  }

  const articleList = document.getElementById('articleList');
  if(articleList) articleList.innerHTML = html;

  // Courses section
  const coursesSec = document.getElementById('courses');
  if(coursesSec && data.showCourses===false){ coursesSec.style.display='none'; }
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  if(categoryFilter){
    uniq(courses.map(c=>c.category)).forEach(v=>categoryFilter.insertAdjacentHTML('beforeend',`<option value="${v}">${v}</option>`));
  }
  if(priceFilter){
    uniq(courses.map(c=>c.priceType)).forEach(v=>priceFilter.insertAdjacentHTML('beforeend',`<option value="${v}">${v}</option>`));
  }

  const courseList = document.getElementById('courseList');
  if(courseList){
    function renderCourses(){
      const c = categoryFilter.value, p = priceFilter.value;
      const list = courses.filter(i => (c==='all'||i.category===c) && (p==='all'||i.priceType===p));
      courseList.innerHTML = list.map(i=>`<article class="course"><h3>${esc(i.title)}</h3><p class="meta">${esc(i.category)} ｜ ${esc(i.priceType)} ｜ ${esc(i.price)}</p><p>${esc(i.summary||'')}</p><a class="btn" href="course.html?id=${i.id}">查看详情</a></article>`).join('');
    }
    renderCourses();
    categoryFilter.addEventListener('change', renderCourses);
    priceFilter.addEventListener('change', renderCourses);
  }
})();