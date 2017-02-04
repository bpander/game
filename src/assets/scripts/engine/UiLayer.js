import preact from 'preact';


export default function UiLayer(props) {
  return (
    <div className="ui">
      <div className="ui__elements">
        {props.children}
      </div>
    </div>
  );
};
