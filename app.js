async function getJson(path){ const r = await fetch(path + '?_=' + Date.now()); return r.json(); }
function esc(s=''){return s.replace(/[&<>\"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]));}
(async()=>{
  const data = await getJson('data.json');
  const posts = await getJson('posts.json').catch(()=>({items:[]}));

  document.getElementById('siteLogo').textContent = data.siteName || '熊猫哥情感';
  document.getElementById('footerText').textContent = data.footerText || '';

  if(data.wechat){
    const contactHtml = `<div class="contact-banner">📢 ${data.contactText||'买课程'}：${data.wechat}</div>`;
    document.body.insertAdjacentHTML('afterbegin', contactHtml);
  }

  const hero = document.querySelector('.hero');
  if(hero && data.showHero===false){ hero.style.display='none'; }
  document.getElementById('heroTitle').textContent = data.heroTitle || '';
  document.getElementById('heroDesc').textContent = data.heroDesc || '';
  document.getElementById('heroChips').innerHTML = (data.heroChips||[]).map(x=>`<span>${esc(x)}</span>`).join('');

  // 直接显示所有文章
  const articleList = document.getElementById('articleList');
  if(posts.items && posts.items.length > 0){
    articleList.innerHTML = posts.items.map(p=>`<article class="post">
      ${p.cover?`<img class="cover" src="${esc(p.cover)}" alt="cover">`:''}
      <h3>${esc(p.title)}</h3>
      <p class="meta">${esc(p.date||'')}</p>
      <p>${esc(p.excerpt||'')}</p>
      <a class="btn" href="article.html?id=${encodeURIComponent(p.id)}">阅读</a>
    </article>`).join('');
  } else {
    articleList.innerHTML = '<p>暂无文章</p>';
  }
})();