(function () {
	const slideshow = () => {
		$(".testimonials-section").each(function () {
			if ($(this).hasClass('slider_started')){
				return ''
			}
			$(this).addClass('slider_started');
			const id = $(this).attr("id");
			const box = $(this).find(".testimonials");
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
				effect: box.data("effect"),
				speed: box.data("speed") * 1000,
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
				loop: true,
				autoHeight: false,
				calculateHeight: false,
				keyboard: true,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
				pagination: {
					el: ".swiper-pagination",
					clickable: true,
				},
				...autoplayParm,
			};
			const swiper = new Swiper(`#${id} .swiper`,swiperParms);
			colorScheme(swiper);
			swiper.on("beforeTransitionStart", function () {
				colorScheme(this);
			});
			function colorScheme(context) {
				const parent = $(context.el).parent();
				const activeIndex = context.activeIndex;
				const activeSlide = context.slides[activeIndex];
				const changeItems = [context.navigation.nextEl, context.navigation.prevEl, parent];
				const colorScheme = $(activeSlide).data("color-scheme");
				changeItems.forEach((item) => {
					$(item)
						.removeClass("color-background-1")
						.removeClass("color-background-2")
						.removeClass("color-background-3")
						.removeClass("color-background-4")
						.removeClass("color-background-5")
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