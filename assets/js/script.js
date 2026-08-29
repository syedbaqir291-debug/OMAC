/* ============================================================
   OMAC by S M Baqir — Interactions
   Vital line scroll progress · reveal-on-scroll · counters
   ============================================================ */

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Vital line scroll progress ---------- */
  var vitalPath = document.getElementById('vitalPath');
  var vitalDot = document.getElementById('vitalDot');

  if (vitalPath) {
    var pathLength = vitalPath.getTotalLength();
    vitalPath.style.strokeDasharray = pathLength;

    function updateVitalLine() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      var offset = pathLength * (1 - progress);
      vitalPath.style.strokeDashoffset = offset;

      if (vitalDot) {
        try {
          var point = vitalPath.getPointAtLength(pathLength * progress);
          vitalDot.setAttribute('cx', point.x);
          vitalDot.setAttribute('cy', point.y);
        } catch (e) {}
      }
    }

    if (reduceMotion) {
      vitalPath.style.strokeDashoffset = 0;
    } else {
      updateVitalLine();
      window.addEventListener('scroll', updateVitalLine, { passive: true });
      window.addEventListener('resize', updateVitalLine);
    }
  }

  /* ---------- Section blip on the vital line ---------- */
  var sections = document.querySelectorAll('[data-blip]');
  if (vitalDot && sections.length && !reduceMotion) {
    var blipObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          vitalDot.style.opacity = '1';
          clearTimeout(window._blipTimeout);
          window._blipTimeout = setTimeout(function () {
            vitalDot.style.opacity = '0';
          }, 900);
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { blipObserver.observe(s); });
  }

  /* ---------- Generic reveal-on-scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if (reduceMotion) {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18 });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------- Bars visual (Training) ---------- */
  var barsVisual = document.querySelector('.bars-visual');
  if (barsVisual) {
    if (reduceMotion) {
      barsVisual.classList.add('in-view');
    } else {
      var barsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            barsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      barsObserver.observe(barsVisual);
    }
  }

  /* ---------- Dashboard chart reveal ---------- */
  var dashVisual = document.querySelector('.dashboard-visual');
  if (dashVisual) {
    var linePath = dashVisual.querySelector('path.line');
    if (linePath && !reduceMotion) {
      var len = linePath.getTotalLength();
      linePath.style.strokeDasharray = len;
      linePath.style.strokeDashoffset = len;
    }
    if (reduceMotion) {
      dashVisual.classList.add('in-view');
      if (linePath) linePath.style.strokeDashoffset = 0;
    } else {
      var dashObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (linePath) {
              linePath.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)';
              linePath.style.strokeDashoffset = 0;
            }
            runCounters(entry.target);
            dashObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });
      dashObserver.observe(dashVisual);
    }
  }

  /* ---------- Hero stat counters ---------- */
  var heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    if (reduceMotion) {
      runCounters(heroStats);
    } else {
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounters(entry.target);
            heroObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      heroObserver.observe(heroStats);
    }
  }

  function runCounters(container) {
    var counters = container.querySelectorAll('[data-count]');
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var start = null;

      if (reduceMotion) {
        el.textContent = target + suffix;
        return;
      }

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = (target * eased);
        el.textContent = (target % 1 !== 0 ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('mobile-open');
      navToggle.textContent = open ? 'CLOSE' : 'MENU';
    });
  }
})();
