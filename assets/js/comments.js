(() => {
  const form = document.querySelector('[data-comment-form]');
  if (!form) return;
  const status = form.querySelector('[data-comment-status]');
  const button = form.querySelector('button[type="submit"]');
  const name = form.elements.namedItem('name');
  const message = form.elements.namedItem('message');
  let widget;
  let widgetTheme;
  let token = '';
  let sending = false;
  let submission;
  const updateButton = () => { button.disabled = sending || !token; };
  const errors = {
    verification_failed: 'Ověření vypršelo nebo se nezdařilo. Zkuste to prosím znovu.',
    rate_limited: 'Teď dorazilo více komentářů najednou. Zkuste to prosím za minutu.',
    unknown_article: 'Článek není dostupný pro komentáře. Obnovte prosím stránku.',
    invalid_fields: 'Zkontrolujte prosím jméno a text komentáře.',
    body_too_large: 'Komentář je příliš dlouhý.',
    id_conflict: 'Předchozí pokus měl jiný obsah. Upravte komentář a zkuste jej znovu.',
    already_reviewed: 'Tento komentář už byl posouzen.',
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !token || !form.reportValidity()) return;
    const fields = { articleId: form.dataset.articleId, name: name.value.trim(), message: message.value.trim() };
    // Preserve the ID after an uncertain network result, but use a new one for edited text.
    const content = JSON.stringify(fields);
    if (!submission || submission.content !== content) submission = { id: crypto.randomUUID(), content };
    sending = true;
    updateButton();
    status.textContent = 'Odesílám komentář…';
    try {
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, id: submission.id, token, website: form.elements.namedItem('website').value }),
        signal: AbortSignal.timeout(90_000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(errors[result.error] || 'Komentář se nepodařilo odeslat. Text zůstává ve formuláři; zkuste to prosím za chvíli.');
      status.textContent = result.status === 'approved' ? 'Komentář už byl schválen. Objeví se po aktualizaci webu.' : 'Děkuji! Komentář čeká na schválení. Na stránce se zobrazí až po schválení a aktualizaci webu.';
      form.reset();
      submission = undefined;
    } catch (error) {
      status.textContent = error.message.startsWith('Komentář') || Object.values(errors).includes(error.message)
        ? error.message : 'Odeslání se nezdařilo. Text zůstává ve formuláři; zkuste to prosím znovu.';
    } finally {
      sending = false;
      token = '';
      if (widget !== undefined && window.turnstile) window.turnstile.reset(widget);
      updateButton();
    }
  });

  const renderChallenge = () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    if (widget !== undefined && widgetTheme === theme) return;
    token = '';
    updateButton();
    if (widget !== undefined) window.turnstile.remove(widget);
    widgetTheme = theme;
    widget = window.turnstile.render(form.querySelector('[data-comment-challenge]'), {
      sitekey: form.dataset.sitekey, action: 'comment', cData: form.dataset.articleId,
      language: 'cs', theme, size: 'flexible',
      callback: value => { token = value; updateButton(); },
      'expired-callback': () => { token = ''; updateButton(); },
      'error-callback': () => { token = ''; updateButton(); status.textContent = 'Ověření se nepodařilo načíst. Zkuste obnovit stránku.'; },
    });
  };
  window.zivotvusaCommentsReady = () => {
    renderChallenge();
    new MutationObserver(renderChallenge).observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme'],
    });
  };
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=zivotvusaCommentsReady&render=explicit';
  script.async = true;
  script.onerror = () => { status.textContent = 'Ověření se nepodařilo načíst. Zkuste obnovit stránku.'; };
  document.head.appendChild(script);
})();
