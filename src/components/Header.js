import { Fade as Hamburger } from "hamburger-react";
import logo from "../assets/ChoKoreanMart.jpg";

const Header = (props) => {
  let { activeUser, collapsed, setCollapsed } = props;
  return (
    <nav
      className="navbar navbar-dark py-0 sticky-top"
      style={{ backgroundColor: "#900" }}
    >
      <Hamburger color="#fff" onToggle={() => setCollapsed(!collapsed)} />
      <span className="navbar-text">
        {activeUser.firstName} {activeUser.lastName}
        <picture>
          <source srcset={activeUser.imgSrc} />
          <img
            alt=""
            className="img-thumbnail ml-3"
            src={logo}
            style={{ maxHeight: 50 }}
          />
        </picture>
      </span>
    </nav>
  );
};

export default Header;
