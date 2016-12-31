import preact from 'preact';


export default function UiLayer(props) {
  return (
    <div className="ui">
      {props.children}
    </div>
  );
};
