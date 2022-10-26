import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import {BsArrowRightShort} from "react-icons/bs";
import { FormattedNumber, IntlProvider } from "react-intl";

import { ICategory, IProduct } from "@typesCustom";
import {FormaPagto} from '../../@typesLocal';
import { getCategories, getProducts } from "../../services/server";

import { Header } from "../../components/Header";
import { CardProduct } from "../../components/CardProduct";
import { Footer } from "../../components/Footer";

import './style.scss';

import imgBannerPromo from '../../assets/img/banner-promo.png';
import imgNotebook from '../../assets/img/notebook.jpeg';

export function HomePage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [newProducts, setNewProducts] = useState<IProduct[]>([]);
    const [bestSellers, setBestSellers] = useState<IProduct[]>([]);
    const [promo, setPromo] = useState<IProduct>();
  
    useEffect(() => {
  
        getCategories().then(result => {
          setCategories(result);
        })

        getProducts().then(result => {

            //Últimos 5 produtos
            setNewProducts(result.slice(result.length -5, result.length))

            //Mais populares
            setBestSellers(result.slice(5, 10));

            //Sorteia quem estará na promoção
            const index = Math.floor(Math.random() * result.length);
            setPromo(result[index]);
        })
  
    }, [])

    return (
        <div id="home-page">
            <Header items={categories} />
            <main>
                <Container fluid>
                    <section className="new-products">
                        <h2>Últimas novidades</h2>

                        <div className="new-products-content">
                            {newProducts.map(item => (
                                <CardProduct 
                                    key={item.id} 
                                    product={item} />
                            ))}                            
                        </div>
                    </section>
                </Container>
                <section className="banner-promo">
                    <Container fluid>
                        <img src={imgBannerPromo} />
                        <div className="banner-promo-container">
                            <div className="banner-promo-img">
                                <img src={imgNotebook} />
                            </div>
                            {promo && (
                                <div className="banner-promo-content">                                
                                    <h3>Promoção de {promo?.category.name}</h3>                                                                
                                    <p>a partir de</p>
                                    <p className="price">
                                        <span>R$</span>
                                        <IntlProvider locale="pt-BR">
                                            <FormattedNumber value={promo.price * FormaPagto['pix']} style="decimal"  
                                                minimumFractionDigits={2}
                                                maximumFractionDigits={2} />
                                        </IntlProvider>
                                        <span>NO PIX</span>
                                    </p>
                                </div>
                            )}
                            <div className="banner-promo-link">
                                <h3>Corra, Falta pouco!</h3>
                                <p>*oferta exclusiva no site das 12h às 20h</p>
                                <Button variant="danger">
                                    Compre Já
                                    <BsArrowRightShort />
                                </Button>
                            </div>
                        </div>
                    </Container>                    
                </section>
                
                <Container fluid>
                    <section className="best-sellers">
                        <h2>Produtos mais vendidos</h2>

                        <div className="best-sellers-content">
                            {bestSellers.map(item => (
                                <CardProduct 
                                    key={item.id} 
                                    product={item} />
                            ))}                            
                        </div>
                    </section>
                    
                </Container>
            </main>

            <Footer />
        </div>
    )
}