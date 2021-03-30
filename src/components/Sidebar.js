import { Link } from "react-router-dom";
import {
  faBox,
  faCashRegister,
  faChevronLeft,
  faCommentDollar,
  faHome,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SubMenu,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import logo from "../assets/ChoKoreanMart.jpg";
import EditProfile from "./EditProfile";

const Sidebar = (props) => {
  let { collapsed, setActiveUser, activeUser } = props;
  return (
    <>
      <ProSidebar collapsed={collapsed}>
        <SidebarHeader>
          <div className="p-4">
            <img alt="" className="img-fluid img-thumbnail" src={logo} />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem
              icon={<FontAwesomeIcon icon={faHome} />}
              title="Dashboard"
            >
              Dashboard <Link to="/" exact />
            </MenuItem>
            {!["Cashier"].includes(activeUser.role) ? (
              <>
                <MenuItem
                  icon={<FontAwesomeIcon icon={faUsers} />}
                  title="Accounts"
                >
                  Accounts <Link to="/accounts" />
                </MenuItem>
                {!["Owner"].includes(activeUser.role) ? (
                  <></>
                ) : (
                  <MenuItem
                    icon={<FontAwesomeIcon icon={faBox} />}
                    title="Inventory"
                  >
                    Inventory <Link to="/inventory" />
                  </MenuItem>
                )}
              </>
            ) : (
              () => null
            )}
            {!["Administrator"].includes(activeUser.role) ? (
              <MenuItem
                icon={<FontAwesomeIcon icon={faCashRegister} />}
                title="P.O.S."
              >
                P.O.S. <Link to="/pos" />
              </MenuItem>
            ) : (
              () => null
            )}
            {!["Administrator"].includes(activeUser.role) ? (
              <SubMenu
                title="Sales"
                icon={<FontAwesomeIcon icon={faCommentDollar} />}
              >
                <MenuItem>
                  Sales Report <Link to="/sales_report" />
                </MenuItem>
                <MenuItem>
                  Best Sellers <Link to="/best_sellers" />
                </MenuItem>
              </SubMenu>
            ) : (
              () => null
            )}
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <Menu iconShape="circle">
            <MenuItem
              icon={<FontAwesomeIcon icon={faUser} />}
              data-target="#modalProfile"
              data-toggle="modal"
              title="Profile"
            >
              Profile
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon icon={faChevronLeft} />}
              data-target="#modalLogout"
              data-toggle="modal"
              title="Logout"
            >
              Logout <Link to="/" exact />
            </MenuItem>
          </Menu>
        </SidebarFooter>
      </ProSidebar>

      <EditProfile activeUser={activeUser} setActiveUser={setActiveUser} />

      {/* logout modal */}
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id="modalLogout"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#333" }}>
              <h5 className="modal-title text-light">Logout Confirmation</h5>
              <button className="close text-light" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div>Are you sure you want to log out?</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-dark" data-dismiss="modal">
                No
              </button>
              <Link to="/" exact onClick={() => setActiveUser(() => undefined)}>
                <button className="btn btn-danger" data-dismiss="modal">
                  Yes
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
