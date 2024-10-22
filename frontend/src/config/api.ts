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

// Show sản phẩm biến thể theo id
    getproductvariantsbyid : `${baseUrl}/api/productvariant/show/`,
    
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

  },

  user : {
    login : `${baseUrl}/api/login`,
    register : `${baseUrl}/api/register/send-code`,
    verify : `${baseUrl}/api/register/verify-code`,

    // Lấy thông tin user theo id
    ///users/show/{id}
    getUserById : `${baseUrl}/api/users/show/`,

        //Gửi mã khôi phục mật khẩu tới email của người dùng.
        sendResetPasswordCode : `${baseUrl}/api/password/forgot`,

        //Xác minh mã khôi phục mật khẩu được gửi tới email người dùng.
        verifyResetPasswordCode : `${baseUrl}/api/password/verify-code`,

        //Cập nhật mật khẩu mới cho người dùng sau khi xác minh mã thành công.
        updatePassword : `${baseUrl}/api/password/update`,
  }

};

export default apiConfig;
