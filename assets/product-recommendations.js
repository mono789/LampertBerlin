class ProductRecommendations extends HTMLElement {
	constructor() {
		super()
		this.recommendationsSlider = null

		const handleIntersection = (entries, observer) => {
			if (!entries[0].isIntersecting) return
			observer.unobserve(this)

			fetch(this.dataset.url)
				.then((response) => response.text())
				.then((text) => {
					const html = document.createElement('div')
					html.innerHTML = text
					const recommendations = html.querySelector('product-recommendations')
					if (recommendations && recommendations.innerHTML.trim().length) {
						this.replaceChildren(...recommendations.children)
					}
					this.initSlider()
				})
				.catch((e) => {
					console.error(e)
				})
		}

		new IntersectionObserver(handleIntersection.bind(this), {
			rootMargin: '0px 0px 200px 0px',
		}).observe(this)
	}

	initSlider() {
		const sliderEl = this.querySelector('.js-recommendation-slider')
		if (!sliderEl) return

		const prevBtn = this.querySelector('.recommendations-prev')
		const nextBtn = this.querySelector('.recommendations-next')
		const productsPerRow = Number(sliderEl.dataset.productsPerRow || 4)
		const slidesPerView576 = productsPerRow > 1 ? 2 : 1
		const slidesPerView990 =
			productsPerRow > 2 ? slidesPerView576 + 1 : slidesPerView576
		const slidesPerView1200 = productsPerRow >= 4 ? 4 : productsPerRow
		const slidesPerView1360 = productsPerRow

		const sliderSettings = {
			slidesPerView: 1,
			spaceBetween: 16,
			speed: 800,
			watchSlideProgress: true,
			allowTouchMove: true,
			mousewheel: {
				forceToAxis: true,
			},
			navigation: {
				nextEl: nextBtn,
				prevEl: prevBtn,
				disabledClass: 'swiper-button-disabled',
			},
			breakpoints: {
				576: {
					slidesPerView: slidesPerView576,
				},
				990: {
					slidesPerView: slidesPerView990,
				},
				1100: {
					spaceBetween: 32,
				},
				1200: {
					slidesPerView: slidesPerView1200,
					spaceBetween: 32,
				},
				1360: {
					slidesPerView: slidesPerView1360,
					spaceBetween: 32,
				},
			},
		}

		this.recommendationsSlider = new Swiper(sliderEl, sliderSettings)
	}
}

customElements.define('product-recommendations', ProductRecommendations)
