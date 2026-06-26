(function () {
	const hoverToggle = () => {
		const category_list = $(".category-list__list li");
		category_list.mouseover(function () {
			const childs = $(this).parent('.category-list__list').children('li')
			childs.addClass("opacity").removeClass("active");
			$(this).addClass('active').removeClass("opacity");
		});
	};

	document.addEventListener("shopify:section:load", function () {
		hoverToggle();
	});

	hoverToggle();
})();
