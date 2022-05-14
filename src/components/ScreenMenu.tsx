import Header from "./Header";

const ScreenMenu = (props: any) => {
  return (
    <div className="screen screen-menu dark-theme bg-black">
      <Header cbMenuToggle={props.cbMenuToggle} />
      <div className="menu">
        <div onClick={() => { props.cbSetMode('ANALOG') }}>ANALOG TIMER</div>
        <div onClick={() => { props.cbSetMode('DIGITAL') }}>DIGITAL TIMER</div>
      </div>
    </div>
  );
};

export default ScreenMenu;