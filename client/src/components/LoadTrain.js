import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadTrainContainer = styled.div`
  display: block;
  position: relative;
`;

const loadTrainAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const LoadTrainAnimationContainer = styled.div`
  position: absolute;
  animation: ${loadTrainAnimation} 1s cubic-bezier(0.66, 0.11, 0.83, 1.48) infinite alternate;
`;

const TrainSegment = styled.span`
  display: inline;
  font-size: ${props => props.theme.fonts.sizes.normal};
`;

/* eslint-disable jsx-a11y/accessible-emoji */
const LoadTrain = (props) => {
  return (
    <LoadTrainContainer>
      <LoadTrainAnimationContainer>
        <TrainSegment>🚂</TrainSegment>
        <TrainSegment>🚃</TrainSegment>
        <TrainSegment>🚃</TrainSegment>
        <TrainSegment>💥</TrainSegment>
      </LoadTrainAnimationContainer>
    </LoadTrainContainer>
  );
};
/* eslint-enable jsx-a11y/accessible-emoji */

export default LoadTrain;
