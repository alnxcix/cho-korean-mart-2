import React from "react"; //https://www.youtube.com/watch?v=IYCa1F-OWmk
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";

const Pagination = ({
  currentRows,
  rowsPerPage,
  totalRows,
  chgPage,
  currentPage,
  setCurrentPage,
  setRowsPerPage,
}) => {
  const pageNums = [];
  for (let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
    pageNums.push(i);
  }
  return (
    <div style={{}}>
      <div style={{float: 'right'}}>
      <caption className="row m-auto">
        {`Showing ${currentRows.length} of ${totalRows} ${
          totalRows > 1 ? "entries" : "entry"
        }.`}
        &nbsp;&nbsp;
        <button
          className="btn btn-light"
          title="Previous"
          data-toggle="tool-tip"
          disabled={currentPage == 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </button>{" "}
        &nbsp;
        <nav>
          <ul className="pagination">
            {pageNums.map((num) => (
              <li key={num} className="page-item badge badge-sm badge-light">
                <a
                  onClick={() => chgPage(num)}
                  className={
                    currentPage === num
                      ? "page-link text-danger"
                      : "page-link text-dark"
                  }
                >
                  {num}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        &nbsp;
        <button
          className="btn btn-light"
          title="Next"
          data-toggle="tool-tip"
          disabled={currentPage == Math.ceil(totalRows / rowsPerPage)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </caption>
      </div>
      <div className="form-row">
        <div className="col input-group">
          <div className="input-group-prepend">
            <caption className="input-group-text">Show</caption>
          </div>
          <select
            className="custom-select col-2"
            onChange={(e) => {
              setRowsPerPage(e.target.value);
              setCurrentPage(1);
            }}
            value={rowsPerPage}
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>

            {/* test  */}
            {/* <option value="1">1</option>
            <option value="3">3</option>
            <option value="5">5</option> */}
          </select>
          <div className="input-group-append">
            <caption className="input-group-text">entries</caption>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Pagination;
