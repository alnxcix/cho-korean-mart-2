import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";

const DeleteTransactionModalComponents = (props) => {
  let { transaction, setTransactions } = props;
  return (
    <>
      <button
        className="btn btn-danger"
        data-target={`#modalDeleteTransaction${transaction._id}`}
        data-toggle="modal"
        title="Delete Transaction"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id={`modalDeleteTransaction${transaction._id}`}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#900" }}>
              <h5 className="modal-title text-light">Delete Transaction</h5>
              <button className="close text-light" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">Delete this transaction?</div>
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
                    .remote.getGlobal("transactions")
                    .delete(transaction)
                    .then(() => $("#transactionAlert1").slideDown())
                    .catch(() => $("#transactionAlert2").slideDown());
                  window
                    .require("electron")
                    .remote.getGlobal("transactions")
                    .readAll()
                    .then((transactions) => setTransactions(transactions));
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

export default DeleteTransactionModalComponents;
