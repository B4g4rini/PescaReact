import './App.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle"
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Clientes from './Pages/Clientes';
import Header from './Components/Header';
import Home from './Pages/Home';
import Produtos from './Pages/Produtos';
import Vendas from './Pages/Vendas';
import Fornecedores from './Pages/Fornecedores';
import Footer from './Components/footer';

const App = () => {
  return (
  <>
  <Router>
    <Header/>
   
<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path= "/clientes" element={<Clientes/>} />
  <Route path= "/produtos" element={<Produtos/>} />
  <Route path= "/fornecedores" element={<Fornecedores/>} />
  <Route path= "/vendas" element={<Vendas/>} />
</Routes>
  <Footer/>
  </Router>
  </>
  )
}

export default App
