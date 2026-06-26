;(function () {
	const initTimer = () => {
		$('.js-countdown').each(function () {
			const $this = $(this)
			const isMockTimerEnabled = $this.data('enable-mock-timer')
			const mockPickerDay = Number($this.data('enable-mock-picker-day'))
			const mockPickerHour = Number($this.data('enable-mock-picker-hours'))
			const rawDate = $this.data('date')
			const rawTime = $this.data('time')
			let countdownDate

			if (isMockTimerEnabled) {
				const nowDate = new Date()
				const mockTargetDate = new Date(
					nowDate.getTime() +
						(mockPickerDay * 24 + mockPickerHour) * 60 * 60 * 1000
				)
				countdownDate = mockTargetDate
			} else {
				const dateStr = rawDate
				const timeStr = rawTime
				countdownDate = new Date(`${dateStr}T${timeStr}`)
				const userTimeZone = +$this.data('timezone')
				const currentDate = new Date()
				const localOffset = currentDate.getTimezoneOffset() * 60 * 1000
				const targetOffset = userTimeZone * 60 * 60 * 1000
				const correctedTime =
					countdownDate.getTime() + localOffset + targetOffset
				countdownDate = new Date(correctedTime)
			}

			const completedCountdown = $this.data('completed')
			const countdown = $this.find('.countdown__body')
			const wrapper = $this.find('.countdown__wrapper')
			const countdownHeading = $this.find('.countdown__heading')
			const daysEl = $this.find('.countdown__block__days')
			const hoursEl = $this.find('.countdown__block__hours')
			const minutesEl = $this.find('.countdown__block__minutes')
			const secondsEl = $this.find('.countdown__block__seconds')
			const section = $this.parent('.shopify-section')

			function updateCountdown() {
				const now = new Date().getTime()
				const distance = countdownDate.getTime() - now

				if (distance < 0 && completedCountdown === 'hide_section') {
					clearInterval(timerInterval)
					section.stop(false, false).fadeOut(0)
				} else if (distance < 0 && completedCountdown === 'show_text') {
					clearInterval(timerInterval)
					countdown.stop(false, false).fadeOut(0)
					wrapper.addClass('show-text')
					countdownHeading.stop(false, false).fadeIn()
				} else {
					const days = Math.floor(distance / (1000 * 60 * 60 * 24))
					const hours = Math.floor(
						(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
					)
					const minutes = Math.floor(
						(distance % (1000 * 60 * 60)) / (1000 * 60)
					)
					const seconds = Math.floor((distance % (1000 * 60)) / 1000)

					daysEl.html(days < 10 ? '0' + days : days)
					hoursEl.html(hours < 10 ? '0' + hours : hours)
					minutesEl.html(minutes < 10 ? '0' + minutes : minutes)
					secondsEl.html(seconds < 10 ? '0' + seconds : seconds)
				}
			}

			let lastUpdateTime = 0
			const timerInterval = setInterval(() => {
				const now = Date.now()
				if (now - lastUpdateTime >= 950) {
					updateCountdown()
					lastUpdateTime = now
				}
			}, 200)

			updateCountdown()
		})
	}

	document.addEventListener('shopify:section:load', () => {
		if (!document.hidden) {
			initTimer()
		}
	})

	if (!document.hidden) {
		initTimer()
	}
})()
