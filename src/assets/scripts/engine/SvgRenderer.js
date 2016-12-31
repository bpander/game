import preact from 'preact';

export default function SvgRenderer(props)  {
  const { x, y, width, height, children } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`${x} ${y} ${width} ${height}`}>
      {children}
    </svg>
  );
}
