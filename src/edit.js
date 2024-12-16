import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck, InspectorControls } from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl, ColorPicker, RangeControl, ToggleControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import './editor.scss';

/**
 * @return {Element}
 */
export default function Edit({ attributes, setAttributes }) {
  const {
    mediaId,
    mediaUrl,
    caption,
    frameColor,
    frameStyle,
    imageFilter,
    rotation,
    framePadding,
    captionFontFamily,
    captionFontSize,
    isWooProduct,
    productId,
    showPrice,
    showAddToCart,
    showQuickView,
    displayStyle
  } = attributes;

  const [isLoading, setIsLoading] = useState(true);
  const blockProps = useBlockProps();

  // Get WooCommerce products with embedded media
  const products = useSelect((select) => {
    return select('core').getEntityRecords('postType', 'product', {
      per_page: -1,
      status: 'publish',
      _embed: true // Include embedded data like featured images
    });
  }, []);

  // Handle loading state
  useEffect(() => {
    if (products !== null) {
      setIsLoading(false);
    }
  }, [products]);

  const frameStyles = [
    { label: 'Classic', value: 'classic' },
    { label: 'Modern', value: 'modern' },
    { label: 'Vintage', value: 'vintage' },
  ];

  const imageFilters = [
    { label: 'None', value: 'none' },
    { label: 'Sepia', value: 'sepia' },
    { label: 'Grayscale', value: 'grayscale' },
    { label: 'Vintage', value: 'vintage' },
    { label: 'Fade', value: 'fade' },
    { label: 'High Contrast', value: 'contrast' }
  ];

  const fontFamilies = [
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Helvetica', value: 'Helvetica' }
  ];

  const displayStyles = [
    { label: 'Single Product', value: 'product' },
    { label: 'Category', value: 'category' },
    { label: 'Featured Products', value: 'featured' }
  ];

  const productOptions = products ? [
    { label: 'Select a product', value: '' },
    ...products.map(product => ({
      label: product.title.rendered,
      value: product.id
    }))
  ] : [];

  const selectedProduct = products?.find(p => p.id === productId);

  // Get the product image URL
  const getProductImageUrl = (product) => {
    if (!product) return '';

    // Try to get the featured media URL
    if (product._embedded && product._embedded['wp:featuredmedia']) {
      return product._embedded['wp:featuredmedia'][0].source_url;
    }

    // Fallback to featured image if available
    if (product.featured_media_src_url) {
      return product.featured_media_src_url;
    }

    // Final fallback to a placeholder
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  };

  const renderProductContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <Spinner />
          <p>Loading products...</p>
        </div>
      );
    }

    if (!productId || !selectedProduct) {
      return (
        <div className="select-product-message">
          Please select a product from the sidebar
        </div>
      );
    }

    const imageUrl = getProductImageUrl(selectedProduct);

    return (
      <div className="polaroid-image-container">
        <img
          src={imageUrl}
          alt={selectedProduct.title.rendered}
          className={`filter-${imageFilter}`}
        />
        {showPrice && (
          <div className="product-price"
            dangerouslySetInnerHTML={{ __html: selectedProduct.price_html }}
          />
        )}
        {showAddToCart && (
          <button className="add-to-cart-button">
            Add to Cart
          </button>
        )}
        {showQuickView && (
          <button className="quick-view-button">
            Quick View
          </button>
        )}
      </div>
    );
  };

  // Debug output
  console.log('Selected Product:', selectedProduct);
  console.log('Product Image URL:', selectedProduct ? getProductImageUrl(selectedProduct) : null);

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title="WooCommerce Settings">
          <ToggleControl
            label="Use WooCommerce Product"
            checked={isWooProduct}
            onChange={(value) => setAttributes({ isWooProduct: value })}
          />
          {isWooProduct && (
            <>
              <SelectControl
                label="Display Style"
                value={displayStyle}
                options={displayStyles}
                onChange={(value) => setAttributes({ displayStyle: value })}
              />
              {displayStyle === 'product' && (
                <SelectControl
                  label="Select Product"
                  value={productId}
                  options={productOptions}
                  onChange={(value) => setAttributes({ productId: Number(value) })}
                />
              )}
              <ToggleControl
                label="Show Price"
                checked={showPrice}
                onChange={(value) => setAttributes({ showPrice: value })}
              />
              <ToggleControl
                label="Show Add to Cart"
                checked={showAddToCart}
                onChange={(value) => setAttributes({ showAddToCart: value })}
              />
              <ToggleControl
                label="Show Quick View"
                checked={showQuickView}
                onChange={(value) => setAttributes({ showQuickView: value })}
              />
            </>
          )}
        </PanelBody>

        <PanelBody title="Frame Settings">
          <div className="components-base-control">
            <label className="components-base-control__label">Frame Color</label>
            <ColorPicker
              color={frameColor}
              onChangeComplete={(value) => setAttributes({ frameColor: value.hex })}
              disableAlpha
            />
          </div>
          <SelectControl
            label="Frame Style"
            value={frameStyle}
            options={frameStyles}
            onChange={(value) => setAttributes({ frameStyle: value })}
          />
          <RangeControl
            label="Frame Padding"
            value={framePadding}
            onChange={(value) => setAttributes({ framePadding: value })}
            min={0}
            max={50}
          />
          <RangeControl
            label="Rotation (degrees)"
            value={rotation}
            onChange={(value) => setAttributes({ rotation: value })}
            min={-45}
            max={45}
          />
        </PanelBody>

        <PanelBody title="Image Settings">
          <SelectControl
            label="Image Filter"
            value={imageFilter}
            options={imageFilters}
            onChange={(value) => setAttributes({ imageFilter: value })}
          />
        </PanelBody>

        <PanelBody title="Caption Settings">
          <SelectControl
            label="Font Family"
            value={captionFontFamily}
            options={fontFamilies}
            onChange={(value) => setAttributes({ captionFontFamily: value })}
          />
          <RangeControl
            label="Font Size"
            value={captionFontSize}
            onChange={(value) => setAttributes({ captionFontSize: value })}
            min={10}
            max={24}
          />
        </PanelBody>
      </InspectorControls>

      <div
        className={`polaroid-frame ${frameStyle}`}
        style={{
          backgroundColor: frameColor,
          padding: `${framePadding}px`,
          transform: `rotate(${rotation}deg)`
        }}
      >
        {!isWooProduct ? (
          !mediaUrl ? (
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => setAttributes({ mediaId: media.id, mediaUrl: media.url })}
                allowedTypes={['image']}
                value={mediaId}
                render={({ open }) => (
                  <Button onClick={open} className="upload-button">
                    Upload Image
                  </Button>
                )}
              />
            </MediaUploadCheck>
          ) : (
            <div className="polaroid-image-container">
              <img
                src={mediaUrl}
                alt={caption}
                className={`filter-${imageFilter}`}
              />
              <input
                type="text"
                value={caption || ''}
                onChange={(e) => setAttributes({ caption: e.target.value })}
                placeholder="Add caption..."
                className="polaroid-caption"
                style={{
                  fontFamily: captionFontFamily,
                  fontSize: `${captionFontSize}px`
                }}
              />
            </div>
          )
        ) : (
          <div className="polaroid-product-container">
            {renderProductContent()}
          </div>
        )}
      </div>
    </div>
  );
}
