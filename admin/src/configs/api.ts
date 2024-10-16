const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const apiConfig = {
  products: {
    getAll: `${baseUrl}/api/product/`,
    getDetailByTag: `${baseUrl}/api/product/getProductByTag/`,
    deletePr: `${baseUrl}/api/product/delete/`,
    updatepr: `${baseUrl}/api/product/update/`,
    createPr: `${baseUrl}/api/product/store/`,

    getproductvariants : `${baseUrl}/api/product/getproductvariants/`,
    deleteproductvariants : `${baseUrl}/api/productvariant/delete/`,
    createproductvariants : `${baseUrl}/api/productvariant/store/`,
    updateproductvariants : `${baseUrl}/api/productvariant/update/`,

    // Show all sản phẩm biến thể
    getallproductvariants : `${baseUrl}/api/product/shop`,

    // Xóa ảnh sản phẩm chính
    deleteproductimage : `${baseUrl}/api/productimage/delete/`,
    // Thêm ảnh sản phẩm chính
    addproductimage : `${baseUrl}/api/productimage/store`,
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

  flashsale : {
    getAllFlashsale: `${baseUrl}/api/flashsale`,
    // Hiển thị thông tin để cập nhật biến thể , id trên url là id bảng flash sale product
    getflashsale : `${baseUrl}/api/flashsale/edit/`,
    // Thêm mới flash sale product
    createflashsale : `${baseUrl}/api/flashsale/store`,
    // Cập nhật flash sale product
    updateflashsale : `${baseUrl}/api/flashsale/update/`,
    // Xóa flash sale product
    deleteflashsale : `${baseUrl}/api/flashsale/delete/`,

    // Show các sản phẩm trong flashsale
    // /flashsale/getproductvariants/{id}
    getShowProductFlashsale : `${baseUrl}/api/flashsale/getproductvariants/`,

    //Sửa time trong flashsale
    // /flashsale/update/{id}
    editTimeFlashSale : `${baseUrl}/api/flashsale/update/`,

    //Sửa thông tin của sản phẩm trong flashsale
    // /flashsaleproduct/update/{id}
    editProductFlashSale : `${baseUrl}/api/flashsaleproduct/update/`,

    //Xóa sản phẩm trong flashsale
    // /flashsaleproduct/delete/{id}
    deleteProductFlashSale : `${baseUrl}/api/flashsaleproduct/delete/`,

    //Show sản phẩm chưa có trong flashsale
    // /flashsale/getProductNotInFlashSale/{id}
    getProductNotInFlashSale : `${baseUrl}/api/flashsale/getProductNotInFlashSale/`,

    //Thêm sản phẩm vào flashsale
    // /flashsale/addProductToFlashSale/{id}
    addProductToFlashSale : `${baseUrl}/api/flashsaleproduct/store/`,

  }
};

export default apiConfig;
