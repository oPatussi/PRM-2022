import { FormattedNumber, IntlProvider } from "react-intl";
import { Card } from 'react-bootstrap';

import { IProduct } from '@typesCustom';
import {FormaPagto} from '../../@typesLocal';

import './style.scss';

type CardProdctProps = {
    product: IProduct;
}
export function CardProduct({
    product
}: CardProdctProps) {

    return (
        <Card className="card-product">
            <Card.Body>
                <Card.Title>
                    <a href={`/products/${product.id}`}>{product.name}</a>
                </Card.Title>
                <Card.Text className="price-max">
                    <IntlProvider locale="pt-BR">
                        <FormattedNumber value={product.price * FormaPagto['max']} style="currency" currency="BRL" />
                    </IntlProvider>
                </Card.Text>
                <Card.Text className="price-pix">
                    <IntlProvider locale="pt-BR">
                        <FormattedNumber value={product.price * FormaPagto['pix']} style="currency" currency="BRL" />
                    </IntlProvider>
                    <span>no pix</span>
                </Card.Text>
                <Card.Text className="price">
                    <IntlProvider locale="pt-BR">
                        <FormattedNumber value={product.price * FormaPagto['vista']} style="currency" currency="BRL" />
                    </IntlProvider>
                    <span> à vista ou em até</span>
                </Card.Text>
                <Card.Text className="price">
                    10x de
                    <IntlProvider locale="pt-BR">
                        <FormattedNumber value={product.price * FormaPagto['cartao'] / 10} style="currency" currency="BRL" />
                    </IntlProvider>
                    <span> iguais no cartão</span>
                </Card.Text>
            </Card.Body>
        </Card>
    )

}