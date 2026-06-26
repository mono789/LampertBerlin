//$('.select').each(function() {
//	const _this = $(this),
//			selectOption = _this.find('option'),
//			selectOptionLength = selectOption.length,
//			selectedOption = selectOption.filter(':selected'),
//			duration = 450; // длительность анимации 

//	_this.hide();
//	_this.wrap('<div class="select"></div>');
//	$('<div>', {
//			class: 'new-select',
//			text: _this.children('option:disabled').text()
//	}).insertAfter(_this);

//	const selectHead = _this.next('.new-select');
//	$('<div>', {
//			class: 'new-select__list'
//	}).insertAfter(selectHead);

//	const selectList = selectHead.next('.new-select__list');
//	for (let i = 1; i < selectOptionLength; i++) {
//			$('<div>', {
//					class: 'new-select__item',
//					html: $('<span>', {
//							text: selectOption.eq(i).text()
//					})
//			})
//			.attr('data-value', selectOption.eq(i).val())
//			.appendTo(selectList);
//	}

//	const selectItem = selectList.find('.new-select__item');
//	selectList.slideUp(0);
//	selectHead.on('click', function() {
//			if ( !$(this).hasClass('on') ) {
//					$(this).addClass('on');
//					selectList.slideDown(duration);

//					selectItem.on('click', function() {
//							let chooseItem = $(this).data('value');

//							$('select').val(chooseItem).attr('selected', 'selected');
//							selectHead.text( $(this).find('span').text() );

//							selectList.slideUp(duration);
//							selectHead.removeClass('on');
//					});

//			} else {
//					$(this).removeClass('on');
//					selectList.slideUp(duration);
//			}
//	});
//});

//function select(element) {
//  var value = element.getAttribute("data-value"); // Считываем значение выбранного элемента
//  var nodes = element.parentNode.childNodes; // Получаем все остальные элементы
//  for (var i = 0; i < nodes.length; i++) {
//    /* Отфильтровываем посторонние элементы text и input */
//    if (nodes[i] instanceof HTMLParagraphElement) {
//      /* Добавляем active у выбранного элемента, стирая данный класс у всех остальных */
//      if (value == nodes[i].getAttribute("data-value")) nodes[i].className = "active";
//      else nodes[i].className = "";
//    }
//  }
//  document.getElementById("my_select").value = value; // Устанавливаем в hidden-поле выбранное значение
//}