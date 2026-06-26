;(function () {
	const slideshow = () => {
		$('.product-markers-section').each(function () {
			if ($(this).hasClass('slider_started')) {
				return ''
			}
			$(this).addClass('slider_started')
			const markers = $(this).find('.product-markers__marker')
			const productMarkersWrapper = $(this).find(
				'.product-markers__product-wrapper .product-markers__swiper-wrapper'
			)[0]
			const id = $(this).attr('id')
			const box = $(this).find('.product-markers')
			const autoplay = box.data('autoplay')
			const stopAutoplay = box.data('stop-autoplay')
			const delay = box.data('delay') * 1000
			if (autoplay) {
				autoplayParm = {
					autoplay: {
						delay: delay,
						pauseOnMouseEnter: stopAutoplay,
						disableOnInteraction: false,
					},
				}
			} else {
				autoplayParm = {}
			}
			let swiperParms = {
				effect: box.data('effect'),
				speed: box.data('speed') * 1000,
				creativeEffect: {
					prev: {
						shadow: false,
						translate: [0, 0, -400],
					},
					next: {
						translate: ['100%', 0, 0],
					},
				},
				coverflowEffect: {
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: false,
				},
				flipEffect: {
					slideShadows: false,
				},
				loop: true,
				autoHeight: false,
				calculateHeight: false,
				keyboard: true,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
				...autoplayParm,
				on: {
					init: function () {
						const swiperSlides =
							productMarkersWrapper.querySelectorAll('.swiper-slide')
						for (let i = 0; i < swiperSlides.length; i++) {
							const inputsChildren = swiperSlides[i]?.querySelector(
								'.product-form__controls-group'
							)?.children

							if (inputsChildren) {
								const inputs = []
								const labels = []
								for (const item of inputsChildren) {
									if (item.tagName === 'INPUT') {
										inputs.push(item)
									} else if (item.tagName === 'LABEL') {
										labels.push(item)
									}
								}

								inputs.forEach((el, index) => {
									if (el.id === labels[index].htmlFor) {
										el.id = el.id + i
										labels[index].htmlFor = labels[index].htmlFor + i
									}
								})
							}
						}
					},
				},
			}
			const swiper = new Swiper(`#${id} .swiper`, swiperParms)
			markers.each(function () {
				$(this).click(function () {
					const index = $(this).data('slide-index')
					markers.removeClass('active')
					$(this).addClass('active')
					swiper.slideTo(index + 1, 1000)
				})
			})
			swiper.on('slideChange', function () {
				const reallIndex = swiper.realIndex
				markers.removeClass('active')
				$(`[data-slide-index="${reallIndex}"]`).addClass('active')
			})
		})
	}

	document.addEventListener('DOMContentLoaded', function () {
		slideshow()
		document.addEventListener('shopify:section:load', function () {
			slideshow()
		})
	})
})()
