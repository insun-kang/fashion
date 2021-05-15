import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

const navLinks = [
  { title: '취향찾기', path: '/#' },
  { title: '키워드 검색', path: '/#' },
  { title: '옷장', path: '/#' },
];

const NavBarComponent = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">오늘옷데</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {navLinks.map(({ title, path }) => (
            <Nav.Link href={path} key={title}>
              {title}
            </Nav.Link>
          ))}
        </Nav>
        <Nav className="justify-content-end">
          <Nav.Link href="#">마이페이지</Nav.Link>
          <Nav.Link href="#">로그아웃</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBarComponent;
