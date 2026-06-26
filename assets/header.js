;(function () {
	const header = () => {
		$('[data-hover-opacity]').hover(
			function () {
				const id = $(this).data('hover-opacity')
				$(`[data-hover-opacity=${id}]`).addClass('opacity')
				$(this).removeClass('opacity')
			},
			function () {
				const id = $(this).data('hover-opacity')
				$(`[data-hover-opacity=${id}]`).removeClass('opacity')
			}
		)

		const megaMenuTabs = () => {
			$('.mega-menu__tab-wrapper')
				.children()
				.find('.mega-menu__tab-wrapper')
				.first()
				.addClass('mega-menu__tab-wrapper--active')
			$('.mega-menu__tab-wrapper').mouseenter(function (event) {
				$('.mega-menu__tab-wrapper').removeClass(
					'mega-menu__tab-wrapper--active'
				)
				$(this).addClass('mega-menu__tab-wrapper--active')
			})
			$('.mega-menu__tab-wrapper').focus(function (event) {
				$('.mega-menu__tab-wrapper').removeClass(
					'mega-menu__tab-wrapper--active'
				)
				$(this).addClass('mega-menu__tab-wrapper--active')
			})
			$('.mega-menu__tab-wrapper').focusin(function (event) {
				$('.mega-menu__tab-wrapper').removeClass(
					'mega-menu__tab-wrapper--active'
				)
				$(this).addClass('mega-menu__tab-wrapper--active')
			})
		}
		megaMenuTabs()

		const headerElement = document.querySelector('.header-main-section')

		if (
			headerElement &&
			headerElement.classList.contains('color-background-overlay')
		) {
			headerElement.addEventListener('mouseenter', () => {
				headerElement.classList.remove('color-background-overlay')
				headerElement.classList.remove('color-background-4')
			})
			headerElement.addEventListener('mouseleave', () => {
				headerElement.classList.add('color-background-overlay')
				if (headerElement.classList.contains('overlay-effect')) {
					headerElement.classList.add('color-background-1')
				} else {
					headerElement.classList.add('color-background-4')
				}
			})
		}
	}

	document.addEventListener('shopify:section:load', header)
	header()
})()
