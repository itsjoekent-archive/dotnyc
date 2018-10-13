import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Caption, PassiveLink } from './Type';

const fadeTimer = 2;

const ImageContainer = styled.div`
  display: block;
  position: relative;
  width: 100%;
`;

const fade = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const ImageStyle = styled.img`
  display: block;
  width: 100%;
  z-index: 10;

  ${props => props.fadeIn ? css`
    animation: ${fade} ${fadeTimer}s forwards;
  ` : ''}

  ${props => props.shadow ? css`
    box-shadow: 0px 0px 20px 0px rgba(1, 1, 1, 0.52);
  ` : ''}
`;

const FloatingImageStyle = styled(ImageStyle)`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
`;

class Image extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      fadeComplete: false,
    };
  }

  componentDidMount() {
    const { src } = this.props;
    const loader = new window.Image();

    const onLoad = () => {
      this.setState({ image: loader.src });

      setTimeout(() => this.setState({ fadeComplete: true }), fadeTimer * 1000);
    };

    loader.onload = onLoad;
    loader.src = `${this.getDirectoryPath()}${src}`;
  }

  getDirectoryPath() {
    const { directory } = this.props;

    return `${process.env.PUBLIC_URL}/content/${directory}/`;
  }

  render() {
    const { alt, caption, credit, src } = this.props;
    const { image, fadeComplete } = this.state;

    const blurPath = `${this.getDirectoryPath()}_blur_${src}`;

    const imageCaption = (caption || credit) ? (
      (caption && credit && (
        <Caption>
          <PassiveLink href={credit}>{caption}</PassiveLink>
        </Caption>
      )) ||
      (caption && ! credit && (
        <Caption>{caption}</Caption>
      )) ||
      (! caption && credit && (
        <Caption>
          <PassiveLink href={credit}>{credit}</PassiveLink>
        </Caption>
      ))
    ) : null;

    if (fadeComplete) {
      return (
        <ImageContainer>
          <ImageStyle src={image} alt={alt} shadow />
          {imageCaption}
        </ImageContainer>
      );
    }

    return (
      <ImageContainer>
        {image ? <FloatingImageStyle src={image} alt={alt} shadow /> : null}
        <ImageStyle src={blurPath} alt="Loading image" fadeIn={!! image} />
        {imageCaption}
      </ImageContainer>
    );
  }
}

export default Image;
