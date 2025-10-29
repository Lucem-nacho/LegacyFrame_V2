// Importa las funciones necesarias de Vitest para definir y ejecutar pruebas.
import { describe, it, expect, vi, beforeEach } from 'vitest';
// Importa funciones de React Testing Library para renderizar componentes y buscar elementos.
import { render, screen } from '@testing-library/react';
// Importa userEvent para simular interacciones del usuario de forma realista.
import userEvent from '@testing-library/user-event';
// Importa MemoryRouter para simular el contexto de enrutamiento necesario para componentes que usan <Link> o useNavigate.
import { MemoryRouter } from 'react-router-dom';
// Importa el componente Registro que se va a probar.
import Registro from '../Pages/Registro';

// --- Configuración de Mocks (Simulaciones) ---
// Crea una función mock (espía) para simular la función 'navigate' de react-router-dom.
const navigateMock = vi.fn();
// Crea una función mock para simular la función global 'alert'.
const alertMock = vi.fn();

// Mockea (reemplaza) el módulo 'react-router-dom'. Esto se hace antes de que se ejecuten las pruebas.
vi.mock('react-router-dom', async (importOriginal) => {
  // Importa el contenido original del módulo 'react-router-dom'.
  const actual = await importOriginal<typeof import('react-router-dom')>();
  // Retorna un objeto que mantiene todas las exportaciones originales (...actual),
  // excepto 'useNavigate', que se reemplaza por una función que devuelve nuestro mock 'navigateMock'.
  return {
    ...actual, // Conserva Link, MemoryRouter, etc.
    useNavigate: () => navigateMock, // Sobrescribe useNavigate para usar el mock.
  };
});

// Define una función que se ejecutará antes de cada prueba ('it') dentro de este archivo.
beforeEach(() => {
  // Limpia el historial de llamadas de todos los mocks (navigateMock y alertMock) para que cada prueba comience limpia.
  vi.clearAllMocks();
  // Reemplaza la función global 'window.alert' con nuestro mock 'alertMock' para poder espiar sus llamadas.
  window.alert = alertMock;
});
// --- Fin de la Configuración de Mocks ---

// Inicia un grupo de pruebas (suite) para el componente 'Registro'.
describe('Registro Component', () => {

  // Test 1: Verifica que el componente se renderice inicialmente con los campos esperados.
  it('muestra todos los campos del formulario de registro', () => {
    // Renderiza el componente Registro dentro de MemoryRouter.
    render(<MemoryRouter><Registro /></MemoryRouter>);
    // Verifica que el input asociado a la etiqueta "nombre" esté presente.
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    // Verifica que el input asociado a la etiqueta "contraseña" (exacta, usando ^$) esté presente.
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    // Verifica que el checkbox asociado a la etiqueta "acepto los términos y condiciones" esté presente.
    expect(screen.getByLabelText(/acepto los términos y condiciones/i)).toBeInTheDocument();
  });

  // Test 2: Verifica que se muestren los errores correctos al enviar el formulario vacío.
  it('muestra errores de validación si se envía el formulario vacío', async () => {
    // Configura userEvent para simular acciones del usuario.
    const user = userEvent.setup();
    // Renderiza el componente.
    render(<MemoryRouter><Registro /></MemoryRouter>);
    // Simula un clic en el botón "Crear Cuenta".
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    // Verifica (esperando si es necesario) que aparezcan los mensajes de error esperados para campos obligatorios.
    expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el apellido es obligatorio/i)).toBeInTheDocument();
    // Verifica el error que realmente muestra el componente para el email vacío (campo obligatorio).
    expect(screen.getByText(/El email es obligatorio./i)).toBeInTheDocument();
    // Verifica el error que realmente muestra el componente para la contraseña vacía (requisitos no cumplidos).
    expect(screen.getByText(/La contraseña no cumple con todos los requisitos./i)).toBeInTheDocument();
    // Verifica el error para los términos no aceptados.
    expect(screen.getByText(/Debes aceptar los términos y condiciones./i)).toBeInTheDocument();
  });

  // Test 3: Verifica que se muestre el error cuando las contraseñas no coinciden.
  it('muestra error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Registro /></MemoryRouter>);
    // Simula escribir una contraseña válida.
    await user.type(screen.getByLabelText(/^contraseña$/i), "Pass123#");
    // Simula escribir una confirmación diferente.
    await user.type(screen.getByLabelText(/confirmar contraseña/i), "Pass-diferente");
    // Simula el envío del formulario.
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    // Verifica que aparezca el mensaje de error específico para contraseñas no coincidentes.
    expect(await screen.findByText(/Las contraseñas no coinciden./i)).toBeInTheDocument();
  });

  // Test 4: Verifica que se muestre el error cuando la contraseña no cumple los requisitos de fortaleza.
  it('muestra error si la contraseña no cumple los requisitos', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Registro /></MemoryRouter>);
    // Simula escribir una contraseña débil en ambos campos.
    await user.type(screen.getByLabelText(/^contraseña$/i), "debil");
    await user.type(screen.getByLabelText(/confirmar contraseña/i), "debil");
    // Simula el envío del formulario.
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    // Define el mensaje de error esperado (el genérico que muestra el componente).
    const expectedError = /La contraseña no cumple con todos los requisitos./i;
    // Verifica que aparezca dicho mensaje de error.
    expect(await screen.findByText(expectedError)).toBeInTheDocument();
  });

  // Test 5: Verifica que se muestre el error si no se marcan los términos y condiciones, incluso si el resto del formulario es válido.
  it('muestra error si no se aceptan los términos y condiciones', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Registro /></MemoryRouter>);
    // Simula el llenado de todos los campos excepto el checkbox de términos.
    await user.type(screen.getByLabelText(/nombre/i), "Usuario");
    await user.type(screen.getByLabelText(/apellido/i), "Prueba");
    await user.type(screen.getByLabelText(/correo electrónico/i), "test@prueba.com");
    await user.type(screen.getByLabelText(/teléfono/i), "987654321"); // Aunque opcional, lo llenamos para completar el formulario.
    await user.type(screen.getByLabelText(/^contraseña$/i), "PassValida123#");
    await user.type(screen.getByLabelText(/confirmar contraseña/i), "PassValida123#");
    // Simula el envío SIN marcar los términos.
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    // Verifica que aparezca el mensaje de error específico para los términos.
    expect(await screen.findByText(/Debes aceptar los términos y condiciones./i)).toBeInTheDocument();
  });

  // Test 6: Verifica el "camino feliz": el usuario llena todo correctamente, envía el formulario,
  // y se llama a las funciones simuladas (alert y navigate) con los argumentos correctos.
  it('llama a alert y navigate si el registro es exitoso', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Registro /></MemoryRouter>);

    // Simula el llenado completo y correcto del formulario.
    await user.type(screen.getByLabelText(/nombre/i), "Usuario");
    await user.type(screen.getByLabelText(/apellido/i), "Prueba");
    await user.type(screen.getByLabelText(/correo electrónico/i), "test@prueba.com");
    await user.type(screen.getByLabelText(/teléfono/i), "987654321");
    await user.type(screen.getByLabelText(/^contraseña$/i), "PassValida123#");
    await user.type(screen.getByLabelText(/confirmar contraseña/i), "PassValida123#");
    // Simula marcar el checkbox de términos y condiciones.
    await user.click(screen.getByLabelText(/acepto los términos y condiciones/i));
    // Simula el envío del formulario válido.
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    // Define el mensaje de alerta esperado (el personalizado que incluye el nombre).
    const expectedAlert = '¡Registro exitoso para Usuario! Serás redirigido al login.';
    // Verifica que el mock de 'alert' haya sido llamado con el mensaje exacto esperado.
    expect(alertMock).toHaveBeenCalledWith(expectedAlert);
    // Verifica que el mock de 'navigate' haya sido llamado con el argumento '/login' (la ruta a la que se debe redirigir).
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
}); // Fin del bloque 'describe' para el componente Registro.