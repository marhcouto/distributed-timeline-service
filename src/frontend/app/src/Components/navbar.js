import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function TopNavbar() {
  return (
    <>
      <br />
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Twitter</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Feed</Nav.Link>
            <Nav.Link href="#features">User</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default TopNavbar;