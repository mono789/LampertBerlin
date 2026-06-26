(function () {
	const announcementSlider = () => {
		$(".announcement-bar__slide").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			if($(".announcement-bar").hasClass("announcement__slide-show")){
				$(this).addClass("slider_started");
			}
			const announcementId = $(this).data("announcement-id");
			const announcementSpeed = $(this).data("announcement-speed") * 1000;
			const announcementSwiper = new Swiper(
				`.announcement-js-${announcementId}`,
				{
					slidesPerView: "auto",
					speed: announcementSpeed,
					initialSlide: 0,
					loop: true,
					loopedSlides: 50,
					allowTouchMove: true,
					waitForTransition: false,
					watchSlidesProgress: false,
					autoplay: {
						delay: 0,
						disableOnInteraction: false,
					},
				}
			);
		});
	};
	checkWindow();
	$(window).resize(function () {
		checkWindow();
	});
	announcementSlider();
	document.addEventListener("shopify:section:load", function () {
		announcementSlider();
	});

	document.addEventListener("visibilitychange", function () {
		if (!document.hidden) {
			$(".announcement-js").each(function () {
				this.swiper.destroy();
			});
			announcementSlider();
		}
	});

	function checkWindow() {
		if ($(window).width() < 576) {
			$(".announcement-bar").addClass("announcement__slide-show");
			announcementSlider();
		} else {
			$(".announcement-bar__slide").removeClass("slider_started");
			$(".announcement-bar").removeClass("announcement__slide-show");
		}
	}
})();
