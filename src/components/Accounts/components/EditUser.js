import { useEffect, useState } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import logo from "../../../assets/ChoKoreanMart.jpg";

const EditUser = (props) => {
  let { setUsers, activeUser } = props;
  const [user, setUser] = useState(props.user);
  const [verifyUser, setVerification] = useState("");
  const [passState, setPassState] = useState("password");
  const [validPassword, setValidPassword] = useState(true);
  const reset = () => {
    setUser(props.user);
    setPassState("password");
    setVerification("");
    setValidPassword(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    window
      .require("electron")
      .remote.getGlobal("users")
      .update(user)
      .then(() => $("#userAlert3").slideDown())
      .catch(() => $("#userAlert4").slideDown());
    window
      .require("electron")
      .remote.getGlobal("users")
      .readAll()
      .then((users) => setUsers(users));
    $(`#modalEdit${user._id}`).modal("hide");
    reset();
  };
  useEffect(() => setUser(props.user), [props.user]);
  return (
    <>
      <button
        className="btn btn-warning"
        data-target={`#modalEdit${user._id}`}
        data-toggle="modal"
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id={`modalEdit${user._id}`}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#900" }}>
              <h5 className="modal-title text-light">Edit User</h5>
              <button
                className="close text-light"
                data-dismiss="modal"
                onClick={() => reset()}
              >
                <span>&times;</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group row">
                  <label className="col-3 col-form-label">First Name</label>
                  <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) =>
                        setUser({ ...user, firstName: e.target.value })
                      }
                      placeholder="First Name"
                      required
                      value={user.firstName}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Last Name</label>
                  <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) =>
                        setUser({ ...user, lastName: e.target.value })
                      }
                      placeholder="Last Name"
                      required
                      value={user.lastName}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">ID</label>
                  <div className="col">
                    <input className="form-control" disabled value={user._id} />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Password</label>
                  <div class="col ">
                    <div className="input-group">
                      <input
                        className="form-control"
                        style={
                          !validPassword ? { backgroundColor: "#ffb3b3" } : {}
                        }
                        onChange={(e) => {
                          setUser({ ...user, password: e.target.value });
                          const pass = e.target.value;
                          if (
                            pass.match(/[a-z]+/) &&
                            pass.match(/[0-9A-Z]+/) &&
                            pass.match(/[~<>?!@#$%^&*()]+/) &&
                            pass.length >= 8 &&
                            pass.length <= 20
                          )
                            setValidPassword(true);
                          else setValidPassword(false);
                        }}
                        placeholder="Password"
                        required
                        type="password"
                        value={user.password}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col">
                    Password should be: <br />
                    At least 8 characters, maximum of 20
                    <br />
                    characters Having both uppercase and lowercase letters
                    <br />
                    Having at least 1 number Inclusion of at least one character
                    <br />
                  </div>
                </div>
                {user.role === "Administrator" &&
                user._id === activeUser._id ? (
                  <></>
                ) : (
                  <div className="form-group row">
                    <label className="col-3 col-form-label">Role</label>
                    <div className="col">
                      <select
                        className="custom-select"
                        onChange={(e) =>
                          setUser({ ...user, role: e.target.value })
                        }
                        required
                        value={user.role}
                      >
                        <option disabled selected value="">
                          Select Role
                        </option>
                        <option value="Administrator">Administrator</option>
                        <option value="Cashier">Cashier</option>
                        <option value="Owner">Owner</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="form-group row">
                  <label className="col-form-label col-sm-12 mb-2">
                    Upload Image
                  </label>
                  <div className="col-sm-12">
                    <input type="file" />
                  </div>
                </div>
                <picture>
                  <source srcset={user.imgSrc} type="image/jpeg+png" />
                  <img
                    alt=""
                    src={logo}
                    className="img-fluid img-thumbnail w-50"
                  />
                </picture>
                <div className="form-group mt-2">
                  <label className="form-label">
                    Input Your Password to Implement the Changes
                  </label>
                  <input
                    className="form-control"
                    required
                    type={passState}
                    onChange={(e) => setVerification(e.target.value)}
                    value={verifyUser}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary mr-auto"
                  onClick={() => reset()}
                  type="button"
                >
                  Reset
                </button>
                <button
                  className="btn btn-dark"
                  data-dismiss="modal"
                  onClick={() => reset()}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className={
                    activeUser.password === verifyUser
                      ? "btn btn-success"
                      : "btn btn-success disabled"
                  }
                  disabled={
                    activeUser.password !== verifyUser || !validPassword
                  }
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;
