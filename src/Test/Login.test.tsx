// Importa las funciones necesarias de Vitest: describe para agrupar tests, it para definir un test individual,
// expect para hacer aserciones (verificar si algo es correcto), y vi para crear mocks (simuladores).
import { describe, it, expect, vi } from 'vitest';
// Importa funciones de React Testing Library: render para dibujar el componente en un DOM virtual,
// y screen para buscar elementos en ese DOM virtual.
import { render, screen } from '@testing-library/react';
// Importa userEvent, una librería que simula interacciones del usuario (clics, escribir texto) de forma más realista.
import userEvent from '@testing-library/user-event';
// Importa MemoryRouter de react-router-dom. Es necesario porque el componente Login usa <Link>,
// y MemoryRouter simula el contexto del router en las pruebas sin necesitar un navegador real.
import { MemoryRouter } from 'react-router-dom';
// Importa el componente Login que vamos a probar. Asegúrate que la ruta sea correcta.
import Login from '../Pages/Login';

// Inicia un bloque de pruebas agrupadas bajo el nombre 'Login Component'. Describe el componente o funcionalidad que se está probando.
describe('Login Component', () => {
  // Test 1: Verifica que el componente se renderice correctamente con sus elementos iniciales visibles.
  // 'it' define una prueba individual con una descripción de lo que debería hacer.
  it('muestra los campos de correo y contraseña y el botón', () => {
    // Renderiza el componente Login dentro del MemoryRouter para simular el entorno de enrutamiento.
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Busca un input asociado a una etiqueta (<label>) que contenga el texto "correo electrónico" (ignorando mayúsculas/minúsculas).
    // 'expect(...).toBeInTheDocument()' afirma que el elemento encontrado debe estar presente en el DOM virtual.
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    // Busca un input asociado a una etiqueta que contenga el texto "contraseña".
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    // Busca un elemento con el rol ARIA 'button' (generalmente <button>) que tenga el texto accesible "ingresar".
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  // Test 2: Verifica que se muestren los mensajes de error de validación correctos cuando se intenta enviar el formulario vacío.
  // La prueba es 'async' porque usamos acciones de 'userEvent' y 'findByText' que son asíncronas (devuelven promesas).
  it('muestra errores de validación si los campos están vacíos', async () => {
    // Configura userEvent. Es una buena práctica hacerlo al inicio del test si se van a simular varias interacciones.
    const user = userEvent.setup();
    // Renderiza el componente.
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula un clic del usuario en el botón que tiene el texto "Ingresar". 'await' espera a que la simulación del clic termine.
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // Busca asíncronamente un elemento que contenga el texto "el correo es obligatorio".
    // 'findByText' espera un corto tiempo a que el elemento aparezca, lo cual es útil si el error se muestra después de una actualización de estado.
    expect(await screen.findByText(/el correo es obligatorio/i)).toBeInTheDocument();
    // Busca asíncronamente el mensaje de error para la contraseña vacía.
    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();

    // Verifica que el mensaje de error general de login ("Correo electrónico o contraseña incorrectos") NO esté presente.
    // 'queryByText' se usa para buscar un elemento que podría no existir; devuelve null si no lo encuentra (no lanza error).
    // '.not.toBeInTheDocument()' afirma que el elemento no debe estar en el DOM.
    expect(screen.queryByText(/correo electrónico o contraseña incorrectos/i)).not.toBeInTheDocument();
  });

  // Test 3: Verifica que se muestre el error de formato específico si se ingresa un email con formato inválido.
  it('muestra error de formato de email', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula al usuario escribiendo "email-invalido.com" en el campo de correo electrónico.
    await user.type(screen.getByLabelText(/correo electrónico/i), "email-invalido.com");
    // Simula un clic en el botón "Ingresar".
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // Espera a que aparezca el mensaje de error indicando que el formato del correo no es válido.
    expect(await screen.findByText(/el formato del correo no es válido/i)).toBeInTheDocument();
  });

  // Test 4: Verifica que se muestre el error general de login cuando se ingresan credenciales incorrectas (pero con formato válido).
  it('muestra error de login con credenciales incorrectas', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula al usuario escribiendo un correo con formato válido (el correcto simulado).
    await user.type(screen.getByLabelText(/correo electrónico/i), "a@a.cl");
    // Simula al usuario escribiendo una contraseña incorrecta.
    await user.type(screen.getByLabelText(/contraseña/i), "pass-incorrecta");
    // Simula un clic en el botón "Ingresar".
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // Espera a que aparezca el mensaje de error general indicando credenciales incorrectas.
    expect(await screen.findByText(/correo electrónico o contraseña incorrectos/i)).toBeInTheDocument();
    // Verifica también que no aparezcan los errores de campo vacío (como el de correo obligatorio).
    expect(screen.queryByText(/el correo es obligatorio/i)).not.toBeInTheDocument();
  });

  // Test 5: Verifica el "camino feliz": el usuario ingresa credenciales correctas, el login es exitoso
  // y se llama a la función `onLoginSuccess` pasada como prop.
  it('llama a onLoginSuccess con credenciales correctas', async () => {
    const user = userEvent.setup();

    // 1. Crea una "función espía" (mock) usando vi.fn(). Esta función simulada registrará si es llamada, cuántas veces y con qué argumentos.
    const mockOnLoginSuccess = vi.fn();

    // 2. Renderiza el componente Login, pasándole la función mock (`mockOnLoginSuccess`) como valor para la prop `onLoginSuccess`.
    // Esto permite al componente invocar nuestro mock cuando la lógica interna determine que el login fue exitoso.
    render(
      <MemoryRouter>
        {/* Pasa la función mock al componente */}
        <Login onLoginSuccess={mockOnLoginSuccess} />
      </MemoryRouter>
    );

    // 3. Simula al usuario escribiendo las credenciales correctas definidas en la lógica del componente.
    await user.type(screen.getByLabelText(/correo electrónico/i), "a@a.cl");
    await user.type(screen.getByLabelText(/contraseña/i), "Pass123#");

    // 4. Simula un clic en el botón "Ingresar".
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // 5. Realiza las aserciones para verificar el resultado esperado:
    // Afirma que la función mock `mockOnLoginSuccess` fue llamada al menos una vez.
    expect(mockOnLoginSuccess).toHaveBeenCalled();
    // Opcional pero recomendado: Afirma que la función mock fue llamada exactamente una vez.
    expect(mockOnLoginSuccess).toHaveBeenCalledOnce();

    // Adicionalmente, verifica que NO apareció ningún mensaje de error en la pantalla.
    expect(screen.queryByText(/correo electrónico o contraseña incorrectos/i)).not.toBeInTheDocument();
  });
}); // Fin del bloque 'describe' que agrupa todos los tests para el componente Login.