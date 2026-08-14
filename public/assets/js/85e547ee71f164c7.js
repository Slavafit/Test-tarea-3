(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const burger = document.querySelector(".header__burger");
const menu = document.getElementById("mobileMenu");
const close = menu?.querySelector(".mobile-menu__close");
const links = menu?.querySelectorAll(".mobile-menu__link, .btn");
if (burger && menu) {
  const closeMenu = () => {
    menu.classList.remove("mobile-menu--open");
    document.body.style.overflow = "";
  };
  burger.addEventListener("click", () => {
    menu.classList.add("mobile-menu--open");
    document.body.style.overflow = "hidden";
  });
  close?.addEventListener("click", closeMenu);
  links?.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}
const reveals = document.querySelectorAll(".reveal");
if (reveals.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );
  reveals.forEach((el) => observer.observe(el));
}
(function() {
  var messageSent = false;
  function sendHeightMessage() {
    if (messageSent) return;
    var height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    if (height < 50 || height > 2e4) return;
    try {
      parent.postMessage({
        action: "resize",
        height,
        source: "htmlpreview-iframe"
      }, "*");
      messageSent = true;
      console.log("Height sent:", height);
    } catch (e) {
      console.error("PostMessage failed:", e);
    }
  }
  function initResize() {
    setTimeout(sendHeightMessage, 100);
    setTimeout(sendHeightMessage, 500);
    setTimeout(sendHeightMessage, 1e3);
  }
  if (document.readyState === "complete") {
    initResize();
  } else {
    window.addEventListener("load", initResize);
  }
})();
(function () {
  function init() {
    var track = document.querySelector('.dds-marquee-track');
    if (!track) return;
    var mq = window.matchMedia('(max-width: 1023px)');
    var content = track.querySelector(':scope > .dds-marquee-content');
    if (!content) return;

    function setLoopOffset() {
      if (!mq.matches) return;
      requestAnimationFrame(function () {
        var width = content.getBoundingClientRect().width;
        var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        if (width > 0) track.style.setProperty('--dds-marquee-loop-offset', '-' + (width + gap) + 'px');
      });
    }

    setLoopOffset();
    mq.addEventListener('change', setLoopOffset);
    window.addEventListener('resize', setLoopOffset, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(setLoopOffset).observe(content);
    Array.prototype.forEach.call(content.querySelectorAll('img'), function (image) {
      if (!image.complete) image.addEventListener('load', setLoopOffset, { once: true });
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setLoopOffset);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
(function () {
    if (window.__ddsTabsUseCases) return;
    window.__ddsTabsUseCases = true;

    var container = document.querySelector('[data-cms-section="use-cases.tabs"]');
    if (!container) return;

    var panel = container.querySelector('.dds-tabs-panel');
    if (!panel) return;

    var hasVideo = function (media) {
      return media && media.tagName === 'VIDEO' && media.getAttribute('src');
    };

    var safePlay = function (media) {
      if (!hasVideo(media)) return;
      media.currentTime = 0;
      var p = media.play();
      if (p && typeof p.catch === 'function') p.catch(function () {  });
    };

    var pauseMedia = function (media) {
      if (!hasVideo(media)) return;
      media.pause();
    };

    var activateCard = function (card) {
      if (!card) return;
      var set = card.closest('.dds-tabs-points-set');
      if (set) {
        set.querySelectorAll('.dds-tabs-card').forEach(function (c) {
          c.classList.remove('dds-tabs-card--active');
        });
      }
      card.classList.add('dds-tabs-card--active');

      var key = card.getAttribute('data-media');
      panel.querySelectorAll('.dds-tabs-media').forEach(function (m) {
        if (m.classList.contains('dds-tabs-media--active')) pauseMedia(m);
        m.classList.remove('dds-tabs-media--active');
      });
      var target = panel.querySelector('.dds-tabs-media--' + key);
      if (!target) return;
      target.classList.add('dds-tabs-media--active');
      safePlay(target);
    };

    container.querySelectorAll('.dds-tabs-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.stopImmediatePropagation();
        activateCard(card);
      });
    });

    container.querySelectorAll('input[name="uc-tabs"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        var tabNum = radio.id.replace('uc-tab-', '');
        var set = container.querySelector('.dds-tabs-points-set--' + tabNum);
        if (!set) return;
        var activeCard = set.querySelector('.dds-tabs-card--active') || set.querySelector('.dds-tabs-card');
        activateCard(activeCard);
      });
    });

    panel.querySelectorAll('video.dds-tabs-media').forEach(function (video) {
      video.addEventListener('ended', function () {
        var key = video.getAttribute('data-media');
        var card = container.querySelector('.dds-tabs-card[data-media="' + key + '"]');
        if (!card) return;
        var set = card.closest('.dds-tabs-points-set');
        if (!set) return;
        var cards = Array.prototype.slice.call(set.querySelectorAll('.dds-tabs-card'));
        var idx = cards.indexOf(card);
        var next = cards[(idx + 1) % cards.length];
        activateCard(next);
      });
    });

    safePlay(panel.querySelector('.dds-tabs-media--active'));
  })();

  document.querySelectorAll('.dds-benefit').forEach(function (root) {
    var table = root.querySelector('.sds-compare-table');
    if (!table) return;
    function sync() {
      var tracks = getComputedStyle(table).gridTemplateColumns;
      var n = tracks && tracks.trim() && tracks !== 'none'
        ? tracks.trim().split(/\s+/).length
        : 0;
      if (!n) {
        var head = root.querySelector('.sds-compare-row--head');
        if (head) n = head.children.length;
      }
      if (n) root.style.setProperty('--dds-benefit-cols', String(n));
    }
    sync();
    if (window.MutationObserver) {
      new MutationObserver(sync).observe(table, {
        attributes: true,
        attributeFilter: ['style'],
        childList: true,
        subtree: true
      });
    }
  });

  const section = document.querySelector('[data-cms-section="roadmap.platform"]');
  if (section) {
    const scroller = section.querySelector('[data-dds-drag-scroll]');
    let dragging = false;
    let startX = 0;
    let startLeft = 0;

    scroller.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse') return;
      dragging = true;
      startX = event.pageX;
      startLeft = scroller.scrollLeft;
      scroller.classList.add('is-dragging');
      event.preventDefault();
    });

    window.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      scroller.scrollLeft = startLeft - (event.pageX - startX);
    });

    const release = () => {
      if (!dragging) return;
      dragging = false;
      scroller.classList.remove('is-dragging');
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
  }
