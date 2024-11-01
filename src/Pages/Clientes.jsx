import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import api from "../Services/api";

// Modelo base conforme Swagger
const clienteInitialState = {
  nome: "",
  cpf: "",
  email: "",
  telefone: ""
};

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState(clienteInitialState);
  const [errors, setErrors] = useState({});

  // Função para validar os campos conforme o modelo do Swagger
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = "CPF deve conter 11 dígitos";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  useEffect(() => {
    fetchClientes();
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
        nome: formData.nome,
        cpf: formData.cpf,
        email: formData.email,
        telefone: formData.telefone
      };

      await api.post("/Clientes", payload);
      setShowCreateModal(false);
      resetForm();
      fetchClientes();
      alert("Cliente criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      alert(error.response?.data?.message || "Erro ao criar cliente");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        nome: formData.nome,
        cpf: formData.cpf,
        email: formData.email,
        telefone: formData.telefone
      };

      await api.put(`/Clientes/${selectedCliente.id}`, payload);
      setShowEditModal(false);
      resetForm();
      fetchClientes();
      alert("Cliente atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      alert(error.response?.data?.message || "Erro ao atualizar cliente");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/Clientes/${selectedCliente.id}`);
      setShowDeleteModal(false);
      setSelectedCliente(null);
      fetchClientes();
      alert("Cliente excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      alert(error.response?.data?.message || "Erro ao excluir cliente");
    }
  };

  const resetForm = () => {
    setFormData(clienteInitialState);
    setErrors({});
  };

  const openEditModal = (cliente) => {
    setSelectedCliente(cliente);
    setFormData(cliente);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    resetForm();
  };

  const ClienteForm = ({ onSubmit, title, submitText }) => (
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
          <label htmlFor="cpf" className="form-label">CPF:</label>
          <input
            type="text"
            className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleOnChange}
          />
          {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
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
        <h1>Clientes</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
        >
          <Plus size={20} className="me-2" />
          Novo Cliente
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.cpf}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefone}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => openEditModal(cliente)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setSelectedCliente(cliente);
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
        <ClienteForm
          onSubmit={handleCreate}
          title="Novo Cliente"
          submitText="Criar"
        />
      </Modal>

      <Modal show={showEditModal}>
        <ClienteForm
          onSubmit={handleEdit}
          title="Editar Cliente"
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
            Tem certeza que deseja excluir o cliente{" "}
            <strong>{selectedCliente?.nome}</strong>?
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

export default Clientes;