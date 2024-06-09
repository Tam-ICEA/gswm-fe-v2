import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "../../components/navbar.component"
import ExercisesList from "../../components/exercises-list.component";
import EditExercise from "../../components/edit-exercise.component";
import CreateExercise from "../../components/create-exercise.component";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components

import Card from "components/Card/Card.js";


// import CreateUser from "./components/create-user.component";

function SuperUser() {
  return (
    <Router>

      <div className="container">
        
      {/* <Navbar /> */}
      <br/>
        <Route path="/" component={ExercisesList} />      
        <Route path="/edit/:id" component={EditExercise} />
        <Route path="/create" component={CreateExercise} />
      {/* <Route path="/user" component={CreateUser} /> */}
      </div>
    </Router>
  );
}

export default SuperUser;
