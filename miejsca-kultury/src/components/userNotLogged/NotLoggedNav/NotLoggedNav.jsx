import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function NotLoggedNav() {
  const navigate = useNavigate();

  const containerStyle = {
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className="fixed-top">
        <Container style={containerStyle}>
          <Navbar.Brand>
            <Link className="link-light link-underline-opacity-0" to={"/"}>
              Miejsca Kultury
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Item>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-outline-light ms-3"
                >
                  Zaloguj się!
                </button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="d-flex mt-5">
      <div className="bg-light border d-none d-lg-block" 
        style={{ 
          width: "200px",
          height: "calc(100vh - 56px)",
          position: "fixed",
          top: "56px"
        }}
        >
          <Nav className="flex-column p-2">
            <Button
              variant="outline-dark"
              className="mb-2"
              onClick={() => navigate("/")}
            >
              Strona główna
            </Button>
            <Button
              variant="outline-dark"
              className="mb-2"
              onClick={() => navigate("/events")}
            >
              O wydarzeniach
            </Button>
          </Nav>
        </div>
        <div style={{ marginLeft: "200px", width: "100%" }}>
          <Outlet />
        </div>
      </div>
    </>
  );
}
