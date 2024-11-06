<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FlashSaleController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\FlashSaleProductController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\StatisticsController;
use App\Models\ProductImage;

// Quản lý roles
Route::resource('roles', RoleController::class);

// Define API routes for posts
Route::prefix('api/posts')->group(function () {
    Route::get('/', [PostController::class, 'index']); 
    Route::post('/store', [PostController::class, 'store']); 
    Route::get('/show/{id}', [PostController::class, 'show']); 
    Route::put('/update/{id}', [PostController::class, 'update']); 
    Route::delete('/delete/{id}', [PostController::class, 'destroy']); 
});

// Quản lý users
Route::resource('api/roles', RoleController::class);

Route::group(['prefix' => 'api/users', 'middleware' => ['auth', 'checkRole:admin']], function() {
    // Các route chỉ dành cho admin

});

Route::middleware(['check.status'])->group(function () {
    // Đăng nhập - đăng xuất
    Route::post('/api/login', [UserController::class, 'login'])->name('api.login');
    Route::post('/api/logout', [UserController::class, 'logout'])->name('api.logout');
    Route::get('/api/auth/google', [UserController::class, 'googlelogin'])->name('api.logingoogle');
    Route::get('/api/auth/google/callback', [UserController::class, 'googlecallback'])->name('api.googlecallback');
});


// Quản lý users
Route::group(['prefix' => 'api/users'], function() {
    Route::get('/', [UserController::class, 'index'])->name('users.index');
    Route::post('/store', [UserController::class, 'store'])->name('users.store');
    Route::get('/show/{user}', [UserController::class, 'show'])->name('users.show');
    Route::put('/update/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/delete/{user}', [UserController::class, 'destroy'])->name('users.delete');
    Route::put('/update/admin/{user}', [UserController::class, 'updateAdmin'])->name('users.updateAdmin');
});

// Role API routes
Route::group(['prefix' => 'api/roles'], function () {
    Route::get('/', [RoleController::class, 'index'])->name('Role.index');
    Route::post('/store', [RoleController::class, 'store'])->name('Role.store');
    Route::get('/show/{role}', [RoleController::class, 'show'])->name('Role.show');
    Route::put('/update/{role}', [RoleController::class, 'update'])->name('Role.update');
    Route::delete('/delete/{role}', [RoleController::class, 'destroy'])->name('Role.destroy');
});



// Đăng ký
Route::group(['prefix' => 'api/register'], function() {
    Route::post('/send-code', [UserController::class, 'sendRegisterCode'])->name('api.register.sendCode');
    Route::post('/verify-code', [UserController::class, 'verifyRegisterCode'])->name('api.register.verifyCode');
});

// Quên mật khẩu
Route::group(['prefix' => 'api/password'], function() {
    Route::post('/forgot', [UserController::class, 'sendResetCode'])->name('api.password.forgot');
    Route::post('/reset', [UserController::class, 'resetPassword'])->name('api.password.reset');
    // Xác minh mã reset
    Route::post('/verify-code', [UserController::class, 'verifyResetCode']);

    // Hiển thị form nhập mật khẩu mới sau khi mã được xác thực
    Route::get('/new-password/{email}', [UserController::class, 'showNewPasswordForm'])
        ->name('password.new');

    // Cập nhật mật khẩu mới
    Route::post('/update', [UserController::class, 'updatePassword']);
});



// Routes từ nhánh origin/main
route::group([
    'prefix' => 'api/product'
],function(){
    Route::get('/', [ProductController::class, 'index'])->name('Product.index');
    Route::get('/home', [ProductController::class, 'home'])->name('Product.home');
    Route::get('/create', [ProductController::class, 'create'])->name('Product.create');
    Route::post('/store', [ProductController::class, 'store'])->name('Product.store');
    Route::get('/detail/{productVariant}', [ProductController::class, 'detail'])->name('Product.detail');
    Route::get('/shop', [ProductController::class, 'shop'])->name('Product.shop');
    Route::get('/edit/{product}', [ProductController::class, 'edit'])->name('Product.edit');
    Route::put('/update/{product}', [ProductController::class, 'update'])->name('Product.update');
    Route::delete('/delete/{product}', [ProductController::class, 'destroy'])->name('Product.delete');
    Route::get('/show/{product}', [ProductController::class, 'show'])->name('Product.show');
    Route::get('/getproductvariants/{product}', [ProductController::class, 'getProductVariants'])->name('Product.getProductVariant');

});
route::group([
    'prefix' => 'api/productvariant'
],function(){
    Route::get('/', [ProductVariantController::class, 'index'])->name('ProductVariant.index');
    Route::get('/create', [ProductVariantController::class, 'create'])->name('ProductVariant.create');
    Route::post('/store', [ProductVariantController::class, 'store'])->name('ProductVariant.store');
    Route::get('/show/{productVariant}', [ProductVariantController::class, 'show'])->name('ProductVariant.show');
    Route::get('/edit/{productVariant}', [ProductVariantController::class, 'edit'])->name('ProductVariant.edit');
    Route::put('/update/{productVariant}', [ProductVariantController::class, 'update'])->name('ProductVariant.update');
    Route::delete('/delete/{productVariant}', [ProductVariantController::class, 'destroy'])->name('ProductVariant.delete');
});

route::group([
    'prefix' => 'api/productimage'
],function(){
    Route::post('/store', [ProductImageController::class, 'store'])->name('ProductImage.store');
    Route::delete('/delete/{productImage}', [ProductImageController::class, 'destroy'])->name('ProductImage.delete');
});

route::group([
    'prefix' => 'api/category'
],function(){
    Route::get('/', [CategoryController::class, 'index'])->name('Category.index');
    Route::get('/create', [CategoryController::class, 'create'])->name('Category.create');
    Route::post('/store', [CategoryController::class, 'store'])->name('Category.store');
    Route::get('/edit/{category}', [CategoryController::class, 'edit'])->name('Category.edit');
    Route::put('/update/{category}', [CategoryController::class, 'update'])->name('Category.update');
    Route::delete('/delete/{category}', [CategoryController::class, 'destroy'])->name('Category.delete');
    Route::get('/show/{category}', [CategoryController::class, 'show'])->name('Category.show');
    Route::get('/getproducts/{category}', [CategoryController::class, 'getProducts'])->name('Category.getProduct');
    Route::get('/getCategoryByTag/{tag}', [CategoryController::class, 'getCategoryByTag'])->name('Category.getProductByTag');
});


route::group([
    'prefix' => 'api/brand',
],function(){
    Route::get('/', [BrandController::class, 'index'])->name('Brand.index');
    Route::get('/create', [BrandController::class, 'create'])->name('Brand.create');
    Route::post('/store', [BrandController::class, 'store'])->name('Brand.store');
    Route::get('/edit/{brand}', [BrandController::class, 'edit'])->name('Brand.edit');
    Route::put('/update/{brand}', [BrandController::class, 'update'])->name('Brand.update');
    Route::delete('/delete/{brand}', [BrandController::class, 'destroy'])->name('Brand.delete');
    Route::get('/show/{brand}', [BrandController::class, 'show'])->name('Brand.show');
    Route::get('/getproducts/{brand}', [BrandController::class, 'getProducts'])->name('Brand.getProduct');
    Route::get('/getBrandByTag/{tag}', [BrandController::class, 'getBrandByTag'])->name('Brand.getProductByTag');
});
route::group([
    'prefix' => 'api/flashsale',
],function(){
    Route::get('/', [FlashSaleController::class, 'index'])->name('FlashSale.index');
    Route::get('/create', [FlashSaleController::class, 'create'])->name('FlashSale.create');
    Route::post('/store', [FlashSaleController::class, 'store'])->name('FlashSale.store');
    Route::get('/edit/{flashsale}', [FlashSaleController::class, 'edit'])->name('FlashSale.edit');
    Route::put('/update/{flashsale}', [FlashSaleController::class, 'update'])->name('FlashSale.update');
    Route::delete('/delete/{flashsale}', [FlashSaleController::class, 'destroy'])->name('FlashSale.delete');
    Route::get('/show/{flashSale}', [FlashSaleController::class, 'show'])->name('FlashSale.show');
    Route::get('/getproductvariants/{flashSale}', [FlashSaleController::class, 'getProductVariants'])->name('Product.getProductVariants');
    Route::get('/getlistflashsale', [FlashSaleController::class, 'listFlashSale'])->name('FlashSale.listFlashSale');
    Route::get('/getProductNotInFlashSale/{flashsale}', [FlashSaleController::class, 'getProductsNotInFlashSale'])->name('FlashSale.editProductVariants');
});

route::group([
    'prefix' => 'api/flashsaleproduct',
],function(){
    Route::post('/store', [FlashSaleProductController::class, 'store'])->name('FlashSale.store');
    Route::get('/edit/{flashSaleProduct}', [FlashSaleProductController::class, 'edit'])->name('FlashSale.edit');
    Route::put('/update/{flashSaleProduct}', [FlashSaleProductController::class, 'update'])->name('FlashSale.update');
    Route::delete('/delete/{flashSaleProduct}', [FlashSaleProductController::class, 'destroy'])->name('FlashSale.delete');


});
Route::group(['prefix' => 'api/favorite'], function() {
        // Route::get('/', [FavoriteController::class, 'index'])->name('Favorite.index');
    Route::post('/store', [FavoriteController::class, 'store']);
});

Route::group(['prefix' => 'api/userfavorite'], function() {
    Route::get('/{userId}', [FavoriteController::class, 'index'])->name('Favorite.index');
});


route::group([
    'prefix' => 'api/cart'
],function(){
    Route::get('/{userId}', [CartController::class, 'showCart'])->name('Cart.index'); //lấy danh sách giỏ hàng của 1 người dùng
    Route::get('/total/{userId}', [CartController::class, 'cartTotal']); // Tổng tiền giỏ hàng của 1 người dùng
    Route::get('/point/{userId}', [CartController::class, 'cartPoint']); // Số điểm tích lũy của 1 người dùng trong giỏ hàng
    Route::post('/movecart', [CartController::class, 'moveCartToDatabase']);
    Route::post('/add', [CartController::class, 'addToCart']);
    Route::put('/update/{userId}/{productVariantId}', [CartController::class, 'updateCart']); // cập nhật số lượng 1 sản phẩm trong giỏ hàng của 1 người dùng
    Route::delete('/delete/{userId}/{productVariantId}', [CartController::class, 'deleteCart']); // xóa 1 sản phẩm trong giỏ hàng của 1 người dùng
    Route::delete('/clear/{userId}', [CartController::class, 'clearCart']); // xóa tất cả sản phẩm trong giỏ hàng của 1 người dùng
    Route::delete('/selectdelete/{userId}', [CartController::class, 'removeSelectedItems']); // xóa sản phẩm trong giỏ hàng của 1 người dùng theo select
});


route::group([
    'prefix' => 'api/checkout'
],function(){
    Route::get('/showorder', [OrderController::class, 'show']); // lấy danh sach đơn hàng tất cả
    Route::get('/showorderuser/{userId}', [OrderController::class, 'showOrder']); // lấy danh sach đơn hàng của 1 người dùng
    Route::get('/showorderdetail/{order}', [OrderController::class, 'showOrderdetail']); // lấy chi tiết của 1 đơn hàng
    Route::get('/showorderdetailcode/{ordercode}', [OrderController::class, 'showOrderdetailcode']); // lấy chi tiết của 1 đơn hàng dựa tên mã đơn hàng
    Route::post('/orders', [OrderController::class, 'checkout']); // tạo đơn hàng
    Route::post('/orders/cancelorder/{orderId}', [OrderController::class, 'cancelOrder']); // Hủy đơn hàng
    Route::post('/orders/reorder/{orderId}', [OrderController::class, 'reorder']); // mua lại đơn hàng
    Route::post('/deduct-points', [OrderController::class, 'deductPoints']); // trừ điểm tích lũy của người dùng đã sử dụng
    Route::put('/orders/updatestatus/{orderId}', [OrderController::class, 'updateOrderStatus']); // cập nhật trạng thái đơn hàng
});

route::group([
    'prefix' => 'api/payment'
],function(){
    Route::get('/vnpay_return/{orderID}', [PaymentController::class, 'vnpayReturn']); // trả về dữ liệu lưu vào db
    Route::post('/vnpay_payment', [PaymentController::class, 'vnpay_payment']); // thanh toán vnpay
});

route::group([
    'prefix' => 'api/statics'
],function(){
    Route::get('/', [StatisticsController::class, 'getMonthlyStatistics']); // Thống kê doanh thu theo tháng, sản phẩm bán chạy, bán ít theo tháng
    Route::get('/user', [StatisticsController::class, 'getUserStatistics']); // Thống kê có bao nhiêu người dùng
    Route::get('/order', [StatisticsController::class, 'getOrderStatistics']); // Thống kê có bao nhiêu đơn hàng (có làm thêm có bao nhiêu đơn hàng thành công và thất bai)
    Route::get('/product', [StatisticsController::class, 'getProductVariantStatics']); // Thống kê có bao nhiêu sản phẩm biến thể
    // Route::get('/blog', [StatisticsController::class, 'getBlogStatics']); // Thống kê có bao nhiêu bài viết
    Route::get('/category', [StatisticsController::class, 'getCategoryStatistics']); // Thống kê có bao nhiêu sản phẩm doanh thu theo category
    Route::get('/brand', [StatisticsController::class, 'getBrandStatistics']); // Thống kê có bao nhiêu sản phẩm doanh thu theo brand
    Route::get('/comparison', [StatisticsController::class, 'getRevenueComparison']); // Thống kê so sánh % tháng này so với tháng trước
});
