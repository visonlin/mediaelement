'use strict';

/**
 * Most of the mtehods have been borrowed/adapted from https://plainjs.com/javascript,
 * except fadeIn/fadeOut (from https://github.com/DimitriMikadze/vanilla-helpers/blob/master/js/vanillaHelpers.js)
 */

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';

export function offset (el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
}

export function closest (el, fn) {
	return el && (fn(el) ? el : closest(el.parentNode, fn));
}

let hasClassMethod, addClassMethod, removeClassMethod;

if ('classList' in document.documentElement) {
	hasClassMethod = (el, className) => el.classList !== undefined && el.classList.contains(className);
	addClassMethod = (el, className) => el.classList.add(className);
	removeClassMethod = (el, className) => el.classList.remove(className);
} else {
	hasClassMethod = (el, className) => new RegExp('\\b' + className + '\\b').test(el.className);
	addClassMethod = (el, className) => {
		if (!hasClass(el, className)) {
			el.className += ' ' + className;
		}
	};
	removeClassMethod = (el, className) => {
		el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
	};
}

export const hasClass = hasClassMethod;
export const addClass = addClassMethod;
export const removeClass = removeClassMethod;

export function toggleClass(el, className) {
	hasClass(el, className) ? removeClass(el, className) : addClass(el, className);
}

// fade an element from the current state to full opacity in "duration" ms
export function fadeOut (el, duration = 400, callback) {
	if ( ! el.style.opacity) { el.style.opacity = 1; }

	let start = null;
	window.requestAnimationFrame(function animate(timestamp) {
		start = start || timestamp;
		const progress = timestamp - start;
		el.style.opacity = 1 - progress / duration;
		if (progress > duration) {
			if (callback && typeof(callback) === 'function') {
				callback();
			}
		} else {
			window.requestAnimationFrame(animate);
		}
	});
}

// fade out an element from the current state to full transparency in "duration" ms
// display is the display style the element is assigned after the animation is done
export function fadeIn (el, duration = 400, callback) {
	if (!el.style.opacity) {
		el.style.opacity = 0;
	}

	let start = null;
	window.requestAnimationFrame(function animate(timestamp) {
		start = start || timestamp;
		const progress = timestamp - start;
		el.style.opacity = progress / duration;
		if (progress > duration) {
			if (callback && typeof(callback) === 'function') {
				callback();
			}
		} else {
			window.requestAnimationFrame(animate);
		}
	});
}

export function siblings (el, filter) {
	const siblings = [];
	el = el.parentNode.firstChild;
	do {
		if (!filter || filter(el)) {
			siblings.push(el)
		}
	} while ((el = el.nextSibling));
	return siblings;
}

export function visible (elem) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
}

export function ajax(url, success, error) {
	const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	xhr.open('GET', url, true);
	xhr.onreadystatechange = () => {
		if (xhr.readyState > 3) {
			if (xhr.status == 200) {
				success(xhr.responseText);
			} else {
				error(xhr.status);
			}
		}
	};
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.send();
	return xhr;
}

mejs.Utils = mejs.Utils || {};
mejs.Utils.offset = offset;
mejs.Utils.hasClass = hasClass;
mejs.Utils.addClass = addClass;
mejs.Utils.removeClass = removeClass;
mejs.Utils.toggleClass = toggleClass;
mejs.Utils.fadeIn = fadeIn;
mejs.Utils.fadeOut = fadeOut;
mejs.Utils.siblings = siblings;
mejs.Utils.visible = visible;
mejs.Utils.closest = closest;
mejs.Utils.ajax = ajax;
