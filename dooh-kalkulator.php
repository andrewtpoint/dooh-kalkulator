<?php
/**
 * Plugin Name: DOOH Kalkulator
 * Plugin URI:  https://mediaspace.de
 * Description: Mediaspace DOOH Kampagnen-Kalkulator als Shortcode [dooh_kalkulator]
 * Version:     1.0.0
 * Author:      Mediaspace
 * License:     GPL2
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function dooh_kalkulator_shortcode() {
    ob_start();
    include plugin_dir_path( __FILE__ ) . 'templates/kalkulator.php';
    return ob_get_clean();
}
add_shortcode( 'dooh_kalkulator', 'dooh_kalkulator_shortcode' );

function dooh_kalkulator_assets() {
    wp_enqueue_style(
        'dooh-kalkulator-style',
        plugin_dir_url( __FILE__ ) . 'assets/style.css',
        array(), '1.0.0'
    );
    wp_enqueue_script(
        'alpinejs',
        'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js',
        array(), '3.0', true
    );
    wp_enqueue_script(
        'jspdf',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        array(), '2.5.1', true
    );
    wp_enqueue_script(
        'dooh-kalkulator-script',
        plugin_dir_url( __FILE__ ) . 'assets/kalkulator.js',
        array(), '1.0.0', true
    );
}
add_action( 'wp_enqueue_scripts', 'dooh_kalkulator_assets' );
