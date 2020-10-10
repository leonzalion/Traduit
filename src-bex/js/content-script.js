// Content script content goes here or in activatedContentHooks (use activatedContentHooks if you need a variable
// accessible to both the content script and inside a hook
$(function () {
	const conjugationArrow = '⇒';
	const routes = window.location.href.split('/');
	const fromTo = routes[routes.length - 2];
	let meta = {};
	[meta.fromLang, meta.toLang] = [fromTo.slice(0, 2), fromTo.slice(2)];

	let currentTranslation = {};
	$('.WRD > tbody').each(function () {
		$(this)
			.children('.even, .odd')
			.each(function () {
				let currentContext = {};

				// if there is an id, it is a main translation
				if ($(this).attr('id')) {
					currentTranslation.from = $(this)
						.children('.FrWrd')
						.children(':first-child')
						.text()
						.replace(conjugationArrow, '');

					currentTranslation.synonym = $(this)
						.children(':nth-child(2)')
						.contents()
						.filter(function () {
							return !$(this).hasClass('dsense');
						})
						.text()
						.trim();

					currentTranslation.fromPos = $(this)
						.children('.FrWrd')
						.children()
						.filter(function () {
							return $(this).hasClass('POS2');
						})
						.contents()
						.filter(function () {
							return this.nodeType === 3;
						})[0]?.textContent;
				}

				let currentTranslationJSON;
				// it's an example sentence
				if ($(this).children('.ToWrd').length === 0) {
					// TODO
				} else {
					// it's a translation
					currentContext.to = $(this)
						.children('.ToWrd')
						.contents()
						.filter(function () {
							return this.nodeType === 3 || !$(this).hasClass('POS2');
						})
						.clone()
						.wrap('<span>')
						.text()
						.replace(conjugationArrow, '')
						.trim();

					currentContext.toPos = $(this)
						.children('.ToWrd')
						.children()
						.filter(function () {
							return $(this).hasClass('POS2');
						})
						.contents()
						.filter(function () {
							return this.nodeType === 3;
						})
						.clone()
						.wrap('<span>')
						.text()
						.replace(conjugationArrow, '')
						.trim();

					// getting the usage for the first translation is different from getting the
					// usage from non-first translations
					currentContext.usage = $(this).find('.dsense').text();

					currentTranslationJSON = JSON.stringify({
						...meta,
						...currentTranslation,
						...currentContext,
					});
				}

				const addButtonStyle = {
					backgroundColor: 'orange',
					color: 'black',
					borderRadius: '5px',
					height: '15px',
					width: '15px',
					fontSize: '12px',
					fontWeight: 'bold',
					border: '1px solid black',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
					cursor: 'pointer',
					userSelect: 'none',
				};

				function styleToString(style) {
					return Object.entries(style).reduce(
						(styleString, [propName, propValue]) => {
							const reformattedPropName = propName.replace(
								/[A-Z]/g,
								(match) => `-${match.toLowerCase()}`
							);
							return `${styleString}${reformattedPropName}:${propValue};`;
						},
						''
					);
				}

				const addButtonStyleString = styleToString(addButtonStyle);

				const addButton = $(
					`<div style="${addButtonStyleString}" onclick="return false;"><img height='8' width='8' alt='+' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjQgMTBoLTEwdi0xMGgtNHYxMGgtMTB2NGgxMHYxMGg0di0xMGgxMHoiLz48L3N2Zz4=" /></div>`
				);

				const addButtonContainer = $(
					`<div style="display: inline-block; margin-left: 5px"></div>`
				);
				addButtonContainer.append(addButton);

				addButtonContainer.on('click', function (e) {
					chrome.runtime.sendMessage({
						action: 'ADD_TRANSLATION',
						payload: JSON.parse(currentTranslationJSON),
					});
					e.stopPropagation();
				});

				addButton
					.on('mouseenter', function () {
						addButton.css('background-color', 'orangered');
					})
					.on('mouseleave', function () {
						addButton.css('background-color', 'orange');
					});

				$(this).children('.ToWrd').append(addButtonContainer);
			});
	});
});
