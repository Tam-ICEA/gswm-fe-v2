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
import Modal from "@material-ui/core/Modal"
import Box from "@material-ui/core/Box"
import { Button } from "react-bootstrap";
import moment from "moment";
const useStyles = makeStyles(styles);

// import moment from 'moment'

export default function Dashboard() {
  //
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8086/api/original-data/search`)
      .then(res => {
        setData(res.data?.data);
      })
      .catch(err => console.error(err));
  const interval = setInterval(() => {
    axios.get(`http://localhost:8086/api/original-data/search`)
      .then(res => {
        setData(res.data?.data);
      })
      .catch(err => console.error(err));
  }, 8000); //set your time here. repeat every 5 seconds

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
          accessor: 'serial_no',
          minWidth: 120   
      },
      {
        Header: 'Created at',  
        accessor: 'created_at',
        Cell: ( props ) => {
          // return <div>{props.original.reportTime}</div>
          if((props.original.created_at == null)||(props.original.created_at == ""))
          return <div>-</div>
          else
          return <div>{moment(props.original.created_at).format('DD/MM/YYYY HH:mm')}</div>
         }
      },
      {
        Header: 'Meter reading (m3)',  
        accessor: 'meter_reading',
        Cell: (props) => {
          return <div>{props.original.meter_reading/1000.000}</div>
        }  
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
        Header: 'magnetic_attack_status',  
        accessor: '/82/0',
        Cell: (props) => {
            let info = JSON.parse(props.original['/82/0']);
            return <div>{info.magneticAttackStatus}</div>
        }  
      },
      {
        Header: 'happenedMagneticAttack',  
        accessor: '/82/0',
        Cell: (props) => {
            let info = JSON.parse(props.original['/82/0']);
            return <div>{info.happenedMagneticAttack}</div>
        }  
      },
      {
        Header: 'antiDemolition',  
        accessor: '/82/0',
        Cell: (props) => {
            let info = JSON.parse(props.original['/82/0']);
            return <div>{info.antiDemolition}</div>
        }  
      },
      {
        Header: 'happenedAntiDemolition',  
        accessor: '/82/0',
        Cell: (props) => {
            let info = JSON.parse(props.original['/82/0']);
            return <div>{info.happenedAntiDemolition}</div>
        }  
      },
      {
        Header: 'Report period (min)',  
        accessor: 'reportPeriod',
        Cell: (props) => {
            return <div>{props.original.report_period/60}</div>
        }  
      },
      {
        Header: 'Pulse constant (L/P)',  
        accessor: 'pulseConstant',
        Cell: (props) => {
          if(props.original.pulse_constant == "0")
          {
            return <div>Direct reading meter</div>
          }
          else if(props.original.pulse_constant == "1")
          {
            return <div>1</div>
          }
          else if(props.original.pulse_constant == "2")
          {
            return <div>10</div>
          }
          else if(props.original.pulse_constant == "3")
          {
            return <div>100</div>
          }
          else if(props.original.pulse_constant == "4")
          {
            return <div>1000</div>
          }
          else
          {
            return <div>-</div>
          }
        }
      },
      // {
      //   Header: 'Valve Status',  
      //   accessor: 'valveStatus',
      //   Cell: (props) => {
      //     if(props.original.valveStatus == "0")
      //     {
      //       return <div>Open</div>
      //     }
      //     else if(props.original.pulseConstant == "1")
      //     {
      //       return <div>Close</div>
      //     }
      //     else if(props.original.pulseConstant == "3")
      //     {
      //       return <div>Is moving</div>
      //     }
      //     else
      //     {
      //       return <div>-</div>
      //     }
      //   }
      // },
      {
        Header: 'Abnormal alarm',  
        Cell: ( props ) => {
            return <div>{props.original['/82/0']}</div>
           }
      }
    ] 
   )
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
        <Box style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: "white",
          padding: "10px",
          width: "50%",
          height: "50%",
          overflow: "hidden",
          overflowY: "scroll" // added scroll
        }}>
          <h2 id="child-modal-title">Detail</h2>
          <p style={{fontWeight: "bold"}}>pn:/3/0</p>
          <p style={{wordWrap: "break-word"}}>{detail['/3/0']}</p>
          <p style={{fontWeight: "bold"}}>pn:/70/0</p>
          <p style={{wordWrap: "break-word"}}>{detail['/70/0']}</p>
          <p style={{fontWeight: "bold"}}>pn:/80/0</p>
          <p style={{wordWrap: "break-word"}}>{detail['/80/0']}</p>
          <p style={{fontWeight: "bold"}}>pn:/81/0</p>
          <p style={{wordWrap: "break-word"}}>{detail['/81/0']}</p>
          <p style={{fontWeight: "bold"}}>pn:/82/0</p>
          <p style={{wordWrap: "break-word"}}>{detail['/82/0']}</p>
          <p style={{fontWeight: "bold"}}>pn:/84/0</p>
          <p style={{wordWrap: "break-word"}}>{detail['/84/0']}</p>
          <p style={{fontWeight: "bold"}}>pn:/99/0</p>
          <p style={{wordWrap: "break-word"}}>{detail['/99/0']}</p>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>  
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
                  getTrProps={(state, rowInfo, column, instance) => {
                    return {
                        onClick: e => {
                            console.log(rowInfo.original.id);
                            if(rowInfo.original != null)
                            {
                              setDetail(
                                {
                                '/3/0': rowInfo.original['/3/0'],
                                '/70/0': rowInfo.original['/70/0'],
                                '/80/0': rowInfo.original['/80/0'],
                                '/81/0': rowInfo.original['/81/0'],
                                '/82/0': rowInfo.original['/82/0'],
                                '/84/0': rowInfo.original['/84/0'],
                                '/99/0': rowInfo.original['/99/0']
                              });
                            }
                            
                            setOpen(true);
                            console.log(detail)
                        }
                    }
                  }}
              /> 
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
