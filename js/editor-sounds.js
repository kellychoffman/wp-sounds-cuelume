/**
 * WP Sounds: wires Cuelume cues to the block editor's publish flow.
 *
 * Sound map (everything else stays silent on purpose):
 *   - Pre-publish panel opens .... bloom
 *   - Publishing starts .......... loading
 *   - Publish succeeds ........... success
 *   - Publish fails .............. error
 *
 * The engine lives in cuelume.js (window.CuelumeSounds).
 */
( function () {
	"use strict";

	if ( ! window.CuelumeSounds || ! window.wp || ! wp.data ) return;
	const play = ( sound ) => window.CuelumeSounds.play( sound );

	// Publish flow only. Cues come from wp.data state transitions, not clicks,
	// so they mark real outcomes. Draft saves and autosaves stay silent.
	let wasPublishing = false;
	let publishPanelOpen = false;

	wp.data.subscribe( () => {
		const editor = wp.data.select( "core/editor" );
		if ( ! editor || ! editor.isSavingPost ) return;
		const editPost = wp.data.select( "core/edit-post" );

		// Pre-publish panel opening: a reveal.
		const panelOpen = !! ( editPost && editPost.isPublishSidebarOpened && editPost.isPublishSidebarOpened() );
		if ( panelOpen && ! publishPanelOpen ) play( "bloom" );
		publishPanelOpen = panelOpen;

		// The save that publishes.
		const publishing = editor.isSavingPost() && ! editor.isAutosavingPost() && editor.isPublishingPost();
		if ( publishing && ! wasPublishing ) {
			play( "loading" );
		} else if ( ! publishing && wasPublishing ) {
			play( editor.didPostSaveRequestSucceed() ? "success" : "error" );
		}
		wasPublishing = publishing;
	} );
} )();
