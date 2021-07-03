import React from "react";

import Modal from "./modal";
import Button from './button';

const Err = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      onCancel={props.cancel}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default Err;
