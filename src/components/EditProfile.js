import { useEffect, useState } from "react";
import bsCustomFileInput from "bs-custom-file-input";
import $ from "jquery";
import bcrypt from "bcryptjs";

const EditProfile = (props) => {
  let { activeUser, setActiveUser } = props;
  const [user, setUser] = useState(activeUser);
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
    setUser(activeUser);
    setPassState("password");
    setPassword("");
    setVerification("");
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
        password: password === "" ? user.password : hashedPassword(password),
      });
    window
      .require("electron")
      .remote.getGlobal("users")
      .read(user._id)
      .then((user) => setActiveUser(user));
    $(`#modalProfile`).modal("hide");
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
  useEffect(() => setUser(activeUser), [activeUser]);
  useEffect(() => $(document).ready(() => bsCustomFileInput.init()), []);
  const hashedPassword = (pass) => bcrypt.hashSync(pass, bcrypt.genSaltSync());
  const samePass = (pass, hash) => bcrypt.compareSync(pass, hash);
  return (
    <>
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id="modalProfile"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#333" }}>
              <h5 className="modal-title text-light">Edit Profile</h5>
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
                      disabled
                      value={user.firstName}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Last Name</label>
                  <div className="col">
                    <input
                      className="form-control"
                      disabled
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
                  <div className="col">
                    <div class="input-group">
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
                        <span className="input-group-text btn">Show</span>
                      </div>
                    </div>
                    <small className="form-text text-muted">
                      Password must be 8-20 characters long, must contain
                      letters and numbers, and is a mixture of both uppercase
                      and lowercase letters.
                    </small>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Role</label>
                  <div className="col">
                    <select
                      className="custom-select"
                      disabled
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
                    className="img-fluid img-thumbnail"
                    style={{ maxHeight: 150, maxWidth: 150 }}
                  />
                </picture>
                <div className="form-group mt-2">
                  <label className="form-label">
                    <h6>
                      <br></br>Enter your old password to implement the changes:
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
                    !samePass(verifyUser, activeUser.password) ||
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

export default EditProfile;
