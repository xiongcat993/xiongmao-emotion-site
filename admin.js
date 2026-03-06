const REPO='xiongcat993/xiongmao-emotion-site'; const BRANCH='main'; const PATH='data.json';
async function getData(){ const r=await fetch('data.json?_='+Date.now()); return r.json(); }
function $(id){return document.getElementById(id)}
(async()=>{ const d=await getData(); $('siteName').value=d.siteName||''; $('heroTitle').value=d.heroTitle||''; $('heroDesc').value=d.heroDesc||''; $('catalogs').value=JSON.stringify(d.catalogs||[],null,2); $('courses').value=JSON.stringify(d.courses||[],null,2); })();
$('saveBtn').onclick=async()=>{ try{ const token=$('token').value.trim(); if(!token) throw new Error('先填 GitHub Token');
  const payload={
    siteName:$('siteName').value.trim(), heroTitle:$('heroTitle').value.trim(), heroDesc:$('heroDesc').value.trim(),
    heroChips:['个人品牌','内容沉淀','课程变现'], heroBullets:['课程目录管理','课程详情展示','持续更新与发布'], footerText:'© 2026 熊猫哥情感',
    catalogs:JSON.parse($('catalogs').value||'[]'), courses:JSON.parse($('courses').value||'[]')
  };
  const api=`https://api.github.com/repos/${REPO}/contents/${PATH}`;
  const old=await fetch(api+`?ref=${BRANCH}`,{headers:{Authorization:`Bearer ${token}`,'Accept':'application/vnd.github+json'}});
  if(!old.ok) throw new Error('读取仓库文件失败，请检查 token 权限');
  const oldJson=await old.json();
  const content=btoa(unescape(encodeURIComponent(JSON.stringify(payload,null,2))));
  const put=await fetch(api,{method:'PUT',headers:{Authorization:`Bearer ${token}`,'Accept':'application/vnd.github+json'},body:JSON.stringify({message:'admin: update site content',content,sha:oldJson.sha,branch:BRANCH})});
  if(!put.ok){ const t=await put.text(); throw new Error('保存失败: '+t.slice(0,120)); }
  $('msg').textContent='保存成功，Cloudflare 正在自动发布（约30-60秒）';
 }catch(e){ $('msg').textContent=e.message; }};