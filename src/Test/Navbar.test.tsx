import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '@testing-library/jest-dom';

const logoutMock = vi.fn();
let mockUser: { nombre: string; rol: string; isAdmin?: boolean; email: string } | null = null;
let mockCartCount = 0;

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: logoutMock
  })
}));

vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    count: mockCartCount
  })
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
    mockCartCount = 0;
  });

  it('muestra enlaces públicos (Molduras, Cuadros)', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    // CAMBIO: Buscamos enlaces reales de tu Navbar
    expect(screen.getByText(/Molduras/i)).toBeInTheDocument();
    expect(screen.getByText(/Cuadros/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
  });

  it('muestra botón "Mi Perfil" cuando está logueado', () => {
    mockUser = { nombre: 'Estudiante', rol: 'ROLE_USER', email: 'test@duoc.cl' };
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    
    // CAMBIO: Tu navbar dice "Mi Perfil", no "Hola Estudiante"
    expect(screen.getByText(/Mi Perfil/i)).toBeInTheDocument();
    // Verifica que el botón de Ingresar ya no esté
    expect(screen.queryByText(/Ingresar/i)).not.toBeInTheDocument();
  });

  it('muestra badge del carrito con cantidad', () => {
    mockCartCount = 5;
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});