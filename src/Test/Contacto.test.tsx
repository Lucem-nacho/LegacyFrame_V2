import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Contacto from '../Pages/Contacto'; // Ajusta la ruta

// --- Configuración de Mocks ---
const alertMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  window.alert = alertMock;
});
// ------------------------------

describe('Contacto Component', () => {

  // Test 1
  it('muestra todos los campos del formulario de contacto', () => {
    render(<MemoryRouter><Contacto /></MemoryRouter>);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
  });

  // Test 2
  it('muestra errores de validación si se envía el formulario vacío', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Contacto /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
    expect(await screen.findByText(/el nombre es obligatorio./i)).toBeInTheDocument();
    expect(screen.getByText(/el email es obligatorio./i)).toBeInTheDocument();
    expect(screen.getByText(/el mensaje debe tener al menos 10 caracteres./i)).toBeInTheDocument();
    expect(alertMock).not.toHaveBeenCalled();
  });

  // Test 3
  it('muestra error si el formato de email no es válido', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Contacto /></MemoryRouter>);
    await user.type(screen.getByLabelText(/nombre/i), "Usuario Prueba");
    await user.type(screen.getByLabelText(/email/i), "email-invalido");
    await user.type(screen.getByLabelText(/mensaje/i), "Este es un mensaje de prueba válido.");
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
    expect(await screen.findByText(/el formato del email no es válido./i)).toBeInTheDocument();
  });

  // Test 4
  it('muestra error si el mensaje es muy corto', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Contacto /></MemoryRouter>);
    await user.type(screen.getByLabelText(/nombre/i), "Usuario Prueba");
    await user.type(screen.getByLabelText(/email/i), "email@valido.com");
    await user.type(screen.getByLabelText(/mensaje/i), "corta");
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
    expect(await screen.findByText(/el mensaje debe tener al menos 10 caracteres./i)).toBeInTheDocument();
  });

  // Test 5
  it('llama a alert y limpia los campos si el envío es exitoso', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Contacto /></MemoryRouter>);

    const nombreInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const mensajeInput = screen.getByLabelText(/mensaje/i);

    await user.type(nombreInput, "Usuario Prueba");
    await user.type(emailInput, "email@valido.com");
    await user.type(mensajeInput, "Este es un mensaje de prueba suficientemente largo.");
    
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
    
    const expectedAlert = 'Gracias Usuario Prueba, tu mensaje ha sido enviado!';
    expect(alertMock).toHaveBeenCalledWith(expectedAlert);
    
    expect(nombreInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(mensajeInput).toHaveValue('');

    expect(screen.queryByText(/el nombre es obligatorio/i)).not.toBeInTheDocument();
  });

  // Test Mensaje muy largo 
  it('muestra error si el mensaje es muy largo', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Contacto />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/nombre/i), "Usuario Prueba");
    await user.type(screen.getByLabelText(/email/i), "email@valido.com");

    const mensajeLargo = "a".repeat(301); 
    await user.type(screen.getByLabelText(/mensaje/i), mensajeLargo);
    
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
    
    expect(await screen.findByText(/El mensaje no puede exceder los 300 caracteres./i)).toBeInTheDocument();
    expect(alertMock).not.toHaveBeenCalled();
    
  }, 10000); 
});