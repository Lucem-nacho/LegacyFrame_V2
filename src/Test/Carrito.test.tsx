import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Carrito from '../Pages/Carrito'; 
import '@testing-library/jest-dom';

// Mocks
const removeItemMock = vi.fn();
const clearMock = vi.fn();
// Variables para controlar el estado del mock en cada test
let mockItems: any[] = [];
let mockTotal = 0;

// Mock del Contexto
vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    items: mockItems,
    total: mockTotal,
    removeItem: removeItemMock,
    clear: clearMock,
  })
}));

describe('Carrito Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockItems = [];
    mockTotal = 0;
  });

  it('muestra mensaje cuando el carrito está vacío', () => {
    render(<MemoryRouter><Carrito /></MemoryRouter>);
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });

  it('muestra los productos del carrito', () => {
    mockItems = [{ id: '1', name: 'Marco Lujo', price: 20000, quantity: 2, image: '/img.jpg' }];
    mockTotal = 40000;

    render(<MemoryRouter><Carrito /></MemoryRouter>);

    expect(screen.getByText('Marco Lujo')).toBeInTheDocument();
    // Busca el precio (puede variar el formato según tu configuración, buscamos parte del texto)
    expect(screen.getByText(/\$20.000/)).toBeInTheDocument();
  });

  it('elimina un item al hacer clic', async () => {
    const user = userEvent.setup();
    mockItems = [{ id: '10', name: 'Marco Borrar', price: 1000, quantity: 1 }];
    
    render(<MemoryRouter><Carrito /></MemoryRouter>);

    // Busca el botón por el aria-label que pusimos en el componente
    const btnEliminar = screen.getByRole('button', { name: /eliminar/i });
    
    await user.click(btnEliminar);

    expect(removeItemMock).toHaveBeenCalledWith('10');
  });
});