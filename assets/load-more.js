const loadItems = (() => {
	let isLoading = false;

	return (button) => {
			if (isLoading) return; 
			isLoading = true;

			const totalPages = parseInt($("[data-total-pages]").val());
			let currentPage = parseInt($("[data-current-page]").val());
			let currentPageScroll = currentPage + 1;

			currentPage = currentPage + 1;

			const rawValue = document.querySelector('[data-next-url]').value;

			const getUrlWithoutPhcursor = (value, pageValue) => {
				const url = new URL(value, window.location.origin)
				url.searchParams.set('page', pageValue)
				url.searchParams.delete('phcursor')
				return url.pathname + '?' + url.searchParams.toString()
			};

			const nextUrl = getUrlWithoutPhcursor(rawValue, currentPage);
			const nextUrlScroll = getUrlWithoutPhcursor(rawValue, currentPageScroll);

			button.setAttribute("disabled", "");
			button.classList.add("loading");
			$("[data-current-page]").val(currentPage);
			$.ajax({
					url: nextUrl,
					type: "GET",
					dataType: "html",
					success: function (responseHTML) {
							$(".load-more-grid").append(
									$(responseHTML).find(".load-more-grid").html()
							);
							colorSwatches();
							window.updateShowingText();
					},
					complete: function () {
							if (currentPage <= totalPages) {
									const scollData = document.querySelector(".infinite-scroll__data");
									if (scollData && currentPage != totalPages) {
											const nextUrlScroll = $("[data-next-url]")
													.val()
													.replace(/page=[0-9]+/, "page=" + (currentPage + 1));

											scollData.querySelector("input[data-next-url]").dataset.nextUrl = nextUrlScroll;
											scollData.querySelector("input[data-next-url]").value = nextUrlScroll;
											scollData.querySelector("input[data-current-page]").dataset.currentPage = currentPage;
											scollData.querySelector("input[data-current-page]").value = currentPage;
											checkVisibility();
									}
									button.removeAttribute("disabled");
									button.classList.remove("loading");
									if (currentPage == totalPages) {
											button.remove();
									}
									//$("[data-current-page]").val(currentPage);
							}
							isLoading = false;
					},
			});
	};
})();


window.updateShowingText = () => {
	let currentPage = parseInt($("[data-current-page]").val());
	const totalProducts = parseInt($("[data-total-products]").val());
	const perPage = $("[data-per-page]").data("per-page");
	if (totalProducts <= perPage) {
		currentPage = 1
	}
	let text = 'products';
	if (totalProducts == 1) {
		text = 'product'
	}
	const productsShowing = Math.min(currentPage * perPage, totalProducts);
	const showingText = `Showing ${productsShowing} of ${totalProducts} ${text}`;
	$(".showing-text").text(showingText);
};

const checkVisibility = () => {
	const spinnerList = document.querySelectorAll(".js-infinite-scroll");
	spinnerList.forEach((spinner) => {
			const sectionObserver = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
							if (entry.isIntersecting) {
									loadItems(spinner);
									sectionObserver.unobserve(spinner);
							}
					});
			});

			sectionObserver.observe(spinner);
	});
};

function loadMore() {
	document.querySelectorAll(".js-load-more").forEach((button) => {
			button.onclick = () => {
					loadItems(button);
			};
	});

	checkVisibility();
	window.updateShowingText();
}

(function () {
	loadMore();
})();

document.addEventListener("DOMContentLoaded", function () {
	loadMore();
	document.addEventListener("shopify:section:load", function () {
		loadMore();
	});
});