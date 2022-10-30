import React, { useEffect, useState, useRef } from "react";
import { db } from "../../../configs/Firebase.config";
import { TextField } from "@mui/material";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Card, Input, Typography } from "@mui/material";
import Alert from "@mui/material";
import { QrReader } from "react-qr-reader";

import styled from "styled-components";

import Switch from "@mui/material/Switch";

import UserInfoCard from "./UserInfoCard";
const AdminPanelHead = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  background-color: #ffffff;

  color: black;
  position: relative;
`;
const UsersList = styled.div`
  width: 50%;
  height: 100%;
  overflow-y: scroll;
`;
const Scanner = styled.div``;

function AdminPannel() {
  const [RegistredPeople, setRegistredPeople] = useState([]);
  const [data, setData] = useState(null);
  const [qr, setqr] = useState("");
  const [scannedResult, setScanneresult] = useState("");
  const [checked, setChecked] = useState(false);
  const currentpaid = useRef(false);
  const [open, setOpen] = useState(false);

  const [load, setload] = useState(false);

  const qrRef = useRef(null);

  const handleError = (e) => {
    console.log(e);
  };

  const handleScan = (result) => {
    if (result) {
      setScanneresult(result);
    }
  };
  const onScanfile = () => {
    qrRef.current.openImageDialog();
  };
  const handleChange = (e) => {
    console.log(e.target.value);
    try {
      const docRef = doc(db, "RegisteredPeople", `${e.target.value}`);
      onSnapshot(docRef, (snapshot) => {
        setRegistredPeople([snapshot.data()]);
        setData(e.target.value);
      });
    } catch (e) {}
  };

  return (
    <AdminPanelHead>
      <UsersList>
        <h1
          style={{
            padding: "1.5rem",
          }}
        >
          Scan the Qr code{" "}
        </h1>
        {RegistredPeople[0] !== undefined && RegistredPeople.length > 0 && (
          <div>
            {RegistredPeople.map((data) => {
              return <UserInfoCard data={data} Scanpage />;
            })}
          </div>
        )}
      </UsersList>
      <TextField
        id="filled-search"
        label="Search field"
        type="search"
        variant="filled"
        onChange={handleChange}
      />

      <Scanner>
        <p
          style={{
            margin: "2rem",
          }}
        >
          scanned result : {data}
        </p>

        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              const res = result?.text.substr(54);
              console.log(res);

              try {
                const docRef = doc(db, "RegisteredPeople", `${res}`);
                onSnapshot(docRef, (snapshot) => {
                  setRegistredPeople([snapshot.data()]);
                  setData(res);
                });
              } catch (e) {
                toast.error("user not exist");
              }
            }

            if (!!error) {
              // console.info(error);
            }
          }}
          containerStyle={{ height: "400px", width: "500px" }}
        />
      </Scanner>
    </AdminPanelHead>
  );
}

export default AdminPannel;
