import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';

import space from 'app/styles/space';

const defaultProps = {
  shape: 'rect' as 'rect' | 'circle',
  bottomGutter: 0,
  width: '100%',
  height: '60px',
};

type DefaultProps = Readonly<typeof defaultProps>;

type Props = {
  className?: string;
} & Partial<DefaultProps>;

const Placeholder = styled((props: Props) => {
  const {className} = props;
  return <div data-test-id="loading-placeholder" className={className} />;
})<Props>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;

  background-color: ${p => p.theme.placeholderBackground};
  width: ${p => p.width};
  height: ${p => p.height};
  ${p => (p.shape === 'circle' ? 'border-radius: 100%;' : '')}
  ${p =>
    typeof p.bottomGutter === 'number' && p.bottomGutter > 0
      ? `margin-bottom: ${space(p.bottomGutter)};`
      : ''}
`;

Placeholder.defaultProps = defaultProps;

Placeholder.propTypes = {
  shape: PropTypes.oneOf(['rect', 'circle']),
  width: PropTypes.string,
  height: PropTypes.string,
  bottomGutter: PropTypes.number,
};

export default Placeholder;
