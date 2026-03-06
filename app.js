const postList = document.getElementById('postList');
const courseList = document.getElementById('courseList');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');

function renderPosts() {
  postList.innerHTML = posts.map(p => `
    <article class="post">
      <h3>${p.title}</h3>
      <p class="meta">${p.date}</p>
      <p>${p.excerpt}</p>
    </article>
  `).join('');
}

function renderCourses() {
  const c = categoryFilter.value;
  const p = priceFilter.value;
  const list = courses.filter(i =>
    (c === 'all' || i.category === c) &&
    (p === 'all' || i.priceType === p)
  );
  courseList.innerHTML = list.map(i => `
    <article class="course">
      <h3>${i.title}</h3>
      <p class="meta">${i.category} ｜ ${i.priceType} ｜ ${i.price}</p>
      <p>${i.summary}</p>
      <a class="btn" href="course.html?id=${i.id}">查看详情</a>
    </article>
  `).join('');
}

if (postList) renderPosts();
if (courseList) {
  renderCourses();
  categoryFilter.addEventListener('change', renderCourses);
  priceFilter.addEventListener('change', renderCourses);
}
