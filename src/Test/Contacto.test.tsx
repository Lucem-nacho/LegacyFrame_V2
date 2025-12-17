import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Contacto from '../Pages/Contacto';
import axios from 'axios';
import '@testing-library/jest-dom'; 

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe('Contacto Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra errores de validación si se envía el formulario vacío', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Contacto /></MemoryRouter>);
    
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
    
    expect(await screen.findByText('Nombre obligatorio')).toBeInTheDocument();
    expect(screen.getByText('Email obligatorio')).toBeInTheDocument();
    expect(screen.getByText('Mensaje obligatorio')).toBeInTheDocument();
  });

  it('envía mensaje exitosamente', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValueOnce({ data: "OK" });

    render(<MemoryRouter><Contacto /></MemoryRouter>);

    const nombreInput = screen.getByPlaceholderText(/juan pérez/i); 
    const emailInput = screen.getByPlaceholderText(/nombre@ejemplo.com/i);
    const mensajeInput = screen.getByPlaceholderText(/cuéntanos qué necesitas/i);

    await user.type(nombreInput, "Usuario Prueba");
    await user.type(emailInput, "test@correo.com");
    await user.type(mensajeInput, "Hola, esto es una prueba");
    
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
    
    await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalled();
        expect(screen.getByText(/¡mensaje enviado con éxito!/i)).toBeInTheDocument();
    });
  });
});