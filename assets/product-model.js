class ProductModel extends DeferredMedia {
  constructor() {
    super();
  }

  loadContent() {
    super.loadContent();

    Shopify.loadFeatures([
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: this.setupModelViewerUI.bind(this),
      },
    ]);
  }

  setupModelViewerUI(errors) {
    if (errors) return;

    this.modelViewerUI = new Shopify.ModelViewerUI(this.querySelector('model-viewer'));

    const $this = this;

    this.querySelector('.shopify-model-viewer-ui__button').addEventListener('click', function () {

      if ($this.closest('.swiper').swiper.slides[$this.closest('.swiper').swiper.activeIndex].querySelector('model-viewer')) {

        if (!$this.closest('.swiper').swiper.slides[$this.closest('.swiper').swiper.activeIndex].querySelector('model-viewer').classList.contains('shopify-model-viewer-ui__disabled')) {

          if ($this.querySelector('.shopify-model-viewer-ui__button').hasAttribute('hidden')) {
            $this.closest('.swiper').swiper.params.noSwiping = true;
            $this.closest('.swiper').swiper.params.noSwipingClass = 'swiper-slide';
          }

        }

      }

    });

    this.querySelector('.shopify-model-viewer-ui__controls-overlay').addEventListener('click', function () {
      if (!$this.querySelector('.shopify-model-viewer-ui__button').hasAttribute('hidden')) {
        $this.closest('.swiper').swiper.params.noSwiping = false;
      }
    });
  }
}
customElements.define('product-model', ProductModel);

window.ProductModel = {
  loadShopifyXR() {
    Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: this.setupShopifyXR.bind(this),
      },
    ]);
  },

  setupShopifyXR(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', () =>
        this.setupShopifyXR()
      );
      return;
    }

    document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
      window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
      modelJSON.remove();
    });
    window.ShopifyXR.setupXRElements();
  },
};

window.addEventListener('DOMContentLoaded', () => { window.ProductModel?.loadShopifyXR(); });
