import Hamburger from "./Hamburger";

const ScreenHome = (props: any) => {
  return (
    <>
      <div className="screen screen-home dark-theme bg-black">
        <header>
          
        </header>
        <div className="main">
          <div className="logo" onClick={() => { props.cbSetNewTimer() }}>
            <Hamburger />
            <div className="logo-title">INTERVAL</div>
            <p>For all you timing needs</p>
          </div>
        </div>
        <footer>

        </footer>
      </div>
    </>
  );
};

export default ScreenHome;