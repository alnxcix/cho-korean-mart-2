import { useEffect, useState } from "react";
import $ from "jquery";
import InitializeAdminModal from "./InitializeAdminModal";
import logo from "../assets/ChoKoreanMart.jpg";

const LoginPage = (props) => {
  let { setActiveUser } = props;
  const [_id, set_id] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    window
      .require("electron")
      .remote.getGlobal("users")
      .auth(_id, password)
      .then((user) =>
        user === null ? $("#loginPageAlert2").slideDown() : setActiveUser(user)
      );
  };
  useEffect(
    () =>
      window
        .require("electron")
        .remote.getGlobal("users")
        .readAll()
        .then((users) =>
          users.length === 0 ? $("#modalInitAdmin").modal("show") : null
        ),
    []
  );
  return (
    <>
      <div className="container" style={{ maxWidth: 300 }}>
        <img alt="" className="img-fluid mb-2" src={logo} />
        <div
          className="alert alert-success alert-dismissible collapse"
          id="loginPageAlert1"
          role="alert"
        >
          <strong>Success:</strong> Admin account created.
          <button
            className="close"
            onClick={() => $("#loginPageAlert1").slideUp()}
          >
            <span>&times;</span>
          </button>
        </div>
        <div
          className="alert alert-danger alert-dismissible collapse"
          id="loginPageAlert2"
          role="alert"
        >
          <strong>Error:</strong> Account does not exist or password is
          incorrect.
          <button
            className="close"
            onClick={() => $("#loginPageAlert2").slideUp()}
          >
            <span>&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            onChange={(e) => {
              set_id(e.target.value);
              $("#loginPageAlert2").slideUp();
            }}
            placeholder="Username / ID"
            required
            value={_id}
          />
          <input
            className="form-control mb-2"
            onChange={(e) => {
              setPassword(e.target.value);
              $("#loginPageAlert2").slideUp();
            }}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
          <button
            className="btn d-block mx-auto text-light"
            style={{ backgroundColor: "#900" }}
            type="submit"
          >
            Login
          </button>
          <button
            className="btn btn-link d-block mx-auto"
            style={{ color: "#900" }}
            type="button"
            data-target="#modalForgotPass"
            data-toggle="modal"
          >
            Forgot Password
          </button>
          <div
            className="fade modal"
            data-backdrop="static"
            data-keyboard="false"
            id="modalForgotPass"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div
                  className="modal-header"
                  style={{ backgroundColor: "#900" }}
                >
                  <h5 className="modal-title text-light">
                    Contact an Administrator/Owner
                  </h5>
                  <button className="close text-light" data-dismiss="modal">
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="m-2">
                    Your password can not be retrieved, and a new password can
                    only be provided by a user with access to an
                    Administrator/Owner account.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <InitializeAdminModal />
    </>
  );
};

export default LoginPage;
