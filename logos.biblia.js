(function(win, doc) {
	var pluginRootUrl = 'http://biblia.com/api/plugins/',
		parametersToIgnoreGlobally = ['resource', 'id'],
		pluginInfos = {
			'verseoftheday': { path: 'verseoftheday/{0}' },
			'biblesearchbox': { path: 'biblesearchbox?resource={0}', parametersToIgnore: ['width', 'height'] },
			'biblesearchresults': { path: 'biblesearchresults?resource={0}', parametersToIgnore: ['width', 'height'] },
			'bible': { path: 'embeddedbible?resourceName={0}', parametersToIgnore: ['width', 'height'] },
			'bibleverse': { path: 'bibleverse?resourceName={0}', parametersToIgnore: ['height'] },
			'preview': { path: 'embeddedpreview?resourceName={0}', parametersToIgnore: ['width', 'height'] },
			'quotebuilder': { path: 'highlightwidget?resourceName={0}' }
		};

	function addUrlParameter(strUrl, strParamName, paramValue) {
		return strUrl + ((/[?]/).test(strUrl) ? '&' : '?') + strParamName + '=' + paramValue;
	}

	function arrayIndexOf(array, str) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === str) {
				return i;
			}
		}

		return -1;
	}

	function isIgnoredParameter(strParam, strType) {
		return arrayIndexOf(parametersToIgnoreGlobally.concat(pluginInfos[strType].parametersToIgnore), strParam) !== -1;
	}

	function addMessageListener(listener) {
		if (win.addEventListener) {
			win.addEventListener('message', listener, false);
		} else {
			win.attachEvent('onmessage', listener);
		}
	}

	function handleMessage(e) {
		var message, iFrameIndex, currentIFrame, iFrameElementsCount, iFrameElements;
		try {
			message = JSON.parse(e.data);
		} catch (err) {
			return;
		}

		iFrameElements = doc.getElementsByTagName('iframe');
		iFrameElementsCount = iFrameElements.length;
		for (iFrameIndex = 0; iFrameIndex < iFrameElementsCount; iFrameIndex++) {
			if (iFrameElements[iFrameIndex].contentWindow == e.source && message.type === 'bibliaUpdateHeight') {
				currentIFrame = iFrameElements[iFrameIndex];
				currentIFrame.setAttribute('height', message.height);
			}
		}
	}

	function createPlugin(elBibliaPlugin, type) {
		var elPlugin = doc.createElement('iframe'),
			resource = elBibliaPlugin.getAttribute('resource'),
			width = elBibliaPlugin.getAttribute('width'),
			height = elBibliaPlugin.getAttribute('height');

		var url = pluginRootUrl + pluginInfos[type].path.replace('{0}', resource || '');
		for (var i = 0; i < elBibliaPlugin.attributes.length; i++) {
			var attrib = elBibliaPlugin.attributes[i];
			if (attrib.specified == true && !isIgnoredParameter(attrib.name, type)) {
				url = addUrlParameter(url, attrib.name, attrib.value);
			}
		}

		if (width) {
			elPlugin.width = width;
		}

		if (height) {
			elPlugin.height = height;
		}

		elPlugin.src = url;

		elPlugin.scrolling = 'no';
		elPlugin.setAttribute('frameborder', '0');
		elPlugin.setAttribute('allowTransparency', 'true');

		elBibliaPlugin.parentNode.replaceChild(elPlugin, elBibliaPlugin);

		if (type === 'bibleverse' || type === 'quotebuilder') {
			if (!width) {
				elPlugin.width = '500';
			}

			elPlugin.style.border = 0;
			addMessageListener(handleMessage);
		}
	}

	function initPlugins(type) {
		var bibliaPluginElements = doc.getElementsByTagName(type),
			numMatching = bibliaPluginElements.length,
			i;

		// replace <biblia:*> tags with plugin iframe
		for (i = 0; i < numMatching; i++) {
			createPlugin(bibliaPluginElements[0], type);
		}

		return numMatching;
	}

	win.logos = win.logos || {};
	win.logos.biblia = {
		init: function() {
			var counts = {};
			for (var pluginName in pluginInfos)
				counts[pluginName] = initPlugins(pluginName);

			// log
			var queryParams = ['url=' + encodeURIComponent(window.location)];
			for (var key in counts) {
				if (counts.hasOwnProperty(key) && counts[key]) {
					queryParams.push(key + '=' + counts[key]);
				}
			}

			new Image().src = '//biblia.com/api/plugins/report?' + queryParams.join('&');

		}
	};
})(window, document);
