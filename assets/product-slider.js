(function () {
	const productSlider = () => {
		$(".product-slider-section").each(function () {
			if ($(this).hasClass('slider_started')){
				return ''
			}
			$(this).addClass('slider_started');
			const id = $(this).attr("id");
			const box = $(this).find(".product-slider");
			const autoplay = box.data("autoplay");
			const stopAutoplay = box.data("stop-autoplay");
			const delay = box.data("delay") * 1000;
			if (autoplay) {
				autoplayParm = {
					autoplay: {
						delay: delay,
						pauseOnMouseEnter: stopAutoplay,
						disableOnInteraction: false,
					},
				};
			} else {
				autoplayParm = { autoplay: false };
			}
			let swiperParms = {
				parallax: box.data("parallax"),
				effect: box.data("effect"),
				speed: box.data("speed") * 1000,
				creativeEffect: {
					prev: {
						shadow: false,
						translate: [0, 0, -400],
					},
					next: {
						translate: ["100%", 0, 0],
					},
				},
				coverflowEffect: {
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: false,
				},
				loop: true,
				autoHeight: false,
				calculateHeight: false,
				keyboard: true,
				slideShadows: false,
				flipEffect: {
					slideShadows: false,
				},
				...autoplayParm,
			};
			const swiperImg = new Swiper(
				`#${id} .product-slider__wrapper__image-swiper`,
				{ ...swiperParms, autoplay: false, allowTouchMove: false }
			);
			const swiperText = new Swiper(
				`#${id} .product-slider__wrapper__text-swiper`,
				{
					navigation: {
						nextEl: `#${id} .swiper-button-next`,
						prevEl: `#${id} .swiper-button-prev`,
					},
					pagination: {
						el: `#${id} .swiper-pagination`,
						clickable: true,
					},
					...swiperParms,
				}
			);
			swiperImg.controller.control = swiperText;
			swiperText.controller.control = swiperImg;
			//colorScheme(swiperText);
			//swiperText.on("beforeTransitionStart", function () {
			//	colorScheme(this);
			//});
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		productSlider();
	});
	document.addEventListener("shopify:section:load", function () {
		productSlider();
	});
})();

//function colorScheme(context) {
//	const parent = $(context.el).parent();
//	const activeIndex = context.activeIndex;
//	const activeSlide = context.slides[activeIndex];
//	const changeItems = [context.navigation.nextEl, context.navigation.prevEl, parent];
//	const colorScheme = $(activeSlide).data("color-scheme");
//	changeItems.forEach((item) => {
//		$(item)
//			.removeClass("color-background-1")
//			.removeClass("color-background-3")
//			.addClass(colorScheme);
//	});
//}
