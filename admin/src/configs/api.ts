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

  productsva: {
    getAll: `${baseUrl}/api/productvariant`,

    ///productvariant/store/{id}
    createproductvariants : `${baseUrl}/api/productvariant/store/`,

    ///update/{productVariant}
    updateproductvariants : `${baseUrl}/api/productvariant/update/`,

    ///delete/{productVariant}
    deleteproductvariants : `${baseUrl}/api/productvariant/delete/`,
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

  users: {
    login: `${baseUrl}/api/login`,
    logout: `${baseUrl}/api/logout`,
    register: `${baseUrl}/api/register/send-code`,
    verify: `${baseUrl}/api/register/verify-code`,

    loginToken: `${baseUrl}/api/auth/login`,

    refreshToken: `${baseUrl}/api/auth/refresh`,


    getUserFromToken: `${baseUrl}/api/auth/profile`,

    getAll: `${baseUrl}/api/users/`,

    createUser: `${baseUrl}/api/users/store/`,

    ///users/show/{id}
    getUserById: `${baseUrl}/api/users/show/`,

    updateUser: `${baseUrl}/api/users/update/`,
    updateUserAdmin: `${baseUrl}/api/users/update/admin/`,

    deleteUser: `${baseUrl}/api/users/delete/`,
  },

  roles: {
    getAll: `${baseUrl}/api/roles/`,
  },

  order: {
    //Show order
    getAll: `${baseUrl}/api/checkout/showorder`,

    //Tạo đơn hàng
    createOrder: `${baseUrl}/api/checkout/orders`,

    //Trừ điểm khi dùng
    subtractionPoint: `${baseUrl}/api/checkout/deduct-points`,

    //Show order user
    ///showorder/{userId}
    showOrderUser: `${baseUrl}/api/checkout/showorder/`,

    //Show order theo id
    ///showorderdetail/{order}
    showOrderDetail: `${baseUrl}/api/checkout/showorderdetail/`,

    //Show order theo mã đơn hàg
    ///showorderdetailcode/{code}
    showOrderDetailCode: `${baseUrl}/api/checkout/showorderdetailcode/`,

    //Hủy đơn hàng dựa trên id
    ///orders/cancelorder/{orderId}
    cancelOrder: `${baseUrl}/api/checkout/orders/cancelorder/`,

    //Cập nhật đơn hàng
    ///orders/updatestatus/{orderId}
    updateOrderStatus: `${baseUrl}/api/checkout/orders/updatestatus/`,
  },

  static: {
    //Show static
    getAll: `${baseUrl}/api/statics`,
    getProduct: `${baseUrl}/api/statics/product`,
    getOrder: `${baseUrl}/api/statics/order`,
    getUser: `${baseUrl}/api/statics/user`,
    getComparison: `${baseUrl}/api/statics/comparison`,
    getMostLeast: `${baseUrl}/api/statics/mostleast`,
  },

  ordernotify: {
    getAll: `${baseUrl}/api/ordernotify/view`,
    unread: `${baseUrl}/api/ordernotify/unread`,
    markAsRead: `${baseUrl}/api/ordernotify/mark-as-read/`,
  },

  post: {
    getAll: `${baseUrl}/api/posts`,
    createPost: `${baseUrl}/api/posts/store`,
    updatePost: `${baseUrl}/api/posts/update/`,
    deletePost: `${baseUrl}/api/posts/delete/`, 
  } 
};

export default apiConfig;
