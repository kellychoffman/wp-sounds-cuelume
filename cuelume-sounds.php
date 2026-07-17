<?php
/**
 * Plugin Name:       Cuelume Sounds
 * Plugin URI:        https://github.com/kellychoffman/cuelume-sounds
 * Description:       Interaction sounds for the block editor: publish, save draft, toggles, and notices. Synthesized live with Web Audio via Cuelume. No audio files.
 * Version:           0.1.0
 * Requires at least: 6.3
 * Requires PHP:      7.4
 * Author:            kellychoffman
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

defined( 'ABSPATH' ) || exit;

/**
 * Load the sound layer in the block editor only. The front end stays silent.
 */
function cuelume_sounds_enqueue_editor_assets() {
	wp_enqueue_script(
		'cuelume-sounds-editor',
		plugins_url( 'js/editor-sounds.js', __FILE__ ),
		array( 'wp-data', 'wp-dom-ready' ),
		'0.1.0',
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'cuelume_sounds_enqueue_editor_assets' );
