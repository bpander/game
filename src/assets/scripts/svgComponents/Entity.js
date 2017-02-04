import preact from 'preact';
import { WORKING } from 'constants/TaskTypes';
import ProgressBar from 'svgComponents/ProgressBar';


export default function Entity(props) {
  const { entity, size } = props;
  return (
    <g transform={`translate(${entity.position.map(p => p * size).join()})`}>
      {(entity.task === WORKING) && (
        <g transform={`translate(-25, -20)`}>
          <ProgressBar width={50} height={10} progress={entity.progress} />
        </g>
      )}
      <circle
        r={size * entity.radius}
        fill="dodgerblue"
      />
    </g>
  );
}
