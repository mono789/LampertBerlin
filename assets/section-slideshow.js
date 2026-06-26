(function () {
	const slideshow = () => {
		$(".slideshow-section").each(function () {
			if ($(this).hasClass('slider_started')){
				return ''
			}
			$(this).addClass('slider_started');
			const id = $(this).attr("id");
			const box = $(this).find(".slideshow");
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
				autoplayParm = {};
			}
			let swiperParms = {
				parallax: box.data("parallax"),
				speed: box.data("speed") * 1000,
				effect: box.data("effect"),
				loop: true,
				centeredSlides: false,
				autoHeight: false,
				calculateHeight: false,
				keyboard: true,
				creativeEffect: {
					prev: {
						shadow: true,
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
					slideShadows: true,
				},
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
				...autoplayParm,
			};
			const swiper = new Swiper(`#${id} .slideshow__swiper`, swiperParms);
			colorScheme(swiper);
			swiper.on("beforeTransitionStart", function () {
				colorScheme(this);
			});
			function colorScheme(context) {
				const parent = $(context.el).parent();
				const activeIndex = context.activeIndex;
				const activeSlide = context.slides[activeIndex];
				const changeItems = [
					context.navigation.nextEl,
					context.navigation.prevEl,
					context.pagination.el,
				];
				const colorScheme = $(activeSlide)
					.find(".slideshow-slide")
					.data("color-scheme");
				changeItems.forEach((item) => {
					$(item)
						.removeClass("color-background-1")
						.removeClass("color-background-4")
						.addClass(colorScheme);
				});
			}
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		slideshow();
		document.addEventListener("shopify:section:load", function () {
			slideshow();
		});
	});
})();
