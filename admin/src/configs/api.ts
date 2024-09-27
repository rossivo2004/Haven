const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const apiConfig = {
  products: {
    getAll: `${baseUrl}/api/product/`,
    getDetailByTag: `${baseUrl}api/product/getProductByTag/`,
    deletePr: `${baseUrl}api/product/delete/`,
    updatepr: `${baseUrl}api/product/update/`,
    createPr: `${baseUrl}api/product/store/`,
  },
  categories: {
    getAll: `${baseUrl}/api/category/`,
    createCt: `${baseUrl}/api/category/store/`,
    updateCt: `${baseUrl}/api/category/update/`,
    deleteCt: `${baseUrl}/api/category/delete/`,
  },
  brands: {
    getAll: `${baseUrl}/api/brand/`,
    createBr: `${baseUrl}/api/brand/store/`,
    updateBr: `${baseUrl}/api/brand/update/`,
    deleteBr: `${baseUrl}/api/brand/delete/`,
  },
};

export default apiConfig;
