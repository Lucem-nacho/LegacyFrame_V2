import { describe, it, expect, vi } from 'vitest'; // 'vi' es para mocks
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Pages/Login'; // Asegúrate que la ruta sea correcta

describe('Login Component', () => {
  // Test 1: Que el componente se pinte (Render)
  it('muestra los campos de correo y contraseña y el botón', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // El label del correo ahora es "Correo Electrónico"
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument(); 
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  // Test 2: Validación de campos vacíos
  it('muestra errores de validación si los campos están vacíos', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // Buscamos los errores específicos que definimos en el 'validate()'
    expect(await screen.findByText(/el correo es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    
    // Verificamos que el error de "login" (el general) NO aparezca
    expect(screen.queryByText(/correo electrónico o contraseña incorrectos/i)).not.toBeInTheDocument();
  });

  // Test 3: Validación de formato de email
  it('muestra error de formato de email', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/correo electrónico/i), "email-invalido.com");
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(await screen.findByText(/el formato del correo no es válido/i)).toBeInTheDocument();
  });

  // Test 4: Credenciales incorrectas
  it('muestra error de login con credenciales incorrectas', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    await user.type(screen.getByLabelText(/correo electrónico/i), "a@a.cl"); // Correo OK
    await user.type(screen.getByLabelText(/contraseña/i), "pass-incorrecta"); // Pass mal
    await user.click(screen.getByRole('button', { name: /ingresar/i }));


    expect(await screen.findByText(/correo electrónico o contraseña incorrectos/i)).toBeInTheDocument();
    expect(screen.queryByText(/el correo es obligatorio/i)).not.toBeInTheDocument();
  });

  // Test 5: Login Exitoso (probando la prop onLoginSuccess)

  it('llama a onLoginSuccess con credenciales correctas', async () => {
    const user = userEvent.setup();
    
    // 1. Creamos una "función espía" (mock)
    const mockOnLoginSuccess = vi.fn();

    // 2. Renderizamos el componente y le pasamos el mock como prop
    render(
      <MemoryRouter>
        <Login onLoginSuccess={mockOnLoginSuccess} />
      </MemoryRouter>
    );

    // 3. Llenamos el formulario con datos correctos
    await user.type(screen.getByLabelText(/correo electrónico/i), "a@a.cl");
    await user.type(screen.getByLabelText(/contraseña/i), "Pass123#");

    // 4. Hacemos clic
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // 5. Verificamos que nuestra función espía fue llamada
    expect(mockOnLoginSuccess).toHaveBeenCalled();
    expect(mockOnLoginSuccess).toHaveBeenCalledOnce();

    // Verificamos que NO apareció ningún error
    expect(screen.queryByText(/correo electrónico o contraseña incorrectos/i)).not.toBeInTheDocument();
  });
});