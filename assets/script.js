(() => {
  const SITE_URL = 'https://superchaveiro.com.br/';
  const SOCIAL_IMAGE = 'https://superchaveiro.com.br/favicon/android-chrome-512x512.png';

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

  // Atualiza a condição comercial exibida no site.
  document.querySelectorAll('.benefit p').forEach((p) => {
    if (p.textContent.includes('Desconto de 10%')) {
      p.textContent = 'Pix, cartões de crédito e débito ou dinheiro. Desconto de 5% para pagamento à vista via Pix ou dinheiro.';
    }
  });

  // SEO técnico do domínio definitivo.
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
  ensureMeta('property', 'og:image:type', 'image/png');
  ensureMeta('property', 'og:image:width', '512');
  ensureMeta('property', 'og:image:height', '512');
  ensureMeta('property', 'og:image:alt', 'Logotipo da Super Chaveiro Sorocaba');
  ensureMeta('name', 'twitter:card', 'summary_large_image');
  ensureMeta('name', 'twitter:title', 'Chaveiro em Sorocaba | Super Chaveiro Sorocaba');
  ensureMeta('name', 'twitter:description', 'Serviços de chaveiro residencial e automotivo em Sorocaba e região. Atendimento todos os dias, das 8h às 22h.');
  ensureMeta('name', 'twitter:image', SOCIAL_IMAGE);

  // Completa o JSON-LD existente com URLs absolutas e dados do domínio final.
  const schemaEl = document.querySelector('script[type="application/ld+json"]');
  if (schemaEl) {
    try {
      const schema = JSON.parse(schemaEl.textContent);
      schema['@id'] = `${SITE_URL}#empresa`;
      schema.url = SITE_URL;
      schema.logo = `${SITE_URL}assets/branding/logo-super-chaveiro.webp`;
      schema.image = [
        `${SITE_URL}assets/images/equipe-frota.webp`,
        `${SITE_URL}assets/images/hero-smart-key.webp`
      ];
      schema.paymentAccepted = 'Pix, cartão de crédito, cartão de débito e dinheiro; 5% de desconto para pagamento à vista via Pix ou dinheiro';
      schema.priceRange = '$$';
      schema.hasMap = 'https://www.google.com/maps/search/?api=1&query=Volunt%C3%A1rios%20de%20Sorocaba%2C%20191%2C%20sala%205%2C%20Sorocaba%2C%20SP';
      schemaEl.textContent = JSON.stringify(schema);
    } catch (_) {}
  }

  // Inclui acesso à política de privacidade no rodapé sem alterar o layout principal.
  const footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom && !footerBottom.querySelector('a[href*="politica-de-privacidade"]')) {
    const privacy = document.createElement('a');
    privacy.href = '/politica-de-privacidade.html';
    privacy.textContent = 'Política de Privacidade';
    const back = footerBottom.querySelector('a[href="#topo"]');
    if (back) footerBottom.insertBefore(privacy, back);
    else footerBottom.appendChild(privacy);
  }

  // Eventos de conversão preparados para GA4. Passam a ser enviados assim que
  // o Google tag (gtag.js) for configurado com um Measurement ID válido.
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
