import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../assets/images/logo.svg"
import user from "../assets/icons/user.svg";
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
                    <Nav.Link href="/funcionarios">Funcionários</Nav.Link>
                    <Nav.Link href="/servicos">Serviços</Nav.Link>
                    <Nav.Link href="/horario">Horários</Nav.Link>
                    <Nav.Link href="/produtos">Produtos</Nav.Link>
                    <Nav.Link href="/cronograma">Cronograma</Nav.Link>
                    <NavDropdown title="Menu do cliente" id="collapsible-nav-dropdown">
                        <NavDropdown.Item href="/clientes">Clientes</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/veiculos">Veiculos</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/agendamentos">Agendamentos</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title={<img src={user} />} id="collapsible-nav-dropdown profile">
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
                    {/* <Nav.Link href="#sobre">Sobre</Nav.Link> */}
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
                    {/* <Nav.Link href="/agendamentos">Agendar</Nav.Link>
                    <Nav.Link href="#sobre">Sobre</Nav.Link> */}
                    <Nav.Link href="/login">Entrar</Nav.Link>
                </Nav>
            );
        }
    };

    return (
        <Navbar collapseOnSelect className="bg-body-tertiary">  {/*fixed="top" expand="lg" */}
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