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
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import moment from "moment";
import { apiGetReturnCmd } from "services/CoreService";
const useStyles = makeStyles(styles);

export default function Dashboard() {
  //
  const [data, setData] = useState([]);

  const fetchReturnCmd = async () => {
    try {
      const res = await apiGetReturnCmd({ page: 1, size: 1000 });
      setData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchReturnCmd();
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
      Header: "Serial Number",
      accessor: "serial_no",
      minWidth: 120,
    },
    {
      Header: "IMEI",
      accessor: "IMEI",
      minWidth: 120,
    },
    {
      Header: "Created at",
      accessor: "created_at",
      Cell: (props) => {
        // return <div>{props.original.reportTime}</div>
        if (
          props.original.created_at == null ||
          props.original.created_at == ""
        )
          return <div>-</div>;
        else
          return (
            <div>
              {moment(props.original.created_at)?.format("DD/MM/YYYY HH:mm")}
            </div>
          );
      },
    },
    {
      Header: "Meter Reading (L)",
      accessor: "meterReading",
    },
    {
      Header: "RSRP (dBm)",
      accessor: "rsrp",
      Cell: (props) => {
        return <div>{props.original.rsrp / 10}</div>;
      },
    },
    {
      Header: "SNR (dB)",
      accessor: "snr",
      Cell: (props) => {
        return <div>{props.original.snr / 10}</div>;
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
      Header: "Report period (min)",
      accessor: "report_period",
      Cell: (props) => {
        return <div>{props.original.report_period / 60}</div>;
      },
    },
    {
      Header: "Pulse constant (L/P)",
      accessor: "pulse_constant",
      Cell: (props) => {
        if (props.original.pulse_constant == "0") {
          return <div>Direct reading meter</div>;
        } else if (props.original.pulse_constant == "1") {
          return <div>1</div>;
        } else if (props.original.pulse_constant == "2") {
          return <div>10</div>;
        } else if (props.original.pulse_constant == "3") {
          return <div>100</div>;
        } else if (props.original.pulse_constant == "4") {
          return <div>1000</div>;
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      Header: "Valve Status",
      accessor: "valve_status",
      Cell: (props) => {
        if (props.original.valve_status == "0") {
          return <div>Open</div>;
        } else if (props.original.pulse_constant == "1") {
          return <div>Close</div>;
        } else if (props.original.pulse_constant == "3") {
          return <div>Is moving</div>;
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      Header: "Abnormal alarm",
      Cell: (props) => {
        return <div>{props.original["/82/0"]}</div>;
      },
    },
  ]);
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Data</h4>
            </CardHeader>
            <CardBody>
              <ReactTable
                // data={(selectedDev === "") ? (data) : (data.filter(function (item) {return item.serialNo === selectedDev}))}
                data={data != null ? data : []}
                columns={columns}
                defaultPageSize={20}
                pageSizeOptions={[10, 20, 50, 100]}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
