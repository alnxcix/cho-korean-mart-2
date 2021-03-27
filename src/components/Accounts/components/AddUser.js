import { useState } from "react";
import $ from "jquery";
import logo from "../../../assets/ChoKoreanMart.jpg";

const AddUser = (props) => {
  let { setUsers } = props;
  const [_id, set_id] = useState("");
  const [firstName, setFirstName] = useState("");
  const [imgSrc, setImgSrc] = useState(logo);
  const [lastName, setLastName] = useState("");
  const [passState, setPassState] = useState("password");
  // const [validPassword, setValidPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const clear = () => {
    set_id("");
    setFirstName("");
    setImgSrc(logo);
    setLastName("");
    setPassword("");
    setRole("");
    setPassState("password");
  };
  const getPasswordValidity = () =>
    password.match(/[a-z]+/) &&
    password.match(/[0-9]+/) &&
    password.match(/[A-Z]+/) &&
    //password.match(/[~<>?!@#$%^&*()]+/) &&
    password.length >= 8 &&
    password.length <= 20;
  const handleSubmit = (e) => {
    e.preventDefault();
    window
      .require("electron")
      .remote.getGlobal("users")
      .create({
        _id: _id,
        firstName: firstName,
        imgSrc: imgSrc,
        lastName: lastName,
        password: password,
        role: role,
      })
      .then(() => {
        $("#userAlert1").slideDown();

        clear();
      })
      .catch(() => $("#userAlert2").slideDown());
    window
      .require("electron")
      .remote.getGlobal("users")
      .readAll()
      .then((users) => setUsers(users));
    $("#modalAddUser").modal("hide");
  };
  const uploadImage = (e) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.readyState === 2) {
        setImgSrc(reader.result);
      }
    };
    reader.readAsDataURL(e[0]);
  };
  return (
    <>
      <button
        className="btn btn-dark btn-lg ml-3 rounded-pill"
        data-target="#modalAddUser"
        data-toggle="modal"
      >
        Add User
      </button>
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id="modalAddUser"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#900" }}>
              <h5 className="modal-title text-light">Add User</h5>
              <button
                className="close text-light"
                data-dismiss="modal"
                onClick={() => clear()}
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
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      required
                      value={firstName}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Last Name</label>
                  <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      required
                      value={lastName}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Username/ID</label>
                  <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) => set_id(e.target.value)}
                      placeholder="Username / ID"
                      required
                      value={_id}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Password</label>
                  <div class="col">
                    <div className="input-group">
                      <input
                        className="form-control"
                        style={{
                          backgroundColor: getPasswordValidity()
                            ? null
                            : "#ffb3b3",
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        type={passState}
                        value={password}
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
                <div className="form-group row">
                  <label className="col-3 col-form-label">Role</label>
                  <div className="col">
                    <select
                      className="custom-select"
                      onChange={(e) => setRole(e.target.value)}
                      required
                      value={role}
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
                  {/* <source srcset={imgSrc} type="image/jpeg+png" /> */}
                  <img
                    alt=""
                    src={imgSrc}
                    className="img-fluid img-thumbnail w-50"
                  />
                </picture>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-dark mr-auto"
                  onClick={() => clear()}
                  type="button"
                >
                  Clear
                </button>
                <button
                  className="btn btn-dark"
                  data-dismiss="modal"
                  onClick={() => clear()}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={!getPasswordValidity()}
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

export default AddUser;
