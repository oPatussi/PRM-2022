import { useEffect, useState } from 'react';

import { Badge, Container, Dropdown, DropdownButton, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BsCart3 } from 'react-icons/bs'
import { useLocation, useNavigate, useParams } from 'react-router-dom';


import { ICategory } from '@typesCustom';
import { RequestParam } from '../../@typesLocal'
import { useAuth } from '../../hook/useAuth';
import { useCart } from '../../hook/useCart';

import './style.scss';

type ToolBarProps = {
    categories?: ICategory[];
}

export function ToolBar({
    categories
}: ToolBarProps) {
    const location = useLocation();
    const params = useParams<RequestParam>();
    const navigate = useNavigate();

    const { cart } = useCart();

    const { user, signOut } = useAuth();

    const [mainMenu, setMainMenu] = useState<ICategory[]>([]);
    const [idActive, setIdActive] = useState(0);

    useEffect(() => {

        //Se for rota de categoria, define o ID do link active
        if (location.pathname.indexOf('categories') >= 0) {
            setIdActive(Number(params.id))
        }

    }, [params]);

    useEffect(() => {

        //Se tem categforias, peas as 5 primeiras para formar o menu
        if (categories) {
            //Pega os 5 primeiras cagegorias
            setMainMenu(categories.slice(0, 5));
        }

    }, [categories]);

    function handleLogout() {
        window.location.reload();
        signOut();
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/">Logomarca</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="me-auto">
                        {mainMenu.map(categoria => (
                            <Nav.Link
                                key={categoria.id}
                                active={idActive == categoria.id}
                                href={`/categories/${categoria.id}`}>
                                {categoria.name}
                            </Nav.Link>
                        ))}
                        {categories && (
                            <NavDropdown title="Todas Categorias" id="basic-nav-dropdown">
                                {categories.map(item => (
                                    <NavDropdown.Item
                                        key={item.id}
                                        active={idActive == item.id}
                                        href={`/categories/${item.id}`}>
                                        {item.name}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        )}
                    </Nav>

                    <div className="login-cart">
                        {user ? (
                            <DropdownButton variant="outline-primary" title={user.name}>
                                <Dropdown.Item onClick={handleLogout}>Sair</Dropdown.Item>
                            </DropdownButton>
                        ) : (
                            <a href="/signin">Login</a>
                        )}

                        <a className="cart" href={'/cart'}>
                            <BsCart3 />
                            {(cart && cart.items && cart.items?.length > 0) && (
                                <Badge pill bg="danger">{cart.items?.length}</Badge>
                            )}
                        </a>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}