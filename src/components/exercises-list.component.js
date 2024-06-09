import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
 import {Table} from 'react-bootstrap';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "components/CustomButtons/Button.js"
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Navbar1 from "components/navbar.component.js";



const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Space Grotesk', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

 

const Exercise = props => (
  <tr>
    <td><Button color="info" round><b>Login</b></Button>{' '}</td>
    <td>{props.exercise.SchoolID}</td>
    <td>{props.exercise.BranchID}</td>
    <td>{props.exercise.SchoolName}</td>    
    <td>{props.exercise.AdminEmail}</td>
    <td>{props.exercise.date.substring(0,10)}</td>
    {/* <td>{props.exercise.Status}</td> */}
    <td>
      <Link to={"/edit/"+props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }}>delete</a>
    </td>
  </tr>
)

export default class ExercisesList extends Component {

  constructor(props) {
    super(props);

    this.deleteExercise = this.deleteExercise.bind(this)

    this.state = {exercises: []};
  }

  componentDidMount() {
    axios.get('http://localhost:5000/exercises/')
      .then(response => {
        this.setState({ exercises: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteExercise(id) {
    axios.delete('http://localhost:5000/exercises/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      exercises: this.state.exercises.filter(el => el._id !== id)
    })
  }

  exerciseList() {
    return this.state.exercises.map(currentexercise => {
      return <Exercise exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id}/>;
    })
  }
  
  render() {
    
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            {/* <h3>School Data</h3> */}
                <Navbar1
                  // routes={routes}
                  // handleDrawerToggle={handleDrawerToggle}
                  // {...rest}
                  />
                </CardHeader>

        <CardBody>
        <Table className="table" responsive>
                  
          <thead className="thead-light">
            
              <tr>
              <th>Login</th>
              <th>School ID</th>
              <th>Branch ID</th>
              <th>School/Branch Name</th>
              
              <th>Admin Email</th> 
              {/* <th>Created On</th> */}
              <th>Modified On</th>
              
              {/* <th>AdminID</th> */}
              {/* <th>Modified on</th> */}
              {/* <th>License</th> */}
              {/* <th>Status</th> */}
              <th>Actions</th>
              {/* <th>Transaction</th>  */}
              
            </tr>
          
          </thead>
         
          <tbody>
            { this.exerciseList() }
          </tbody>
        </Table>
                {/* </GridItem> */}
        
        </CardBody>
        </Card>
        </GridItem>
        </GridContainer>
      </div>
    )
  }
}