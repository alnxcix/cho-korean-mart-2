import { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import bcrypt from "bcryptjs";

const DeleteUser = (props) => {
  let { setUsers, user, activeUser } = props;
  const [verifyUser, setVerification] = useState("");
  const [passIsSame, setPassIsSame] = useState(false);
  const samePass = (pass, hash) => bcrypt.compareSync(pass, hash);
  return (
    <>
      <button
        className="btn btn-danger"
        data-target={`#modalDelete${user._id}`}
        data-toggle="modal"
        disabled={user._id === activeUser._id}
        onClick={() => {
          $("#userAlert1").slideUp();
          $("#userAlert2").slideUp();
          $("#userAlert3").slideUp();
          $("#userAlert4").slideUp();
          $("#userAlert5").slideUp();
          $("#userAlert6").slideUp();
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id={`modalDelete${user._id}`}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#900" }}>
              <h5 className="modal-title text-light">Delete User</h5>
              <button
                className="close text-light"
                data-dismiss="modal"
                onClick={() => setVerification("")}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Delete <b>{user.firstName}'s</b> account?
            </div>
            <div className="modal-body form-group mt-2">
              <label className="form-label">
                <h6>Enter your password to delete the account:</h6>
              </label>
              <input
                className="form-control"
                type="password"
                onChange={(e) => {
                  setVerification(e.target.value);
                  setPassIsSame(samePass(e.target.value, activeUser.password));
                }}
                value={verifyUser}
                placeholder="Password"
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-dark"
                data-dismiss="modal"
                onClick={() => setVerification("")}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                data-dismiss="modal"
                disabled={!passIsSame}
                type="submit"
                onClick={() => {
                  window
                    .require("electron")
                    .remote.getGlobal("users")
                    .delete(user)
                    .then(() => $("#userAlert5").slideDown())
                    .catch(() => $("#userAlert6").slideDown());
                  window
                    .require("electron")
                    .remote.getGlobal("users")
                    .readAll()
                    .then((users) => setUsers(users));
                  setVerification("");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteUser;
