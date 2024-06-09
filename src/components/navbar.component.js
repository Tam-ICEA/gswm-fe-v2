import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

export default class Navbar1 extends Component {


  render() {
    return (

      <Navbar collapseOnSelect expand="lg">
        <Navbar.Brand style={{ color: "white" }} href="#home">Control Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto ">

            
            <Nav.Link  eventKey="1" as={Link} to="/create">
                Create New School
            </Nav.Link>

            <Nav.Link eventKey="2" as={Link} to="/create">
              Create New Branch
            </Nav.Link>

            <Nav.Link eventKey="3" as={Link} to="/">
              Reset
            </Nav.Link>

           
            </Nav>
        </Navbar.Collapse>
    </Navbar>

      // <nav className="navbar navbar-dark navbar-expand-lg">
      //   <div className="container-fluid">
      //   {/* <Link to="/" className="navbar-brand">Super Admin</Link> */}
      //   <button className="navbar-toggler" type="button" data-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      //     <span className="navbar-toggler-icon"></span>
      //   </button>
      //   <div className="collpase navbar-collapse" id="navbarSupportedContent">
      //       <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      //     <li className="navbar-item active">
      //           <Link to="/" className="nav-link active" aria-current="page">List of Schools</Link>
      //     </li>
      //     <li className="navbar-item">
      //     <Link to="/create" className="nav-link">Create New School</Link>
      //     </li>
      //     {/* <li className="navbar-item">
      //     <Link to="/user" className="nav-link">Create User</Link>
      //     </li> */}
      //   </ul>
      //   </div>
      //   </div>
      // </nav>
    );
  }
}