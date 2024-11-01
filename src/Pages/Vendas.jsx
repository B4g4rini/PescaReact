import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import api from "../Services/api";

const vendaInitialState = {
  clienteId: "",
  produtoId: "",
  valorTotal: 0,
  dataEmissao: new Date().toISOString()
};

const Vendas = () => {
  const [vendas, setVendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [formData, setFormData] = useState(vendaInitialState);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clienteId) {
      newErrors.clienteId = "Cliente é obrigatório";
    }
    
    if (!formData.produtoId) {
      newErrors.produtoId = "Produto é obrigatório";
    }
    
    if (formData.valorTotal <= 0) {
      newErrors.valorTotal = "Valor total deve ser maior que zero";
    }
    
    if (!formData.dataEmissao) {
      newErrors.dataEmissao = "Data de emissão é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchVendas = async () => {
    try {
      const response = await api.get("/Vendas");
      setVendas(response.data);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
      alert("Erro ao carregar vendas");
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get("/Clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      alert("Erro ao carregar clientes");
    }
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

  useEffect(() => {
    fetchVendas();
    fetchClientes();
    fetchProdutos();
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
        clienteId: formData.clienteId,
        produtoId: formData.produtoId,
        valorTotal: Number(formData.valorTotal),
        dataEmissao: formData.dataEmissao
      };

      await api.post("/Vendas", payload);
      setShowCreateModal(false);
      resetForm();
      fetchVendas();
      alert("Venda registrada com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      alert(error.response?.data?.message || "Erro ao registrar venda");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        clienteId: formData.clienteId,
        produtoId: formData.produtoId,
        valorTotal: Number(formData.valorTotal),
        dataEmissao: formData.dataEmissao
      };

      await api.put(`/Vendas/${selectedVenda.vendaId}`, payload);
      setShowEditModal(false);
      resetForm();
      fetchVendas();
      alert("Venda atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar venda:", error);
      alert(error.response?.data?.message || "Erro ao atualizar venda");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/Vendas/${selectedVenda.vendaId}`);
      setShowDeleteModal(false);
      setSelectedVenda(null);
      fetchVendas();
      alert("Venda excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar venda:", error);
      alert(error.response?.data?.message || "Erro ao excluir venda");
    }
  };

  const resetForm = () => {
    setFormData(vendaInitialState);
    setErrors({});
  };

  const openEditModal = (venda) => {
    setSelectedVenda(venda);
    setFormData(venda);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const getProdutoNome = (produtoId) => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto ? produto.nome : 'Produto não encontrado';
  };

  const VendaForm = ({ onSubmit, title, submitText }) => (
    <form onSubmit={onSubmit} className="needs-validation" noValidate>
      <div className="modal-header">
        <h5 className="modal-title">{title}</h5>
        <button type="button" className="btn-close" onClick={closeModals}></button>
      </div>
      <div className="modal-body">
        <div className="mb-3">
          <label htmlFor="clienteId" className="form-label">Cliente:</label>
          <select
            className={`form-select ${errors.clienteId ? 'is-invalid' : ''}`}
            id="clienteId"
            name="clienteId"
            value={formData.clienteId}
            onChange={handleOnChange}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          {errors.clienteId && <div className="invalid-feedback">{errors.clienteId}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="produtoId" className="form-label">Produto:</label>
          <select
            className={`form-select ${errors.produtoId ? 'is-invalid' : ''}`}
            id="produtoId"
            name="produtoId"
            value={formData.produtoId}
            onChange={handleOnChange}
          >
            <option value="">Selecione um produto</option>
            {produtos.map(produto => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
          {errors.produtoId && <div className="invalid-feedback">{errors.produtoId}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="valorTotal" className="form-label">Valor Total:</label>
          <div className="input-group">
            <span className="input-group-text">R$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`form-control ${errors.valorTotal ? 'is-invalid' : ''}`}
              id="valorTotal"
              name="valorTotal"
              value={formData.valorTotal}
              onChange={handleOnChange}
            />
            {errors.valorTotal && <div className="invalid-feedback">{errors.valorTotal}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="dataEmissao" className="form-label">Data de Emissão:</label>
          <input
            type="datetime-local"
            className={`form-control ${errors.dataEmissao ? 'is-invalid' : ''}`}
            id="dataEmissao"
            name="dataEmissao"
            value={formData.dataEmissao.slice(0, 16)}
            onChange={handleOnChange}
          />
          {errors.dataEmissao && <div className="invalid-feedback">{errors.dataEmissao}</div>}
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
        <h1>Vendas</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
        >
          <Plus size={20} className="me-2" />
          Nova Venda
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Valor Total</th>
              <th>Data de Emissão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => (
              <tr key={venda.vendaId}>
                <td>{getClienteNome(venda.clienteId)}</td>
                <td>{getProdutoNome(venda.produtoId)}</td>
                <td>{formatCurrency(venda.valorTotal)}</td>
                <td>{formatDate(venda.dataEmissao)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => openEditModal(venda)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setSelectedVenda(venda);
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
        <VendaForm
          onSubmit={handleCreate}
          title="Nova Venda"
          submitText="Registrar"
        />
      </Modal>

      <Modal show={showEditModal}>
        <VendaForm
          onSubmit={handleEdit}
          title="Editar Venda"
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
            Tem certeza que deseja excluir esta venda?
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

export default Vendas;