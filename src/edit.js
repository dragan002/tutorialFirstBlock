import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import './editor.scss';

const renderPhotos = (count) => {
  const photosArray = [];
  for (let i = 0; i < count; i++) {
    photosArray.push(
      <div className="polaroid" key={i}>
        <img src={`https://picsum.photos/200/300?random=${i}`}
          width="200"
          loading="lazy"
          alt="Polaroid" />
      </div>
    );
  }
  return photosArray;
}

/**
 * @return {Element}
 */
export default function Edit({ attributes: { photos }, setAttributes }) {
  return (
    <section {...useBlockProps()}>
      <div className="polaroids">
        {renderPhotos(photos)}
      </div>
      <InspectorControls>
        <PanelBody title="Photos">
          <RangeControl
            label={__('Number of photos', 'polaroid-generator')}
            value={photos}
            onChange={(newCount) =>
              setAttributes({ photos: newCount })}
            min={3}
            max={12}
            __nextHasNoMargin
          />
        </PanelBody>
      </InspectorControls>
    </section>
  );
}
