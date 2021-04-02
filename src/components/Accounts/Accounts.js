import { useEffect, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import sortArray from "sort-array";
import AddUser from "./components/AddUser";
import DeleteUser from "./components/DeleteUser";
import EditUser from "./components/EditUser";
import Pagination from "../Pagination";

const Accounts = (props) => {
  let { activeUser, setActiveUser } = props;
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("All");
  const [searchString, setSearchString] = useState("");
  const [propertyToBeSorted, setPropertyToBeSorted] = useState("_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const formatDigits = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const getFilteredUsers = () =>
    sortArray(
      users.filter((user) =>
        JSON.stringify(Object.values(user))
          .toLowerCase()
          .includes(searchString) && role === "All"
          ? true
          : user.role === role
      ),
      { by: propertyToBeSorted, order: sortOrder }
    );
  useEffect(
    () =>
      window
        .require("electron")
        .remote.getGlobal("users")
        .readAll()
        .then((users) => setUsers(users)),
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //test
  // const [rowsPerPage, setRowsPerPage] = useState(1);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = getFilteredUsers().slice(indexOfFirstRow, indexOfLastRow);
  const chgPage = (pageNum) => setCurrentPage(pageNum);
  return (
    <div className="p-3">
      <div
        className="alert alert-success alert-dismissible collapse"
        id="userAlert1"
        role="alert"
      >
        <strong>Success:</strong> User added.
        <button className="close" onClick={() => $("#userAlert1").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-danger alert-dismissible collapse"
        id="userAlert2"
        role="alert"
      >
        <strong>Error:</strong> User ID is already used. Use a different ID.
        <button className="close" onClick={() => $("#userAlert2").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-success alert-dismissible collapse"
        id="userAlert3"
        role="alert"
      >
        <strong>Success:</strong> Changes saved.
        <button className="close" onClick={() => $("#userAlert3").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-danger alert-dismissible collapse"
        id="userAlert4"
        role="alert"
      >
        <strong>Error:</strong> Failed to save changes.
        <button className="close" onClick={() => $("#userAlert4").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-success alert-dismissible collapse"
        id="userAlert5"
        role="alert"
      >
        <strong>Success:</strong> User deleted.
        <button className="close" onClick={() => $("#userAlert5").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-danger alert-dismissible collapse"
        id="userAlert6"
        role="alert"
      >
        <strong>Error:</strong> Failed to delete user.
        <button className="close" onClick={() => $("#userAlert6").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div className="align-items-center d-flex">
        <h1 className="flex-fill">Accounts</h1>
        <AddUser setUsers={setUsers} />
      </div>
      <hr />
      <div className="form-row">
        <div className="col input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Sort by</span>
          </div>
          <select
            className="custom-select"
            onChange={(e) => setPropertyToBeSorted(e.target.value)}
            value={propertyToBeSorted}
          >
            <option value="_id">Username / ID</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="role">Role</option>
          </select>
          <select
            className="custom-select"
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value={"asc"}>Ascending</option>
            <option value={"desc"}>Descending</option>
          </select>
        </div>
        <div className="col input-group">
          <div className="input-group-prepend">
            <label className="input-group-text">Role</label>
          </div>
          <select
            className="custom-select"
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            {["All", "Administrator", "Cashier", "Owner"].map((role) => (
              <option value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div className="col input-group">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
          <input
            className="form-control"
            onChange={(e) => {
              setSearchString(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search"
            value={searchString}
          />
        </div>
      </div>
      <hr />
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <col span="1" style={{ width: "60px" }} />
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th>Name</th>
            <th>Username / ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((user, index) => (
            <tr>
              <td className="text-center text-wrap">
                {formatDigits(index + 1)}
              </td>
              <td className="text-wrap">{`${user.firstName} ${user.lastName}`}</td>
              <td className="text-wrap">{user._id}</td>
              <td className="text-wrap">{user.role}</td>
              <td>
                <EditUser
                  setUsers={setUsers}
                  user={user}
                  activeUser={activeUser}
                  setActiveUser={setActiveUser}
                />
                &nbsp;
                <DeleteUser
                  setUsers={setUsers}
                  user={user}
                  activeUser={activeUser}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentRows={currentRows}
        rowsPerPage={rowsPerPage}
        totalRows={getFilteredUsers().length}
        chgPage={chgPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
      />
    </div>
  );
};

export default Accounts;
