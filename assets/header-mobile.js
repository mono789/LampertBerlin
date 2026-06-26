(function () {
	const headerMobile = () => {
		const headerSection = document.querySelector(".header-mobile-section");
		const header = document.querySelector(".header-mobile");
		let scrollPos = 0;
		window.addEventListener("scroll", () => {
			if (!header.classList.contains("sticky-header")) {
				return;
			}
			const scroll = window.scrollY;
			if (scroll > 40) {
				header.classList.add("header-scroll");
			} else {
				header.classList.remove("header-scroll");
			}
			if (scroll > scrollPos) {
				// down
				if (scroll > 100) {
					hideHeader();
				} else {
					showHeader();
				}
			} else {
				// up
				showHeader();
			}
			scrollPos = scroll;
		});
		function hideHeader() {
			if (header.classList.contains("sticky-header-always")) {
				return "";
			}
			headerSection.classList.add("hide");
		}
		function showHeader() {
			headerSection.classList.remove("hide");
		}

		const burger = document.querySelector(".header-mobile__burger");
		const mobileMenu = document.querySelector(".header-mobile__menu");
		const mobileAnimateBg = document.querySelector(".animate-bg");
		burger.addEventListener("click", function (e) {
			e.preventDefault();
			this.classList.toggle("active");
			mobileMenu.classList.toggle("active");
			mobileAnimateBg.classList.toggle("active");
			document.body.classList.toggle("overflow-hidden");
		});

		const mobileMenuList = document.querySelectorAll(
			".header-mobile__menu-header a"
		);
		mobileMenuList.forEach((item) => {
			item.addEventListener("click", function (event) {
				event.preventDefault();
				const id = this.getAttribute("href");
				mobileMenuList.forEach((_item) => {
					_item.parentElement.classList.remove("active");
				});
				this.parentElement.classList.add("active");
				const menus = document.querySelectorAll(".header-mobile__menus > li");
				const current = document.querySelector(id);
				menus.forEach((_menu) => {
					_menu.style.display = "none";
				});
				current.style.display = "block";
			});
		});
		
		let resizeTimeout;
		window.addEventListener("resize", () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				const isDesktop = window.innerWidth >= 1100;

				if (isDesktop) {
					burger.classList.remove("active");
					mobileMenu.classList.remove("active");
					mobileAnimateBg.classList.remove("active");
					document.body.classList.remove("overflow-hidden");
				}
			}, 300);
		});
	};

	document.addEventListener("shopify:section:load", headerMobile);
	headerMobile();
})();
