import Hamburger from "./Hamburger";

const Header = (props: any) => {
  let headerTitle = '';
  if (typeof props.headerTitle === 'string') {
    headerTitle = props.headerTitle;
  }
  return (
    <>
      <header>
        <Hamburger cbMenuToggle={props.cbMenuToggle} />
        <span>{headerTitle}</span>
      </header>
    </>
  );
};

export default Header;