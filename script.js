const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const incorporationDialog = document.querySelector('[data-incorporation-dialog]');
const incorporationSessionKey = 'sooner-secure-incorporation-announcement-seen';

if (incorporationDialog) {
  try {
    if (!sessionStorage.getItem(incorporationSessionKey)) {
      incorporationDialog.showModal();
      sessionStorage.setItem(incorporationSessionKey, 'true');
    }
  } catch {
    incorporationDialog.showModal();
  }

  incorporationDialog.querySelectorAll('[data-incorporation-close]').forEach((button) => {
    button.addEventListener('click', () => incorporationDialog.close());
  });
}

if (!document.querySelector('[data-consent-dialog]')) {
  document.body.insertAdjacentHTML('beforeend', `
    <section class="consent-banner" data-consent-banner aria-labelledby="consent-title" aria-describedby="consent-description" hidden>
      <div><p class="consent-kicker">Your privacy, your choice</p><h2 id="consent-title">Cookie preferences</h2><p id="consent-description">We use necessary browser storage to remember your choice. Optional analytics will stay off unless you allow them. Read our <a href="cookies.html">cookie notice</a>.</p></div>
      <div class="consent-actions"><button class="consent-button" type="button" data-consent-accept>Accept optional cookies</button><button class="consent-button" type="button" data-consent-reject>Reject optional cookies</button><button class="consent-text-button" type="button" data-consent-customize>Customize</button></div>
    </section>
    <dialog class="consent-dialog" data-consent-dialog aria-labelledby="settings-title">
      <form method="dialog"><div class="dialog-heading"><div><p class="consent-kicker">Privacy controls</p><h2 id="settings-title">Choose what you allow</h2></div><button class="dialog-close" value="cancel" aria-label="Close cookie settings">×</button></div>
        <p>Necessary storage is always active because it records your privacy preference. No advertising cookies are used.</p>
        <div class="consent-category"><div><strong>Necessary</strong><span>Preference storage only</span></div><span class="always-on">Always on</span></div>
        <label class="consent-category" for="analytics-consent"><div><strong>Analytics</strong><span>Anonymous site-use measurement, if added and enabled</span></div><input id="analytics-consent" type="checkbox" data-analytics-toggle /></label>
        <p class="consent-status">This site does not currently load an analytics provider. This setting provides consent gating if one is added later.</p>
        <div class="dialog-actions"><button class="consent-button" value="save" data-consent-save>Save preferences</button><button class="consent-button" value="reject" data-consent-reject-dialog>Reject optional cookies</button></div>
      </form>
    </dialog>`);
}

const CONSENT_KEY = 'sooner-secure-consent-v1';
const banner = document.querySelector('[data-consent-banner]');
const dialog = document.querySelector('[data-consent-dialog]');
const analyticsToggle = document.querySelector('[data-analytics-toggle]');

function readConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY));
  } catch {
    return null;
  }
}

function saveConsent(analytics) {
  const consent = {
    necessary: true,
    analytics: Boolean(analytics),
    savedAt: new Date().toISOString(),
    version: 1
  };

  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // The preference remains active for this page view if storage is unavailable.
  }

  window.soonerConsent = consent;
  window.dispatchEvent(new CustomEvent('sooner:consent', { detail: consent }));
  if (banner) banner.hidden = true;
  if (dialog?.open) dialog.close();
}

window.soonerConsent = readConsent() || { necessary: true, analytics: false, version: 1 };
window.soonerConsentAllows = (category) => category === 'necessary' || window.soonerConsent[category] === true;

if (banner && !readConsent()) banner.hidden = false;

document.querySelector('[data-consent-accept]')?.addEventListener('click', () => saveConsent(true));
document.querySelector('[data-consent-reject]')?.addEventListener('click', () => saveConsent(false));

document.querySelectorAll('[data-consent-open], [data-consent-customize]').forEach((button) => {
  button.addEventListener('click', () => {
    if (analyticsToggle) analyticsToggle.checked = Boolean(readConsent()?.analytics);
    dialog?.showModal();
  });
});

document.querySelector('[data-consent-save]')?.addEventListener('click', (event) => {
  event.preventDefault();
  saveConsent(Boolean(analyticsToggle?.checked));
});

document.querySelector('[data-consent-reject-dialog]')?.addEventListener('click', (event) => {
  event.preventDefault();
  saveConsent(false);
});
