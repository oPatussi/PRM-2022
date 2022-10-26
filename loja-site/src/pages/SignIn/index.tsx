import { FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

//Types
import { ICredential } from '@typesCustom';

//Components
import { Footer } from '../../components/Footer';
import { ToolBar } from '../../components/ToolBar';

//Hooks
import { useAuth } from '../../hook/useAuth';

//Service
import { signIn } from '../../services/server';

//CSS
import './../../assets/css/sign.scss';

export function SignInPage() {

    const navigate = useNavigate();
    const { registerSignIn } = useAuth();

    const [searchParams, setSearchParams] = useSearchParams();

    const [messageError, setMessageError] = useState('');
    const [loading, setLoading] = useState(false);

    const [redirectURL, setRedirectURL] = useState('/');

    const [credential, setCredential] = useState<ICredential>({ email: '', password: '' } as ICredential);

    useEffect(() => {
        const redirect = searchParams.get('redirect');

        if (redirect) {
            setRedirectURL(redirect);
        }

    }, [searchParams]);

    function handleSignIn(event: FormEvent) {
        event.preventDefault();

        setLoading(true)

        signIn(credential)
            .then(result => {
                registerSignIn(result);

                //redireciona para página correta
                navigate(redirectURL);
            })
            .catch(error => {
                setMessageError(error.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div id="sign-page">

            <ToolBar />

            <Container fluid>

                <div className="sign-page-container">

                    <Card>

                        <Card.Body>
                            <h1>Faça Login</h1>
                            <h3>Já é cliente UNIMATER?</h3>

                            {messageError && (
                                <Alert variant="danger">
                                    {messageError}
                                </Alert>
                            )}

                            <div className="form-login">
                                <form onSubmit={event => handleSignIn(event)}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>E-mail</Form.Label>
                                        <Form.Control type="email"
                                            value={credential.email}
                                            onChange={event => setCredential({ ...credential, email: event.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Senha</Form.Label>
                                        <Form.Control type="password"
                                            value={credential.password}
                                            onChange={event => setCredential({ ...credential, password: event.target.value })} />
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
                                            <span>Entrar</span>
                                        )}

                                    </Button>
                                </form>
                            </div>

                            <div className="sign-separator">
                                <div className="traco"></div>
                                <span>OU</span>
                                <div className="traco"></div>
                            </div>

                            <h1>Crie uma conta</h1>
                            <h3>Ainda não tem uma conta UNIMATER?</h3>
                            <Button variant="outline-danger" onClick={() => navigate('/signup')}>Cadastre-se</Button>

                        </Card.Body>
                    </Card>
                </div>
            </Container>

            <Footer />
        </div>
    )
}