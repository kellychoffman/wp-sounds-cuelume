/**
 * WP Sounds: a sparkle when a new theme is activated on the Themes screen.
 *
 * Activating a theme navigates to a fresh page load, where autoplay rules
 * would swallow the cue. So the cue plays on the click, and the navigation
 * follows a beat later, long enough for the twinkle to land.
 *
 * The engine lives in cuelume.js (window.CuelumeSounds).
 */
( function () {
	"use strict";

	if ( ! window.CuelumeSounds ) return;

	const NAVIGATION_DELAY_MS = 350;
	let navigating = false;

	document.addEventListener(
		"click",
		( event ) => {
			const link = event.target.closest && event.target.closest( "a.activate" );
			if ( ! link || ! link.href ) return;
			// Leave modified clicks (new tab, etc.) and repeat clicks alone.
			if ( event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 ) return;
			if ( navigating ) {
				event.preventDefault();
				return;
			}
			navigating = true;
			event.preventDefault();
			window.CuelumeSounds.play( "sparkle" );
			window.setTimeout( () => {
				window.location.href = link.href;
			}, NAVIGATION_DELAY_MS );
		},
		true
	);
} )();
