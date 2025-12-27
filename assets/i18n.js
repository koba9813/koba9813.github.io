
(function(){
  const STORAGE_KEY = 'site_lang';
  const DEFAULT = 'en';
  const translations = {
    en: {
      heading: "Hello — I'm Koba_9813",
      intro: "I'm a student living in Japan. I'm into programming right now, especially studying JavaScript and English too. I like Linux, space, and music.",
      callout: "I'm learning English — feel free to say hi on GitHub.",
      links_label: 'Links:',
      timeline: 'Timeline',
      nav_home: 'Home',
      nav_memo: 'Memo',
      nav_github: 'GitHub',
      lang_label: 'Language:',
      menu_toggle: 'Menu',
      timeline_item1_title: 'My first year with gadgets and audio',
      timeline_item1_desc: 'I became interested in gadgets after buying Nintendo Switch-related items (like SD cards and headphones) at DAISO. I also started exploring headphones, earphones, and audio that year.',
      timeline_item2_title: 'I studied WordPress diligently.',
      timeline_item2_desc: 'Around winter, I think I was using HTML and CSS instead of WordPress.',
      timeline_item3_title: 'Registered sunabacks.com',
      timeline_item3_desc: 'Set up a blog and experimented with WordPress.',
      timeline_item4_title: 'Started programming',
      timeline_item4_desc: 'I probably started programming (though it might not be considered programming) around this time. It was around the time ChatGPT came out, so I remember doing it while utilizing those tools.',
      timeline_item5_title: "I'm totally hooked on Minecraft.",
      timeline_item5_desc: "It's still my favorite game to this day.",
      timeline_item6_title: "I'm starting to use a PC for the first time in my life.",
      timeline_item6_desc: 'The first PC I touched was a Dell Inspiron 1545, and the OS was Zorin OS 15 Core.',
      timeline_item7_title: 'to be born into this world',
      blog_posts_title: 'Posts',
      blog_lang_switch_label: 'Language:',
      link_tools: 'Tools:',
      link_sites: 'Sites:',
      link_irodori: 'Irodori Translation:',
      link_irodori_desc: 'A translation tool that handles Japanese, English, French, Korean, and Chinese.',
      link_github: 'GitHub:'
    },
    ja: {
      heading: 'こんにちは — Koba_9813 です',
      intro: '日本在住の学生です。今はプログラミング（特にJavaScript）と英語を勉強しています。Linux、宇宙、音楽が好きです。',
      callout: '英語を勉強中です — GitHubで気軽に話しかけてください。',
      links_label: 'リンク：',
      timeline: 'タイムライン',
      nav_home: 'ホーム',
      nav_memo: 'メモ',
      nav_github: 'GitHub',
      lang_label: '言語：',
      menu_toggle: 'メニュー',
      timeline_item1_title: 'ガジェットとオーディオ元年',
      timeline_item1_desc: 'DAISOでNintendo Switch関連の商品（SDカードやヘッドホンなど）を買ったのがきっかけで、ガジェットに興味を持つようになりました。この年にヘッドホン、イヤホン、オーディオにも手を出し始めました。',
      timeline_item2_title: 'WordPressを熱心に勉強しました。',
      timeline_item2_desc: '冬頃には、WordPressではなくHTMLやCSSを使っていたと思います。',
      timeline_item3_title: 'sunabacks.comを登録',
      timeline_item3_desc: 'ブログを立ち上げ、WordPressを試行錯誤していました。',
      timeline_item4_title: 'プログラミングを始める',
      timeline_item4_desc: 'この頃からプログラミング（とは言えないかもしれないけど）を始めたと思います。ChatGPTが登場した時期で、それらを活用しながらやっていた記憶があります。',
      timeline_item5_title: 'マインクラフトにどハマり',
      timeline_item5_desc: '今でも一番好きなゲームです。',
      timeline_item6_title: 'PCをもらう',
      timeline_item6_desc: '最初に触ったPCはDellのInspiron 1545で、OSはZorin OS 15 Coreでした。',
      timeline_item7_title: '生まれる',
      blog_posts_title: '投稿',
      blog_lang_switch_label: '言語：',
      link_tools: 'ツール：',
      link_sites: 'サイト：',
      link_irodori: 'Irodori翻訳：',
      link_irodori_desc: '日本語、英語、フランス語、韓国語、中国語に対応した翻訳ツールです。',
      link_github: 'GitHub：'
    }
  };

  function getStored(){
    return localStorage.getItem(STORAGE_KEY)||DEFAULT;
  }
  function setStored(l){
    localStorage.setItem(STORAGE_KEY,l);
  }

  function translatePage(lang){
    const dict = translations[lang]||translations[DEFAULT];
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(!key) return;
      if(dict[key]){

        el.textContent = dict[key];
      }
    });
  }

  function initFloatingMenu(){
    document.querySelectorAll('.floating-menu').forEach(menu=>{
      const toggle = menu.querySelector('.fm-toggle');
      const panel = menu.querySelector('.fm-panel');

      const closeMenu = () => {
        panel.setAttribute('hidden','');
        toggle.setAttribute('aria-expanded','false');
        document.removeEventListener('click', handleOutsideClick);
      };

      const handleOutsideClick = (event) => {
        if (!panel.contains(event.target) && !toggle.contains(event.target)) {
          closeMenu();
        }
      };

      toggle.addEventListener('click', (event)=>{
        event.stopPropagation();
        const open = panel.hasAttribute('hidden');
        if(open){
          panel.removeAttribute('hidden');
          toggle.setAttribute('aria-expanded','true');
          document.addEventListener('click', handleOutsideClick);
        } else {
          closeMenu();
        }
      });

      // language buttons
      menu.querySelectorAll('.fm-lang-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const lang = btn.getAttribute('data-lang');
          setStored(lang);
          translatePage(lang);

          const params = new URLSearchParams(location.search);
          params.set('lang',lang);

          history.replaceState(null,'', location.pathname + '?' + params.toString());

          window.dispatchEvent(new CustomEvent('site:lang-changed',{detail:{lang}}));
        });
      });
    });
  }


  window.SiteI18n = {
    getLang(){ return getStored(); },
    setLang(l){ setStored(l); translatePage(l); window.dispatchEvent(new CustomEvent('site:lang-changed',{detail:{lang:l}})); },
    translatePage
  };

  document.addEventListener('DOMContentLoaded', ()=>{
    const langParam = new URLSearchParams(location.search).get('lang');
    const lang = langParam || getStored();

    if(langParam){
      setStored(lang);
    }
    translatePage(lang);
    initFloatingMenu();
  });

})();
