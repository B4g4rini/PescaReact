import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Itens de Pesca
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={"/"}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/clientes"}>
                Clientes
              </Link>
              
            </li>

            <li className="nav-item">
              <Link className="nav-link" to={"/Fornecedores"}>
                Fornecedores
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to={"/vendas"}>
                Vendas
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to={"/produtos"}>
                Produtos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
