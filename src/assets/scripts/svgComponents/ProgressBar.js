import preact from 'preact';

export default function ProgressBar(props) {
  const {
    width,
    height,
    complete,
  } = props;
  return (
    <g>
      <rect width={complete * width} height={height} stroke="none" fill="red" />
      <rect width={width} height={height} stroke="black" fill="none" />
    </g>
  );
};
