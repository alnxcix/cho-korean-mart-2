import { useState } from "react";
import $ from "jquery";
import logo from "../../../assets/ChoKoreanMart.jpg";

const AddUser = (props) => {
  let { setUsers } = props;
  const [_id, set_id] = useState("");
  const [firstName, setFirstName] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [lastName, setLastName] = useState("");
  const [passState, setPassState] = useState("password");
  const [validPassword, setValidPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const clear = () => {
    set_id("");
    setFirstName("");
    setImgSrc("");
    setLastName("");
    setPassword("");
    setRole("");
    setPassState("password");
    setValidPassword(true);
  };
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
      .then(() => $("#userAlert1").slideDown())
      .catch(() => $("#userAlert2").slideDown());
    window
      .require("electron")
      .remote.getGlobal("users")
      .readAll()
      .then((users) => setUsers(users));
    $("#modalAddUser").modal("hide");
    clear();
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
                  <label className="col-3 col-form-label">ID</label>
                  <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) => set_id(e.target.value)}
                      placeholder="ID"
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
                          )
                            setValidPassword(true);
                          else setValidPassword(false);
                        }}
                        // onFocus={(e) => {

                        // }}
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
                        <br/>Password must be 8-20 characters long, must contain letters and numbers, and is a mixture of both uppercase and lowercase letters.
                      </small>
                    </div>
                  </div>
                </div>
                {/* <div className="form-group row">
                  <div className="col">
                    Password should be: <br />
                    At least 8 characters, maximum of 20
                    <br />
                    characters Having both uppercase and lowercase letters
                    <br />
                    Having at least 1 number Inclusion of at least one character
                    <br />
                  </div>
                </div> */}
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
                    <input type="file" />
                  </div>
                </div>
                <picture>
                  <source srcset={imgSrc} type="image/jpeg+png" />
                  <img
                    alt=""
                    src={logo}
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
                  disabled={!validPassword}
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