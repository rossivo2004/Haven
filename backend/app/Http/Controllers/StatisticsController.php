<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;

class StatisticsController extends Controller
{
    public function getMonthlyStatistics()
    {
        // 1. Thống kê doanh thu theo tháng
        $monthlyRevenue = Order::selectRaw('MONTH(created_at) as month, SUM(total) as revenue')
            ->where('status', 'complete') // Chỉ tính doanh thu cho đơn hàng đã hoàn thành
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        // 2. Thống kê sản phẩm bán nhiều và ít nhất theo tháng
        $productsByMonth = OrderDetail::join('orders', 'orders.id', '=', 'order_details.order_id')
            ->selectRaw('MONTH(orders.created_at) as month, product_variant_id, SUM(order_details.quantity) as total_sold')
            ->where('orders.status', 'complete')
            ->groupBy('month', 'product_variant_id')
            ->orderBy('month', 'asc')
            ->get()
            ->groupBy('month')
            ->map(function ($monthData) {
                return [
                    'most_sold' => $monthData->sortByDesc('total_sold')->first(), // Sản phẩm bán nhiều nhất
                    'least_sold' => $monthData->sortBy('total_sold')->first(),     // Sản phẩm bán ít nhất
                ];
            });

        return response()->json([
            'revenue' => $monthlyRevenue,
            'products_by_month' => $productsByMonth,
        ]);
    }

}
