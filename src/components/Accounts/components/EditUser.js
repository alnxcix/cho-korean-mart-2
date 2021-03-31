import { useEffect, useState } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bsCustomFileInput from "bs-custom-file-input";
import $ from "jquery";

const EditUser = (props) => {
  let { setUsers, activeUser, setActiveUser } = props;
  const [user, setUser] = useState(props.user);
  const [verifyUser, setVerification] = useState("");
  const [password, setPassword] = useState("");
  const [passState, setPassState] = useState("password");
  const getPasswordValidity = () =>
    password.match(/[a-z]+/) &&
    password.match(/[0-9]+/) &&
    password.match(/[A-Z]+/) &&
    //password.match(/[~<>?!@#$%^&*()]+/) &&
    password.length >= 8 &&
    password.length <= 20;
  const reset = () => {
    setUser(props.user);
    setPassState("password");
    setPassword("");
    setVerification("");
    // setValidPassword(true);
    $("#imageInput3").next("label").html("Choose image");
    $("#imageInput3").val(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    window
      .require("electron")
      .remote.getGlobal("users")
      .update({
        ...user,
        password: password === "" ? user.password : password,
        newPass: password === "" ? false : true,
      })
      .then(() => $("#userAlert3").slideDown())
      .catch(() => $("#userAlert4").slideDown());
    window
      .require("electron")
      .remote.getGlobal("users")
      .readAll()
      .then((users) => setUsers(users));
    if (user._id === activeUser._id) {
      window
        .require("electron")
        .remote.getGlobal("users")
        .read(activeUser._id)
        .then((user) => setActiveUser(user));
    }
    $(`#modalEdit${user._id}`).modal("hide");
    reset();
  };
  const uploadImage = (e) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.readyState === 2) {
        setUser({ ...user, imgSrc: reader.result });
      }
    };
    if (e[0]) reader.readAsDataURL(e[0]);
  };
  useEffect(() => setUser(props.user), [props.user]);
  useEffect(() => $(document).ready(() => bsCustomFileInput.init()), []);
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
                  <div className="col ">
                    <div className="input-group">
                      <input
                        className="form-control"
                        style={{
                          backgroundColor:
                            password.length === 0 || getPasswordValidity()
                              ? null
                              : "#ffb3b3",
                        }}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        placeholder="Password"
                        type={passState}
                        value={password}
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
                {user.role !== "Cashier" && user._id === activeUser._id ? (
                  () => null
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
                  <label className="col-form-label col-3">Image</label>
                  <div className="col custom-file mx-3">
                    <input
                      accept="image/*"
                      className="custom-file-input"
                      id="imageInput3"
                      onChange={(e) => {
                        uploadImage(e.target.files);
                      }}
                      type="file"
                    />
                    <label className="custom-file-label">Choose image</label>
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
                    <h6>
                      <br></br>Enter your password to implement the changes:
                    </h6>
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
                  className="btn btn-success"
                  disabled={
                    activeUser.password !== verifyUser ||
                    (password.length > 0 && !getPasswordValidity())
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
