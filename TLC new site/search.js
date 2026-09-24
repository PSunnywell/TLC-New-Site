(function () {
  'use strict';

  const sitePages = [
    { title: 'Home', url: 'index.html', text: 'Digital accessibility Teaching and Learning Center accessibility champions made here' },
    { title: 'Accessible Course Materials', url: 'course-materials.html', text: 'Creating accessible course materials Slide Presentations Documents Bruin Learn Media Alt Text' },
    { title: 'Policies & Standards', url: 'policies.html', text: 'Policies standards guidelines ADA Section 504 Section 508 IMT' },
    { title: 'Training', url: 'training.html', text: 'Training instructor-led courses self-paced courses Slide Presentations Documents Bruin Learn Media Alt Text' },
    { title: 'Tools', url: 'tools.html', text: 'Tools WebAIM Color Contrast Checker Bookmarklet Color Contrast Matrix Generator Color Blindness Emulator' },
    { title: 'Help & Support', url: 'support.html', text: 'Help support accessibility consultation assistance' },
    { title: 'Accessibility Basics', url: 'accessibility-basics.html', text: 'Accessibility basics digital accessibility principles' },
    { title: 'Websites', url: 'websites.html', text: 'Accessible websites structure navigation forms headings links color' },
    { title: 'Documents', url: 'documents.html', text: 'Accessible documents PDFs Word documents spreadsheets' },
    { title: 'Video & Media', url: 'video-media.html', text: 'Video media captions transcripts audio description accessible players' },
    { title: 'Slide Presentations', url: 'slide-presentations.html', text: 'Accessible slide presentations PowerPoint Google Slides presentations' },
    { title: 'Bruin Learn', url: 'bruin-learn.html', text: 'Bruin Learn accessible course content pages assignments quizzes' },
    { title: 'Media', url: 'media.html', text: 'Accessible media captions transcripts audio video' },
    { title: 'Alt Text', url: 'alt-text.html', text: 'Alternative text alt text images charts visual content' },
    { title: 'ADA', url: 'ada.html', text: 'Americans with Disabilities Act ADA accessibility policy' },
    { title: 'Section 504', url: 'section-504.html', text: 'Section 504 accessibility rehabilitation act' },
    { title: 'Section 508', url: 'section-508.html', text: 'Section 508 electronic information technology accessibility' },
    { title: 'IMT', url: 'imt.html', text: 'IMT information media technology accessibility' },
    { title: 'Instructor-led Courses', url: 'instructor-led-courses.html', text: 'Instructor-led accessibility courses training' },
    { title: 'Self-Paced Courses', url: 'self-paced-courses.html', text: 'Self-paced accessibility courses training' },
    { title: 'Keyboard Accessibility', url: 'keyboard-accessibility.html', text: 'Keyboard accessibility keyboard navigation' },
    { title: 'Color & Contrast', url: 'color-contrast.html', text: 'Color contrast accessible design' },
    { title: 'Accessibility Checklist', url: 'checklist.html', text: 'Accessibility checklist' },
    { title: 'Request Support', url: 'request-support.html', text: 'Request accessibility support' },
    { title: 'Report an Accessibility Barrier', url: 'report-barrier.html', text: 'Report an accessibility barrier' },
    { title: 'Contact', url: 'contact.html', text: 'Contact accessibility staff' },
    { title: 'Accessibility Statement', url: 'accessibility.html', text: 'Accessibility statement' },
    { title: 'Privacy', url: 'privacy.html', text: 'Privacy' },
    { title: 'Resources', url: 'resources.html', text: 'Accessibility resources' }
  ];

  function normalize(value) {
    return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }

  function runSearch(query) {
    const q = normalize(query.trim());
    if (!q) return [];

    const terms = q.split(/\s+/).filter(Boolean);
    return sitePages
      .map((page) => {
        const haystack = normalize(page.title + ' ' + page.text);
        const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
        return { ...page, score };
      })
      .filter((page) => page.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  }

  function getQuery() {
    return new URLSearchParams(window.location.search).get('q') || '';
  }

  function setupSearchForm(form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const value = input ? input.value.trim() : '';
      if (value) {
        window.location.href = 'search.html?q=' + encodeURIComponent(value);
      }
    });
  }

  document.querySelectorAll('.site-search').forEach(setupSearchForm);

  const results = document.getElementById('search-results');
  const resultsStatus = document.getElementById('search-status');
  const resultHeading = document.getElementById('search-query-heading');

  if (results && resultHeading) {
    const query = getQuery().trim();
    const formInput = document.querySelector('.site-search input[name="q"]');
    if (formInput) formInput.value = query;

    resultHeading.textContent = query ? 'Search results for “' + query + '”' : 'Search the site';

    if (!query) {
      results.innerHTML = '<p class="search-empty">Enter a word or phrase above to search this site.</p>';
      if (resultsStatus) resultsStatus.textContent = '';
      return;
    }

    const matches = runSearch(query);
    if (resultsStatus) {
      resultsStatus.textContent = matches.length + (matches.length === 1 ? ' result' : ' results') + ' found.';
    }

    if (!matches.length) {
      results.innerHTML = '<p class="search-empty">No matching pages were found. Try a different word or phrase.</p>';
      return;
    }

    results.innerHTML = matches.map((page) => `
      <a class="search-result" href="${page.url}">
        <h3>${page.title}</h3>
        <p>${page.text}</p>
      </a>
    `).join('');
  }

  const filterCheckboxes = Array.from(document.querySelectorAll('[data-filter-topic]'));
  const courseGrid = document.getElementById('course-materials-grid');
  const courseStatus = document.getElementById('course-materials-filter-status');
  const courseClearAll = document.getElementById('course-materials-clear-all');
  const groupClearButtons = Array.from(document.querySelectorAll('[data-clear-group]'));

  if (filterCheckboxes.length && courseGrid) {
    const courseCards = Array.from(courseGrid.querySelectorAll('[data-filter-tags]'));

    function applyCourseMaterialFilters() {
      const selected = filterCheckboxes
        .filter(function (checkbox) { return checkbox.checked; })
        .map(function (checkbox) { return checkbox.value; });

      let visible = 0;

      courseCards.forEach(function (card) {
        const tags = (card.dataset.filterTags || '').split(/\s+/).filter(Boolean);
        const showCard = selected.length === 0 || selected.every(function (tag) {
          return tags.includes(tag);
        });
        card.hidden = !showCard;
        if (showCard) visible += 1;
      });

      if (courseStatus) {
        courseStatus.textContent = visible + (visible === 1 ? ' resource shown.' : ' resources shown.');
      }
    }

    filterCheckboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', applyCourseMaterialFilters);
    });

    groupClearButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const group = button.dataset.clearGroup;
        const groupFieldset = document.querySelector('[data-filter-group="' + group + '"]');
        if (!groupFieldset) return;

        groupFieldset.querySelectorAll('[data-filter-topic]').forEach(function (checkbox) {
          checkbox.checked = false;
        });

        applyCourseMaterialFilters();
        button.focus();
      });
    });

    if (courseClearAll) {
      courseClearAll.addEventListener('click', function () {
        filterCheckboxes.forEach(function (checkbox) {
          checkbox.checked = false;
        });
        applyCourseMaterialFilters();
        courseClearAll.focus();
      });
    }

    applyCourseMaterialFilters();
  }
})();
