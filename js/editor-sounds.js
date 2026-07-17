/**
 * Cuelume Sounds — wires Cuelume interaction sounds to block editor moments.
 *
 * Sound map (everything else stays silent on purpose):
 *   - Publish panel opens ........ bloom
 *   - Publishing starts .......... loading
 *   - Publish succeeds ........... success
 *   - Save draft succeeds ........ tick
 *   - Save fails ................. error
 *   - Toggle controls ............ toggle
 *   - Snackbar dismissed ......... droplet (click only; auto-dismiss is silent)
 *   - Block inserter opens ....... bloom
 *
 * The synth engine below is Cuelume 0.1.2 (MIT, Daniel Belyi), inlined because
 * the npm package is ESM-only. https://www.npmjs.com/package/cuelume
 */
( function () {
	"use strict";

	/* ================================================================
	 * Cuelume engine (inlined)
	 * ================================================================ */
	const cuelume = ( () => {
		const RECIPES = {
			chime: { masterGain: 0.5, layers: [
				{ kind: "tone", waveform: "sine", frequency: 1046.5, attack: 0.006, decay: 0.22, peak: 0.09 },
				{ kind: "tone", waveform: "sine", frequency: 1568, offset: 0.09, attack: 0.006, decay: 0.26, peak: 0.08 },
			], shimmer: { delay: 0.12, feedback: 0.25, wet: 0.18, lowpass: 4000 } },
			sparkle: { masterGain: 0.5, layers: [
				{ kind: "tone", waveform: "sine", frequency: 1760, offset: 0, attack: 0.003, decay: 0.09, peak: 0.045 },
				{ kind: "tone", waveform: "sine", frequency: 2217, offset: 0.045, attack: 0.003, decay: 0.09, peak: 0.04 },
				{ kind: "tone", waveform: "sine", frequency: 2637, offset: 0.09, attack: 0.003, decay: 0.1, peak: 0.038 },
				{ kind: "tone", waveform: "sine", frequency: 3520, offset: 0.135, attack: 0.003, decay: 0.12, peak: 0.032 },
			], shimmer: { delay: 0.07, feedback: 0.35, wet: 0.22, lowpass: 6000 } },
			droplet: { masterGain: 0.55, layers: [
				{ kind: "tone", waveform: "sine", frequency: 1200, glideTo: 550, glideTime: 0.14, attack: 0.004, decay: 0.2, peak: 0.075 },
			], shimmer: { delay: 0.09, feedback: 0.2, wet: 0.15, lowpass: 3000 } },
			bloom: { masterGain: 0.5, layers: [
				{ kind: "tone", waveform: "sine", frequency: 528, attack: 0.06, decay: 0.32, peak: 0.06 },
				{ kind: "tone", waveform: "sine", frequency: 528, detune: 12, attack: 0.06, decay: 0.34, peak: 0.05 },
			], shimmer: { delay: 0.15, feedback: 0.2, wet: 0.12, lowpass: 2500 } },
			whisper: { masterGain: 0.5, layers: [
				{ kind: "noise", filterType: "lowpass", filterFrequency: 1200, filterQ: 0.7, attack: 0.04, decay: 0.16, peak: 0.05 },
			] },
			tick: { masterGain: 0.4, layers: [
				{ kind: "noise", filterType: "bandpass", filterFrequency: 5400, filterQ: 1.8, attack: 0.001, decay: 0.018, peak: 0.14 },
				{ kind: "tone", waveform: "sine", frequency: 2600, attack: 0.001, decay: 0.012, peak: 0.018 },
			] },
			press: { masterGain: 0.4, layers: [
				{ kind: "noise", filterType: "bandpass", filterFrequency: 1700, filterQ: 1.4, attack: 0.001, decay: 0.02, peak: 0.13 },
			] },
			release: { masterGain: 0.4, layers: [
				{ kind: "noise", filterType: "bandpass", filterFrequency: 4600, filterQ: 1.8, attack: 0.001, decay: 0.016, peak: 0.12 },
				{ kind: "tone", waveform: "sine", frequency: 3200, offset: 0.006, attack: 0.001, decay: 0.05, peak: 0.02 },
			] },
			toggle: { masterGain: 0.4, layers: [
				{ kind: "noise", filterType: "bandpass", filterFrequency: 2200, filterQ: 1.6, attack: 0.001, decay: 0.016, peak: 0.12 },
				{ kind: "noise", filterType: "bandpass", filterFrequency: 3800, filterQ: 1.6, offset: 0.024, attack: 0.001, decay: 0.02, peak: 0.1 },
			] },
			success: { masterGain: 0.5, layers: [
				{ kind: "tone", waveform: "sine", frequency: 880, attack: 0.004, decay: 0.09, peak: 0.06 },
				{ kind: "tone", waveform: "sine", frequency: 1108.73, offset: 0.06, attack: 0.004, decay: 0.1, peak: 0.06 },
				{ kind: "tone", waveform: "sine", frequency: 1318.51, offset: 0.12, attack: 0.004, decay: 0.18, peak: 0.07 },
			], shimmer: { delay: 0.1, feedback: 0.22, wet: 0.16, lowpass: 4500 } },
			error: { masterGain: 0.42, layers: [
				{ kind: "noise", filterType: "bandpass", filterFrequency: 850, filterQ: 1.1, attack: 0.001, decay: 0.035, peak: 0.13 },
				{ kind: "tone", waveform: "triangle", frequency: 440, offset: 0.025, attack: 0.004, decay: 0.09, peak: 0.045 },
				{ kind: "tone", waveform: "triangle", frequency: 349.23, offset: 0.1, attack: 0.004, decay: 0.14, peak: 0.04 },
			] },
			page: { masterGain: 0.38, layers: [
				{ kind: "noise", filterType: "lowpass", filterFrequency: 1800, filterQ: 0.7, attack: 0.006, decay: 0.08, peak: 0.11 },
				{ kind: "noise", filterType: "bandpass", filterFrequency: 4200, filterQ: 1.2, offset: 0.04, attack: 0.004, decay: 0.065, peak: 0.08 },
				{ kind: "tone", waveform: "sine", frequency: 2400, offset: 0.075, attack: 0.002, decay: 0.045, peak: 0.02 },
			] },
			loading: { masterGain: 0.42, layers: [
				{ kind: "noise", filterType: "lowpass", filterFrequency: 1400, filterQ: 0.6, attack: 0.035, decay: 0.14, peak: 0.035 },
				{ kind: "tone", waveform: "sine", frequency: 420, glideTo: 630, glideTime: 0.18, attack: 0.025, decay: 0.18, peak: 0.05 },
			], shimmer: { delay: 0.11, feedback: 0.18, wet: 0.12, lowpass: 2800 } },
			ready: { masterGain: 0.45, layers: [
				{ kind: "noise", filterType: "bandpass", filterFrequency: 3200, filterQ: 1.7, attack: 0.001, decay: 0.018, peak: 0.1 },
				{ kind: "tone", waveform: "sine", frequency: 659.25, offset: 0.025, attack: 0.012, decay: 0.2, peak: 0.05 },
				{ kind: "tone", waveform: "sine", frequency: 987.77, offset: 0.025, attack: 0.012, decay: 0.22, peak: 0.035 },
			], shimmer: { delay: 0.13, feedback: 0.2, wet: 0.13, lowpass: 3600 } },
		};
		const SOURCE_STOP_PADDING = 0.05, CLEANUP_MARGIN = 0.05, INAUDIBLE_GAIN = 0.001;
		const isSoundName = ( v ) => typeof v === "string" && Object.prototype.hasOwnProperty.call( RECIPES, v );

		function renderTone( context, destination, layer, startTime ) {
			const oscillator = context.createOscillator();
			oscillator.type = layer.waveform;
			oscillator.frequency.setValueAtTime( layer.frequency, startTime );
			if ( layer.detune ) oscillator.detune.value = layer.detune;
			if ( layer.glideTo !== undefined ) {
				const glideTime = layer.glideTime ?? layer.attack + layer.decay;
				oscillator.frequency.exponentialRampToValueAtTime( layer.glideTo, startTime + glideTime );
			}
			const gain = context.createGain();
			gain.gain.setValueAtTime( 0.0001, startTime );
			gain.gain.exponentialRampToValueAtTime( layer.peak, startTime + layer.attack );
			gain.gain.exponentialRampToValueAtTime( 0.0001, startTime + layer.attack + layer.decay );
			oscillator.connect( gain ).connect( destination );
			oscillator.start( startTime );
			oscillator.stop( startTime + layer.attack + layer.decay + SOURCE_STOP_PADDING );
		}
		function renderNoise( context, destination, layer, startTime ) {
			const duration = layer.attack + layer.decay + SOURCE_STOP_PADDING;
			const length = Math.max( 1, Math.floor( duration * context.sampleRate ) );
			const buffer = context.createBuffer( 1, length, context.sampleRate );
			const data = buffer.getChannelData( 0 );
			for ( let i = 0; i < length; i++ ) data[ i ] = 2 * Math.random() - 1;
			const source = context.createBufferSource();
			source.buffer = buffer;
			const filter = context.createBiquadFilter();
			filter.type = layer.filterType;
			filter.frequency.value = layer.filterFrequency;
			if ( layer.filterQ !== undefined ) filter.Q.value = layer.filterQ;
			const gain = context.createGain();
			gain.gain.setValueAtTime( 0.0001, startTime );
			gain.gain.exponentialRampToValueAtTime( layer.peak, startTime + layer.attack );
			gain.gain.exponentialRampToValueAtTime( 0.0001, startTime + layer.attack + layer.decay );
			source.connect( filter ).connect( gain ).connect( destination );
			source.start( startTime );
			source.stop( startTime + duration );
		}
		function attachShimmer( context, source, destination, shimmer ) {
			const delay = context.createDelay( 1 );
			delay.delayTime.value = shimmer.delay;
			const feedbackFilter = context.createBiquadFilter();
			feedbackFilter.type = "lowpass";
			feedbackFilter.frequency.value = shimmer.lowpass;
			const feedbackGain = context.createGain();
			feedbackGain.gain.value = shimmer.feedback;
			const wetGain = context.createGain();
			wetGain.gain.value = shimmer.wet;
			source.connect( delay );
			delay.connect( feedbackFilter );
			feedbackFilter.connect( feedbackGain );
			feedbackGain.connect( delay );
			feedbackFilter.connect( wetGain );
			wetGain.connect( destination );
			return [ delay, feedbackFilter, feedbackGain, wetGain ];
		}
		const sourceEnd = ( recipe ) => Math.max( ...recipe.layers.map( ( l ) => ( l.offset ?? 0 ) + l.attack + l.decay + SOURCE_STOP_PADDING ) );
		function shimmerTail( shimmer ) {
			if ( ! shimmer || shimmer.feedback <= 0 ) return 0;
			if ( shimmer.feedback >= 1 ) return shimmer.delay;
			return shimmer.delay * ( 1 + Math.ceil( Math.log( INAUDIBLE_GAIN ) / Math.log( shimmer.feedback ) ) );
		}
		function renderRecipe( context, recipe ) {
			const now = context.currentTime;
			const master = context.createGain();
			master.gain.value = recipe.masterGain;
			master.connect( context.destination );
			const shimmerNodes = recipe.shimmer ? attachShimmer( context, master, context.destination, recipe.shimmer ) : [];
			for ( const layer of recipe.layers ) {
				const startTime = now + ( layer.offset ?? 0 );
				if ( layer.kind === "tone" ) renderTone( context, master, layer, startTime );
				else renderNoise( context, master, layer, startTime );
			}
			const cleanupAfterMs = ( sourceEnd( recipe ) + shimmerTail( recipe.shimmer ) + CLEANUP_MARGIN ) * 1000;
			setTimeout( () => {
				master.disconnect();
				for ( const node of shimmerNodes ) node.disconnect();
			}, cleanupAfterMs );
		}
		let sharedContext = null, enabled = true;
		function setEnabled( value ) {
			if ( typeof value === "boolean" ) enabled = value;
		}
		function getAudioContext() {
			if ( sharedContext ) return sharedContext;
			const Ctor = window.AudioContext ?? window.webkitAudioContext;
			if ( ! Ctor ) return null;
			try { sharedContext = new Ctor(); } catch { return null; }
			return sharedContext;
		}
		function play( sound = "chime" ) {
			if ( ! enabled || ! isSoundName( sound ) ) return;
			if ( navigator.userActivation?.hasBeenActive === false ) return;
			const context = getAudioContext();
			if ( ! context ) return;
			const recipe = RECIPES[ sound ];
			if ( context.state === "running" ) renderRecipe( context, recipe );
			else {
				try {
					void context.resume().then( () => {
						if ( enabled && context.state === "running" ) renderRecipe( context, recipe );
					}, () => {} );
				} catch {}
			}
		}
		return { play, setEnabled, sounds: Object.keys( RECIPES ) };
	} )();

	// Handy for poking around from the console: CuelumeSounds.play('sparkle')
	window.CuelumeSounds = cuelume;

	/* ================================================================
	 * Editor wiring
	 * ================================================================ */
	const play = cuelume.play;

	// Outcome sounds come from wp.data state transitions, not clicks.
	let wasSaving = false;
	let wasPublishing = false;
	let publishPanelOpen = false;
	let inserterOpen = false;

	wp.data.subscribe( () => {
		const editor = wp.data.select( "core/editor" );
		if ( ! editor || ! editor.isSavingPost ) return;
		const editPost = wp.data.select( "core/edit-post" );

		// Pre-publish panel opening: a reveal.
		const panelOpen = !! ( editPost && editPost.isPublishSidebarOpened && editPost.isPublishSidebarOpened() );
		if ( panelOpen && ! publishPanelOpen ) play( "bloom" );
		publishPanelOpen = panelOpen;

		// Block inserter opening: also a reveal. The selector moved from
		// edit-post to editor in WP 6.5, so check both.
		let insOpen = false;
		if ( typeof editor.isInserterOpened === "function" ) insOpen = editor.isInserterOpened();
		else if ( editPost && typeof editPost.isInserterOpened === "function" ) insOpen = editPost.isInserterOpened();
		if ( insOpen && ! inserterOpen ) play( "bloom" );
		inserterOpen = insOpen;

		// Saves. Autosaves stay silent; only user-initiated saves get a cue.
		const saving = editor.isSavingPost() && ! editor.isAutosavingPost();
		if ( saving && ! wasSaving ) {
			wasPublishing = editor.isPublishingPost();
			if ( wasPublishing ) play( "loading" );
		} else if ( ! saving && wasSaving ) {
			if ( editor.didPostSaveRequestSucceed() ) {
				play( wasPublishing ? "success" : "tick" );
			} else {
				play( "error" );
			}
			wasPublishing = false;
		}
		wasSaving = saving;
	} );

	// Toggle controls anywhere in the editor chrome: a mechanical click-clack.
	document.addEventListener(
		"change",
		( event ) => {
			const target = event.target;
			if ( target && target.classList && target.classList.contains( "components-form-toggle__input" ) ) {
				play( "toggle" );
			}
		},
		true
	);

	// Snackbar notices dismiss on click; auto-dismiss stays silent. Skip the
	// action link so navigation does not race a sound.
	document.addEventListener(
		"click",
		( event ) => {
			const bar = event.target.closest && event.target.closest( ".components-snackbar" );
			if ( bar && ! event.target.closest( "a, .components-snackbar__action" ) ) {
				play( "droplet" );
			}
		},
		true
	);
} )();
