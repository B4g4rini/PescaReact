import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 fixed-bottom">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>Sobre Nós</h5>
            <p>
              Somos uma empresa dedicada a oferecer as melhores soluções de pesca para nossos clientes. Nossa equipe está pronta para ajudar você.
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Links Úteis</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
              <li><Link to="/about" className="text-white text-decoration-none">Sobre</Link></li>
              <li><Link to="/services" className="text-white text-decoration-none">Serviços</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none">Contato</Link></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Contato</h5>
            <address>
              Rua Jaú, 143<br />
              Jaú, SP<br />
              CEP: 12345-678<br />
              <a href="mailto:contato@exemplo.com" className="text-white text-decoration-none">pesca@itens.com</a>
            </address>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <p className="mb-0">&copy; {new Date().getFullYear()} Itens de Pesca. Todos os direitos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
