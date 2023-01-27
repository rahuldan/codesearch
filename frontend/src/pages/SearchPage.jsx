import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";

import Navbar from "../components/Navbar";
import ProjectDialog from "../components/ProjectDialog";
import ResultsTable from "../components/ResultsTable";
import "./SearchPage.css";

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

  const [openDialog, setOpenDialog] = useState(false);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [project, setProject] = useState("None");
  const [urlValue, setUrlValue] = useState("");
  const [loadingbar, setLoadingbar] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [options, setOptions] = useState(["None"]);

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    if (project != "None") {
      if (typeof project !== "undefined") {
        setUrlValue(project);
      }
    }
  }, [project]);

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
    getProjects();
  };

  const handleCloseDialog = (newValue) => {
    setOpenDialog(false);

    if (newValue) {
      setProject(newValue);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const actionAlert = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseAlert}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleSearch = () => {
    var bodyFormData = new FormData();

    bodyFormData.append("query", query);
    bodyFormData.append("url", urlValue);

    if (urlValue.length == 0 || query.length == 0) {
      setOpenAlert(true);
      return;
    }

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
    e.persist(); // Remove this if not needed
    setQuery(e.target.value);
  };

  const handleURLChange = (e) => {
    // e.persist();
    if (typeof e.target.value !== "undefined") {
      setUrlValue(e.target.value);
    }
  };

  const handleIndex = () => {
    setOpenDialog(false);
    var bodyFormData = new FormData();
    bodyFormData.append("url", urlValue);

    if (urlValue.length == 0) {
      setOpenAlert(true);
      return;
    }

    setLoadingbar(true);

    axios({
      method: "post",
      url: `http://${baseURL}:5000/encode`,
      data: bodyFormData,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
      .then(function (response) {
        setLoadingbar(false);
      })
      .catch(function (response) {
        console.log(response);
        setLoadingbar(false);
      });
  };

  const getProjects = () => {
    axios({
      method: "get",
      url: `http://${baseURL}:5000/`,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
      .then(function (response) {
        var newOptions = ["None"];
        var dictKey = Object.keys(response.data);

        for (var i = 0; i < dictKey.length; i++) {
          newOptions.push(response.data[dictKey[i]]);
        }
        setOptions(newOptions);
      })
      .catch(function (response) {
        console.log(response);
      });
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
          <div className="searchbar-index">
            <TextField
              style={{ width: "342px" }} // This odd width value is to accomodate for the column padding of 8px
              id="outlined"
              label="Github Repo URL or Local Repo Path"
              defaultValue=""
              onChange={handleURLChange}
              required={true}
              value={urlValue}
            />
            <Button
              style={{ textTransform: "none", width: "150px" }}
              variant="outlined"
              className="button"
              onClick={handleIndex}
            >
              Index Project
            </Button>
          </div>
          <div className="searchbar-button">
            <Button
              style={{ textTransform: "none", width: "150px" }}
              variant="contained"
              className="button"
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button
              style={{ textTransform: "none", width: "150px" }}
              variant="outlined"
              className="button"
              onClick={handleOpenDialog}
            >
              Select Project
            </Button>
          </div>
        </div>

        <ProjectDialog
          id="project-menu"
          keepMounted
          open={openDialog}
          onClose={handleCloseDialog}
          value={project}
          options={options}
          getProjects={getProjects}
          baseURL={baseURL}
        />

        {loadingbar == true ? (
          <div className="loadingbar">
            <LinearProgress style={{ width: "100%" }} />
          </div>
        ) : (
          <div></div>
        )}

        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          message="Input not specified"
          action={actionAlert}
        />

        {Object.keys(rows).length > 0 ? (
          <ResultsTable rows={rows} opacity="1" />
        ) : (
          <ResultsTable rows={rows} opacity="0" />
        )}
      </div>
    </div>
  );
}
