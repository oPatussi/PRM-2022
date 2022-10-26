import { Container } from 'react-bootstrap';
import {FiYoutube, FiTwitter, FiInstagram, FiFacebook} from 'react-icons/fi';
import './style.scss';

export function Footer() {
    return (
        <footer>
            <Container fluid>
                <div className="footer-content">
                    <div className="footer-list">
                        <h5>Sobre a Loja UNIMATER</h5>
                        <ul>
                            <li><a href="#">Nossas Lojas</a></li>
                            <li><a href="#">Trabalhe Conosco</a></li>
                            <li><a href="#">Institucional</a></li>
                            <li><a href="#">Imprensa</a></li>
                        </ul>
                    </div>
                    <div className="footer-list">
                        <h5>Atendimento UNIMATER</h5>
                        <ul>
                            <li><a href="#">Fale Conosco</a></li>
                            <li><a href="#">Troca e Devolução</a></li>
                            <li><a href="#">Primeira Compra</a></li>
                            <li><a href="#">Arrependimento de Compra</a></li>
                        </ul>
                    </div>
                    <div className="footer-list">
                        <h5>Proteção de dados UNIMATER</h5>
                        <ul>
                            <li><a href="#">Como usamos seus dados</a></li>
                            <li><a href="#">Política de privacidade</a></li>
                            <li><a href="#">Termo de Confidencialidade</a></li>
                        </ul>
                    </div>
                    <div className="footer-social">
                        <h5>Loja UNIMATER nas redes</h5>
                        <ul>
                            <li>
                                <a className="icon-social" href="https://www.youtube.com" target="_blank"><FiYoutube /></a>
                            </li>
                            <li>
                                <a className="icon-social" href="https://www.twitter.com" target="_blank"><FiTwitter /></a>
                            </li>
                            <li>
                                <a className="icon-social" href="https://www.instagram.com" target="_blank"><FiInstagram /></a>
                            </li>
                            <li>
                                <a className="icon-social" href="https://facebook.com" target="_blank"><FiFacebook /></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </Container>
        </footer>
    )
}