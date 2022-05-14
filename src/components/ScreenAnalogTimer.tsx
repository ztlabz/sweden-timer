import WidgetAnalogTimer from "./WidgetAnalogTimer";


const ScreenAnalogTimer = (props: any) => {

  return (
    <>
      <div className="screen screen-analog-timer">
        <h1>Analog timer</h1>
        <WidgetAnalogTimer minutes={props.minutes} seconds={props.seconds} />
      </div>
    </>
  );
};

export default ScreenAnalogTimer;