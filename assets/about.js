(function () {
	const initProductAccordion = () => {
		$(".product-about__accordion-title").click(function () {
			if (!$(this).hasClass("active")) {
				$(".product-about__accordion-title.active").removeClass("active");
				$(this).addClass("active");
				$(".product-about__accordion-description").stop().slideUp(300);
				$(this)
					.siblings(".product-about__accordion-description")
					.eq($(this).index())
					.stop()
					.slideDown(300);
			} else {
				$(".product-about__accordion-title").removeClass("active");
				$(".product-about__accordion-description").stop().slideUp(300);
			}
		});
	};

	document.addEventListener("shopify:section:load", function () {
		initProductAccordion();
	});

	initProductAccordion();
})();
