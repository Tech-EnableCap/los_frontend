import React from "react";

import Modal from "./modal";

const Err = (props) => {
  console.log(props.error);
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      onCancel={props.cancel}
      footer={<button onClick={props.onClear}>Okay</button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default Err;
