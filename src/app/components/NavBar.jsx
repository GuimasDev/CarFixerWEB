import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../assets/images/logo.svg"
import { useUserType } from './UserTypeContext';
import { useLocation } from 'react-router-dom';

function NavBar(props) {
    const { userType } = useUserType();
    const location = useLocation();

    const getNav = () => {
        console.log(userType);

        if (location.pathname == '/login') {
            <Nav>
                <Nav.Link href="/home">Home</Nav.Link>
            </Nav>
        } else if (userType === 'Admin') {
            return (
                <Nav>
                    <Nav.Link href="/clientes">Clientes</Nav.Link>
                    <Nav.Link href="/veiculos">Veiculos</Nav.Link>
                    <Nav.Link href="/agendamentos">Agendamentos</Nav.Link>
                    <Nav.Link href="/horario">Horário de Funcionamento</Nav.Link>
                    <Nav.Link href="/cronograma">Cronograma</Nav.Link>
                    <NavDropdown title="" id="collapsible-nav-dropdown">
                        <NavDropdown.Item href="#profile">Perfil</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            );
        } else if (userType === 'Cliente') {
            return (
                <Nav>
                    <Nav.Link href="/agendamentos">Agendar</Nav.Link>
                    <Nav.Link href="/veiculos">Meus veículos</Nav.Link>
                    <Nav.Link href="#sobre">Sobre</Nav.Link>
                    <NavDropdown title="" id="collapsible-nav-dropdown">
                        <NavDropdown.Item href="#profile">Perfil</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            );
        } else {
            return (
                <Nav>
                    <Nav.Link href="/agendamentos">Agendar</Nav.Link>
                    <Nav.Link href="#sobre">Sobre</Nav.Link>
                    <Nav.Link href="/login">Entrar</Nav.Link>
                </Nav>
            );
        }
    };

    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">  {/*fixed="top" */}
            <Container>
                {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Navbar.Brand href="/">
                            <img
                                src={logo}
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                                alt="CarFixer"
                            />
                        </Navbar.Brand>

                    </Nav>
                    {getNav()}
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
}

export default NavBar;