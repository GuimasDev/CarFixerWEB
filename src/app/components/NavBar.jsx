import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import logo from "../assets/images/logo.svg"

function NavBar(props) {
    const [userType, setType] = useState(props.type);
    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('1');

    const radios = [    
        { name: 'Admin', value: '1' },
        { name: 'Cliente', value: '2' }
    ];

    const changeType = <ButtonGroup>
        {radios.map((radio, idx) => (
            <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                name="radio"
                value={radio.value}
                checked={radioValue === radio.value}
                onChange={(e) => {
                    setRadioValue(e.currentTarget.value);
                    (radioValue === '1' ? setType("Cliente") : setType("Admin"));
                }}
            >
                {radio.name}
            </ToggleButton>
        ))}
    </ButtonGroup>;

    let admin = <Nav>
        <Nav.Link href="#funcionarios">Funcionários</Nav.Link>
        <Nav.Link href="#servicos">Serviços</Nav.Link>
        <Nav.Link href="/horario">Horários</Nav.Link>
        <Nav.Link href="#produtos">Produtos</Nav.Link>
        {/* <img
    src="/img/profile.svg"
    width="30"
    height="30"
    className="d-inline-block align-top"
    alt="CarFixer"
    href="collapsible-nav-dropdown"
/> */}
        <NavDropdown title="" id="collapsible-nav-dropdown">
            <NavDropdown.Item href="#profile">Perfil</NavDropdown.Item>

            {/* <NavDropdown.Item> */}

            {/* </NavDropdown.Item> */}
            <NavDropdown.Divider />
            <NavDropdown.Item href="/login">
                Logout
            </NavDropdown.Item>
        </NavDropdown>
        {changeType}
    </Nav>;

    let cliente = <Nav>
        <Nav.Link href="#agendar">Agendar</Nav.Link>
        <Nav.Link href="#sobre">Sobre</Nav.Link>
        {/* <img
        src="/img/profile.svg"
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="CarFixer"
        href="collapsible-nav-dropdown"
    /> */}
        <NavDropdown title="" id="collapsible-nav-dropdown">
            <NavDropdown.Item href="#profile">Perfil</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/logout">
                Logout
            </NavDropdown.Item>
        </NavDropdown>
        {changeType}
    </Nav>;


    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
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
                    {(userType === "Admin" ? admin : cliente)}
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
}

export default NavBar;