const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const apiConfig = {
  products: {
    getAll: `${baseUrl}/api/product/`,
    getAllProduct: `${baseUrl}/api/product/home`,
    getDetailByTag: `${baseUrl}/api/product/getProductByTag/`,
    deletePr: `${baseUrl}/api/product/delete/`,
    updatepr: `${baseUrl}/api/product/update/`,
    createPr: `${baseUrl}/api/product/store/`,

    getproductvariants: `${baseUrl}/api/product/getproductvariants/`,
    deleteproductvariants: `${baseUrl}/api/productvariant/delete/`,
    createproductvariants: `${baseUrl}/api/productvariant/store/`,
    updateproductvariants: `${baseUrl}/api/productvariant/update/`,

    // Show all sản phẩm biến thể
    getallproductvariants: `${baseUrl}/api/product/shop`,

    // Show sản phẩm biến thể theo id
    getproductvariantsbyid: `${baseUrl}/api/productvariant/show/`,

    //Shaw sản phẩm tương tự
    // /getRelatedVariants/{productVariant
    getRelatedVariants: `${baseUrl}/api/productvariant/getRelatedVariants/`,
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

  flashsale: {
    getAllFlashsale: `${baseUrl}/api/flashsale`,
    // Hiển thị thông tin để cập nhật biến thể , id trên url là id bảng flash sale product
    getflashsale: `${baseUrl}/api/flashsale/edit/`,
    // Thêm mới flash sale product
    createflashsale: `${baseUrl}/api/flashsale/store`,
    // Cập nhật flash sale product
    updateflashsale: `${baseUrl}/api/flashsale/update/`,
    // Xóa flash sale product
    deleteflashsale: `${baseUrl}/api/flashsale/delete/`,

    // Show các sản phẩm trong flashsale
    // /flashsale/getproductvariants/{id}
    getShowProductFlashsale: `${baseUrl}/api/flashsale/getproductvariants/`,

    //Sửa time trong flashsale
    // /flashsale/update/{id}
    editTimeFlashSale: `${baseUrl}/api/flashsale/update/`,

    //Sửa thông tin của sản phẩm trong flashsale
    // /flashsaleproduct/update/{id}
    editProductFlashSale: `${baseUrl}/api/flashsaleproduct/update/`,

    //Xóa sản phẩm trong flashsale
    // /flashsaleproduct/delete/{id}
    deleteProductFlashSale: `${baseUrl}/api/flashsaleproduct/delete/`,

    //Show sản phẩm chưa có trong flashsale
    // /flashsale/getProductNotInFlashSale/{id}
    getProductNotInFlashSale: `${baseUrl}/api/flashsale/getProductNotInFlashSale/`,

    //Thêm sản phẩm vào flashsale
    // /flashsale/addProductToFlashSale/{id}
    addProductToFlashSale: `${baseUrl}/api/flashsaleproduct/store/`,

  },

  user: {
    login: `${baseUrl}/api/login`,
    logout: `${baseUrl}/api/logout`,
    register: `${baseUrl}/api/register/send-code`,
    verify: `${baseUrl}/api/register/verify-code`,

    loginToken: `${baseUrl}/api/auth/login`,

    //Lấy data user từ token
    getUserFromToken: `${baseUrl}/api/auth/profile`,

    // Refresh token
    refreshToken: `${baseUrl}/api/auth/refresh`,

    // Lấy thông tin user theo id
    ///users/show/{id}
    getUserById: `${baseUrl}/api/users/show/`,

    //Gửi mã khôi phục mật khẩu tới email của người dùng.
    sendResetPasswordCode: `${baseUrl}/api/password/forgot`,

    //Xác minh mã khôi phục mật khẩu được gửi tới email người dùng.
    verifyResetPasswordCode: `${baseUrl}/api/password/verify-code`,

    //Cập nhật mật khẩu mới cho người dùng sau khi xác minh mã thành công.
    updatePassword: `${baseUrl}/api/password/update`,

    saveGoogleUser: `${baseUrl}/api/save-google-user`,

    updateUser: `${baseUrl}/api/users/update/`,
  },

  favourite: {
    //Show danh sách sản phẩm yêu thích của người dùng.
    getFavourite: `${baseUrl}/api/favorite/`,

    //Thêm, xóa sản phẩm yêu thích
    acitonFavourite: `${baseUrl}/api/favorite/store`,

    //Show sản phẩm yêu thích theo id
    getFavouriteById: `${baseUrl}/api/userfavorite/`,
  },

  cart: {
    //Hiển thị giỏ hàng
    getCart: `${baseUrl}/api/cart/`,

    //Thêm sản phẩm vào giỏ hàng
    addToCart: `${baseUrl}/api/cart/add`,

    // Tính tổng tiền các sản phẩm trong giỏ hàng của người dùng chưa hoặc đã đăng nhập
    getCartTotal: `${baseUrl}/api/cart/total/`,

    //Điểm người dùng sẽ lấy trong db nếu người dùng đăng nhập, ngược lại mặc định là 0
    getPointUser: `${baseUrl}/api/cart/point/`,

    //Cập nhật số lượng sản phẩm trong giỏ hàng
    ///cart/update/{productVariantId}
    updateCart: `${baseUrl}/api/cart/update/`,

    //Xóa sản phẩm trong giỏ hàng
    // Xóa 1 sản phẩm trong giỏ hàng của người dùng chưa hoặc đã đăng nhập
    // /cart/delete/{productVariantId}
    deleteCart: `${baseUrl}/api/cart/delete/`,

    //Xóa toàn bộ sản phẩm trong giỏ hàng
    // /cart/clear
    clearCart: `${baseUrl}/api/cart/clear`,

    //lấy danh sách giỏ hàng của 1 người dùng
    getCartByUserId: `${baseUrl}/api/cart/`,

    //Chuyển cart từ cookie sang database
    moveCartToDatabase: `${baseUrl}/api/cart/movecart`,

    // cập nhật số lượng 1 sản phẩm trong giỏ hàng của 1 người dùng
    ///update/{userId}/{productVariantId}
    updateCartByUserId: `${baseUrl}/api/cart/update/`,

    // xóa 1 sản phẩm trong giỏ hàng của 1 người dùng
    ///delete/{userId}/{productVariantId}
    deleteCartByUserId: `${baseUrl}/api/cart/delete/`,

    // xóa tất cả sản phẩm trong giỏ hàng của 1 người dùng
    ///clear/{userId}
    clearCartByUserId: `${baseUrl}/api/cart/clear/`,
  },


  order: {
    //Tạo đơn hàng
    createOrder: `${baseUrl}/api/checkout/orders`,

    //Trừ điểm khi dùng
    subtractionPoint: `${baseUrl}/api/checkout/deduct-points`,

    //Show order user
    ///showorder/{userId}
    showOrderUser: `${baseUrl}/api/checkout/showorderuser/`,

    //Show order theo id
    ///showorderdetail/{order}
    showOrderDetail: `${baseUrl}/api/checkout/showorderdetail/`,

    //Show order theo mã đơn hàg
    ///showorderdetailcode/{code}
    showOrderDetailCode: `${baseUrl}/api/checkout/showorderdetailcode/`,

    // Trừ điểm user
    deductPoints : `${baseUrl}/api/checkout/deduct-points`,

        //Hủy đơn hàng dựa trên id
    ///orders/cancelorder/{orderId}
    cancelOrder: `${baseUrl}/api/checkout/orders/cancelorder/`,
  },


  payment: {
    createPayment: `${baseUrl}/api/payment/vnpay_payment`
  }

  


};

export default apiConfig;
