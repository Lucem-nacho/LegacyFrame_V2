import { describe, it, expect, vi, beforeEach, afterEach, type Mocked } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Pages/Home';
import axios from 'axios';
import '@testing-library/jest-dom';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;
const addItemMock = vi.fn();
let mockUser: { email: string } | null = null;

vi.mock('../context/CartContext', () => ({
  useCart: () => ({ addItem: addItemMock })
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser })
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null; 
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza correctamente y carga productos', async () => {
    mockedAxios.get.mockResolvedValueOnce({ 
      data: [{ id: 1, nombre: 'Marco Test', precio: 5000, imagenUrl: '/img.jpg', descripcion: '...', stock: 5 }] 
    });

    await act(async () => {
      render(<MemoryRouter><Home /></MemoryRouter>);
    });

    // CAMBIO: Buscamos específicamente el Encabezado (H1)
    expect(screen.getByRole('heading', { name: /Legacy Frames/i })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Marco Test')).toBeInTheDocument();
    });
  });

  it('agrega un producto al carrito', async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValueOnce({ 
      data: [{ id: 1, nombre: 'Marco Test', precio: 5000, imagenUrl: '/img.jpg', descripcion: '...', stock: 5 }] 
    });

    await act(async () => {
      render(<MemoryRouter><Home /></MemoryRouter>);
    });

    const btnAgregar = await screen.findByRole('button', { name: /agregar/i });
    await user.click(btnAgregar);

    expect(addItemMock).toHaveBeenCalled();
  });

  it('oculta CTA si usuario está logueado', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    mockUser = { email: 'user@test.com' }; 

    await act(async () => {
      render(<MemoryRouter><Home /></MemoryRouter>);
    });

    expect(screen.queryByText(/Únete/i)).not.toBeInTheDocument();
  });
});