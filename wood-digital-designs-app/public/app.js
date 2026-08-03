const services = {
  social: {
    kicker: 'Consistent and polished',
    title: 'Social media design and support',
    description:
      'Stay visible with branded content created specifically for your business, promotions, audience, and goals.',
    list: ['Branded graphics', 'Caption writing', 'Content planning', 'Reels and promotional campaigns'],
    theme: 'social-preview',
    tag: 'NEW POST',
    headline: 'Your business deserves to be remembered.',
    button: 'Learn more'
  },
  graphics: {
    kicker: 'Made for the moment',
    title: 'Custom graphics for promotions and announcements',
    description:
      'Get a clear, professional design for the moments when your business needs to communicate quickly and confidently.',
    list: ['Sales graphics', 'Event announcements', 'Service promotions', 'Digital advertisements'],
    theme: 'graphics-preview',
    tag: 'SPECIAL EVENT',
    headline: 'Make the message impossible to miss.',
    button: 'Save the date'
  },
  branding: {
    kicker: 'Recognizable and cohesive',
    title: 'Brand identity that feels like your business',
    description:
      'Build a visual foundation that makes every future graphic, page, and customer touchpoint feel connected.',
    list: ['Logo direction', 'Color palette', 'Typography', 'Brand style guide'],
    theme: 'branding-preview',
    tag: 'BRAND STORY',
    headline: 'A clear identity people can recognize.',
    button: 'Meet the brand'
  },
  websites: {
    kicker: 'Clear and easy to use',
    title: 'Websites that guide people toward action',
    description:
      'Give your business a polished online home that explains what you do and makes it easy for customers to take the next step.',
    list: ['Responsive design', 'Service pages', 'Contact forms', 'Launch support'],
    theme: 'websites-preview',
    tag: 'WELCOME',
    headline: 'Your online home should work for you.',
    button: 'Explore services'
  },
  print: {
    kicker: 'Ready to share',
    title: 'Marketing materials for print and digital use',
    description:
      'Carry your brand into the real world with materials that are practical, polished, and ready to send or print.',
    list: ['Flyers', 'Business cards', 'Brochures', 'Menus and price sheets'],
    theme: 'print-preview',
    tag: 'NOW AVAILABLE',
    headline: 'Professional materials that support the sale.',
    button: 'See details'
  },
  products: {
    kicker: 'Designed to sell again and again',
    title: 'Digital products and printable resources',
    description:
      'Turn your knowledge or creative idea into a polished product customers can purchase, download, and use.',
    list: ['Printable worksheets', 'Educational resources', 'Ebooks and guides', 'Product listing graphics'],
    theme: 'products-preview',
    tag: 'DIGITAL DOWNLOAD',
    headline: 'Useful products with a polished finish.',
    button: 'Shop the collection'
  }
};

const quizSteps = [
  {
    question: 'What are you mainly trying to improve?',
    options: [
      { label: 'Consistent social media', detail: 'I need regular content each week.', score: { standard: 3, advanced: 2, custom: 0 } },
      { label: 'Stronger growth and visibility', detail: 'I want more content and video support.', score: { standard: 1, advanced: 4, custom: 1 } },
      { label: 'A brand or website', detail: 'I need a larger one time project.', score: { standard: 0, advanced: 1, custom: 5 } },
      { label: 'A mix of different projects', detail: 'My needs do not fit one package.', score: { standard: 0, advanced: 1, custom: 4 } }
    ]
  },
  {
    question: 'How often do you need new content?',
    options: [
      { label: 'A few times each month', detail: 'Basic consistency is enough.', score: { standard: 3, advanced: 1, custom: 0 } },
      { label: 'Several times each week', detail: 'I want an active online presence.', score: { standard: 1, advanced: 4, custom: 1 } },
      { label: 'For a specific campaign', detail: 'I need a focused project or launch.', score: { standard: 0, advanced: 1, custom: 4 } },
      { label: 'I am not sure yet', detail: 'I need help deciding.', score: { standard: 1, advanced: 2, custom: 2 } }
    ]
  },
  {
    question: 'Do you want video or reel support?',
    options: [
      { label: 'No, graphics are enough', detail: 'I mainly need posts and captions.', score: { standard: 3, advanced: 0, custom: 1 } },
      { label: 'Yes, every week', detail: 'Video should be part of the plan.', score: { standard: 0, advanced: 4, custom: 1 } },
      { label: 'Only for special promotions', detail: 'Occasional video is enough.', score: { standard: 1, advanced: 2, custom: 2 } },
      { label: 'I need help deciding', detail: 'Recommend what makes sense.', score: { standard: 1, advanced: 2, custom: 2 } }
    ]
  },
  {
    question: 'What starting budget feels realistic?',
    options: [
      { label: 'Around $300 monthly', detail: 'I need a dependable basic plan.', score: { standard: 4, advanced: 0, custom: 0 } },
      { label: 'Around $500 monthly', detail: 'I am ready for more support.', score: { standard: 0, advanced: 4, custom: 1 } },
      { label: '$1,000 or more for a project', detail: 'I am planning a larger investment.', score: { standard: 0, advanced: 0, custom: 5 } },
      { label: 'I need a quote first', detail: 'The scope will determine the budget.', score: { standard: 0, advanced: 1, custom: 4 } }
    ]
  }
];

const packageDetails = {
  standard: {
    name: 'Standard Package',
    price: 'Starting at $300 per month',
    description: 'A strong fit for steady branded content without a heavy posting schedule.'
  },
  advanced: {
    name: 'Advanced Package',
    price: 'Starting at $500 per month',
    description: 'A strong fit for businesses that want more weekly content, video, and active growth support.'
  },
  custom: {
    name: 'Custom Project',
    price: 'Custom quote based on scope',
    description: 'A strong fit for branding, websites, launches, campaigns, and projects that need a tailored plan.'
  }
};

const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  siteNav.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const serviceTabs = document.querySelectorAll('.service-tab');
const serviceKicker = document.getElementById('service-kicker');
const serviceTitle = document.getElementById('service-title');
const serviceDescription = document.getElementById('service-description');
const serviceList = document.getElementById('service-list');
const servicePreview = document.getElementById('service-preview');

function renderService(key) {
  const service = services[key];
  serviceKicker.textContent = service.kicker;
  serviceTitle.textContent = service.title;
  serviceDescription.textContent = service.description;
  serviceList.innerHTML = service.list.map((item) => `<li>${item}</li>`).join('');
  servicePreview.innerHTML = `
    <div class="preview-canvas ${service.theme}">
      <span class="preview-tag">${service.tag}</span>
      <strong>${service.headline}</strong>
      <div class="preview-button">${service.button}</div>
    </div>
  `;
}

serviceTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    serviceTabs.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    renderService(tab.dataset.service);
  });
});

let quizIndex = 0;
let quizScores = { standard: 0, advanced: 0, custom: 0 };
let quizAnswers = [];
const quizContent = document.getElementById('quiz-content');
const quizBack = document.getElementById('quiz-back');
const quizRestart = document.getElementById('quiz-restart');
const progressLabel = document.getElementById('progress-label');
const progressBar = document.getElementById('progress-bar');

function renderQuiz() {
  const step = quizSteps[quizIndex];
  progressLabel.textContent = `Question ${quizIndex + 1} of ${quizSteps.length}`;
  progressBar.style.width = `${((quizIndex + 1) / quizSteps.length) * 100}%`;
  quizBack.classList.toggle('hidden', quizIndex === 0);
  quizRestart.classList.add('hidden');

  quizContent.innerHTML = `
    <h3 class="quiz-question">${step.question}</h3>
    <div class="quiz-options">
      ${step.options
        .map(
          (option, index) => `
            <button class="quiz-option" type="button" data-option-index="${index}">
              ${option.label}
              <small>${option.detail}</small>
            </button>
          `
        )
        .join('')}
    </div>
  `;

  quizContent.querySelectorAll('.quiz-option').forEach((button) => {
    button.addEventListener('click', () => selectQuizOption(Number(button.dataset.optionIndex)));
  });
}

function selectQuizOption(optionIndex) {
  const option = quizSteps[quizIndex].options[optionIndex];
  quizAnswers[quizIndex] = optionIndex;
  Object.keys(quizScores).forEach((key) => {
    quizScores[key] += option.score[key];
  });

  if (quizIndex < quizSteps.length - 1) {
    quizIndex += 1;
    renderQuiz();
  } else {
    renderQuizResult();
  }
}

function rebuildScores() {
  quizScores = { standard: 0, advanced: 0, custom: 0 };
  quizAnswers.forEach((answerIndex, stepIndex) => {
    if (answerIndex === undefined) return;
    const option = quizSteps[stepIndex].options[answerIndex];
    Object.keys(quizScores).forEach((key) => {
      quizScores[key] += option.score[key];
    });
  });
}

function renderQuizResult() {
  const winner = Object.entries(quizScores).sort((a, b) => b[1] - a[1])[0][0];
  const result = packageDetails[winner];
  progressLabel.textContent = 'Recommendation ready';
  progressBar.style.width = '100%';
  quizBack.classList.add('hidden');
  quizRestart.classList.remove('hidden');
  quizContent.innerHTML = `
    <div class="quiz-result">
      <span class="result-badge">Your best starting point</span>
      <h3>${result.name}</h3>
      <p>${result.description}</p>
      <div class="result-price">${result.price}</div>
      <a class="button primary" href="#contact" id="use-package-result">Ask About This Package</a>
    </div>
  `;

  document.getElementById('use-package-result').addEventListener('click', () => {
    applyPackageToForm(result.name);
  });
}

quizBack.addEventListener('click', () => {
  if (quizIndex === 0) return;
  quizIndex -= 1;
  quizAnswers = quizAnswers.slice(0, quizIndex);
  rebuildScores();
  renderQuiz();
});

quizRestart.addEventListener('click', () => {
  quizIndex = 0;
  quizScores = { standard: 0, advanced: 0, custom: 0 };
  quizAnswers = [];
  renderQuiz();
});

renderQuiz();

const filterButtons = document.querySelectorAll('.filter-button');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    portfolioItems.forEach((item) => {
      item.classList.toggle('is-hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  });
});

const postCount = document.getElementById('post-count');
const postOutput = document.getElementById('post-output');
const includeReels = document.getElementById('include-reels');
const includeScheduling = document.getElementById('include-scheduling');
const estimateTotal = document.getElementById('estimate-total');
const useEstimate = document.getElementById('use-estimate');
let currentEstimate = '$300 per month';

function updateEstimate() {
  const posts = Number(postCount.value);
  postOutput.textContent = posts;

  let low = posts === 0 ? 0 : 120 + posts * 90;
  let high = posts === 0 ? 0 : 170 + posts * 120;

  if (includeReels.checked) {
    low += 160;
    high += 260;
  }

  if (includeScheduling.checked) {
    low += 75;
    high += 125;
  }

  if (low === 0) {
    currentEstimate = 'Custom quote';
  } else if (low === high) {
    currentEstimate = `$${low} per month`;
  } else {
    currentEstimate = `$${low} to $${high} per month`;
  }

  estimateTotal.textContent = currentEstimate;
}

[postCount, includeReels, includeScheduling].forEach((control) => {
  control.addEventListener('input', updateEstimate);
  control.addEventListener('change', updateEstimate);
});

updateEstimate();

function applyPackageToForm(packageName) {
  const message = document.querySelector('textarea[name="message"]');
  const prefix = `I am interested in the ${packageName}. `;
  if (!message.value.includes(prefix)) {
    message.value = `${prefix}${message.value}`.trim();
  }
}

document.querySelectorAll('[data-package]').forEach((link) => {
  link.addEventListener('click', () => applyPackageToForm(`${link.dataset.package} package`));
});

useEstimate.addEventListener('click', () => {
  const message = document.querySelector('textarea[name="message"]');
  const prefix = `My website estimate was ${currentEstimate}. `;
  if (!message.value.includes(prefix)) {
    message.value = `${prefix}${message.value}`.trim();
  }
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => message.focus(), 500);
});

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.className = 'form-status';
  formStatus.textContent = 'Sending your inquiry...';

  const formData = new FormData(contactForm);
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    business: formData.get('business'),
    services: formData.getAll('services'),
    budget: formData.get('budget'),
    message: formData.get('message'),
    website: formData.get('website')
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      if (result.fallback && result.ownerEmail) {
        const subject = encodeURIComponent(`Wood Digital Designs inquiry from ${payload.name}`);
        const body = encodeURIComponent(
          `Name: ${payload.name}\nEmail: ${payload.email}\nBusiness: ${payload.business || 'Not provided'}\nServices: ${payload.services.join(', ') || 'Not selected'}\nBudget: ${payload.budget || 'Not provided'}\n\n${payload.message}`
        );
        window.location.href = `mailto:${result.ownerEmail}?subject=${subject}&body=${body}`;
        formStatus.textContent = 'Your email app should open with the inquiry filled in.';
        return;
      }
      throw new Error(result.message || 'The form could not be sent.');
    }

    formStatus.classList.add('success');
    formStatus.textContent = result.message;
    contactForm.reset();
  } catch (error) {
    formStatus.classList.add('error');
    formStatus.textContent = error.message || 'The form could not be sent. Please try again.';
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
