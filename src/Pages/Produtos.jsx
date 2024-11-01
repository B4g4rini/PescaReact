import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import api from "../Services/api";

// Modelo base conforme Swagger
const produtoInitialState = {
  nome: "",
  descricao: "",
  preco: 0,
  quantidadeEstoque: 0,
  fornecedorId: ""
};

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [formData, setFormData] = useState(produtoInitialState);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }
    
    if (formData.preco <= 0) {
      newErrors.preco = "Preço deve ser maior que zero";
    }
    
    if (formData.quantidadeEstoque < 0) {
      newErrors.quantidadeEstoque = "Quantidade não pode ser negativa";
    }
    
    if (!formData.fornecedorId) {
      newErrors.fornecedorId = "Fornecedor é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchProdutos = async () => {
    try {
      const response = await api.get("/Produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      alert("Erro ao carregar produtos");
    }
  };

  const fetchFornecedores = async () => {
    try {
      const response = await api.get("/Fornecedores");
      setFornecedores(response.data);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      alert("Erro ao carregar fornecedores");
    }
  };

  useEffect(() => {
    fetchProdutos();
    fetchFornecedores();
  }, []);

  const handleOnChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: Number(formData.preco),
        quantidadeEstoque: Number(formData.quantidadeEstoque),
        fornecedorId: formData.fornecedorId
      };

      await api.post("/Produtos", payload);
      setShowCreateModal(false);
      resetForm();
      fetchProdutos();
      alert("Produto criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert(error.response?.data?.message || "Erro ao criar produto");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: Number(formData.preco),
        quantidadeEstoque: Number(formData.quantidadeEstoque),
        fornecedorId: formData.fornecedorId
      };

      await api.put(`/Produtos/${selectedProduto.id}`, payload);
      setShowEditModal(false);
      resetForm();
      fetchProdutos();
      alert("Produto atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert(error.response?.data?.message || "Erro ao atualizar produto");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/Produtos/${selectedProduto.id}`);
      setShowDeleteModal(false);
      setSelectedProduto(null);
      fetchProdutos();
      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert(error.response?.data?.message || "Erro ao excluir produto");
    }
  };

  const resetForm = () => {
    setFormData(produtoInitialState);
    setErrors({});
  };

  const openEditModal = (produto) => {
    setSelectedProduto(produto);
    setFormData(produto);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    resetForm();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getFornecedorNome = (fornecedorId) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    return fornecedor ? fornecedor.nomeEmpresa : 'Fornecedor não encontrado';
  };

  const ProdutoForm = ({ onSubmit, title, submitText }) => (
    <form onSubmit={onSubmit} className="needs-validation" noValidate>
      <div className="modal-header">
        <h5 className="modal-title">{title}</h5>
        <button type="button" className="btn-close" onClick={closeModals}></button>
      </div>
      <div className="modal-body">
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome:</label>
          <input
            type="text"
            className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleOnChange}
          />
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="descricao" className="form-label">Descrição:</label>
          <textarea
            className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleOnChange}
            rows="3"
          />
          {errors.descricao && <div className="invalid-feedback">{errors.descricao}</div>}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="preco" className="form-label">Preço:</label>
            <div className="input-group">
              <span className="input-group-text">R$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-control ${errors.preco ? 'is-invalid' : ''}`}
                id="preco"
                name="preco"
                value={formData.preco}
                onChange={handleOnChange}
              />
              {errors.preco && <div className="invalid-feedback">{errors.preco}</div>}
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="quantidadeEstoque" className="form-label">Quantidade em Estoque:</label>
            <input
              type="number"
              min="0"
              className={`form-control ${errors.quantidadeEstoque ? 'is-invalid' : ''}`}
              id="quantidadeEstoque"
              name="quantidadeEstoque"
              value={formData.quantidadeEstoque}
              onChange={handleOnChange}
            />
            {errors.quantidadeEstoque && <div className="invalid-feedback">{errors.quantidadeEstoque}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="fornecedorId" className="form-label">Fornecedor:</label>
          <select
            className={`form-select ${errors.fornecedorId ? 'is-invalid' : ''}`}
            id="fornecedorId"
            name="fornecedorId"
            value={formData.fornecedorId}
            onChange={handleOnChange}
          >
            <option value="">Selecione um fornecedor</option>
            {fornecedores.map(fornecedor => (
              <option key={fornecedor.id} value={fornecedor.id}>
                {fornecedor.nomeEmpresa}
              </option>
            ))}
          </select>
          {errors.fornecedorId && <div className="invalid-feedback">{errors.fornecedorId}</div>}
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={closeModals}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {submitText}
        </button>
      </div>
    </form>
  );

  const Modal = ({ show, children }) => (
    show && (
      <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {children}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Produtos</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
        >
          <Plus size={20} className="me-2" />
          Novo Produto
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Fornecedor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{produto.descricao}</td>
                <td>{formatCurrency(produto.preco)}</td>
                <td>{produto.quantidadeEstoque}</td>
                <td>{getFornecedorNome(produto.fornecedorId)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => openEditModal(produto)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setSelectedProduto(produto);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showCreateModal}>
        <ProdutoForm
          onSubmit={handleCreate}
          title="Novo Produto"
          submitText="Criar"
        />
      </Modal>

      <Modal show={showEditModal}>
        <ProdutoForm
          onSubmit={handleEdit}
          title="Editar Produto"
          submitText="Salvar"
        />
      </Modal>

      <Modal show={showDeleteModal}>
        <div className="modal-header">
          <h5 className="modal-title">Confirmar Exclusão</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowDeleteModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <p>
            Tem certeza que deseja excluir o produto{" "}
            <strong>{selectedProduto?.nome}</strong>?
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Confirmar Exclusão
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Produtos;