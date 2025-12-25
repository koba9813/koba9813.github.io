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

  // hide fallback by default
  fallback.style.display = 'none';

  // If iframe loads within timeout, assume OK
  const onLoad = ()=>{
    settled = true;
    fallback.style.display = 'none';
  };
  iframe.addEventListener('load', onLoad);

  // After 2500ms, if load hasn't fired, show fallback
  const timeout = setTimeout(()=>{
    if(!settled) showFallback();
  }, 2500);

  // Clean up in case
  setTimeout(()=>{ clearTimeout(timeout); }, 6000);
})();
