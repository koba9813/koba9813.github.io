(function(){
  const iframe = document.getElementById('AmazonMusicEmbed51c44bcf00a14afa80bd8ddc6455f67ajajp');
  const fallback = document.getElementById('musicFallback');
  if(!iframe || !fallback) return;

  let settled = false;
  const showFallback = ()=>{
    if(settled) return;
    settled = true;
    fallback.setAttribute('aria-hidden','false');
    fallback.style.display = 'block';
  };


  fallback.style.display = 'none';


  const onLoad = ()=>{
    settled = true;
    fallback.style.display = 'none';
  };
  iframe.addEventListener('load', onLoad);


  const timeout = setTimeout(()=>{
    if(!settled) showFallback();
  }, 2500);


  setTimeout(()=>{ clearTimeout(timeout); }, 6000);
})();
