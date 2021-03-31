import { useEffect, useState } from "react";
import $ from "jquery";
import InitializeAdminModal from "./InitializeAdminModal";
import logo from "../assets/ChoKoreanMart.jpg";

const LoginPage = (props) => {
  let { setActiveUser } = props;
  const [_id, set_id] = useState("");
  const [password, setPassword] = useState("");
  const [password4NewPass, setPassword4NewPass] = useState("");
  const [passState, setPassState] = useState("password");

  const [user, setUser] = useState([]);

  const getPasswordValidity = () =>
    password4NewPass.match(/[a-z]+/) &&
    password4NewPass.match(/[0-9]+/) &&
    password4NewPass.match(/[A-Z]+/) &&
    //password4NewPass.match(/[~<>?!@#$%^&*()]+/) &&
    password4NewPass.length >= 8 &&
    password4NewPass.length <= 20;
  const handleSubmit = (e) => {
    e.preventDefault();
    window
      .require("electron")
      .remote.getGlobal("users")
      .auth(_id, password)
      .then((user) => {
        user === null
          ? $("#loginPageAlert2").slideDown()
          : user.newPass
          ? $("#modalNewPass").modal("show")
          : setActiveUser(user);
      });
  };

  const getUser = () => user.filter((user) => user._id == _id);

  const newPassSet = () => {
    window
      .require("electron")
      .remote.getGlobal("users")
      .auth(_id, password)
      .then((user) => setActiveUser(user));
    getUser().map((user) => {
      window
        .require("electron")
        .remote.getGlobal("users")
        .update({
          ...user,
          password: password4NewPass,
          newPass: false,
        });
    });
    $("#modalNewPass").modal("hide");
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
  useEffect(
    () =>
      window
        .require("electron")
        .remote.getGlobal("users")
        .readAll()
        .then((users) => setUser(users)),
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
          {/* modal  */}
        </form>

        {/* new pass modal */}
        <div
          className="fade modal"
          data-backdrop="static"
          data-keyboard="false"
          id="modalNewPass"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: "#900" }}>
                <h5 className="modal-title text-light">Set Your Password</h5>
              </div>
              <div className="modal-body">
                <div className="m-2">
                  The password you used was an initial password given by an
                  Administrator/Owner. You must set your own password to
                  continue.
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Password</label>
                  <div className="col">
                    <div className="input-group">
                      <input
                        className="form-control"
                        style={{
                          backgroundColor:
                            password4NewPass.length === 0 ||
                            getPasswordValidity()
                              ? null
                              : "#ffb3b3",
                        }}
                        onChange={(e) => {
                          setPassword4NewPass(e.target.value);
                        }}
                        placeholder="Password"
                        type={passState}
                        value={password4NewPass}
                      />
                      <div
                        className="input-group-append"
                        onClick={() => setPassState("text")}
                        onMouseOut={() => {
                          setPassState("password");
                        }}
                      >
                        <span className="input-group-text">View</span>
                      </div>
                    </div>
                    <small className="text-muted">
                      Password must be 8-20 characters long, must contain
                      letters and numbers, and is a mixture of both uppercase
                      and lowercase letters.
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary mr-auto"
                  onClick={() => setPassword4NewPass("")}
                  type="button"
                >
                  Reset
                </button>
                <button
                  className="btn btn-success"
                  disabled={
                    password4NewPass.length === 0 || !getPasswordValidity()
                  }
                  type="button"
                  onClick={() => newPassSet()}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InitializeAdminModal />
    </>
  );
};

export default LoginPage;
