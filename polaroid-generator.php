<?php

/**
 * Plugin Name:       Polaroid Generator
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.6
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       polaroid-generator
 *
 * @package CreateBlock
 */

if (! defined('ABSPATH')) {
  exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_polaroid_generator_block_init()
{
  register_block_type(__DIR__ . '/build');
}
add_action('init', 'create_block_polaroid_generator_block_init');

/**
 * Add featured image to WooCommerce REST API response
 */
function polaroid_generator_add_product_images_to_rest_api()
{
  register_rest_field(
    'product',
    'featured_media_src_url',
    array(
      'get_callback' => function ($product) {
        $product_obj = wc_get_product($product['id']);
        if (!$product_obj) {
          return '';
        }
        $image_id = $product_obj->get_image_id();
        if (!$image_id) {
          return '';
        }
        $image = wp_get_attachment_image_src($image_id, 'full');
        return $image ? $image[0] : '';
      },
      'schema' => array(
        'description' => __('Product featured image URL'),
        'type' => 'string'
      ),
    )
  );
}
add_action('rest_api_init', 'polaroid_generator_add_product_images_to_rest_api');
