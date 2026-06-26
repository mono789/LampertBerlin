(function () {
	function initCompareSlider() {
		const $container = $(".twentytwenty-container");

		if (!$container.length) return;

		const imgs = $container.find("img");

		let loadedCount = 0;
		imgs.each(function () {
			if (this.complete) {
				loadedCount++;
			} else {
				$(this).on("load", () => {
					loadedCount++;
					if (loadedCount === imgs.length) {
						initTwentyTwenty();
					}
				});
			}
		});

		if (loadedCount === imgs.length) {
			initTwentyTwenty();
		}
	}

	function initTwentyTwenty() {
		$(".twentytwenty-container").twentytwenty({ default_offset_pct: 0.5 });
	}

	function destroyAndReinit() {
		const original = $(".twentytwenty-container").clone();
		$(".twentytwenty-wrapper").replaceWith(original);
		initCompareSlider();
	}

	document.addEventListener("DOMContentLoaded", initCompareSlider);
	document.addEventListener("shopify:section:load", initCompareSlider);

	let resizeTimeout;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			destroyAndReinit();
		}, 300);
	});
})();
