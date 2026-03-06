const REPO='xiongcat993/xiongmao-emotion-site';
const BRANCH='main';
const POSTS='posts.json';
async function getPosts(){
  const r=await fetch(POSTS+'?_='+Date.now());
  return r.ok?r.json():{items:[]};
}
function $(id){return document.getElementById(id)}
$('pubBtn').onclick=async()=>{
  try{
    const token=$('token').value.trim();
    if(!token) throw new Error('请先填 GitHub Token');
    const title=$('title').value.trim();
    if(!title) throw new Error('请填写标题');
    const content=$('content').value.trim();
    if(!content) throw new Error('请填写正文');
    const cover=$('cover').value.trim();
    const id='p'+Date.now();
    const date=new Date().toISOString().slice(0,10);
    const excerpt=content.slice(0,60)+'...';
    const posts=await getPosts();
    const newItem={id,title,cover,content,date,excerpt};
    posts.items=[newItem,...posts.items];
    const api=`https://api.github.com/repos/${REPO}/contents/${POSTS}`;
    const old=await fetch(api+`?ref=${BRANCH}`,{headers:{Authorization:`Bearer ${token}`,'Accept':'application/vnd.github+json'}});
    if(!old.ok) throw new Error('读取失败，请检查 Token 权限');
    const oldJson=await old.json();
    const contentB64=btoa(unescape(encodeURIComponent(JSON.stringify(posts,null,2))));
    const put=await fetch(api,{method:'PUT',headers:{Authorization:`Bearer ${token}`,'Accept':'application/vnd.github+json'},body:JSON.stringify({message:'publish: '+title,content:contentB64,sha:oldJson.sha,branch:BRANCH})});
    if(!put.ok) throw new Error('发布失败: '+(await put.text()).slice(0,80));
    $('msg').textContent='发布成功！请访问首页查看。';
    $('title').value='';$('content').value='';$('cover').value='';
  }catch(e){$('msg').textContent=e.message;}}