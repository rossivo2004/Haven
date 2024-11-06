<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderDetail;

class PaymentController extends Controller
{
    public function vnpay_payment(Request $request)
    {

        $order_id = $request->input('order_id');

        // Lấy thông tin đơn hàng từ cơ sở dữ liệu
        $order = Order::find($order_id);
        if (!$order) {
            return response()->json(['status' => false, 'message' => 'Đơn hàng không tồn tại'], 404);
        }

        $vnp_Url = env('VNP_URL');
        $vnp_Returnurl = env('VNP_RETURN_URL') . '/' . $order_id;
        $vnp_TmnCode = env('VNP_TMN_CODE');//Mã website tại VNPAY
        $vnp_HashSecret = env('VNP_HASH_SECRET'); //Chuỗi bí mật
        $vnp_TxnRef = $order->invoice_code; //Mã đơn hàng.
        $vnp_OrderInfo = "Thanh toán hóa đơn đơn hàng $order->invoice_code";
        $vnp_OrderType = "Haven";
        $vnp_Amount = $order->total * 100;
        $vnp_Locale = "VN";
        $vnp_BankCode = "NCB";
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        //var_dump($inputData);
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);//
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        $returnData = array('code' => '00'
            , 'message' => 'success'
            , 'data' => $vnp_Url);
            // Kiểm tra nếu có yêu cầu chuyển hướng (redirect)
    if ($request->has('redirect')) {
        return response()->json(['redirect_url' => $vnp_Url]);
    } else {
        return response()->json($returnData);
    }

    }

// Hàm xử lý callback sau khi VNPay thanh toán
public function vnpayReturn(Request $request, $orderID)
{
    // Lấy dữ liệu phản hồi
    $responseData = $request->toArray();

    // Xác minh secure hash
    $secureHash = $responseData['vnp_SecureHash'] ?? '';
    unset($responseData['vnp_SecureHash']); // Loại bỏ secure hash khỏi dữ liệu để tính toán hash

    // Sắp xếp dữ liệu phản hồi
    ksort($responseData);
    $hashData = '';
    foreach ($responseData as $key => $value) {
        $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
    }
    $hashData = substr($hashData, 1); // Loại bỏ '&' đầu tiên

    // Tính toán secure hash
    $vnp_HashSecret = env('VNP_HASH_SECRET'); // Lấy secret từ biến môi trường
    $calculatedSecureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

    // Kiểm tra secure hash
    if ($secureHash !== $calculatedSecureHash) {
        return response()->json(['status' => false, 'message' => 'Invalid secure hash'], 400);
    }

    // Lưu thông tin thanh toán vào cơ sở dữ liệu
    $order = Order::find($orderID);
    if (!$order) {
        return response()->json(['status' => false, 'message' => 'Đơn hàng không tồn tại'], 404);
    }

    $payment = Payment::create([
        'user_id' => $order->user_id,
        'order_id' => $order->id,
        'p_money' => $responseData['vnp_Amount'] / 100,
        'p_note' => $responseData['vnp_OrderInfo'],
        'p_code_vnpay' => $responseData['vnp_TransactionNo'],
        'p_code_bank' => $responseData['vnp_BankCode'],
        'p_vnp_reponse_code' => $responseData['vnp_ResponseCode'],
    ]);

    // Cập nhật trạng thái đơn hàng
    if($payment->p_vnp_reponse_code == 00){
        $order->payment_status = 'paid';
    }

    $order->save();

    if ($request->vnp_ResponseCode == '00') { // Kiểm tra mã phản hồi từ VNPay
        // Nếu thành công
        return redirect()->to('/thankorder');
    } else {
        // Nếu thất bại, chuyển hướng đến trang thất bại (tuỳ chọn)
        return redirect()->to('/failure');
    }

    // return response()->json(['status' => true, 'message' => 'Payment successful', 'data' => $responseData]);
}

}
