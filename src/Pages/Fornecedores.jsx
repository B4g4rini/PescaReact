import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import api from "../Services/api";

// Modelo base conforme Swagger
const fornecedorInitialState = {
  nomeEmpresa: "",
  cnpj: "",
  endereco: "",
  telefone: "",
  email: ""
};

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [formData, setFormData] = useState(fornecedorInitialState);
  const [errors, setErrors] = useState({});

  // Função para validar os campos conforme o modelo do Swagger
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nomeEmpresa.trim()) {
      newErrors.nomeEmpresa = "Nome da empresa é obrigatório";
    }
    
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else if (!/^\d{14}$/.test(formData.cnpj.replace(/\D/g, ''))) {
      newErrors.cnpj = "CNPJ deve conter 14 dígitos";
    }
    
    if (!formData.endereco.trim()) {
      newErrors.endereco = "Endereço é obrigatório";
    }
    
    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    fetchFornecedores();
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa o erro do campo quando o usuário começa a digitar
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
        nomeEmpresa: formData.nomeEmpresa,
        cnpj: formData.cnpj,
        endereco: formData.endereco,
        telefone: formData.telefone,
        email: formData.email
      };

      await api.post("/Fornecedores", payload);
      setShowCreateModal(false);
      resetForm();
      fetchFornecedores();
      alert("Fornecedor criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
      alert(error.response?.data?.message || "Erro ao criar fornecedor");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        nomeEmpresa: formData.nomeEmpresa,
        cnpj: formData.cnpj,
        endereco: formData.endereco,
        telefone: formData.telefone,
        email: formData.email
      };

      await api.put(`/Fornecedores/${selectedFornecedor.id}`, payload);
      setShowEditModal(false);
      resetForm();
      fetchFornecedores();
      alert("Fornecedor atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      alert(error.response?.data?.message || "Erro ao atualizar fornecedor");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/Fornecedores/${selectedFornecedor.id}`);
      setShowDeleteModal(false);
      setSelectedFornecedor(null);
      fetchFornecedores();
      alert("Fornecedor excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      alert(error.response?.data?.message || "Erro ao excluir fornecedor");
    }
  };

  const resetForm = () => {
    setFormData(fornecedorInitialState);
    setErrors({});
  };

  const openEditModal = (fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setFormData(fornecedor);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    resetForm();
  };

  const FornecedorForm = ({ onSubmit, title, submitText }) => (
    <form onSubmit={onSubmit} className="needs-validation" noValidate>
      <div className="modal-header">
        <h5 className="modal-title">{title}</h5>
        <button type="button" className="btn-close" onClick={closeModals}></button>
      </div>
      <div className="modal-body">
        <div className="mb-3">
          <label htmlFor="nomeEmpresa" className="form-label">Nome da Empresa:</label>
          <input
            type="text"
            className={`form-control ${errors.nomeEmpresa ? 'is-invalid' : ''}`}
            id="nomeEmpresa"
            name="nomeEmpresa"
            value={formData.nomeEmpresa}
            onChange={handleOnChange}
          />
          {errors.nomeEmpresa && <div className="invalid-feedback">{errors.nomeEmpresa}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="cnpj" className="form-label">CNPJ:</label>
          <input
            type="text"
            className={`form-control ${errors.cnpj ? 'is-invalid' : ''}`}
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleOnChange}
          />
          {errors.cnpj && <div className="invalid-feedback">{errors.cnpj}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="endereco" className="form-label">Endereço:</label>
          <input
            type="text"
            className={`form-control ${errors.endereco ? 'is-invalid' : ''}`}
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleOnChange}
          />
          {errors.endereco && <div className="invalid-feedback">{errors.endereco}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="telefone" className="form-label">Telefone:</label>
          <input
            type="text"
            className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleOnChange}
          />
          {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleOnChange}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
        <h1>Fornecedores</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
        >
          <Plus size={20} className="me-2" />
          Novo Fornecedor
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nome da Empresa</th>
              <th>CNPJ</th>
              <th>Endereço</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td>{fornecedor.nomeEmpresa}</td>
                <td>{fornecedor.cnpj}</td>
                <td>{fornecedor.endereco}</td>
                <td>{fornecedor.telefone}</td>
                <td>{fornecedor.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => openEditModal(fornecedor)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setSelectedFornecedor(fornecedor);
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
        <FornecedorForm
          onSubmit={handleCreate}
          title="Novo Fornecedor"
          submitText="Criar"
        />
      </Modal>

      <Modal show={showEditModal}>
        <FornecedorForm
          onSubmit={handleEdit}
          title="Editar Fornecedor"
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
            Tem certeza que deseja excluir o fornecedor{" "}
            <strong>{selectedFornecedor?.nomeEmpresa}</strong>?
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

export default Fornecedores;