function getSliderSettings() {
  return {
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };
}

function getSubSliderProductSettings() {
  return {
    slidesPerView: 3,
    direction: "vertical",
    navigation: false,
  };
}

function updatethumbnail() {
  let mediaElement = document.querySelector(".product__media-list");
  const sublists = document.querySelector(".js-media-sublist");
  const thumbsDirection = sublists.dataset.thumbsDirection;

  if (!mediaElement) return "";

  let mediaHeight = mediaElement.offsetHeight;
  let mediaThumbHeight = document.querySelector(".product__media-sublist");

  if (window.innerWidth > 1100) {
    if (thumbsDirection == "vertical") {
      mediaThumbHeight.style.height = mediaHeight + "px";
    } else {
      let calculatedHeight = window.innerWidth * 0.15; // adjust ratio if needed
      let finalHeight = Math.min(calculatedHeight, 220);

      mediaThumbHeight.style.height = finalHeight + "px";
    }
  }
}

const sliderInit = (isUpdate) => {
  if (
    (document.querySelectorAll(".product-section .js-media-list") &&
      document.querySelectorAll(".product-section .js-media-list").length >
        0) ||
    (document.querySelectorAll(".featured-product-section .js-media-list") &&
      document.querySelectorAll(".featured-product-section .js-media-list")
        .length > 0)
  ) {
    let slider = new Swiper(
      ".featured-product-section .js-media-list, .product-section .js-media-list",
      {
        slidesPerView: 1,
        spaceBetween: 4,
        navigation: {
          nextEl: ".swiper-btn--next",
          prevEl: ".swiper-btn--prev",
        },
        pagination: {
          el: ".product .product__pagination",
          clickable: true,
        },
        thumbs: {
          swiper: document.querySelector(".js-media-sublist").swiper,
        },
        on: {
          slideChangeTransitionStart: function () {
            document
              .querySelector(".js-media-sublist")
              .swiper.slideTo(
                document.querySelector(".js-media-list").swiper.activeIndex,
              );
          },
          slideChange: function () {
            window.pauseAllMedia();
            this.params.noSwiping = false;
          },
          slideChangeTransitionEnd: function () {
            if (this.slides[this.activeIndex].querySelector("model-viewer")) {
              this.slides[this.activeIndex]
                .querySelector(".shopify-model-viewer-ui__button--poster")
                .removeAttribute("hidden");
            }
          },
          touchStart: function (s, e) {
            if (this.slides[this.activeIndex].querySelector("model-viewer")) {
              if (
                !this.slides[this.activeIndex]
                  .querySelector("model-viewer")
                  .classList.contains("shopify-model-viewer-ui__disabled")
              ) {
                this.params.noSwiping = true;
                this.params.noSwipingClass = "swiper-slide";
              } else {
                this.params.noSwiping = false;
              }
            }
          },
        },
      },
    );
    updatethumbnail();
    if (isUpdate) {
      setTimeout(function () {
        slider.update();
      }, 800);
    }
  }
};

window.addEventListener("resize", () => {
  updatethumbnail();
});

document.addEventListener("shopify:section:load", function () {
  updatethumbnail();
});

const subSliderInit = (isUpdate) => {
  if (
    (document.querySelectorAll(".product-section .js-media-sublist") &&
      document.querySelectorAll(".product-section .js-media-sublist").length >
        0) ||
    (document.querySelectorAll(".featured-product-section .js-media-sublist") &&
      document.querySelectorAll(".featured-product-section .js-media-sublist")
        .length > 0)
  ) {
    const sublists = document.querySelector(".js-media-sublist");
    const thumbsDirection = sublists.dataset.thumbsDirection;
    const slidesPerView = thumbsDirection == "horizontal" ? 4 : "auto";
    let subSlider = new Swiper(
      ".featured-product-section .js-media-sublist, .product-section .js-media-sublist",
      {
        centeredSlides: true,
        centeredSlidesBounds: true,
        slideToClickedSlide: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        slidesPerView: 4,
        spaceBetween: 4,
        autoHeight: true,
        direction: "horizontal",
        navigation: false,
        freeMode: true,
        preloadImages: false,
        lazy: true,
        transitionStart: function () {
          document
            .querySelector(".js-media-list")
            .swiper.slideTo(
              document.querySelector(".js-media-sublist").swiper.activeIndex,
            );
        },
        breakpoints: {
          1100: {
            direction: thumbsDirection,
            slidesPerView: slidesPerView,
            allowTouchMove: true,
          },
        },
        on: {
          touchEnd: function (s, e) {
            let range = 5;
            let diff = (s.touches.diff = s.isHorizontal()
              ? s.touches.currentX - s.touches.startX
              : s.touches.currentY - s.touches.startY);
            if (diff < range || diff > -range) s.allowClick = true;
          },
        },
      },
    );
    if (subSlider.slides && subSlider.slides.length <= 3) {
      subSlider.params.centeredSlides = false;
      subSlider.update();
    }

    if (isUpdate) {
      setTimeout(function () {
        subSlider.update();
      }, 200);
    }
  }
};

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe",
    ),
  );
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute("role", "button");
  summary.setAttribute("aria-expanded", "false");

  if (summary.nextElementSibling.getAttribute("id")) {
    summary.setAttribute("aria-controls", summary.nextElementSibling.id);
  }

  summary.addEventListener("click", (event) => {
    event.currentTarget.setAttribute(
      "aria-expanded",
      !event.currentTarget.closest("details").hasAttribute("open"),
    );
  });

  if (summary.closest("header-drawer")) return;
  summary.parentElement.addEventListener("keyup", onKeyUpEscape);
});

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE") return;

  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus();
}

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  elementToFocus.focus();
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*",
    );
  });
  document.querySelectorAll(".js-vimeo").forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', "*");
  });
  document.querySelectorAll("video").forEach((video) => video.pause());
  document.querySelectorAll("product-model").forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this)),
    );

    var eventList = ["paste", "input"];

    for (event of eventList) {
      this.input.addEventListener(event, function (e) {
        const numberRegex = /^0*?[1-9]\d*$/;

        if (
          numberRegex.test(e.currentTarget.value) ||
          e.currentTarget.value === ""
        ) {
          e.currentTarget.value;
        } else {
          e.currentTarget.value = 1;
        }
      });
    }

    this.input.addEventListener("focusout", function (e) {
      if (e.currentTarget.value === "") {
        e.currentTarget.value = 1;
      }
    });
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define("quantity-input", QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return JSON.stringify(obj);
};

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options,
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid,
  );

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this),
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector("details");
    const summaryElements = this.querySelectorAll("summary");
    this.addAccessibilityAttributes(summaryElements);

    if (navigator.platform === "iPhone")
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${window.innerHeight}px`,
      );

    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this)),
    );
    this.querySelectorAll("button").forEach((button) => {
      if (this.querySelector(".header__localization-button") === button) return;
      if (this.querySelector(".header__localization-lang-button") === button)
        return;
      button.addEventListener("click", this.onCloseButtonClick.bind(this));
    });
  }

  addAccessibilityAttributes(summaryElements) {
    summaryElements.forEach((element) => {
      element.setAttribute("role", "button");
      element.setAttribute("aria-expanded", false);
      element.setAttribute("aria-controls", element.nextElementSibling.id);
    });
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;

    const openDetailsElement = event.target.closest("details[open]");
    if (!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(this.mainDetailsToggle.querySelector("summary"))
      : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const isOpen = detailsElement.hasAttribute("open");

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault();
      isOpen
        ? this.closeMenuDrawer(summaryElement)
        : this.openMenuDrawer(summaryElement);
    } else {
      trapFocus(
        summaryElement.nextElementSibling,
        detailsElement.querySelector("button"),
      );

      setTimeout(() => {
        detailsElement.classList.add("menu-opening");
      });
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove("menu-opening");
      this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
        details.removeAttribute("open");
        details.classList.remove("menu-opening");
      });
      this.mainDetailsToggle
        .querySelector("summary")
        .setAttribute("aria-expanded", false);
      document.body.classList.remove(
        `overflow-hidden-${this.dataset.breakpoint}`,
      );
      removeTrapFocus(elementToFocus);
      this.closeAnimation(this.mainDetailsToggle);
    }
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (
        this.mainDetailsToggle.hasAttribute("open") &&
        !this.mainDetailsToggle.contains(document.activeElement)
      )
        this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest("details");
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    detailsElement.classList.remove("menu-opening");
    removeTrapFocus();
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute("open");
        if (detailsElement.closest("details[open]")) {
          trapFocus(
            detailsElement.closest("details[open]"),
            detailsElement.querySelector("summary"),
          );
        }
      }
    };

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define("menu-drawer", MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }

  openMenuDrawer(summaryElement) {
    this.header =
      this.header || document.getElementById("shopify-section-header");
    this.borderOffset =
      this.borderOffset ||
      this.closest(".header-wrapper").classList.contains(
        "header-wrapper--border-bottom",
      )
        ? 1
        : 0;
    document.documentElement.style.setProperty(
      "--header-bottom-position",
      `${parseInt(
        this.header.getBoundingClientRect().bottom - this.borderOffset,
      )}px`,
    );

    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });

    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
}

customElements.define("header-drawer", HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this, false),
    );
    this.addEventListener("keyup", (event) => {
      if (event.code.toUpperCase() === "ESCAPE") this.hide();
    });
    if (this.classList.contains("media-modal")) {
      this.addEventListener("pointerup", (event) => {
        if (
          event.pointerType === "mouse" &&
          !event.target.closest("deferred-media, product-model")
        )
          this.hide();
      });
    } else {
      this.addEventListener("click", (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector(".template-popup");
    document.body.classList.add("overflow-hidden");
    this.setAttribute("open", "");
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    let isOpen = false;

    this.removeAttribute("open");
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();

    document.querySelectorAll("body > quick-add-modal").forEach((el) => {
      if (el.hasAttribute("open")) {
        isOpen = true;
      }
    });

    if (!isOpen) {
      document.body.classList.remove("overflow-hidden");
      document.body.dispatchEvent(new CustomEvent("modalClosed"));
    }
  }
}

customElements.define("modal-dialog", ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector("button");

    if (!button) return;
    button.addEventListener("click", () => {
      const modal = document.querySelector(this.getAttribute("data-modal"));
      if (modal) modal.show(button);
    });
  }
}

customElements.define("modal-opener", ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener(
      "click",
      this.loadContent.bind(this),
    );
    if (this.getAttribute("data-autoplay")) {
      this.loadContent();
    }
  }
  loadContent() {
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div");
      content.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(
          true,
        ),
      );
      this.setAttribute("loaded", true);
      window.pauseAllMedia();

      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (this.getAttribute("data-autoplay")) {
              if (entry.target.nodeName == "VIDEO") {
                let playPromise = entry.target.play();
                if (playPromise !== undefined) {
                  playPromise.then(() => {}).catch(() => {});
                }
              } else {
                if (entry.target.classList.contains("js-youtube")) {
                  entry.target.contentWindow.postMessage(
                    '{"event":"command","func":"playVideo","args":""}',
                    "*",
                  );
                } else {
                  entry.target.contentWindow.postMessage(
                    '{"method":"play"}',
                    "*",
                  );
                }
              }
            }
          } else {
            if (entry.target.nodeName == "VIDEO") {
              entry.target.pause();
            } else {
              if (entry.target.classList.contains("js-youtube")) {
                entry.target.contentWindow.postMessage(
                  '{"event":"command","func":"pauseVideo","args":""}',
                  "*",
                );
              } else {
                entry.target.contentWindow.postMessage(
                  '{"method":"pause"}',
                  "*",
                );
              }
            }
          }
        });
      });

      this.appendChild(content);

      content.querySelectorAll("video, iframe").forEach((deferredElement) => {
        if (
          deferredElement.nodeName == "VIDEO" ||
          deferredElement.nodeName == "IFRAME"
        ) {
          if (this.classList.contains("video-section__media")) {
            let playPromise = deferredElement.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {}).catch(() => {});
            }
            videoObserver.observe(deferredElement);
          } else {
            deferredElement.play();
          }
        }
      });

      if (
        this.closest(".swiper")?.swiper.slides[
          this.closest(".swiper").swiper.activeIndex
        ].querySelector("model-viewer")
      ) {
        if (
          !this.closest(".swiper")
            .swiper.slides[
              this.closest(".swiper").swiper.activeIndex
            ].querySelector("model-viewer")
            .classList.contains("shopify-model-viewer-ui__disabled")
        ) {
          this.closest(".swiper").swiper.params.noSwiping = true;
          this.closest(".swiper").swiper.params.noSwipingClass = "swiper-slide";
        }
      }
    }
  }
}

customElements.define("deferred-media", DeferredMedia);

class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector(".slider");
    this.sliderItems = this.querySelectorAll(".slider__slide");
    this.pageCount = this.querySelector(".slider-counter--current");
    this.pageTotal = this.querySelector(".slider-counter--total");
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    if (!this.slider || !this.nextButton) return;

    const resizeObserver = new ResizeObserver((entries) => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener("scroll", this.update.bind(this));
    this.prevButton.addEventListener("click", this.onButtonClick.bind(this));
    this.nextButton.addEventListener("click", this.onButtonClick.bind(this));
  }

  initPages() {
    if (!this.sliderItems.length === 0) return;
    this.slidesPerPage = Math.floor(
      this.slider.clientWidth / this.sliderItems[0].clientWidth,
    );
    this.totalPages = this.sliderItems.length - this.slidesPerPage + 1;
    this.update();
  }

  update() {
    if (!this.pageCount || !this.pageTotal) return;
    this.currentPage =
      Math.round(this.slider.scrollLeft / this.sliderItems[0].clientWidth) + 1;

    if (this.currentPage === 1) {
      this.prevButton.setAttribute("disabled", true);
    } else {
      this.prevButton.removeAttribute("disabled");
    }

    if (this.currentPage === this.totalPages) {
      this.nextButton.setAttribute("disabled", true);
    } else {
      this.nextButton.removeAttribute("disabled");
    }

    this.pageCount.textContent = this.currentPage;
    this.pageTotal.textContent = this.totalPages;
  }

  onButtonClick(event) {
    event.preventDefault();
    const slideScrollPosition =
      event.currentTarget.name === "next"
        ? this.slider.scrollLeft + this.sliderItems[0].clientWidth
        : this.slider.scrollLeft - this.sliderItems[0].clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }
}

customElements.define("slider-component", SliderComponent);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange);

    this.isHighVariantNeedUpdate = false;
    this.isCombinedListingsNeedUpdate = false;
  }

  onVariantChange(event) {
    if (!this.contains(event.target)) return;

    const combinedProductURL = event.target.dataset?.productUrl;

    this.updateOptions();
    // updateMasterId method updates currentVariant from liquid <script data-all-variations-no-high>
    this.updateMasterId();
    this.toggleAddButton(true, "");

    this.isHighVariantNeedUpdate = false;
    // -----
    // checking for high-variant and combined products
    // if variant not found in liquid <script data-all-variants-no-high> and product is high-variant
    if (
      (!this.currentVariant && this.dataset.isHighVariantProduct === "true") ||
      (!this.currentVariant && combinedProductURL)
    ) {
      const selectedValuesIds = this.getSelectedValuesIds();
      this.highVariantRequestUrl = this.createRequestUrl({
        selectedValuesIds: selectedValuesIds,
        combinedProductURL: combinedProductURL,
      });
      if (this.highVariantRequestUrl) {
        this.isHighVariantNeedUpdate = true;
        if (combinedProductURL) {
          this.isCombinedListingsNeedUpdate = true;
        }
      }
    }
    // -----

    if (this.isHighVariantNeedUpdate === false) {
      this.updatePickupAvailability();
      this.updateVariantStatuses();
    }
    this.resetErrorMessage();

    if (!this.currentVariant) {
      // -----
      // for high-variant products
      if (this.isHighVariantNeedUpdate) {
        this.classList.add("high-variant-loading");
        this.renderProductInfo(this.highVariantRequestUrl);
        return;
      }
      // -----

      this.toggleAddButton(true, "");
      this.setUnavailable();
    } else {
      if (
        this.currentVariant?.featured_media &&
        this.dataset?.variantMediaDisplay === "show_all"
      ) {
        // If variant display != "show_all", the media gallery element is fully replaced inside updateElementsAfterFetch
        const mediaId = `${this.dataset.section}-${this.currentVariant.featured_media.id}`;
        this.updateMedia(mediaId);
      }
      this.updateURL();
      this.updateVariantInput();
      const requestUrl = this.createRequestUrl({
        currentVariantId: this.currentVariant.id,
      });
      this.renderProductInfo(requestUrl);
    }
  }

  updateOptions() {
    const fieldsets = Array.from(
      this.querySelectorAll(".product-form__controls--dropdown"),
    );

    this.options = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value,
    ).concat(
      fieldsets.map((fieldset) => {
        return Array.from(fieldset.querySelectorAll("input")).find(
          (radio) => radio.checked,
        ).value;
      }),
    );
  }

  updateMasterId() {
    if (this.variantData || this.querySelector("[data-all-variants-no-high]")) {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options
          .map((option, index) => {
            return this.options[index] === option;
          })
          .includes(false);
      });
    }
  }

  isHidden(elem) {
    const styles = window.getComputedStyle(elem);
    return styles.display === "none" || styles.visibility === "hidden";
  }

  updateMedia(mediaId = null) {
    if (!this.currentVariant || !this.currentVariant?.featured_media) return;

    const targetMediaId =
      mediaId ||
      `${this.dataset.section}-${this.currentVariant.featured_media.id}`;

    const newMediaGlobal = document.querySelector(
      `[data-media-id="${targetMediaId}"]`,
    );

    if (!newMediaGlobal) return;

    const parent = newMediaGlobal.parentElement;

    /**
     * ------------------------------------------------
     * Main sliders
     * ------------------------------------------------
     */
    const swiperWrappers = document.querySelectorAll(
      ".product__media-wrapper, .global-variant-slider",
    );

    swiperWrappers.forEach((elem) => {
      // skip quickview here
      if (
        elem.firstElementChild &&
        elem.firstElementChild.classList.contains("quick-product__media-list")
      ) {
        return;
      }

      if (this.isHidden(elem)) return;

      const newMedia = elem.querySelector(`[data-media-id="${targetMediaId}"]`);

      if (!newMedia) return;

      const mediaList = elem.querySelector(
        ".js-media-list, .global-variant-js-media-list",
      );

      /**
       * Swiper layouts
       */
      if (mediaList && mediaList.swiper) {
        let slideIndex = mediaList.swiper.slides.findIndex((slideEl) => {
          return slideEl.dataset?.mediaId === targetMediaId;
        });

        // fallback
        if (slideIndex === -1) {
          slideIndex = Number(newMedia.dataset?.swiperSlideIndex || 0);
        }

        mediaList.swiper.slideTo(slideIndex, 800);
      } else {
        /**
         * Non-swiper layouts
         */
        newMedia && parent.prepend(newMedia);

        window.setTimeout(() => {
          parent.scroll(0, 0);
        });
      }

      /**
       * stacked / stacked_previews support
       */
      const stackedList =
        elem.querySelector(
          ".product__media-list[data-desktop-type='stacked_previews']",
        ) ||
        elem.querySelector(".product__media-list[data-desktop-type='stacked']");

      if (stackedList && window.innerWidth >= 990) {
        const targetItem = stackedList.querySelector(
          `[data-media-id="${targetMediaId}"]`,
        );

        if (targetItem) {
          const offset =
            targetItem.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: offset - 100,
            behavior: "smooth",
          });
        }
      }
    });

    /**
     * ------------------------------------------------
     * Quick view
     * ------------------------------------------------
     */
    const swiperWrappersQuickView = document.querySelectorAll(
      ".quick-product__media-list",
    );

    swiperWrappersQuickView.forEach((elem) => {
      if (this.isHidden(elem)) return;

      const newMedia = elem.querySelector(`[data-media-id="${targetMediaId}"]`);

      if (!newMedia) return;

      const mediaList = elem.querySelector(".quick-js-media-list");

      if (mediaList && mediaList.swiper) {
        let slideIndex = mediaList.swiper.slides.findIndex((slideEl) => {
          return slideEl.dataset?.mediaId === targetMediaId;
        });

        if (slideIndex === -1) {
          slideIndex = Number(newMedia.dataset?.swiperSlideIndex || 0);
        }

        mediaList.swiper.slideTo(slideIndex, 800);
      } else {
        newMedia && parent.prepend(newMedia);

        window.setTimeout(() => {
          parent.scroll(0, 0);
        });
      }
    });
  }

  updateURL() {
    if (this.dataset.updateUrl === "false") return;
    const newUrl = this.currentVariant
      ? `${this.dataset.url}?variant=${this.currentVariant.id}`
      : this.dataset.url;

    window.history.replaceState({}, "", newUrl);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`,
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    publish(PUB_SUB_EVENTS.variantChange, {
      data: {
        sectionId: this.dataset.section,
        variant: this.currentVariant,
      },
    });
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(
      (variant) => this.querySelector(":checked").value === variant.option1,
    );
    const inputWrappers = [...this.querySelectorAll(".product-form__controls")];
    inputWrappers.forEach((option, index) => {
      if (index === 0) return;
      const optionInputs = [
        ...option.querySelectorAll('input[type="radio"], option'),
      ];
      const previousOptionSelected =
        inputWrappers[index - 1].querySelector(":checked").value;
      const availableOptionInputsValue = selectedOptionOneVariants
        .filter(
          (variant) =>
            variant.available &&
            variant.options[index - 1] === previousOptionSelected,
        )
        .map((variantOption) => variantOption.options[index]);
      this.setInputAvailability(optionInputs, availableOptionInputsValue);
    });
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
        if (input.tagName === "OPTION") {
          input.innerText = input.getAttribute("value");
        } else if (input.tagName === "INPUT") {
          input.classList.remove("disabled");
        }
      } else {
        if (input.tagName === "OPTION") {
          input.innerText =
            window.variantStrings.unavailable_with_option.replace(
              "[value]",
              input.getAttribute("value"),
            );
        } else if (input.tagName === "INPUT") {
          input.classList.add("disabled");
        }
      }
    });
  }

  setCheckedInputsBySelectedValues(selectedValues) {
    const inputWrappers = [...this.querySelectorAll(".product-form__controls")];

    inputWrappers.forEach((groupEl, index) => {
      const selectedValue = selectedValues[index];
      if (!selectedValue) return;

      const inputs = [...groupEl.querySelectorAll('input[type="radio"]')];

      inputs.forEach((input) => {
        const shouldBeChecked = input.value === selectedValue;
        input.checked = shouldBeChecked;
        if (shouldBeChecked) {
          input.setAttribute("checked", "");
        } else {
          input.removeAttribute("checked");
        }
      });
    });
  }

  getSelectedValues() {
    const controls = [...this.querySelectorAll(".product-form__controls")];

    controls.sort((a, b) => {
      return (
        Number(a.dataset.optionPosition) - Number(b.dataset.optionPosition)
      );
    });

    const selectedValues = controls.map((control) => {
      const checkedInput = control.querySelector('input[type="radio"]:checked');
      return checkedInput ? checkedInput.value : null;
    });

    return selectedValues;
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }

  renderProductInfo(requestUrl) {
    this.abortController?.abort();
    this.abortController = new AbortController();

    fetch(requestUrl, { signal: this.abortController.signal })
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");

        try {
          this.setCurrentVariantAfterFetch(html);
        } catch (err) {}

        // -----
        // for high-variant products
        // and if variant not found in liquid <script data-all-variants-no-high>
        // but it was found after a request with the option_values parameter
        if (this.isHighVariantNeedUpdate) {
          try {
            this.updateURL();
            this.updatePickupAvailability();
            this.updatePickerInnerHtml(html);
            if (this.currentVariant) {
              this.updateVariantInput();
              if (
                this.currentVariant.featured_media &&
                this.dataset?.variantMediaDisplay === "show_all"
              ) {
                // If variant display != "show_all", the media gallery element is fully replaced inside updateElementsAfterFetch
                const mediaId = `${this.dataset.section}-${this.currentVariant.featured_media.id}`;
                this.updateMedia(mediaId);
              }
            }
          } catch (err) {}
        }
        // -----

        this.updateElementsAfterFetch(html);

        if (!this.currentVariant) {
          this.toggleAddButton(true, "");
          this.setUnavailable();
        } else {
          this.toggleAddButton(
            !this.currentVariant.available,
            window.variantStrings.soldOut,
          );
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.info("Fetch aborted by user");
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        this.classList.remove("high-variant-loading");
      });
  }

  toggleAddButton(disable = true, text) {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`,
    );
    productForms.forEach((productForm) => {
      const addButton = productForm.querySelector('[name="add"]');
      if (!addButton) return;

      const addButtonText =
        addButton.querySelector(".button__label") ||
        addButton.querySelector("span");

      if (disable) {
        addButton.setAttribute("disabled", true);
        addButton.setAttribute("aria-disabled", true);
        if (text) {
          addButtonText.textContent = text;

          if (text === window.variantStrings.unavailable) {
            addButton.dataset.status = "unavailable";
          } else {
            addButton.dataset.status = "sold-out";
          }
        }
      } else {
        addButton.removeAttribute("disabled");
        addButton.removeAttribute("aria-disabled");
        addButtonText.textContent = window.variantStrings.addToCart;
        addButton.dataset.status = "available";
      }
    });
  }

  resetErrorMessage() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`,
    );
    productForms.forEach((productForm) => {
      const parentEl = productForm.closest("product-form");
      if (parentEl) {
        const errorWrapperEl = parentEl.querySelector(
          ".product-form__error-message-wrapper",
        );
        const errorTextEl = errorWrapperEl?.querySelector(
          ".product-form__error-message",
        );
        if (!errorWrapperEl || !errorTextEl) return;
        errorWrapperEl.setAttribute("hidden", true);
        errorTextEl.textContent = "";
      }
    });
  }

  setUnavailable() {
    const price = document.getElementById(`price-${this.dataset.section}`);
    const priceSticky = document.getElementById(
      `price-sticky-${this.dataset.section}`,
    );
    const inventory = document.getElementById(
      `Inventory-${this.dataset.section}`,
    );
    const pickerInventory = document.getElementById(
      `PickerInventory-${this.dataset.section}`,
    );
    const sku = document.getElementById(`Sku-${this.dataset.section}`);
    const colorNameDestinations = document.querySelectorAll(
      `[id^="ColorName-${this.dataset.section}"]`,
    );

    this.toggleAddButton(true, window.variantStrings.unavailable);
    if (price) price.classList.add("visibility-hidden");
    if (priceSticky) priceSticky.classList.add("visibility-hidden");
    if (inventory) inventory.classList.add("visibility-hidden");
    if (pickerInventory) pickerInventory.classList.add("visibility-hidden");
    if (sku) sku.classList.add("visibility-hidden");
    colorNameDestinations.forEach((colorNameDestination) => {
      colorNameDestination.classList.add("visibility-hidden");
    });
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector("[data-all-variants-no-high]").textContent);
    return this.variantData;
  }

  updateElementsAfterFetch(html) {
    // attr data-original-section use for Quick view modal
    const currentSectionId = this.dataset.section;
    const sourceSectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    // price
    const priceDestination = document.getElementById(
      `price-${currentSectionId}`,
    );
    const priceStickyDestination = document.getElementById(
      `price-sticky-${currentSectionId}`,
    );
    const priceSource = html.getElementById(`price-${sourceSectionId}`);
    if (priceSource && priceDestination) {
      priceDestination.innerHTML = priceSource.innerHTML;
      priceDestination.classList.remove("visibility-hidden");
    }
    if (priceSource && priceStickyDestination) {
      priceStickyDestination.innerHTML = priceSource.innerHTML;
      const priceText = priceStickyDestination.querySelector(".price-text");
      if (priceText) priceText.className = "price-text";
    }

    // inventory
    const inventorySource = html.getElementById(`Inventory-${sourceSectionId}`);
    const inventoryDestination = document.getElementById(
      `Inventory-${currentSectionId}`,
    );
    if (inventorySource && inventoryDestination) {
      inventoryDestination.innerHTML = inventorySource.innerHTML;
      inventoryDestination.classList.toggle(
        "visibility-hidden",
        inventorySource.innerText === "",
      );
    }

    const pickerInventorySource = html.getElementById(
      `PickerInventory-${sourceSectionId}`,
    );
    const pickerInventoryDestination = document.getElementById(
      `PickerInventory-${currentSectionId}`,
    );
    if (pickerInventorySource && pickerInventoryDestination) {
      pickerInventoryDestination.innerHTML = pickerInventorySource.innerHTML;
      pickerInventoryDestination.classList.toggle(
        "visibility-hidden",
        pickerInventorySource.innerText === "",
      );
    }

    // sku
    const skuSource = html.getElementById(`Sku-${sourceSectionId}`);
    const skuDestination = document.getElementById(`Sku-${currentSectionId}`);
    if (skuSource && skuDestination) {
      skuDestination.innerHTML = skuSource.innerHTML;
      skuDestination.classList.toggle(
        "visibility-hidden",
        skuSource.classList.contains("visibility-hidden"),
      );
    }

    // color swatches label
    const colorNameSources = html.querySelectorAll(
      `[id^="ColorName-${sourceSectionId}"]`,
    );
    const colorNameDestinations = document.querySelectorAll(
      `[id^="ColorName-${currentSectionId}"]`,
    );
    if (colorNameSources?.length === colorNameDestinations?.length) {
      colorNameDestinations.forEach((colorNameDestination, index) => {
        colorNameDestination.classList.remove("visibility-hidden");
        colorNameDestination.innerHTML = colorNameSources[index].innerHTML;
      });
    }

    // variant image swatches
    if (this.isHighVariantNeedUpdate !== true) {
      const variantSwatchesSource = html.querySelector(
        `#variant-picker-${sourceSectionId} [data-is-variant-image-swatch="true"]`,
      );
      const variantSwatchesDestination = document.querySelector(
        `#variant-picker-${currentSectionId} [data-is-variant-image-swatch="true"]`,
      );
      if (variantSwatchesSource && variantSwatchesDestination) {
        const quickViewModal = this.closest("quick-add-modal");
        if (quickViewModal) {
          variantSwatchesDestination.innerHTML =
            variantSwatchesSource.innerHTML.replaceAll(
              sourceSectionId,
              `quickview-${sourceSectionId}`,
            );
        } else {
          variantSwatchesDestination.innerHTML =
            variantSwatchesSource.innerHTML;
        }
      }
    }

    // product media
    if (
      this.dataset?.variantMediaDisplay !== "show_all" ||
      this.isCombinedListingsNeedUpdate
    ) {
      const mediaSource = html.querySelector(
        `[data-section="product-media-${sourceSectionId}"]`,
      );
      const mediaDestination = document.querySelector(
        `[data-section="product-media-${currentSectionId}"]`,
      );
      if (mediaSource && mediaDestination) {
        mediaDestination.innerHTML = mediaSource.innerHTML;

        const parentQuickView = this.closest("quick-add-modal");
        const parentFeaturedProduct = this.closest(".featured-product-section");
        if (parentQuickView) {
          if (typeof parentQuickView.removeDOMElements === "function") {
            parentQuickView.removeDOMElements(mediaDestination);
          }
          if (typeof parentQuickView.initSlider === "function") {
            parentQuickView.initSlider();
          }
        } else if (parentFeaturedProduct) {
          const section = document.getElementById(
            `shopify-section-${currentSectionId}`,
          );

          if (section && typeof window.initFeaturedProduct === "function") {
            window.initFeaturedProduct(section);
          }
        } else {
          const section = document.getElementById(
            `shopify-section-${currentSectionId}`,
          );

          if (section && typeof initProductPage === "function") {
            initProductPage(section);
          }
        }
      }
    }
  }

  // methods for high variant products
  getSelectedValuesIds() {
    const controls = [...this.querySelectorAll(".product-form__controls")];

    controls.sort((a, b) => {
      return (
        Number(a.dataset.optionPosition) - Number(b.dataset.optionPosition)
      );
    });

    return controls.map((control) => {
      const checkedInput = control.querySelector('input[type="radio"]:checked');
      return checkedInput?.dataset?.optionValueId
        ? checkedInput.dataset.optionValueId
        : null;
    });
  }

  createRequestUrl({
    currentVariantId = "",
    selectedValuesIds = [],
    combinedProductURL = "",
  }) {
    const productUrl = combinedProductURL || `${this.dataset.url}`;
    const sectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    if (currentVariantId) {
      return `${productUrl}?variant=${currentVariantId}&section_id=${sectionId}`;
    }

    // -----
    // for high-variant products
    // and if variant not found in liquid <script data-all-variants-no-high>
    if (selectedValuesIds.length) {
      const params = [];
      params.push(`section_id=${sectionId}`);
      params.push(`option_values=${selectedValuesIds.join(",")}`);
      return `${productUrl}?${params.join("&")}`;
    }
    // -----
  }

  setCurrentVariantAfterFetch(html) {
    // attr data-original-section use for Quick view modal
    const sourceSectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    const variantPickerSource = html.getElementById(
      `variant-picker-${sourceSectionId}`,
    );
    const variantPickerDestionation = document.getElementById(
      `variant-picker-${this.dataset.section}`,
    );
    if (!variantPickerSource) return;

    const newVariantDataEl = variantPickerSource.querySelector(
      "[data-selected-variant]",
    );
    if (!newVariantDataEl) return;

    const newVariantData = variantPickerSource.querySelector(
      "[data-selected-variant]",
    ).innerHTML;

    const selectedVariant = !!newVariantData
      ? JSON.parse(newVariantData)
      : null;

    this.currentVariant = selectedVariant;

    const oldEl = variantPickerDestionation.querySelector(
      "[data-selected-variant]",
    );
    if (oldEl) {
      oldEl.innerHTML = newVariantData;
    }
  }

  updatePickerInnerHtml(html) {
    // attr data-original-section use for Quick view modal
    const currentSectionId = this.dataset.section;
    const sourceSectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    const variantPickerSource = html.getElementById(
      `variant-picker-${sourceSectionId}`,
    );
    const variantPickerDestination = document.getElementById(
      `variant-picker-${currentSectionId}`,
    );

    if (variantPickerSource && variantPickerDestination) {
      const quickViewModal = this.closest("quick-add-modal");
      if (quickViewModal) {
        variantPickerDestination.innerHTML =
          variantPickerSource.innerHTML.replaceAll(
            sourceSectionId,
            `quickview-${sourceSectionId}`,
          );
      } else {
        variantPickerDestination.innerHTML = variantPickerSource.innerHTML;
      }
    }
  }
}

if (!customElements.get("variant-selects")) {
  customElements.define("variant-selects", VariantSelects);
}

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
        input.classList.remove("disabled");
        input.disabled = false;
      } else {
        input.classList.add("disabled");
      }
    });
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked,
      ).value;
    });
  }
}

if (!customElements.get("variant-radios")) {
  customElements.define("variant-radios", VariantRadios);
}

(function () {
  const imageMouseParallax = (options) => {
    options = options || {};
    this.nameSpaces = {
      wrapper: options.wrapper || ".parallax",
      layers: options.layers || ".parallax-layer",
      deep: options.deep || "data-parallax-deep",
    };

    this.init = function () {
      var self = this;
      var parallaxWrappers = document.querySelectorAll(this.nameSpaces.wrapper);

      for (var i = 0; i < parallaxWrappers.length; i++) {
        (function (i) {
          parallaxWrappers[i].addEventListener("mousemove", function (e) {
            var x = e.clientX;
            var y = e.clientY;
            var layers = parallaxWrappers[i].querySelectorAll(
              self.nameSpaces.layers,
            );

            for (var j = 0; j < layers.length; j++) {
              (function (j) {
                var deep = layers[j].getAttribute(self.nameSpaces.deep);
                var disallow = layers[j].getAttribute("data-parallax-disallow");
                var itemX = disallow && disallow === "x" ? 0 : x / deep;
                var itemY = disallow && disallow === "y" ? 0 : y / deep;

                if (disallow && disallow === "both") return;
                layers[j].style.transform =
                  "translateX(" + itemX + "%) translateY(" + itemY + "%)";
              })(j);
            }
          });
        })(i);
      }
    };
    this.init();
    return this;
  };

  document.addEventListener("shopify:section:load", imageMouseParallax);

  imageMouseParallax();
})();

(function () {
  const initHeaderOverlay = () => {
    const main = document.getElementById("MainContent");
    const sections = main.querySelectorAll(".shopify-section");

    if (sections.length > 0) {
      const sectionFirstChild = sections[0].querySelector(
        "[data-header-overlay]",
      );
      const headerGroupSections = document.querySelectorAll(
        ".shopify-section-group-header-group",
      );
      const header = document.querySelector(".header-main-section");
      const headerMobile = document.querySelector(".header-mobile-section");
      const breadcrumbs = document.querySelector("body > .breadcrumbs-wrapper");

      if (sectionFirstChild) {
        if (headerGroupSections[headerGroupSections.length - 2] === header) {
          sections[0].classList.add("section--has-overlay");
          header.classList.add("color-background-overlay");
          header.classList.add("color-background-4");
          header.classList.add("header-overlay");

          headerMobile.classList.add("color-background-overlay");
          headerMobile.classList.add("color-background-4");
          headerMobile.classList.add("header-overlay");
          if (breadcrumbs) breadcrumbs.classList.add("color-background-4");
        } else {
          sections[0].classList.remove("section--has-overlay");
          header.classList.remove("color-background-overlay");
          header.classList.remove("color-background-4");
          header.classList.remove("header-overlay");

          headerMobile.classList.remove("color-background-overlay");
          headerMobile.classList.remove("color-background-4");
          headerMobile.classList.remove("header-overlay");
          if (breadcrumbs) breadcrumbs.classList.remove("color-background-4");
        }
      } else {
        sections[0].classList.remove("section--has-overlay");
        header.classList.remove("color-background-overlay");
        header.classList.remove("color-background-4");

        headerMobile.classList.remove("color-background-overlay");
        headerMobile.classList.remove("color-background-4");
        if (breadcrumbs) breadcrumbs.classList.remove("color-background-4");
      }
    }
  };

  initHeaderOverlay();

  document.addEventListener("shopify:section:load", initHeaderOverlay);
  document.addEventListener("shopify:section:unload", initHeaderOverlay);
  document.addEventListener("shopify:section:reorder", initHeaderOverlay);
})();

///* Light header on dark bg */
//(function () {
//	let setLightHeader = () => {
//		let articleElement = document.querySelector(".article-template");
//		let headerArticle = document.querySelector(".article-template__header");
//		let headerWrapper = document.querySelector(".header-wrapper");
//		let headerLogo =
//			document.querySelector(
//				".header > .header__heading-link .header__heading-logo:not(.header__heading-logo--overlay)"
//			) ||
//			document.querySelector(
//				".header > .header__heading .header__heading-link .header__heading-logo:not(.header__heading-logo--overlay)"
//			);
//		let headerLogoOverlay = document.querySelector(
//			".header__heading-logo--overlay"
//		);

//		if (headerLogoOverlay) {
//			if (headerLogo) {
//				headerLogo.classList.add("hide");
//			}
//			headerLogoOverlay.classList.add("show");
//		} else {
//			if (headerLogo) {
//				headerLogo.classList.remove("hide");
//			}
//		}

//		if (
//			articleElement &&
//			articleElement.classList.contains("section-template--overlay")
//		) {
//			if (headerWrapper) {
//				headerWrapper.classList.add("header-wrapper--overlay");
//			}
//		} else {
//			if (headerWrapper) {
//				headerWrapper.classList.remove("header-wrapper--overlay");
//			}
//		}

//		let heroMedia = document.querySelector(".article-template__hero > .media");

//		if (heroMedia) {
//			if (heroMedia.classList.contains("article-template__hero-large")) {
//				headerArticle.classList.add("article-template__header-large");
//			} else {
//				headerArticle.classList.remove("article-template__header-large");
//			}
//		}

//		//// Checking Interactive section
//		//const main = document.getElementById("MainContent");
//		//const sections = main.querySelectorAll(".shopify-section");
//		//const elementOverlay = sections[0].querySelector(".section--has-overlay");

//		//sections.forEach((section) => {
//		//	const sectionFirstChild = sections[0].querySelector("div");
//		//	if (
//		//		(sections[0].classList.contains("section--overlay") &&
//		//			sectionFirstChild.classList.contains("color-background-3")) ||
//		//		elementOverlay
//		//	) {
//		//		headerWrapper.classList.add("header-wrapper--overlay");
//		//		if (headerLogoOverlay) {
//		//			if (headerLogo) {
//		//				headerLogo.classList.add("hide");
//		//			}
//		//			headerLogoOverlay.classList.add("show");
//		//		} else {
//		//			if (headerLogo) {
//		//				headerLogo.classList.remove("hide");
//		//			}
//		//		}
//		//	}
//		//});
//	};

//	document.addEventListener("shopify:section:load", function () {
//		setLightHeader();
//	});

//	window.addEventListener("resize", function () {
//		setLightHeader();
//	});

//	setLightHeader();

//	let loopedSlides;
//})();

(function () {
  const selectDropDown = () => {
    // Only target dropdowns that haven't been initialized yet
    const dropdowns = document.querySelectorAll(
      ".product-form__controls--dropdown:not([data-initialized])",
    );

    dropdowns.forEach((container) => {
      const elList = container.querySelector(".dropdown-select ul");
      const elListItems = container.querySelectorAll(".dropdown-select ul li");
      const selectedText = container.querySelector(
        ".dropdown-select .select-label",
      );
      const shadowTop = container.querySelector(".shadow-top");
      const shadowBottom = container.querySelector(".shadow-bottom");

      if (!elList || !selectedText) return;

      container.setAttribute("data-initialized", "true");

      const updateShadows = () => {
        shadowTop?.classList.toggle("show", elList.scrollTop > 0);
        shadowBottom?.classList.toggle(
          "show",
          elList.scrollTop + elList.clientHeight < elList.scrollHeight - 5,
        );
      };

      selectedText.addEventListener("click", function (e) {
        e.stopPropagation();
        const isActive = elList.classList.contains("active");

        // Close other open dropdowns
        document
          .querySelectorAll(".dropdown-select ul.active")
          .forEach((openUl) => {
            if (openUl !== elList) openUl.classList.remove("active");
          });

        elList.classList.toggle("active");
        if (elList.classList.contains("active")) updateShadows();
      });

      elListItems.forEach((li) => {
        li.addEventListener("click", function () {
          const input = li.querySelector("input");

          // Opción A: permitir seleccionar también variantes agotadas (preorder/notify).
          // El texto visible del dropdown se actualiza para cualquier opción, no solo
          // las disponibles, de modo que la variante agotada quede marcada visualmente.
          if (input) {
            const span = selectedText.querySelector("span");
            if (span) {
              span.textContent = li.innerText.trim();
              span.setAttribute("title", li.innerText.trim());
            }
            if (li.dataset.color) {
              selectedText.style.setProperty(
                "--swatch-color",
                li.dataset.color,
              );
            }
          }
          elList.classList.remove("active");
        });
      });

      elList.addEventListener("scroll", updateShadows);
    });
  };

  // 1. Initial Load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", selectDropDown);
  } else {
    selectDropDown();
  }

  // 2. Global click to close
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".dropdown-select ul.active")
      .forEach((ul) => ul.classList.remove("active"));
  });

  // 3. Shopify Theme Editor Support
  document.addEventListener("shopify:section:load", selectDropDown);

  // 4. THE FIX: Watch for AJAX/Internal page refreshes
  // This observes the body for any added elements and re-runs the init logic
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        selectDropDown();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

// CART REFRESH EVENT
// -----------------------------------------------------------------------------

document.documentElement.addEventListener("cart:refresh", () => {
  const sectionsToUpdate = [
    { id: "cart-icon-bubble", selector: "#cart-icon-bubble" },
    { id: "cart-drawer", selector: "cart-drawer" },
    { id: "main-cart-items", selector: "#main-cart-items" },
    { id: "main-cart-footer", selector: "#main-cart-footer" },
  ];
  sectionsToUpdate.forEach((section) => {
    fetch(`${routes.cart_url}?section_id=${section.id}`)
      .then((response) => response.text())
      .then((html) => {
        const parsedHTML = new DOMParser().parseFromString(html, "text/html");
        const source = parsedHTML.querySelector(section.selector);
        const target = document.querySelector(section.selector);
        if (source && target) {
          target.innerHTML = source.innerHTML;
        }
      })
      .catch((e) =>
        console.error(`[cart:refresh] error updating ${section.id}`, e),
      );
  });
});

// CART REFRESH EVENT END
// -----------------------------------------------------------------------------
