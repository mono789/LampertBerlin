(function () {
	document.addEventListener("shopify:section:load", function () {
		const slider = new Swiper(".js-media-list", getSliderSettings);

		const subSlider = new Swiper(
			".js-media-sublist",
			getSubSliderProductSettings
		);

		setTimeout(function () {
			slider.update();
			subSlider.update();
		}, 200);
	});
})();

let attached = false;

let imageContainer = document.querySelector("#image");

const followMouse = (event) => {
	imageContainer.style.left = event.pageX + "px";
	imageContainer.style.top = event.pageY + "px";
};

function showImage() {
	if (!attached) {
		attached = true;
		imageContainer.style.display = "block";
		document.addEventListener("pointermove", followMouse);
	}
}

function hideImage() {
	attached = false;
	imageContainer.style.display = "";
	document.removeEventListener("pointermove", followMouse);
}
