import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import "./SearchPage.css";
import { fontFamily } from "@mui/system";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell width="1%">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row.class_name}</TableCell>
        <TableCell align="center">{row.func_name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {row.desc.map((descRow) => (
                    <TableRow key={descRow.id}>
                      <TableCell component="th" scope="row">
                        {descRow.name}
                      </TableCell>
                      <TableCell>{descRow.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number,
    class_name: PropTypes.string,
    func_name: PropTypes.string,
    desc: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        line_number: PropTypes.number,
      })
    ),
  }),
};

function createData(id, class_name, func_name, file_path, line_number) {
  return {
    id,
    class_name,
    func_name,
    desc: [
      {
        id: 1,
        name: "File Path",
        value: file_path,
      },
      {
        id: 2,
        name: "Line Number",
        value: line_number,
      },
    ],
  };
}

export default function SearchPage() {
  const baseURL = "localhost";

  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);

  const updateRows = (results) => {
    if (Object.keys(results).length > 0) {
      const new_rows = [];
      for (var i = 0; i < Object.keys(results).length; i++) {
        new_rows.push(
          createData(
            i,
            results[i]["class_name"],
            results[i]["function_name"].concat("()"),
            results[i]["filepath"],
            results[i]["line_number"]
          )
        );
      }

      setRows(new_rows);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    var bodyFormData = new FormData();
    bodyFormData.append("query", query);

    axios({
      method: "post",
      url: `http://${baseURL}:5000/search`,
      data: bodyFormData,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
      .then(function (response) {
        updateRows(response.data);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const handleQueryChange = (e) => {
    e.persist();
    setQuery(e.target.value);
  };

  const handleIndex = () => {
    setOpen(false);
    var bodyFormData = new FormData();
    bodyFormData.append("project_path", path);

    axios({
      method: "post",
      url: `http://${baseURL}:5000/encode`,
      data: bodyFormData,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const handlePathChange = (e) => {
    e.persist();
    setPath(e.target.value);
  };

  return (
    <div>
      <Navbar />
      <div className="search-container">
        <div className="searchbar">
          <TextField
            style={{ width: "500px" }}
            id="outlined"
            label="Search Query"
            defaultValue=""
            onChange={handleQueryChange}
          />
          <Button
            style={{ textTransform: "none" }}
            variant="contained"
            className="button"
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button
            style={{ textTransform: "none" }}
            variant="outlined"
            className="button"
            onClick={handleClickOpen}
          >
            Index Project
          </Button>
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Index a Project</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To index a new project or re-index an existing project, please
              enter the path to the project in the text field below.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Path to Project"
              type="text"
              fullWidth
              variant="standard"
              onChange={handlePathChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleIndex}>Index</Button>
          </DialogActions>
        </Dialog>

        {Object.keys(rows).length > 0 ? (
          <div className="results-container">
            <p className="results-title">Search Results</p>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell style={{ fontWeight: "bold" }} align="center">
                      Class Name
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="center">
                      Function Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <Row key={row.id} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div className="results-container" style={{ opacity: "0" }}>
            <p className="results-title">Search Results</p>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell style={{ fontWeight: "bold" }} align="center">
                      Class Name
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="center">
                      Function Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <Row key={row.id} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
}
