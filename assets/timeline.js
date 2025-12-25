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

    // compute top/bottom relative to container
    const extraTop = 6; // extend slightly above first item
    const top = Math.max(firstRect.top - containerRect.top - extraTop, 0);
    const bottom = Math.max(lastRect.bottom - containerRect.top, 0);
    const height = Math.max(bottom - top, 0);

    line.style.top = top + 'px';
    line.style.height = height + 'px';
  }

  window.addEventListener('load', ()=>{
    updateTimelineLine();
    // small delay to account for fonts/images
    setTimeout(updateTimelineLine, 300);
  });
  window.addEventListener('resize', ()=>{
    updateTimelineLine();
  });
})();
