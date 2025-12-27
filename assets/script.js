(function(){
  const translations = {
    ja: {
      title: "Koba_9813",
      heading: "こんにちは — Kobaです",
      intro: "日本の学生で、英語を勉強中です。小さなウェブツールやサイトを作っています。",
      callout: "英語を勉強しています — GitHubで気軽に話しかけてください。",
      btn: "English"
    },
    en: {
      title: "Koba_9813",
      heading: "Hello — I'm Koba",
      intro: "I'm a student from Japan studying English. I build small web tools and projects.",
      callout: "I'm learning English — feel free to say hi on GitHub.",
      btn: "日本語"
    }
  };

  let lang = 'en';
  const els = {
    title: document.getElementById('title'),
    heading: document.getElementById('heading'),
    intro: document.getElementById('intro'),
    callout: document.getElementById('callout'),
    toggle: document.getElementById('langToggle')
  };

  function apply(langKey){
    const t = translations[langKey];
    els.title.textContent = t.title;
    els.heading.textContent = t.heading;
    els.intro.textContent = t.intro;
    els.callout.textContent = t.callout;
    els.toggle.textContent = t.btn;
  }

  els.toggle.addEventListener('click', ()=>{
    lang = (lang === 'en') ? 'ja' : 'en';
    apply(lang);
  });

  
  apply(lang);
})();
