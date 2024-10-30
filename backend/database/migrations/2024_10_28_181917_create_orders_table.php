<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_code');
            $table->boolean('refunded_stock')->default(false); // Theo dõi hoàn stock
            $table->string('full_name'); // Họ và tên khách hàng
            $table->string('phone', 15); // Số điện thoại với độ dài tối đa 15 ký tự
            $table->string('email');
            $table->decimal('total', 15, 2); // Tổng tiền, độ chính xác 15 số, 2 số thập phân
            $table->string('status')->default('pending'); // Trạng thái đơn hàng
            $table->string('province'); // Tỉnh/Thành phố
            $table->string('district'); // Quận/Huyện
            $table->string('ward'); // Phường/Xã
            $table->string('address'); // Địa chỉ cụ thể
            $table->string('payment_transpot'); // Địa chỉ cụ thể
            $table->string('payment_method'); // Phương thức thanh toán (VD: 'VNPay', 'Credit Card')
            $table->string('payment_status')->default('unpaid'); // Trạng thái thanh toán (VD: 'unpaid', 'paid')
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');// Khóa ngoại tới bảng users
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
