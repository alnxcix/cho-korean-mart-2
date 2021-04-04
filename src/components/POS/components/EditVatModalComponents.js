import $ from "jquery";

const EditVatModalComponents = (props) => {
  let { vatRate, setVatRate } = props;
  const updateVatRate = () => {
    window
      .require("electron")
      .remote.getGlobal("settings")
      .set("vatRate", Number(vatRate));
    $("#modalEditVAT").modal("hide");
  };
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
              <button className="close text-light" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>New VAT Rate:</label>
                <div className="input-group">
                  <input
                    className="form-control"
                    onChange={(e) => setVatRate(e.target.value)}
                    type="number"
                    value={vatRate}
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
                type="button"
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
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
