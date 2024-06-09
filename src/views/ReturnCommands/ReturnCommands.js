import React, {useEffect, useMemo, useState} from "react";
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
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import axios from "axios"
import ReactTable from "react-table-6" 
import "react-table-6/react-table.css"  
const useStyles = makeStyles(styles);

export default function Dashboard() {
  //
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`http://117.0.35.45:9989/returncmd`)
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.error(err));
  const interval = setInterval(() => {
    axios.get(`http://117.0.35.45:9989/returncmd`)
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.error(err));
  }, 5000); //set your time here. repeat every 5 seconds

  return () => clearInterval(interval);
}, []);
  //
  const classes = useStyles();
  const columns = useMemo(
    () =>[
      {
          Header: 'ID',  
          accessor: 'id',
          maxWidth: 60
      },
      {
          Header: 'Serial Number',  
          accessor: 'serialNo',
          minWidth: 120   
      },
      {
        Header: 'IMEI',  
        accessor: 'IMEI',
        minWidth: 120   
      },
      {
        Header: 'Created at',  
        accessor: 'createdAt',
        Cell: ( props ) => {
          // return <div>{props.original.reportTime}</div>
          if((props.original.createdAt == null)||(props.original.createdAt == ""))
          return <div>-</div>
          else
          return <div>{new Intl.DateTimeFormat('vi-VN', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(props.original.createdAt)}</div>
         }
      },
      {
        Header: 'Meter Reading (L)',  
        accessor: 'meterReading'  
      },
      {
        Header: 'RSRP (dBm)',  
        accessor: 'rsrp',
        Cell: (props) => {
          return <div>{props.original.rsrp/10}</div>
        } 
      },
      {
        Header: 'SNR (dB)',  
        accessor: 'snr',
        Cell: (props) => {
            return <div>{props.original.snr/10}</div>
        }  
      },
      {
        Header: 'Voltage (V)',  
        accessor: 'voltage', 
        Cell: (props) => {
            return <div>{props.original.voltage/100.00}</div>
        }  
      },
      {
        Header: 'Report period (min)',  
        accessor: 'reportPeriod',
        Cell: (props) => {
            return <div>{props.original.reportPeriod/60}</div>
        }  
      },
      {
        Header: 'Pulse constant (L/P)',  
        accessor: 'pulseConstant',
        Cell: (props) => {
          if(props.original.pulseConstant == "0")
          {
            return <div>Direct reading meter</div>
          }
          else if(props.original.pulseConstant == "1")
          {
            return <div>1</div>
          }
          else if(props.original.pulseConstant == "2")
          {
            return <div>10</div>
          }
          else if(props.original.pulseConstant == "3")
          {
            return <div>100</div>
          }
          else if(props.original.pulseConstant == "4")
          {
            return <div>1000</div>
          }
          else
          {
            return <div>-</div>
          }
        }
      },
      {
        Header: 'Valve Status',  
        accessor: 'valveStatus',
        Cell: (props) => {
          if(props.original.valveStatus == "0")
          {
            return <div>Open</div>
          }
          else if(props.original.pulseConstant == "1")
          {
            return <div>Close</div>
          }
          else if(props.original.pulseConstant == "3")
          {
            return <div>Is moving</div>
          }
          else
          {
            return <div>-</div>
          }
        }
      },
      {
        Header: 'Abnormal alarm',  
        Cell: ( props ) => {
            return <div>{props.original['/82/0']}</div>
           }
      }
    ] 
   )
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Data</h4>
            </CardHeader>
            <CardBody>
              {/* <Table
                tableHeaderColor="primary"
                tableHead={["ID", "Serial number", "IMEI", "Created at", "Meter reading (L)", "RSRP (dBm)", "SNR (dB)", "Voltage", "Report period (min)", "Pulse constant (L/P)", "Valve Status", "Abnormal alarm"]}
                tableData = {data.map((item) => [
                  item.id,
                  item.serialNo,
                  item.IMEI,
                  new Intl.DateTimeFormat('vi-VN', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(item.createdAt),
                  item.meterReading,
                  item.rsrp/10,
                  item.snr/10,
                  item.voltage/100.00,
                  item.reportPeriod/60,
                  item.pulseConstant,
                  item.valveStatus,
                  item['/82/0']
                ])}
              /> */}
              <ReactTable  
                  // data={(selectedDev === "") ? (data) : (data.filter(function (item) {return item.serialNo === selectedDev}))}  
                  data={(data != null) ? (data) : ([])}
                  columns={columns}  
                  defaultPageSize = {20}  
                  pageSizeOptions = {[10, 20, 50, 100]}  
                  className="-striped -highlight"
              /> 
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
