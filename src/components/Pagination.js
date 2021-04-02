import {
  faAngleDoubleLeft,
  faAngleLeft,
  faAngleDoubleRight,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Pagination = (props) => {
  let {
    getChunkedDataset,
    getDataset,
    itemsPerPage,
    page,
    setItemsPerPage,
    setPage,
  } = props;
  // const pageNums = [];
  // for (let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
  //   pageNums.push(i);
  // }
  return (
    <caption>
      <div class="form-inline">
        <span className="mr-auto">
          {getDataset().length > 0
            ? getChunkedDataset()[page] !== undefined
              ? `Showing ${itemsPerPage * page + 1} - ${
                  itemsPerPage * page + getChunkedDataset()[page].length
                } of ${getDataset().length} ${
                  getDataset().length > 1 ? "entries" : "entry"
                }.`
              : () => null
            : () => null}
        </span>
        <div className="btn-group mr-3" role="group">
          <button
            className="btn btn-outline-dark shadow-none"
            disabled={page === 0}
            onClick={() => setPage(0)}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          <button
            className="btn btn-outline-dark shadow-none"
            disabled={page === 0}
            onClick={() => setPage(page > 0 ? page - 1 : page)}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          {page === 0 ? (
            () => null
          ) : page - 1 === 0 ? (
            () => null
          ) : (
            <button
              className="btn btn-outline-dark shadow-none"
              onClick={() => setPage(page - 2)}
            >
              {page - 1}
            </button>
          )}
          {page === 0 ? (
            () => null
          ) : (
            <button
              className="btn btn-outline-dark shadow-none"
              onClick={() => setPage(page - 1)}
            >
              {page}
            </button>
          )}
          <button className="btn btn-dark shadow-none">{page + 1}</button>
          {page + 1 === getChunkedDataset().length ||
          getChunkedDataset()[page] === undefined ? (
            () => null
          ) : (
            <button
              className="btn btn-outline-dark shadow-none"
              onClick={() => setPage(page + 1)}
            >
              {page + 2}
            </button>
          )}
          {page + 1 === getChunkedDataset().length ||
          getChunkedDataset()[page] === undefined ? (
            () => null
          ) : page + 2 === getChunkedDataset().length ||
            getChunkedDataset()[page] === undefined ? (
            () => null
          ) : (
            <button
              className="btn btn-outline-dark shadow-none"
              onClick={() => setPage(page + 2)}
            >
              {page + 3}
            </button>
          )}
          <button
            className="btn btn-outline-dark shadow-none"
            disabled={
              page + 1 === getChunkedDataset().length ||
              getChunkedDataset()[page] === undefined
            }
            onClick={() => setPage(page + 1)}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button
            className="btn btn-outline-dark shadow-none"
            disabled={
              page + 1 === getChunkedDataset().length ||
              getChunkedDataset()[page] === undefined
            }
            onClick={() => setPage(getChunkedDataset().length - 1)}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
        </div>
        <label className="mr-2">Show</label>
        <select
          className="custom-select"
          onChange={(e) => setItemsPerPage(e.target.value)}
          value={itemsPerPage}
        >
          {[5, 10, 25, 50, 100].map((el) => (
            <option value={el}>{el}</option>
          ))}
        </select>
      </div>
    </caption>
  );
};

export default Pagination;
