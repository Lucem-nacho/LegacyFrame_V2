import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Registro from '../Pages/Registro';
import axios from 'axios';
import '@testing-library/jest-dom';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;
const navigateMock = vi.fn();
const alertMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  window.alert = alertMock;
});

// Helper para obtener inputs por nombre (ya que los labels no están asociados)
const getByName = (name: string) => document.querySelector(`input[name="${name}"]`);

describe('Registro Component', () => {

  it('muestra errores de validación si se envía el formulario vacío', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Registro /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('El apellido es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('El correo es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
    expect(screen.getByText('Debes aceptar los términos')).toBeInTheDocument();
  });

  it('muestra error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup();
    const { container } = render(<MemoryRouter><Registro /></MemoryRouter>);
    
    // Usamos selectores directos al DOM
    const passInput = container.querySelector('input[name="password"]');
    const confirmInput = container.querySelector('input[name="confirmPassword"]');

    if (passInput) await user.type(passInput, "Pass123456");
    if (confirmInput) await user.type(confirmInput, "PassDiferente");
    
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    
    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();
  });

  it('envía el formulario exitosamente', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValueOnce({ data: "Usuario creado" });

    const { container } = render(<MemoryRouter><Registro /></MemoryRouter>);

    // Llenamos el formulario usando selectores por nombre
    await user.type(container.querySelector('input[name="nombre"]')!, "Juan");
    await user.type(container.querySelector('input[name="apellido"]')!, "Perez");
    await user.type(container.querySelector('input[name="email"]')!, "juan@test.com");
    await user.type(container.querySelector('input[name="password"]')!, "123456");
    await user.type(container.querySelector('input[name="confirmPassword"]')!, "123456");
    
    // El checkbox de términos sí tiene ID en tu código, así que podemos usar getByLabelText o selector
    const termsCheckbox = container.querySelector('input[name="terms"]');
    if (termsCheckbox) await user.click(termsCheckbox);

    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalled();
        expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("Registro exitoso"));
        expect(navigateMock).toHaveBeenCalledWith('/login');
    });
  });
});