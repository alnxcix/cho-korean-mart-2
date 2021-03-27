import { useEffect, useState } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import logo from "../../../assets/ChoKoreanMart.jpg";

const EditUser = (props) => {
  let { setUsers, activeUser, setActiveUser } = props;
  const [user, setUser] = useState(props.user);
  const [verifyUser, setVerification] = useState("");
  const [pass, setPassword] = useState("");
  const [logout, setLogout] = useState(false);
  const [passState, setPassState] = useState("password");
  const [validPassword, setValidPassword] = useState(true);
  const reset = () => {
    setUser(props.user);
    setPassState("password");
    setPassword("");
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
    logout ? setActiveUser(() => undefined) : console.log("all is well");
  };
  useEffect(() => setUser(props.user), [props.user]);
  const uploadImage = (e) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.readyState === 2) {
        setUser({ ...user, imgSrc: reader.result });
      }
    };
    reader.readAsDataURL(e[0]);
  };
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
                  <label className="col-3 col-form-label">Username/ID</label>
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
                          setPassword(e.target.value);
                          const pass = e.target.value;
                          if (
                            pass.match(/[a-z]+/) &&
                            pass.match(/[0-9]+/) &&
                            pass.match(/[A-Z]+/) &&
                            //pass.match(/[~<>?!@#$%^&*()]+/) &&
                            pass.length >= 8 &&
                            pass.length <= 20
                          ) {
                            setValidPassword(true);
                          } else setValidPassword(false);
                        }}
                        placeholder="Password"
                        type={passState}
                        value={pass}
                      />
                      <div className="input-group-append">
                        <button
                          class="input-group-text"
                          onClick={() => setPassState("text")}
                          onMouseOut={() => {
                            setPassState("password");
                          }}
                          type="button"
                        >
                          View
                        </button>
                      </div>
                      <small id="passwordHelpInline" class="text-muted">
                        <br />
                        Password must be 8-20 characters long, must contain
                        letters and numbers, and is a mixture of both uppercase
                        and lowercase letters.
                      </small>
                    </div>
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
                    <input
                      type="file"
                      id="formFile"
                      accept="image/*"
                      onChange={(e) => {
                        uploadImage(e.target.files);
                      }}
                    />
                  </div>
                </div>
                <picture>
                  {/* <source srcset={user.imgSrc} type="image/jpeg+png" /> */}
                  <img
                    alt=""
                    src={user.imgSrc}
                    className="img-fluid img-thumbnail w-50"
                  />
                </picture>
                <div className="form-group mt-2">
                  <label className="form-label">
                    <h5>
                      <b>Input Your Password to Implement the Changes</b>
                    </h5>
                  </label>
                  <input
                    className="form-control"
                    type="password"
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
                    activeUser.password !== verifyUser ||
                    (pass !== "" ? !validPassword : false)
                  }
                  onClick={() => {
                    setUser({
                      ...user,
                      password: pass !== "" ? pass : user.password,
                    });
                    setLogout(pass !== "" && activeUser._id === user._id);
                  }}
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
