(function(){
  function updateTimelineLine(){
    const container = document.querySelector('.timeline-vertical');
    const line = container && container.querySelector('.tl-line');
    const items = container && Array.from(container.querySelectorAll('.tl-item'));
    if(!container || !line || !items || items.length===0) return;

    const first = items[0];
    const last = items[items.length-1];
    const containerRect = container.getBoundingClientRect();
    const firstRect = first.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();

    // small vertical offset so the line doesn't overlap the dot
    const extraTop = 8;
    const top = Math.max(firstRect.top - containerRect.top - extraTop, 0);
    const bottom = Math.max(lastRect.bottom - containerRect.top, 0);
    const height = Math.max(bottom - top, 0);

    line.style.top = top + 'px';
    line.style.height = height + 'px';
  }

  async function insertMemosIntoTimeline(){
    try{
      const res = await fetch('/posts/index.json');
      if(!res.ok) return;
      const idx = await res.json();
      if(!idx.posts || !idx.posts.length) return;
      const container = document.querySelector('.timeline-vertical');
      const line = container && container.querySelector('.tl-line');
      if(!container || !line) return;

      const posts = idx.posts.slice().sort((a,b)=> new Date(b.date)-new Date(a.date));

      let ref = line.nextElementSibling;

      const lang = (window.SiteI18n && typeof window.SiteI18n.getLang==='function') ? window.SiteI18n.getLang() : 'en';
      function formatDate(d, lang){
        if(!d) return '';
        const dt = new Date(d);
        if(isNaN(dt)) return d;
        if(lang==='ja') return dt.getFullYear()+'年'+(dt.getMonth()+1)+'月'+dt.getDate()+'日';
        return dt.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
      }

      posts.forEach(p=>{
        const item = document.createElement('article');
        item.className='tl-item memo-item';
        const dateDiv = document.createElement('div');
        dateDiv.className='tl-date';
        // set date text if available
        dateDiv.textContent = p.date ? formatDate(p.date, lang) : '';

        const card = document.createElement('div');
        card.className='tl-card';
        const h4 = document.createElement('h4');

        const a = document.createElement('a');
        a.href = '/post.html?slug=' + encodeURIComponent(p.slug) + '&lang=' + encodeURIComponent(lang);
        a.textContent = (lang==='ja' ? (p.title_ja || p.title_en) : (p.title_en || p.title_ja || p.slug));
        h4.appendChild(a);
        const pdesc = document.createElement('p');
        pdesc.className='desc';
        pdesc.textContent = (lang==='ja' ? (p.excerpt_ja || p.excerpt_en || '') : (p.excerpt_en || p.excerpt_ja || ''));
        card.appendChild(h4);
        if(pdesc.textContent) card.appendChild(pdesc);
        item.appendChild(dateDiv);
        item.appendChild(card);
        container.insertBefore(item, ref);
      });

      updateTimelineLine();

      setTimeout(updateTimelineLine,300);
    }catch(err){
      console.error('Failed to load memos for timeline',err);
    }
  }
  function renderTimeline(){

    const container = document.querySelector('.timeline-vertical');
    if(!container) return;
    Array.from(container.querySelectorAll('.memo-item')).forEach(n=>n.remove());
    insertMemosIntoTimeline();
    updateTimelineLine();
  }

  window.addEventListener('load', ()=>{
    updateTimelineLine();
    renderTimeline();
  });
  window.addEventListener('site:lang-changed', ()=>{
    renderTimeline();
  });
  window.addEventListener('resize', ()=>{
    updateTimelineLine();
  });
})();
