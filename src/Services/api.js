import api from '../api'; // Certifique-se de ajustar o caminho conforme necessário

export const fetchClientes = async () => {
    try {
        const response = await api.get('/clientes'); // Altere o endpoint conforme necessário
        return response.data;
    } catch (error) {
        throw error; // Propaga o erro para ser tratado no componente
    }
};