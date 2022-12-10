import { useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Container, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FormattedNumber, IntlProvider } from "react-intl";
import { BiTrash } from 'react-icons/bi';

import { ToolBar } from '../../components/ToolBar';
import { useCart } from '../../hook/useCart';

import { Footer } from '../../components/Footer';

import { ICustomer, IOrder, IOrderItem } from '@typesCustom'
import { FormaPagto, ICartItem } from '../../@typesLocal';

import imgCartEmpty from '../../assets/img/icon-cart-empty.svg';

import { useAuth } from '../../hook/useAuth';
import { useNavigate } from 'react-router-dom';
import { createOrder, getCustomerByUID } from '../../services/server';

import './style.scss';
;

export function CartPage() {

    const {user} = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const { cart, replaceCart } = useCart();
    const [fator, setFator] = useState(FormaPagto['pix']);
    const [total, setTotal] = useState(0);
    const [items, setItems] = useState<ICartItem[]>([]);
    const [cep, setCep] = useState('');

    useEffect(() => {

        if (cart?.items) {
            let totalAux = 0;

            for (const item of cart.items) {
                totalAux += (Number(item.product.price) * Number(item.amount));
            }

            setTotal(totalAux);

            setItems(cart.items);

        }

        if (user) {
            //TO-DO: Buscar o CEP do usuário logado
        }
    }, [cart]);

    function handleRemoveItem(id: number) {
        const filteredItems = items.filter(item => item.product.id !== id);

        replaceCart({ ...cart, items: filteredItems, shipping: filteredItems.length == 0 ? 0 : cart?.shipping });

    }

    function handleChangeAmount(indexItem: number, amount: number) {
        const productAux = items[indexItem].product;

        const filteredItems = items.filter((item, index) => index != indexItem);

        filteredItems.push({ product: productAux, amount: amount })

        replaceCart({ ...cart, items: filteredItems });
    }
    function hadleCalculateShipping() {
        const valorFrete = 300;

        //TO-DO: implementar aqui a chamada do método (servie) para o calculo de frete

        replaceCart({ ...cart, shipping: valorFrete })
    }
    async function handleFinalize() {
        if (!user) {
            navigate('/login?redirect=/cart');
        } else if (cart) {

            setLoading(true);

            //Pega o cliente
            const customer = await getCustomerByUID(user.uid || '');
            //Monta o preco do produto baseado no fator de desconto
            const orderItems: IOrderItem[] = [];
            for (const item of items) {
                const orderItem: IOrderItem = {
                    product: item.product,
                    amount: item.amount || 1,
                    value: item.product.price * fator
                }

                orderItems.push(orderItem);
            }

            //TO-DO: Preparar um objeto de pedido para ser gravado
            const order: IOrder = {                
                customer: customer,
                orderDate: new Date(),
                deadline: new Date(),
                shipping: cart?.shipping,
                items: orderItems
            }

            createOrder(order)
                .then(result => {
                    console.log('Deu certo ', result)
                })
                .catch(error => {
                    console.log('Deu pau ', error)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <div id="cart-page">

            <ToolBar />

            <Container fluid>
                {(cart && cart.items && (cart?.items?.length > 0)) ? (
                    <div className="cart-page-container">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Carrinho de Compra</Breadcrumb.Item>
                        </Breadcrumb>

                        <Card>
                            <Card.Body>
                                {items.map((item, index) => (
                                    <div key={`item-${item.product.id}${Math.random() * 10}`} className="product-row">
                                        <div className="product-description">
                                            <img alt="Minatura" />
                                            <p>{item.product.name}</p>
                                        </div>

                                        <div className="product-detail">
                                            <div className="product-fields">
                                                <Form.Control type="number"
                                                    min={1}
                                                    value={item.amount}
                                                    onChange={event => handleChangeAmount(Number(index), Number(event.target.value))} />
                                                <Button variant="link"
                                                    onClick={() => handleRemoveItem(Number(item.product.id))}>
                                                    <BiTrash />
                                                </Button>
                                            </div>
                                            <div className="product-prices">
                                                <p className="price-pix">
                                                    <IntlProvider locale="pt-BR">
                                                        <FormattedNumber value={item.product.price * FormaPagto['pix']} style="currency" currency="BRL" />
                                                    </IntlProvider>
                                                    <span> no pix</span>
                                                </p>
                                                <p className="price">
                                                    <IntlProvider locale="pt-BR">
                                                        <FormattedNumber value={item.product.price * FormaPagto['vista']} style="currency" currency="BRL" />
                                                    </IntlProvider>
                                                    <span> à vista ou </span>
                                                </p>
                                                <p className="price">
                                                    10x de&nbsp;
                                                    <IntlProvider locale="pt-BR">
                                                        <FormattedNumber value={(item.product.price * FormaPagto['cartao']) / 10} style="currency" currency="BRL" />
                                                    </IntlProvider>
                                                    <span> no cartão</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="frete">
                                    <p>Frete:</p>
                                    <div className="frete-content">
                                        <InputGroup>
                                            <InputGroup.Text>CEP</InputGroup.Text>
                                            <Form.Control
                                                placeholder="99.999-999"
                                                value={cep}
                                                onChange={event => setCep(event.target.value)}
                                            />
                                            <Button variant="link"
                                                disabled={cep == ''}
                                                onClick={hadleCalculateShipping}>Calcular</Button>
                                        </InputGroup>
                                        <p className="frete-valor">
                                            <span>Frete: </span>
                                            <IntlProvider locale="pt-BR">
                                                <FormattedNumber value={cart?.shipping || 0} style="currency" currency="BRL" />
                                            </IntlProvider>
                                        </p>
                                    </div>
                                </div>
                                <div className="forma-pagto">
                                    <p>Forma de Pagamento:</p>
                                    <div className="forma-pagto-content">
                                        <Form.Check
                                            inline
                                            id="PIX"
                                            label="PIX"
                                            value={FormaPagto['pix']}
                                            name="grp-pagto"
                                            type="radio"
                                            checked={fator == FormaPagto['pix']}
                                            onChange={event => setFator(Number(event.target.value))} />
                                        <Form.Check
                                            inline
                                            id="À Vista"
                                            label="À Vista"
                                            name="grp-pagto"
                                            value={FormaPagto['vista']}
                                            type="radio"
                                            checked={fator == FormaPagto['vista']}
                                            onChange={event => setFator(Number(event.target.value))} />
                                        <Form.Check
                                            inline
                                            id="Cartão"
                                            label="Cartão"
                                            name="grp-pagto"
                                            value={FormaPagto['cartao']}
                                            type="radio"
                                            checked={fator == FormaPagto['cartao']}
                                            onChange={event => setFator(Number(event.target.value))} />
                                    </div>

                                </div>
                                <div className="total">
                                    <p className="price-total">
                                        <span>Total: </span>
                                        <IntlProvider locale="pt-BR">
                                            <FormattedNumber value={(total * fator) + (cart?.shipping || 0)} style="currency" currency="BRL" />
                                        </IntlProvider>
                                    </p>
                                    {(fator === 1.2) && (
                                        <p>
                                            em 10x de
                                            <span>
                                                <IntlProvider locale="pt-BR">
                                                    <FormattedNumber value={(total * fator) / 10} style="currency" currency="BRL" />
                                                </IntlProvider>
                                            </span>
                                        </p>
                                    )}
                                </div>

                            </Card.Body>
                            <Card.Footer>
                                <Button variant="danger"
                                    onClick={handleFinalize}>
                                    {loading ? (
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <span>Finalizar a Compra</span>
                                    )}
                                </Button>
                            </Card.Footer>
                        </Card>
                        <div className="continuar">
                            <a className="btn btn-link" href="/">Continuar Comprando</a>
                        </div>
                    </div>
                ) : (
                    <div className="cart-page-container">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Carrinho de Compra</Breadcrumb.Item>
                        </Breadcrumb>

                        <Card className="cart-empty">
                            <Card.Body>
                                <img src={imgCartEmpty} />
                                <Card.Subtitle>Seu carrinho está vazio!</Card.Subtitle>
                                <Card.Text>Você pode navegar pelo menu ou voltar a página inicial para encontrar o que deseja</Card.Text>
                                <a href="/" className="btn btn-link btn-outline-danger">Página Inicial</a>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </Container>

            <Footer />
        </div>
    )
}