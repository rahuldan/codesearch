import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";

export default function ProjectDialog(props) {
  const {
    onClose,
    value: valueProp,
    options: options,
    getProjects: getProjects,
    baseURL: baseURL,
    open,
    ...other
  } = props;

  const [value, setValue] = useState(valueProp);
  const radioGroupRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
    console.log("Here");
  };

  const handleChange = (event) => {
    event.persist();
    console.log("event.target.value: ", event.target.value);
    setValue(event.target.value);
  };

  const handleDelete = () => {
    // event.persist();
    console.log("event.target.value: ", value);
    if (value == "None") {
      return;
    }

    var bodyFormData = new FormData();
    bodyFormData.append("url", value);

    axios({
      method: "delete",
      url: `http://${baseURL}:5000/delete`,
      data: bodyFormData,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
      .then(function (response) {
        console.log(response);
        setValue("None");
        getProjects();
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Project List</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="projects"
          name="projects"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete}>Delete</Button>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

ProjectDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};
