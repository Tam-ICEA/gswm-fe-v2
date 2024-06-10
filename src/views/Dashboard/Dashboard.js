import React, { useEffect, useMemo, useState } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Devices from "@material-ui/icons/Watch";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
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
import BatteryGauge from "react-battery-gauge";
import ProgressBar from "@ramonak/react-progress-bar";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import Modal from "@material-ui/core/Modal";
import Box from "@material-ui/core/Box";
import { Button } from "react-bootstrap";
import { apiGetDevicesInformation } from "services/CoreService";
const useStyles = makeStyles(styles);

export default function Dashboard() {
  //
  const [deviceList, setDeviceList] = useState([]);
  const fetchData = async () => {
    try {
      const res = await apiGetDevicesInformation();
      setDeviceList(res.data?.data);
    } catch(err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  //
  const classes = useStyles();
  const columns = useMemo(() => [
    {
      Header: "ID",
      accessor: "id",
      maxWidth: 60,
    },
    {
      Header: "Device name",
      accessor: "device_name",
    },
    {
      Header: "Serial Number",
      accessor: "serial_no",
      minWidth: 120,
    },
    {
      Header: "Status",
      accessor: "/84/0",
      Cell: (props) => {
        let info = JSON.parse(props.original["/84/0"]);
        if (info == null) {
          return <div>-</div>;
        } else {
          if (
            (Number(Date.now()) - Number(props.original.last_seen_at)) / 1000 <=
            Number(info.reportPeriod) + 60
          ) {
            return (
              <div style={{ color: "green", fontWeight: "bold" }}>ONLINE</div>
            );
          } else {
            return (
              <div style={{ color: "red", fontWeight: "bold" }}>OFFLINE</div>
            );
          }
        }
      },
    },
    {
      Header: "Meter reading (m3)",
      accessor: "meter_reading",
      Cell: (props) => {
        return <div>{props.original.meter_reading / 1000.0}</div>;
      },
    },
    {
      Header: "denseData_startCollectionTime",
      accessor: "denseData_startCollectionTime",
      Cell: (props) => {
        return <div>{props.original.denseData_startCollectionTime}</div>;
      },
    },
    {
      Header: "denseData_startFlowPulseNumber",
      accessor: "denseData_startFlowPulseNumber",
      Cell: (props) => {
        return <div>{props.original.denseData_startFlowPulseNumber}</div>;
      },
    },
    {
      Header: "denseData_diffirenceOfTheFlowPulseNumber",
      accessor: "denseData_diffirenceOfTheFlowPulseNumber",
      Cell: (props) => {
        if (props.original.denseData_diffirenceOfTheFlowPulseNumber != null) {
          return (
            <div>
              {props.original.denseData_diffirenceOfTheFlowPulseNumber.toString()}
            </div>
          );
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      Header: "Pulse constant (L/P)",
      accessor: "pulse_constant",
      // let info = JSON.parse(props.original['/82/0']);
      Cell: (props) => {
        if (props.original.pn == "0") {
          return <div>Direct reading meter</div>;
        } else if (props.original.pn == "1") {
          return <div>1</div>;
        } else if (props.original.pn == "2") {
          return <div>10</div>;
        } else if (props.original.pn == "3") {
          return <div>100</div>;
        } else if (props.original.pn == "4") {
          return <div>1000</div>;
        } else if (props.original.pn == "9") {
          return <div>3</div>;
        } else if (props.original.pn == "10") {
          return <div>30</div>;
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      Header: "Alarm Status",
      accessor: "/82/0",
      Cell: (props) => {
        let info = JSON.parse(props.original["/82/0"]);
        let magneticAttackStatus = false;
        let antiDemolitionStatus = false;
        if (info.magneticAttackStatus == "1") {
          magneticAttackStatus = true;
        } else {
          magneticAttackStatus = false;
        }
        if (info.antiDemolition == "1") {
          antiDemolitionStatus = true;
        } else {
          antiDemolitionStatus = false;
        }
        // let info = JSON.parse(props.original['/82/0']);
        if ((magneticAttackStatus || antiDemolitionStatus) == true) {
          return <div style={{ color: "red", fontWeight: "bold" }}>1</div>;
        } else {
          return <div>0</div>;
        }
      },
    },
    {
      Header: "Happened Alarm",
      accessor: "/82/0",
      Cell: (props) => {
        let info = JSON.parse(props.original["/82/0"]);
        let happenedMagneticAttackStatus = false;
        let happenedAntiDemolitionStatus = false;
        if (info.happenedMagneticAttack == "1") {
          happenedMagneticAttackStatus = true;
        } else {
          happenedMagneticAttackStatus = false;
        }
        if (info.happenedAntiDemolition == "1") {
          happenedAntiDemolitionStatus = true;
        } else {
          happenedAntiDemolitionStatus = false;
        }
        // let info = JSON.parse(props.original['/82/0']);
        // return <div>{(happenedMagneticAttackStatus || happenedAntiDemolitionStatus).toString()}</div>
        if (
          (happenedMagneticAttackStatus || happenedAntiDemolitionStatus) == true
        ) {
          return <div style={{ color: "red", fontWeight: "bold" }}>1</div>;
        } else {
          return <div>0</div>;
        }
      },
    },
    // {
    //     Header: 'IMEI',
    //     accessor: 'IMEI'
    // },

    // <LinearProgress variant="determinate" value={normalise(props.value)} />
    {
      Header: "RSRP (dBm)",
      accessor: "/99/0",
      Cell: (props) => {
        // return <div>{props.original.rsrp/10}</div>
        let info = JSON.parse(props.original["/99/0"]);
        if (info == null) {
          return <div>-</div>;
        }
        let rsrp = info.rsrp;
        if (Number(rsrp / 10) >= -100) {
          return (
            <div>
              <ProgressBar
                customLabel={Number(rsrp / 10).toString()}
                completed={(Number(rsrp / 10) + 100) / 3 + 80}
                bgColor="green"
                labelAlignment="left"
              />
            </div>
          );
        }

        if (Number(rsrp / 10) >= -110 && Number(rsrp / 10) < -100) {
          return (
            <div>
              <ProgressBar
                customLabel={Number(rsrp / 10)}
                completed={3 * (Number(rsrp / 10) + 110) + 50}
                bgColor="#ffc107"
                labelAlignment="left"
              />
            </div>
          );
        }
        if (Number(rsrp / 10) <= -110) {
          return (
            <div>
              <ProgressBar
                customLabel={Number(rsrp / 10)}
                completed={Number(rsrp / 10) + 160}
                bgColor="red"
                labelAlignment="left"
              />
            </div>
          );
        }
      },
    },
    {
      Header: "Remaining battery capacity (%)",
      accessor: "voltage",
      Cell: (props) => {
        // return <div>{props.original.voltage/100.00}</div>
        if (props.original.voltage == null || props.original.voltage == "")
          return <div>-</div>;
        else {
          let remainingBatCap =
            ((8500 * 1000 -
              ((props.original.last_seen_at - props.original.install_time) *
                30) /
                (3600 * 1000) -
              props.original.number_of_updates * 1394.52) /
              (8500 * 1000)) *
            100;
          return (
            <div>
              <BatteryGauge
                value={remainingBatCap}
                size={50}
                customization={{ readingText: { fontSize: 24 } }}
              />
            </div>
          );
        }
      },
    },
    {
      Header: "Last seen",
      accessor: "last_seen_at",
      Cell: (props) => {
        // return <div>{props.original.reportTime}</div>
        if (
          props.original.last_seen_at == null ||
          props.original.last_seen_at == ""
        )
          return <div>-</div>;
        else
          return (
            <div>
              {new Intl.DateTimeFormat("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(props.original.last_seen_at)}
            </div>
          );
      },
    },
    {
      Header: "Voltage (V)",
      accessor: "voltage",
      Cell: (props) => {
        return <div>{props.original.voltage / 100.0}</div>;
      },
    },
    {
      Header: "Number of updates",
      accessor: "number_of_updates",
    },
  ]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [detail, setDetail] = useState({});
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
            width: "50%",
            height: "50%",
            overflow: "hidden",
            overflowY: "scroll", // added scroll
          }}
        >
          <h2 id="child-modal-title">Detail</h2>
          <p style={{ fontWeight: "bold" }}>pn:/3/0</p>
          <p style={{ wordWrap: "break-word" }}>{detail["/3/0"]}</p>
          <p style={{ fontWeight: "bold" }}>pn:/70/0</p>
          <p style={{ wordWrap: "break-word" }}>{detail["/70/0"]}</p>
          <p style={{ fontWeight: "bold" }}>pn:/80/0</p>
          <p style={{ wordWrap: "break-word" }}>{detail["/80/0"]}</p>
          <p style={{ fontWeight: "bold" }}>pn:/81/0</p>
          <p style={{ wordWrap: "break-word" }}>{detail["/81/0"]}</p>
          <p style={{ fontWeight: "bold" }}>pn:/82/0</p>
          <p style={{ wordWrap: "break-word" }}>{detail["/82/0"]}</p>
          <p style={{ fontWeight: "bold" }}>pn:/84/0</p>
          <p style={{ wordWrap: "break-word" }}>{detail["/84/0"]}</p>
          <p style={{ fontWeight: "bold" }}>pn:/99/0</p>
          <p style={{ wordWrap: "break-word" }}>{detail["/99/0"]}</p>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Devices />
              </CardIcon>
              <p className={classes.cardCategory}>Number of devices</p>
              <h3 className={classes.cardTitle}>{deviceList.length}</h3>
            </CardHeader>
            <CardFooter stats></CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Devices />
              </CardIcon>
              <p className={classes.cardCategory}>Number of devices online</p>
              <h3 className={classes.cardTitle}>
                {
                  deviceList?.filter(function (item) {
                    return (
                      (Number(Date.now()) - Number(item.last_seen_at)) / 1000 <=
                      Number(JSON.parse(item["/84/0"]).reportPeriod) + 60
                    );
                  }).length
                }
              </h3>
            </CardHeader>
            <CardFooter stats></CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Devices />
              </CardIcon>
              <p className={classes.cardCategory}>Number of devices offline</p>
              <h3 className={classes.cardTitle}>
                {
                  deviceList?.filter(function (item) {
                    return (
                      (Number(Date.now()) - Number(item.last_seen_at)) / 1000 >
                      Number(JSON.parse(item["/84/0"]).reportPeriod) + 60
                    );
                  }).length
                }
              </h3>
            </CardHeader>
            <CardFooter stats>
              {/* <div className={classes.stats}>
                <Update />
                Just Updated
              </div> */}
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="info">
              <ChartistGraph
                className="ct-chart"
                data={{
                  series: [
                    deviceList?.filter(function (item) {
                      return (
                        (Number(Date.now()) - Number(item.last_seen_at)) /
                          1000 <=
                        Number(JSON.parse(item["/84/0"]).reportPeriod) + 60
                      );
                    }).length,
                    deviceList?.filter(function (item) {
                      return (
                        (Number(Date.now()) - Number(item.last_seen_at)) /
                          1000 >
                        Number(JSON.parse(item["/84/0"]).reportPeriod) + 60
                      );
                    }).length,
                  ],

                  labels: [
                    "Online: " +
                      deviceList?.filter(function (item) {
                        return (
                          (Number(Date.now()) - Number(item.last_seen_at)) /
                            1000 <=
                          Number(JSON.parse(item["/84/0"]).reportPeriod) + 60
                        );
                      }).length,
                    "Offline: " +
                      deviceList?.filter(function (item) {
                        return (
                          (Number(Date.now()) - Number(item.last_seen_at)) /
                            1000 >
                          Number(JSON.parse(item["/84/0"]).reportPeriod) + 60
                        );
                      }).length,
                  ],
                }}
                type="Pie"

                // options={dailySalesChart.options}
                // listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Status of the devices</h4>
              {/* <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                increase in today sales.
              </p> */}
            </CardBody>
            <CardFooter chart>
              {/* <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div> */}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="info">
              <ChartistGraph
                className="ct-chart"
                data={{
                  series: [deviceList.map((item) => item.meter_reading / 1000)],
                  labels: deviceList.map((item) => item.serial_no),
                  // labels: ["016", "017", "018", "019", "020"]
                }}
                type="Bar"
                options={{
                  options: {
                    low: 0,
                    high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                    chartPadding: {
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    },
                  },
                }}
                responsiveOptions={{
                  responsiveOptions: [
                    [
                      "screen and (max-width: 640px)",
                      {
                        seriesBarDistance: 5,
                        axisX: {
                          labelInterpolationFnc: function (value) {
                            return value[0];
                          },
                        },
                      },
                    ],
                  ],
                }}
                // options={emailsSubscriptionChart.options}
                // responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                // listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Cummulative flow</h4>
              {/* <p className={classes.cardCategory}>Last Campaign Performance</p> */}
            </CardBody>
            <CardFooter chart>
              {/* <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div> */}
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>List of devices</h4>
            </CardHeader>
            <CardBody>
              <ReactTable
                // data={(selectedDev === "") ? (items) : (items.filter(function (item) {return item.serialNo === selectedDev}))}
                data={deviceList}
                columns={columns}
                defaultPageSize={20}
                pageSizeOptions={[10, 20, 50, 100]}
                //   style={{
                //     height: "100%", // This will force the table body to overflow and scroll, since there is not enough room
                //     contain: "none"

                //   }}
                className="-striped -highlight"
                getTrProps={(state, rowInfo, column, instance) => {
                  return {
                    onClick: (e) => {
                      console.log(rowInfo.original.id);
                      if (rowInfo.original != null) {
                        setDetail({
                          "/3/0": rowInfo.original["/3/0"],
                          "/70/0": rowInfo.original["/70/0"],
                          "/80/0": rowInfo.original["/80/0"],
                          "/81/0": rowInfo.original["/81/0"],
                          "/82/0": rowInfo.original["/82/0"],
                          "/84/0": rowInfo.original["/84/0"],
                          "/99/0": rowInfo.original["/99/0"],
                        });
                      }

                      setOpen(true);
                      console.log(detail);
                    },
                  };
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
