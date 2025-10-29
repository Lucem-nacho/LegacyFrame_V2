import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Registro from '../Pages/Registro';

// --- Configuración de Mocks---
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
// ------------------------------

describe('Registro Component', () => {

  // Test 1: (Pasaba)
  it('muestra todos los campos del formulario de registro', () => {
    render(<MemoryRouter><Registro /></MemoryRouter>);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/acepto los términos y condiciones/i)).toBeInTheDocument();
  });

  // Test 2: Envío de formulario vacío 
  it('muestra errores de validación si se envía el formulario vacío', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Registro /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    // Verificamos los errores que VIMOS en el log
    expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el apellido es obligatorio/i)).toBeInTheDocument();
    
    // CORRECCIÓN: Buscamos el error de formato que tu componente muestra
    expect(screen.getByText(/El formato del email no es válido./i)).toBeInTheDocument();
    
    // CORRECCIÓN: Buscamos el error de requisitos que tu componente muestra
    expect(screen.getByText(/La contraseña no cumple con todos los requisitos./i)).toBeInTheDocument();
    
    expect(screen.getByText(/Debes aceptar los términos y condiciones./i)).toBeInTheDocument();
  });

  // Test 3
  it('muestra error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Registro /></MemoryRouter>);
    await user.type(screen.getByLabelText(/^contraseña$/i), "Pass123#");
    await user.type(screen.getByLabelText(/confirmar contraseña/i), "Pass-diferente");
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(await screen.findByText(/Las contraseñas no coinciden./i)).toBeInTheDocument();
  });

  // Test 4
  it('muestra error si la contraseña no cumple los requisitos', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Registro /></MemoryRouter>);
    await user.type(screen.getByLabelText(/^contraseña$/i), "debil");
    await user.type(screen.getByLabelText(/confirmar contraseña/i), "debil");
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    const expectedError = /La contraseña no cumple con todos los requisitos./i;
    expect(await screen.findByText(expectedError)).toBeInTheDocument();
  });

  // Test 5
  it('muestra error si no se aceptan los términos y condiciones', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Registro /></MemoryRouter>);
    await user.type(screen.getByLabelText(/nombre/i), "Usuario");
    await user.type(screen.getByLabelText(/apellido/i), "Prueba");
    await user.type(screen.getByLabelText(/correo electrónico/i), "test@prueba.com");
    await user.type(screen.getByLabelText(/teléfono/i), "987654321");
    await user.type(screen.getByLabelText(/^contraseña$/i), "PassValida123#");
    await user.type(screen.getByLabelText(/confirmar contraseña/i), "PassValida123#");
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(await screen.findByText(/Debes aceptar los términos y condiciones./i)).toBeInTheDocument();
  });

  // Test 6
  it('llama a alert y navigate si el registro es exitoso', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Registro /></MemoryRouter>);

    await user.type(screen.getByLabelText(/nombre/i), "Usuario");
    await user.type(screen.getByLabelText(/apellido/i), "Prueba");
    await user.type(screen.getByLabelText(/correo electrónico/i), "test@prueba.com");
    await user.type(screen.getByLabelText(/teléfono/i), "987654321");
    await user.type(screen.getByLabelText(/^contraseña$/i), "PassValida123#");
    await user.type(screen.getByLabelText(/confirmar contraseña/i), "PassValida123#");
    await user.click(screen.getByLabelText(/acepto los términos y condiciones/i));
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    
    const expectedAlert = '¡Registro exitoso para Usuario! Serás redirigido al login.';
    expect(alertMock).toHaveBeenCalledWith(expectedAlert);
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});