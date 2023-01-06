import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="navbar-container">
      <div>Code Search</div>
      {/* <Button
        style={{ textTransform: "none", color: "white", borderColor: "white" }}
        variant="outlined"
        className="button"
        onClick={handleOpen}
      >
        Add API Key
      </Button> */}

      {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add API Key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add your OpenAI API Key below. Navigate to{" "}
            <a href="https://beta.openai.com/account/api-keys">OpenAI</a> to get
            your API Key.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="API Key"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Add</Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
}
