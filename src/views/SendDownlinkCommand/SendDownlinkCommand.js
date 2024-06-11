import React, { useEffect, useMemo, useState } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { bugs, website, server } from "variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import axios from "axios";
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select, { SelectChangeEvent } from "@material-ui/core/Select";
import { Button } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import moment from "moment";
import { apiGetLinkDown } from "services/CoreService";
import { apiGetDevicesInformation } from "services/CoreService";
import { apiCreateLinkDown } from "services/CoreService";
import { apiGetUserInfo } from "services/CoreService";
import { useLocation } from "react-router-dom";
import { showSuccessAlert } from "helper";
import { showErrorAlert } from "helper";
import { showWarning } from "helper";
const useStyles = makeStyles(styles);
export default function Dashboard() {
  //
  const [deviceList, setDeviceList] = useState([]);
  const [historicalCmd, setHistoricalCmd] = useState([]);
  const [imei, setImei] = useState("");
  const [cmd, setCmd] = useState("");
  const [meterReading, setMeterReading] = useState("0");
  const [pulseConstant, setPulseConstant] = useState("1");
  const [notification, setNotification] = useState("");
  const [user, setUser] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const role = query.get("role");
  const serial_no = query.get("sn");

  const isAdmin = role == "0101915236@@GBS@@";

  const fetchDevices = async () => {
    try {
      const res = await apiGetDevicesInformation({ page: 1, size: 1000 });
      setDeviceList(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await apiGetUserInfo();
      setUser(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSendLinkDown = async () => {
    try {
      const res = await apiGetLinkDown({ page: 1, size: 1000 });
      setHistoricalCmd(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // fetchUserInfo();
    fetchDevices();
    fetchSendLinkDown();
  }, []);

  useEffect(() => {
    console.log("Chạy vào đâyyyyy");
    setSelectedDevice(
      deviceList?.find((item) => item?.serial_no === serial_no)
    );
  }, [serial_no, deviceList?.length]);

  console.log("seletedDevice:::", selectedDevice);

  //
  const classes = useStyles();
  const columns = useMemo(() => [
    {
      Header: "ID",
      accessor: "id",
      maxWidth: 60,
    },
    {
      Header: "Status",
      accessor: "is_sent",
      Cell: (props) => {
        if (props.original.is_sent == 1) {
          return <div>Sent</div>;
        } else {
          return <div style={{ backgroundColor: "lightyellow" }}>Unsent</div>;
        }
      },
    },
    {
      Header: "Serial number",
      accessor: "serial_no",
      Cell: (props) => {
        return (
          <div>
            {props.original.imei != null
              ? deviceList.filter(function (item) {
                  return props.original.imei == item.imei;
                })[0]?.serial_no
              : ""}
          </div>
        );
      },
    },
    {
      Header: "imei",
      accessor: "imei",
    },
    {
      Header: "Created at",
      accessor: "created_at",
      Cell: (props) => {
        // return <div>{props.original.reportTime}</div>
        return (
          <div>
            {moment(props.original.created_at).format("DD/MM/YYYY HH:mm")}
          </div>
        );
      },
    },
    {
      Header: "Command",
      accessor: "cmd",
    },
  ]);
  let handleSendCmd = async (e) => {
    e.preventDefault();
    // if(/^\d+$/.test(meterReading))
    if (!selectedDevice?.imei) {
      showWarning(
        "Send link command",
        "Please select a device before sending the command!"
      );
      return;
    }
    try {
      console.log(JSON.stringify({ imei: selectedDevice?.imei, cmd: cmd }));
      const res = await apiCreateLinkDown({
        imei: selectedDevice?.imei,
        cmd: cmd,
      });
      if (res?.data.status === 200) {
        showSuccessAlert(
          "Send link command",
          "The command has been written to the cache!"
        );
        fetchSendLinkDown();
      } else {
        showErrorAlert("Send link command", "An error occourred!");
      }
    } catch (err) {
      showErrorAlert("Send link command", "An error occourred: " + err);
    }
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleShowError = () => {
    showWarning(
      "Send link command",
      "This function is exclusive to the manufacturer!"
    );
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "10px",
          }}
        >
          <h2 id="child-modal-title">Notification</h2>
          <p id="child-modal-description">{notification}</p>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info" stats icon>
              <p className={classes.cardCategory}>Device number</p>
            </CardHeader>
            <CardBody>
              <FormControl fullWidth>
                {!selectedDevice && (
                  <InputLabel id="demo-simple-select-label">
                    Serial number
                  </InputLabel>
                )}
                <Select
                  value={selectedDevice}
                  label="Serial number"
                  onChange={(e) => setSelectedDevice(e.target.value)}
                >
                  {deviceList?.map((dev) => (
                    <MenuItem value={dev}>
                      {dev.serial_no} - {dev.device_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader>
              <p>Meter reading (L)</p>
            </CardHeader>
            <CardBody>
              <FormControl
                fullWidth
                onChange={(e) => setCmd({ setMeterReading: e.target.value })}
              >
                <TextField inputProps={{ type: "number" }} />
              </FormControl>
            </CardBody>
            <CardFooter>
              <Button onClick={handleSendCmd}>Send</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <p>Repord period</p>
            </CardHeader>
            <CardBody>
              <FormControl fullWidth>
                <Select
                  label="Repord period"
                  onChange={(e) => setCmd({ setReportPeriod: e.target.value })}
                >
                  <MenuItem value="5">5 minutes</MenuItem>
                  <MenuItem value="10">10 minutes</MenuItem>
                  <MenuItem value="15">15 minutes</MenuItem>
                  <MenuItem value="30">30 minutes</MenuItem>
                  <MenuItem value="60">1 hour</MenuItem>
                  <MenuItem value="720">12 hours</MenuItem>
                  <MenuItem value="1440">1 day</MenuItem>
                </Select>
              </FormControl>
            </CardBody>
            <CardFooter>
              <Button onClick={isAdmin ? handleSendCmd : handleShowError}>
                Send
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <p>Valve control</p>
            </CardHeader>
            <CardBody>
              <FormControl fullWidth>
                <Select
                  label="Valve control"
                  onChange={(e) => setCmd({ setValveControl: e.target.value })}
                >
                  <MenuItem value="0">Open</MenuItem>
                  <MenuItem value="1">Close</MenuItem>
                </Select>
              </FormControl>
            </CardBody>
            <CardFooter>
              <Button onClick={isAdmin ? handleSendCmd : handleShowError}>
                Send
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader>
              <p>Dense data cycle</p>
            </CardHeader>
            <CardBody>
              <FormControl fullWidth>
                <Select
                  label="Dense data cycle"
                  onChange={(e) =>
                    setCmd({ setDenseDataCycle: e.target.value })
                  }
                >
                  <MenuItem value="1">1 minute</MenuItem>
                  <MenuItem value="5">5 minutes</MenuItem>
                  <MenuItem value="15">15 minutes</MenuItem>
                  <MenuItem value="30">30 minutes</MenuItem>
                  <MenuItem value="60">1 hour</MenuItem>
                  <MenuItem value="720">12 hours</MenuItem>
                  <MenuItem value="1440">1 day</MenuItem>
                </Select>
              </FormControl>
            </CardBody>
            <CardFooter>
              <Button onClick={isAdmin ? handleSendCmd : handleShowError}>
                Send
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <p>Pulse constant</p>
            </CardHeader>
            <CardBody>
              <FormControl fullWidth>
                <Select
                  label="Pulse constant"
                  onChange={(e) => setCmd({ setPulseConstant: e.target.value })}
                >
                  <MenuItem value="1">1L/P</MenuItem>
                  <MenuItem value="2">10L/P</MenuItem>
                  <MenuItem value="3">100L/P</MenuItem>
                  <MenuItem value="4">1000L/P</MenuItem>
                  <MenuItem value="5">0.5L/P</MenuItem>
                  <MenuItem value="6">5L/P</MenuItem>
                  <MenuItem value="9">3L/P</MenuItem>
                  <MenuItem value="10">30L/P</MenuItem>
                </Select>
              </FormControl>
            </CardBody>
            <CardFooter>
              <Button onClick={isAdmin ? handleSendCmd : handleShowError}>
                Send
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <p>Server address</p>
            </CardHeader>
            <CardBody>
              <FormControl fullWidth>
                <TextField inputProps={{ type: "text" }} />
              </FormControl>
            </CardBody>
            <CardFooter>
              <Button>Send</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Historical commands</h4>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={historicalCmd}
                columns={columns}
                defaultPageSize={10}
                pageSizeOptions={[10, 20, 50, 100]}
                style={{
                  height: "500px", // This will force the table body to overflow and scroll, since there is not enough room
                  marginTop: "10px",
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
