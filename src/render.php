<?php

/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Check if WooCommerce is active
$woocommerce_active = class_exists('WooCommerce');
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
  <div class="polaroid-frame <?php echo esc_attr($attributes['frameStyle']); ?>"
    style="background-color: <?php echo esc_attr($attributes['frameColor']); ?>;
           padding: <?php echo esc_attr($attributes['framePadding']); ?>px;
           transform: rotate(<?php echo esc_attr($attributes['rotation']); ?>deg);">
    <?php if ($attributes['isWooProduct'] && $woocommerce_active) : ?>
      <?php
      $product = wc_get_product($attributes['productId']);
      if ($product) :
        $image_id = $product->get_image_id();
        $image_url = wp_get_attachment_image_url($image_id, 'full');
      ?>
        <div class="polaroid-product-container">
          <?php if ($product->is_on_sale()) : ?>
            <div class="product-sale-badge">Sale!</div>
          <?php endif; ?>

          <div class="polaroid-image-container">
            <img src="<?php echo esc_url($image_url); ?>"
              alt="<?php echo esc_attr($product->get_name()); ?>"
              class="filter-<?php echo esc_attr($attributes['imageFilter']); ?>" />

            <?php if ($attributes['showPrice']) : ?>
              <div class="product-price">
                <?php echo $product->get_price_html(); ?>
              </div>
            <?php endif; ?>

            <?php if ($attributes['showAddToCart']) : ?>
              <a href="<?php echo esc_url($product->add_to_cart_url()); ?>"
                class="add-to-cart-button"
                data-product_id="<?php echo esc_attr($product->get_id()); ?>"
                data-quantity="1">
                Add to Cart
              </a>
            <?php endif; ?>

            <?php if ($attributes['showQuickView']) : ?>
              <button class="quick-view-button"
                data-product-id="<?php echo esc_attr($product->get_id()); ?>">
                Quick View
              </button>
            <?php endif; ?>
          </div>
        </div>
      <?php endif; ?>
    <?php else : ?>
      <?php if (!empty($attributes['mediaUrl'])) : ?>
        <div class="polaroid-image-container">
          <img src="<?php echo esc_url($attributes['mediaUrl']); ?>"
            alt="<?php echo esc_attr($attributes['caption']); ?>"
            class="filter-<?php echo esc_attr($attributes['imageFilter']); ?>" />
          <?php if (!empty($attributes['caption'])) : ?>
            <div class="polaroid-caption"
              style="font-family: <?php echo esc_attr($attributes['captionFontFamily']); ?>;
                     font-size: <?php echo esc_attr($attributes['captionFontSize']); ?>px;">
              <?php echo esc_html($attributes['caption']); ?>
            </div>
          <?php endif; ?>
        </div>
      <?php endif; ?>
    <?php endif; ?>
  </div>
</div>