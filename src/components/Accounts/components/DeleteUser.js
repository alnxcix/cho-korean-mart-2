import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";

const DeleteUser = (props) => {
  let { setUsers, user, activeUser } = props;
  return (
    <>
      <button
        className="btn btn-danger"
        data-target={`#modalDelete${user._id}`}
        data-toggle="modal"
        disabled={user._id === activeUser._id}
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
              <button className="close text-light" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">Delete {user.firstName}'s account?</div>
            <div className="modal-footer">
              <button className="btn btn-dark" data-dismiss="modal">
                Cancel
              </button>
              <button
                className="btn btn-danger"
                data-dismiss="modal"
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
