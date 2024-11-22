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
    public function loginForAdminOnly()
{
    $credentials = request(['email', 'password']);

    // Xác thực thông tin đăng nhập
    if (! $token = auth('api')->attempt($credentials)) {
        return response()->json(['error' => 'Thông tin đăng nhập không chính xác.'], 401);
    }

    // Lấy thông tin người dùng
    $user = auth('api')->user();

    // Kiểm tra trạng thái tài khoản
    if ($user->status === 'banned') {
        auth('api')->logout();
        return response()->json([
            'error' => 'Tài khoản của bạn đã bị ban. Xin hãy liên hệ để được hỗ trợ.'
        ], 403);
    }

    // Kiểm tra vai trò người dùng
    if ($user->role->name !== 'admin') {
        auth('api')->logout();
        return response()->json([
            'error' => 'Chỉ admin mới được phép truy cập.'
        ], 403);
    }

    // Tạo refresh token
    $refreshToken = $this->createRefreshToken();

    // Trả về token
    return $this->respondWithToken($token, $refreshToken);
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
