import preact from 'preact';

export default function ProgressBar(props) {
  const {
    width,
    height,
    progress,
  } = props;
  return (
    <g>
      <rect width={progress * width} height={height} stroke="none" fill="red" />
      <rect width={width} height={height} stroke="black" fill="none" />
    </g>
  );
};
