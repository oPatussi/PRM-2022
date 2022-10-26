import { Button, Carousel, Container } from 'react-bootstrap';

import imgSlider1 from '../../assets/img/slider-1-1920x1000.png';
import imgSlider2 from '../../assets/img/slider-2-1920x1000.png';

import './style.scss';

export function CarouselContainer() {
    return (
        
            <Container fluid>
                <Carousel variant="dark">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={imgSlider1}
                        />
                        <Carousel.Caption>
                            <h3>Nova Coleção de Moda Feminna</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            <Button variant="danger">Veja mais</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={imgSlider2}
                            alt="Second slide"
                        />
                        <Carousel.Caption>
                            <h3>Nova Coleção de Moda Masculina</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            <Button variant="danger">Veja mais</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </Container>

    )
}