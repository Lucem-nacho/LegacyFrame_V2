import { describe, it, expect, vi, beforeEach, afterEach, type Mocked } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Pages/Login';
import axios from 'axios';
import '@testing-library/jest-dom';

// 1. Mock de Axios
vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

// 2. Mock de window.alert
const alertMock = vi.fn();

// 3. Mock de useAuth (Contexto) para evitar el error de "AuthProvider"
const loginMock = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock
  })
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = alertMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('muestra los campos de correo y contraseña y el botón', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // USAMOS PLACEHOLDER PORQUE TU COMPONENTE NO TIENE ID EN LOS INPUTS
    expect(screen.getByPlaceholderText(/ejemplo@correo.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  it('los campos tienen el atributo required', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/ejemplo@correo.com/i)).toBeRequired();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeRequired();
  });

  it('muestra alerta de error con credenciales incorrectas', async () => {
    const user = userEvent.setup();
    // Simulamos que el backend rechaza el login
    mockedAxios.post.mockRejectedValueOnce(new Error('Error login'));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Llenamos el formulario
    await user.type(screen.getByPlaceholderText(/ejemplo@correo.com/i), "test@error.com");
    await user.type(screen.getByPlaceholderText(/••••••••/i), "wrongpass");
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // Esperamos la alerta
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Credenciales incorrectas o error en el servidor.");
    });
  });

  it('realiza login exitoso', async () => {
    const user = userEvent.setup();
    // Simulamos token exitoso
    const fakeToken = "header.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbCI6IlJPTEVfVVNFUiIsIm5vbWJyZSI6IlVzdWFyaW8ifQ.signature";
    
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: fakeToken }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/ejemplo@correo.com/i), "admin@test.com");
    await user.type(screen.getByPlaceholderText(/••••••••/i), "password123");
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      // Verificamos llamada a axios
      expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:8082/auth/login", {
        email: "admin@test.com",
        password: "password123",
      });
      // Verificamos que se logueó en el contexto
      expect(loginMock).toHaveBeenCalled(); 
    });
  });
});