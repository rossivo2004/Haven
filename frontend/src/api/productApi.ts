import axios from 'axios';

const BASE_URL = 'https://api.sampleapis.com/beers/ale';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching products');
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching product with id: ${id}`);
  }
};
