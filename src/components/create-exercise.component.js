import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Navbar from "components/navbar.component.js";


export default class CreateExercise extends Component {
  constructor(props) {
    super(props);

    this.onChangeSchoolName = this.onChangeSchoolName.bind(this);
    this.onChangeSchoolID = this.onChangeSchoolID.bind(this);
    this.onChangeBranchID = this.onChangeBranchID.bind(this);
    this.onChangeAdminEmail = this.onChangeAdminEmail.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      SchoolName: '',
      SchoolID: '',
      BranchID: '',
      AdminEmail: '',
      date: new Date(),
      users: []
    }
  }

  // componentDidMount() {
  //   axios.get('http://localhost:5000/users/')
  //     .then(response => {
  //       if (response.data.length > 0) {
  //         this.setState({
  //           users: response.data.map(user => user.SchoolName),
  //           SchoolName: response.data[0].SchoolName
  //         })
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })

  // }

  onChangeSchoolName(e) {
    this.setState({
      SchoolName: e.target.value
    })
  }

  onChangeSchoolID(e) {
    this.setState({
      SchoolID: e.target.value
    })
  }

  onChangeBranchID(e) {
    this.setState({
      BranchID: e.target.value
    })
  }

  onChangeAdminEmail(e) {
    this.setState({
      AdminEmail: e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date: date
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const exercise = {
      SchoolName: this.state.SchoolName,
      SchoolID: this.state.SchoolID,
      BranchID: this.state.BranchID,
      AdminEmail: this.state.AdminEmail,
      date: this.state.date
    }

    console.log(exercise);

    axios.post('http://localhost:5000/exercises/add', exercise)
      .then(res => console.log(res.data));

    window.location = '/';
  }

  render() {
    return (
    <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info"><h5>Create New School</h5>
              </CardHeader>
      <form onSubmit={this.onSubmit}>
        <CardBody>
      <div className="form-group"> 
          <label>SchoolName: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.SchoolName}
              onChange={this.onChangeSchoolName}
              />
        </div>
        
        <div className="form-group"> 
          <label>SchoolID: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.SchoolID}
              onChange={this.onChangeSchoolID}
              />
        </div>
        <div className="form-group">
          <label>BranchID: </label>
          <input type="text"
            required
            className="form-control"
            value={this.state.BranchID}
            onChange={this.onChangeBranchID}
          />
        </div>
        <div className="form-group">
          <label>AdminEmail: </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.AdminEmail}
              onChange={this.onChangeAdminEmail}
              />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker
              selected={this.state.date}
              onChange={this.onChangeDate}
            />
          </div>
          
        </div>
                </CardBody>     
        <CardFooter>
        <div className="form-group">
          <input type="submit" value="Create New School" className="btn btn-primary" />
        </div>
                </CardFooter>
      </form>
      </Card>
      </GridItem>
      </GridContainer>
    </div>
    )
  }
}