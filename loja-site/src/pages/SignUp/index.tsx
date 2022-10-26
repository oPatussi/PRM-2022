import { FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Form, Spinner, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ICustomer, IUser } from '@typesCustom';
import { Footer } from '../../components/Footer';
import { ToolBar } from '../../components/ToolBar';
import { useAuth } from '../../hook/useAuth';

import './../../assets/css/sign.scss';
import { createUserCustomer } from '../../services/server';

export function SignUpPage() {

    const navigate = useNavigate();
    const { registerSignIn } = useAuth();

    const [customer, setCustomer] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zipcode:''
    } as ICustomer);

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    } as IUser);

    const [messageError, setMessageError] = useState('');
    const [loading, setLoading] = useState(false);

    function setName(name: string) {
        setUser({ ...user, name: name });
        setCustomer({ ...customer, name: name });
    }

    function handleSignUp(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        createUserCustomer(user, customer)
            .then(result => {
                registerSignIn(result);

                //redireciona para página correta
                navigate('/');
            })
            .catch(error => {
                setMessageError(error.message)
            })
            .finally(() => {
                setLoading(false);
            })

    }

    function handleCompleteAddress(cep: string) {
        //TO-DO: Implementar chamada ao serviço que pega endereço pelo CEP e preencher os campos com o retorno.
    }

    return (
        <div id="sign-page">

            <ToolBar />

            <Container fluid>

                <div className="sign-page-container">

                    <Card style={{width: '600px'}}>

                        <Card.Body>
                            <h1>Crie uma conta</h1>
                            <h3>Ainda não tem uma conta UNIMATER?</h3>

                            {messageError && (
                                <Alert variant="danger">
                                    {messageError}
                                </Alert>
                            )}

                            <div className="form-login">
                                <form onSubmit={event => handleSignUp(event)}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control type="text"
                                            value={customer.name}
                                            onChange={event => setName(event.target.value)} />
                                    </Form.Group>
                                    <Stack direction="horizontal" gap={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>CEP</Form.Label>
                                            <Form.Control type="text"
                                                value={customer.zipcode}
                                                onChange={event => setCustomer({ ...customer, zipcode: event.target.value })}
                                                onBlur={event => handleCompleteAddress(event.target.value)}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3"
                                            style={{width: '100%'}}>
                                            <Form.Label>Estado</Form.Label>
                                            <Form.Select
                                                value={customer.state}
                                                onChange={event => setCustomer({ ...customer, state: event.target.value })}>
                                                <option>Escolha</option>
                                                <option value="AC">Acre</option>
                                                <option value="AL">Alagoas</option>
                                                <option value="AP">Amapá</option>
                                                <option value="AM">Amazonas</option>
                                                <option value="BA">Bahia</option>
                                                <option value="CE">Ceará</option>
                                                <option value="DF">Distrito Federal</option>
                                                <option value="ES">Espírito Santo</option>
                                                <option value="GO">Goiás</option>
                                                <option value="MA">Maranhão</option>
                                                <option value="MT">Mato Grosso</option>
                                                <option value="MS">Mato Grosso do Sul</option>
                                                <option value="MG">Minas Gerais</option>
                                                <option value="PA">Pará</option>
                                                <option value="PB">Paraíba</option>
                                                <option value="PR">Paraná</option>
                                                <option value="PE">Pernambuco</option>
                                                <option value="PI">Piauí</option>
                                                <option value="RJ">Rio de Janeiro</option>
                                                <option value="RN">Rio Grande do Norte</option>
                                                <option value="RS">Rio Grande do Sul</option>
                                                <option value="RO">Rondônia</option>
                                                <option value="RR">Roraima</option>
                                                <option value="SC">Santa Catarina</option>
                                                <option value="SP">São Paulo</option>
                                                <option value="SE">Sergipe</option>
                                                <option value="TO">Tocantins</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Stack>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Endereço</Form.Label>
                                        <Form.Control type="text"
                                            value={customer.address}
                                            onChange={event => setCustomer({ ...customer, address: event.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Cidade</Form.Label>
                                        <Form.Control type="text"
                                            value={customer.city}
                                            onChange={event => setCustomer({ ...customer, city: event.target.value })} />
                                    </Form.Group>
                                    <div className="sign-separator">
                                        <div className="traco"></div>
                                    </div>
                                    <Form.Group className="mb-3">
                                        <Form.Label>E-mail</Form.Label>
                                        <Form.Control type="email"
                                            value={user.email}
                                            onChange={event => setUser({ ...user, email: event.target.value })}
                                            required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Senha</Form.Label>
                                        <Form.Control type="password"
                                            value={user.password}
                                            onChange={event => setUser({...user, password: event.target.value})} />
                                    </Form.Group>

                                    <Button variant="danger" type="submit"
                                        disabled={loading}>
                                        {loading ? (
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <span>Cadastrar</span>
                                        )}

                                    </Button>
                                </form>
                            </div>

                            <div className="sign-separator">
                                <div className="traco"></div>
                                <span>OU</span>
                                <div className="traco"></div>
                            </div>

                            <h1>Faça Login</h1>
                            <h3>Já é cliente UNIMATER?</h3>

                            <Button variant="outline-danger" onClick={() => navigate('/signin')}>Acessar</Button>

                        </Card.Body>
                    </Card>
                </div>
            </Container>

            <Footer />
        </div>
    )
}