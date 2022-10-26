import { useEffect, useState } from 'react';
import { Breadcrumb, Button, Container, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FormattedNumber, IntlProvider } from "react-intl";

import { IProduct } from '@typesCustom';
import {ICartItem, RequestParam} from '../../@typesLocal'

//Hook
import { useCart } from '../../hook/useCart';

//Componenets
import { Footer } from '../../components/Footer';
import { ToolBar } from '../../components/ToolBar';
import { getProductById } from '../../services/server';

//Style
import './style.scss';

export function ProductPage() {

    const params = useParams<RequestParam>();

    const { cart, replaceCart } = useCart();

    const [product, setProduct] = useState<IProduct>({} as IProduct);
    const [itemCart, setItemCart] = useState<ICartItem>({} as ICartItem)

    useEffect(() => {

        getProductById(Number(params.id)).then(result => {
            setProduct(result);
            setItemCart({ product: result, amount: 1 });
        })

    }, [params]);

    function handleAddItemCard(itemCart: ICartItem) {
        replaceCart({ ...cart, items: [...cart?.items || [], itemCart] })
    }

    return (
        <div id="product-page">

            <ToolBar />

            <Container fluid>
                <div className="product-page-container">
                    <div className="view-left">
                        {product.category && (
                            <Breadcrumb>
                                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                                <Breadcrumb.Item href={`/categories/${product.category.id}`}>{product.category.name}</Breadcrumb.Item>
                                {product.brand && (
                                    <Breadcrumb.Item active>{product.brand.name}</Breadcrumb.Item>
                                )}
                                <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
                            </Breadcrumb>
                        )}

                        <div className="product-images">

                        </div>
                    </div>
                    <div className="view-right">
                        <div className="product-prices">
                            <h2>{product.name}</h2>
                            <p className="price-max">
                                <IntlProvider locale="pt-BR">
                                    <FormattedNumber value={product.price * 1.15} style="currency" currency="BRL" />
                                </IntlProvider>
                            </p>
                            <p className="price-pix">
                                <span>R$ </span>
                                <IntlProvider locale="pt-BR">
                                    <FormattedNumber value={product.price * 0.95} style="decimal"
                                        minimumFractionDigits={2}
                                        maximumFractionDigits={2} />
                                </IntlProvider>
                                <span> no pix</span>
                            </p>
                            <p className="price">
                                <IntlProvider locale="pt-BR">
                                    <FormattedNumber value={product.price} style="currency" currency="BRL" />
                                </IntlProvider>
                                <span> à vista ou em até </span>
                                10x de &nbsp;
                                <IntlProvider locale="pt-BR">
                                    <FormattedNumber value={(product.price * 1.2) / 10} style="currency" currency="BRL" />
                                </IntlProvider>
                                <span>* no cartão</span>
                            </p>
                            <p className="juros">
                                <span>* juros de 20% no pagamento com cartão. Total </span>
                                <IntlProvider locale="pt-BR">
                                    <FormattedNumber value={product.price * 1.2} style="currency" currency="BRL" />
                                </IntlProvider>
                                <span> à prazo</span>
                            </p>
                        </div>
                        <div className="product-cart">
                            <div className="cart">
                                <Form.Group className="mb-3">
                                    <Form.Label>Quantidade</Form.Label>
                                    <Form.Control type="number"
                                        min={1}
                                        value={itemCart.amount || 1}
                                        onChange={event => setItemCart({ ...itemCart, amount: Number(event.target.value) })} />
                                </Form.Group>
                                <Button variant="danger" onClick={() => handleAddItemCard(itemCart)}>Adicionar no Carrinho</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>

            <Footer />
        </div>
    )
}