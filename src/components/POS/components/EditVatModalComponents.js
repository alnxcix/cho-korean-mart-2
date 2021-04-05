import { useState } from "react";

const EditVatModalComponents = (props) => {
  let { vatRate, setVatRate } = props;
  const [newVatRate, setNewVatRate] = useState(vatRate);
  const reset = () => setNewVatRate(vatRate);
  const updateVatRate = () => setVatRate(newVatRate);
  return (
    <>
      <a
        className="badge badge-pill badge-dark mr-2"
        data-target="#modalEditVAT"
        data-toggle="modal"
        type="button"
      >
        Edit VAT
      </a>
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id="modalEditVAT"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#900" }}>
              <h5 className="modal-title text-light">Edit VAT Rate</h5>
              <button
                className="close text-light"
                data-dismiss="modal"
                onClick={() => reset()}
                type="button"
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>New VAT Rate:</label>
                <div className="input-group">
                  <input
                    className="form-control"
                    onChange={(e) => setNewVatRate(Number(e.target.value))}
                    type="number"
                    value={newVatRate}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
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
                data-dismiss="modal"
                disabled={vatRate === "" || vatRate < 0 || vatRate > 100}
                onClick={() => updateVatRate()}
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditVatModalComponents;
