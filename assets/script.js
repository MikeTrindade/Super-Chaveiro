(() => {
  const SITE_URL = 'https://superchaveiro.com.br/';
  const SOCIAL_IMAGE = 'https://superchaveiro.com.br/assets/images/hero-smart-key.webp';

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  const year = document.getElementById('ano-atual');
  if (year) year.textContent = String(new Date().getFullYear());

  // Faixa de movimento integrada entre Serviços e Diferenciais.
  const servicesSection = document.getElementById('servicos');
  if (servicesSection && !document.querySelector('.motion-showcase')) {
    const motionSection = document.createElement('section');
    motionSection.className = 'motion-showcase';
    motionSection.setAttribute('aria-label', 'Atendimento Super Chaveiro em movimento');
    motionSection.innerHTML = `
      <div class="motion-showcase-frame">
        <video class="ambient-video motion-showcase-video" autoplay muted loop playsinline preload="metadata" data-autoplay-video aria-hidden="true">
          <source src="https://res.cloudinary.com/tpdvdi9t/video/upload/v1788957370/download_1.mp4" type="video/mp4">
        </video>
        <div class="motion-showcase-shade" aria-hidden="true"></div>
      </div>
    `;
    servicesSection.insertAdjacentElement('afterend', motionSection);

    const motionStyle = document.createElement('style');
    motionStyle.textContent = `
      .motion-showcase {
        padding: 46px 0 70px;
        background: #05070a;
        overflow: hidden;
      }
      .motion-showcase-frame {
        position: relative;
        width: min(1360px, calc(100% - 40px));
        height: clamp(280px, 31vw, 440px);
        margin: 0 auto;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 22px;
        background: #080c12;
        box-shadow: 0 24px 80px rgba(0,0,0,.38);
      }
      .motion-showcase-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transform: scale(1.005);
      }
      .motion-showcase-shade {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          linear-gradient(90deg, rgba(5,7,10,.18), transparent 18%, transparent 82%, rgba(5,7,10,.18)),
          linear-gradient(0deg, rgba(5,7,10,.16), transparent 28%);
      }
      @media (max-width: 760px) {
        .motion-showcase { padding: 28px 0 42px; }
        .motion-showcase-frame {
          width: calc(100% - 28px);
          height: clamp(210px, 58vw, 310px);
          border-radius: 16px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .motion-showcase-video { opacity: .96; }
      }
    `;
    document.head.appendChild(motionStyle);
  }

  document.querySelectorAll('.benefit p').forEach((p) => {
    if (p.textContent.includes('Desconto de 10%')) {
      p.textContent = 'Pix, cartões de crédito e débito ou dinheiro. Desconto de 5% para pagamento à vista via Pix ou dinheiro.';
    }
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ambientVideos = [...document.querySelectorAll('[data-autoplay-video]')];

  const safePlay = (video) => {
    if (reducedMotion.matches || document.hidden) return;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  };

  const syncMotionPreference = () => {
    ambientVideos.forEach((video) => {
      if (reducedMotion.matches) {
        video.pause();
        try { video.currentTime = 0; } catch (_) {}
      } else if (video.hasAttribute('data-priority-video')) {
        safePlay(video);
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (reducedMotion.matches) {
          video.pause();
          return;
        }
        if (entry.isIntersecting) safePlay(video);
        else if (!video.hasAttribute('data-priority-video')) video.pause();
      });
    }, { rootMargin: '200px 0px', threshold: 0.05 });
    ambientVideos.forEach((video) => observer.observe(video));
  } else {
    ambientVideos.forEach(safePlay);
  }

  document.addEventListener('visibilitychange', () => {
    ambientVideos.forEach((video) => {
      if (document.hidden) video.pause();
      else if (!reducedMotion.matches && (video.hasAttribute('data-priority-video') || video.getBoundingClientRect().top < innerHeight + 200)) safePlay(video);
    });
  });

  syncMotionPreference();
  if (typeof reducedMotion.addEventListener === 'function') reducedMotion.addEventListener('change', syncMotionPreference);
  else if (typeof reducedMotion.addListener === 'function') reducedMotion.addListener(syncMotionPreference);

  const ensureLink = (rel, href) => {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
  };

  const ensureMeta = (attr, key, content) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  ensureLink('canonical', SITE_URL);
  ensureMeta('property', 'og:url', SITE_URL);
  ensureMeta('property', 'og:image', SOCIAL_IMAGE);
  ensureMeta('property', 'og:image:secure_url', SOCIAL_IMAGE);
  ensureMeta('property', 'og:image:type', 'image/webp');
  ensureMeta('property', 'og:image:width', '1280');
  ensureMeta('property', 'og:image:height', '720');
  ensureMeta('property', 'og:image:alt', 'Programação de chave automotiva na Super Chaveiro Sorocaba');
  ensureMeta('name', 'twitter:card', 'summary_large_image');
  ensureMeta('name', 'twitter:title', 'Chaveiro em Sorocaba | Super Chaveiro Sorocaba');
  ensureMeta('name', 'twitter:description', 'Serviços de chaveiro residencial e automotivo em Sorocaba e região. Atendimento todos os dias, das 8h às 22h.');
  ensureMeta('name', 'twitter:image', SOCIAL_IMAGE);

  const schemaEl = document.querySelector('script[type="application/ld+json"]');
  if (schemaEl) {
    try {
      const schema = JSON.parse(schemaEl.textContent);
      schema['@id'] = `${SITE_URL}#empresa`;
      schema.url = SITE_URL;
      schema.logo = `${SITE_URL}assets/branding/logo-super-chaveiro.webp`;
      schema.image = [
        `${SITE_URL}assets/images/equipe-frota.webp`,
        `${SITE_URL}assets/images/hero-smart-key.webp`,
        `${SITE_URL}assets/images/cta.webp`
      ];
      schema.paymentAccepted = 'Pix, cartão de crédito, cartão de débito e dinheiro; 5% de desconto para pagamento à vista via Pix ou dinheiro';
      schema.priceRange = '$$';
      schema.hasMap = 'https://www.google.com/maps/search/?api=1&query=Volunt%C3%A1rios%20de%20Sorocaba%2C%20191%2C%20sala%205%2C%20Sorocaba%2C%20SP';
      schemaEl.textContent = JSON.stringify(schema);
    } catch (_) {}
  }

  const footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom && !footerBottom.querySelector('a[href*="politica-de-privacidade"]')) {
    const privacy = document.createElement('a');
    privacy.href = '/politica-de-privacidade.html';
    privacy.textContent = 'Política de Privacidade';
    const back = footerBottom.querySelector('a[href="#topo"]');
    if (back) footerBottom.insertBefore(privacy, back);
    else footerBottom.appendChild(privacy);
  }

  const track = (eventName, params = {}) => {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, params);
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const common = {
      link_url: link.href,
      link_text: (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)
    };
    if (href.startsWith('https://wa.me/')) track('whatsapp_click', common);
    else if (href.startsWith('tel:')) track('phone_click', common);
    else if (href.includes('google.com/maps')) track('maps_click', common);
    else if (href.includes('instagram.com/')) track('instagram_click', common);
    else if (href.startsWith('mailto:')) track('email_click', common);
  });
})();
