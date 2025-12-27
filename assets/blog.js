
(function(){
  function qs(name){
    const params=new URLSearchParams(location.search);
    return params.get(name);
  }

  function getLang(){
    if(window.SiteI18n && typeof window.SiteI18n.getLang==='function'){
      return window.SiteI18n.getLang();
    }
    const q=qs('lang');
    if(q) return q;
    const stored=localStorage.getItem('site_lang');
    return stored||'en';
  }

  function setLang(lang){
    if(window.SiteI18n && typeof window.SiteI18n.setLang==='function'){
      return window.SiteI18n.setLang(lang);
    }
    localStorage.setItem('site_lang',lang);
  }

  function formatDate(d,lang){
    const dt=new Date(d);
    if(isNaN(dt)) return d;
    if(lang==='ja') return dt.getFullYear()+'年'+(dt.getMonth()+1)+'月'+dt.getDate()+'日';
    return dt.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
  }

  async function fetchIndex(){
    const res=await fetch('/posts/index.json');
    return res.json();
  }

  function createTagList(tags){
    if(!tags||!tags.length) return '';
    return '<span class="tags">'+tags.map(t=>'<span class="tag">'+t+'</span>').join(' ')+'</span>';
  }

  async function renderList(){
    const lang=getLang();
    setLang(lang);
    const idx=await fetchIndex();
    const container=document.getElementById('post-list');
    if(!container) return;
    container.innerHTML='';
    idx.posts.sort((a,b)=> new Date(b.date)-new Date(a.date)).forEach(p=>{
      const title = (lang==='ja') ? (p.title_ja || p.title_en) : (p.title_en || p.title_ja || p.slug);
      const excerpt = (lang==='ja') ? (p.excerpt_ja || p.excerpt_en || '') : (p.excerpt_en || p.excerpt_ja || '');
      const date = formatDate(p.date,lang);
      const tags = createTagList(p.tags);

      const available = p.langs || [];
      let usedLang = lang;
      let langNote = '';
      if(available.length && !available.includes(lang)){
        usedLang = available[0];
        langNote = '<span class="lang-note">('+usedLang.toUpperCase()+' only)</span>';
      }
      const link = '/post.html?slug='+encodeURIComponent(p.slug)+'&lang='+encodeURIComponent(usedLang);
      const el=document.createElement('div');
      el.className='post-item';
      el.innerHTML=`<a class="post-link" href="${link}"><h3>${title} ${langNote}</h3></a><div class="meta">${date} ${tags}</div><p class="excerpt">${excerpt}</p>`;
      container.appendChild(el);
    });
  }

  async function renderPost(){
    const lang=qs('lang')||getLang();
    if(qs('lang')) setLang(lang);
    let slug = qs('slug');

    if(!slug){
      const parts = location.pathname.split('/').filter(Boolean);
      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        slug = lastPart.replace(/\.html$/, '');
      }
    }
    if(!slug) return;
    try{
      const idx = await fetchIndex();
      const meta = idx.posts.find(p=>p.slug===slug) || {};
      const avail = meta.langs || [];

      async function tryFetchVariants(s, l){
        const candidates = [
          `/posts/${s}.${l}.md`,
          `/posts/${s}-${l}.md`,
          `/posts/${s}_${l}.md`
        ];
        for(const p of candidates){
          try{
            const r = await fetch(p);
            if(r && r.ok) return r;
          }catch(e){/* ignore and try next */}
        }
        return null;
      }

      let res = await tryFetchVariants(slug, lang);
      if(!res){
        const fallback = avail.find(l=> l!==lang );
        if(fallback){
          res = await tryFetchVariants(slug, fallback);
        }
      }

      if(!res || !res.ok){
        document.getElementById('post-body').innerHTML='<p>Post not found.</p>';
        return;
      }

      const md = await res.text();
      const usedLang = (meta.langs && meta.langs.includes(lang)) ? lang : (meta.langs && meta.langs[0]) || lang;
      const title = (usedLang==='ja' && meta.title_ja) ? meta.title_ja : meta.title_en || slug;
      document.getElementById('post-title').textContent=title;
      document.getElementById('post-meta').innerHTML=(meta.date?formatDate(meta.date,usedLang):'')+(meta.tags?createTagList(meta.tags):'');
      const html = marked.parse(md);
      document.getElementById('post-body').innerHTML=html;
    }catch(err){
      document.getElementById('post-body').innerHTML='<p>Error loading post.</p>';
      console.error(err);
    }
  }


  document.addEventListener('DOMContentLoaded',()=>{
    if(document.getElementById('post-list')){
      renderList();
    }
    if(document.getElementById('post')){
      renderPost();
    }

    window.addEventListener('site:lang-changed',()=>{
      if(document.getElementById('post-list')) renderList();
      if(document.getElementById('post')) renderPost();
    });
  });
})();
