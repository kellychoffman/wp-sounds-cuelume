<?php
/**
 * Plugin Name:       WP Sounds
 * Plugin URI:        https://github.com/kellychoffman/wp-sounds-cuelume
 * Description:       Publish sounds for the block editor, and a sparkle when you switch themes. Synthesized live with Web Audio via Cuelume. No audio files.
 * Version:           0.3.0
 * Requires at least: 6.3
 * Requires PHP:      7.4
 * Author:            kellychoffman
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

defined( 'ABSPATH' ) || exit;

define( 'WP_SOUNDS_CUELUME_VERSION', '0.3.0' );

/**
 * Register the shared Cuelume engine so each wiring script can depend on it.
 */
function wp_sounds_cuelume_register_engine() {
	if ( ! wp_script_is( 'wp-sounds-cuelume-engine', 'registered' ) ) {
		wp_register_script(
			'wp-sounds-cuelume-engine',
			plugins_url( 'js/cuelume.js', __FILE__ ),
			array(),
			WP_SOUNDS_CUELUME_VERSION,
			true
		);
	}
}

/**
 * Block editor: cues for the publish flow. The front end stays silent.
 */
function wp_sounds_cuelume_enqueue_editor_assets() {
	wp_sounds_cuelume_register_engine();
	wp_enqueue_script(
		'wp-sounds-cuelume-editor',
		plugins_url( 'js/editor-sounds.js', __FILE__ ),
		array( 'wp-sounds-cuelume-engine', 'wp-data' ),
		WP_SOUNDS_CUELUME_VERSION,
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'wp_sounds_cuelume_enqueue_editor_assets' );

/**
 * Themes screen: a sparkle when a new theme is activated.
 */
function wp_sounds_cuelume_enqueue_theme_assets( $hook_suffix ) {
	if ( 'themes.php' !== $hook_suffix ) {
		return;
	}
	wp_sounds_cuelume_register_engine();
	wp_enqueue_script(
		'wp-sounds-cuelume-themes',
		plugins_url( 'js/theme-sounds.js', __FILE__ ),
		array( 'wp-sounds-cuelume-engine' ),
		WP_SOUNDS_CUELUME_VERSION,
		true
	);
}
add_action( 'admin_enqueue_scripts', 'wp_sounds_cuelume_enqueue_theme_assets' );
