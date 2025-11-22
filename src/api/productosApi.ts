import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api/catalog';

const productosApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoria: Categoria;
}

export const getProductos = async (): Promise<Producto[]> => {
  const response = await productosApi.get<Producto[]>('/productos');
  return response.data;
};

export const getProductosByCategoria = async (categoriaNombre: string): Promise<Producto[]> => {
  const productos = await getProductos();
  return productos.filter(p => p.categoria.nombre.toLowerCase() === categoriaNombre.toLowerCase());
};

export default {
  getProductos,
  getProductosByCategoria,
};
