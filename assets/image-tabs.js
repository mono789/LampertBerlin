(function () {
	const hoverToggle = () => {
		$(".image-tabs__list a").click(function (e) {
			e.preventDefault();
		});
		$(".image-tabs__list li").mouseover(function (e) {
			if ($(this).hasClass("active")) {
				return false;
			}
			$(".image-tabs__list li").removeClass("active");
			const id = $(this).addClass("active").find("a").attr("href");
			$(".image-tabs__desc, .image-tabs__button-wrraper, .image-tabs__img").stop(false, false).fadeOut(0);
			$(`[data-image-tabs="${id}"]`).stop(false, false).fadeIn();
		});
	};

	document.addEventListener("shopify:section:load", function () {
		hoverToggle();
	});

	hoverToggle();
})();
