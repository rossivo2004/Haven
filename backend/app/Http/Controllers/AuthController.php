<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'refresh']]);
    }

    public function profile()
    {
        try {
            return response()->json(auth('api')->user());

        } catch (JWTException $exception) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Thông tin đăng nhập không chính xác.'], 401);
        }

        $user = auth('api')->user();

        if ($user->status === 'banned') {
            auth('api')->logout();
            return response()->json([
                'error' => 'Tài khoản của bạn đã bị ban. Xin hãy liên hệ để được hỗ trợ.'
            ], 403);
        }

        $refreshToken = $this->createRefreshToken();
        return $this->respondWithToken($token, $refreshToken);
    }
    public function adminLogin(Request $request)
    {
        // Gọi hàm login cũ để xử lý đăng nhập
        $response = $this->login($request);
    
        // Kiểm tra nếu đăng nhập thành công
        if ($response instanceof JsonResponse && $response->status() === 200) {
            $user = auth()->user();
    
            // Kiểm tra role của user
            if ($user->role->name !== 'admin') {
                auth()->logout(); // Đăng xuất nếu không phải admin
                return response()->json([
                    'message' => 'Chỉ admin mới được phép truy cập.'
                ], 403);
            }
    
            // Nếu là admin, trả về phản hồi thành công
            return $response;
        }
    
        // Nếu đăng nhập thất bại, trả về lỗi gốc
        return $response;
    }
    
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Đăng xuất thành công'], 200);
    }

    public function refresh()
    {
        $refreshToken = request()->refresh_token;
        try {
            $decode = JWTAuth::getJWTProvider()->decode($refreshToken);
            $user = User::find($decode['user_id']);
            if(!$user){
                return response()->json(['error' => 'User not found'], 404);
            }

            if ($user->status === 'banned') {
                return response()->json([
                    'error' => 'Tài khoản của bạn đã bị ban. Xin hãy liên hệ để được hỗ trợ.'
                ], 403);
            }

            $token = auth('api')->login($user);
            $refreshToken = $this->createRefreshToken();
            return $this->respondWithToken($token, $refreshToken);
        } catch (JWTException $exception) {
            return response()->json(['error' => 'Unauthorized'], 500);
        }
    }

    private function respondWithToken($token, $refreshToken)
    {
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }

    private function createRefreshToken() {
        $data = [
            'user_id' => auth('api')->user()->id,
            'random' => rand() . time(),
            'exp' => time() + config('jwt.refresh_ttl')
        ];
        $refreshToken = JWTAuth::getJWTProvider()->encode($data);
        return $refreshToken;
    }
}
