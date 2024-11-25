<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Exception;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->get();
        return response()->json($users, 200);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user, 200);
    }

    public function updateAdmin(Request $request, $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Validate the input, making both fields optional
        $data = $request->validate([
            'status' => 'nullable|in:active,banned', // `status` is optional
            'point' => 'nullable|integer|min:0',    // `point` is optional
        ]);

        // Update the fields if they are present in the request
        if (isset($data['status'])) {
            $user->status = $data['status'];
        }

        if (isset($data['point'])) {
            $user->point = $data['point'];
        }

        // Save the updated user
        $user->save();

        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role_id' => 'required|integer',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'status' => 'required|in:active,banned',
            'image' => 'nullable',
            'province' => 'nullable|string|max:255',
            'district' => 'nullable|string|max:255',
            'ward' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            try {
                $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath())->getSecurePath();
                $data['image'] = $uploadedFileUrl;
            } catch (Exception $e) {
                return response()->json(['error' => 'Failed to upload image to Cloudinary'], 500);
            }
        } else {
            $data['image'] = $user->image;
        }

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    // Chức năng đăng nhập
    public function indexlogin(Request $request)
    {
        return view("login");
    }

    // Đăng nhập qua API
    // public function login(Request $request)
    // {
    //     // Validate login credentials
    //     $credentials = $request->only('email', 'password');

    //     // Attempt to authenticate the user
    //     if (Auth::attempt($credentials)) {
    //         $user = Auth::user();

    //         // Kiểm tra nếu user bị banned
    //         if ($user->status === 'banned') {
    //             // Đăng xuất user ngay lập tức nếu đã đăng nhập
    //             Auth::logout();

    //             // Trả về thông báo lỗi cho người dùng
    //             return response()->json([
    //                 'message' => 'Tài khoản của bạn đã bị ban. Xin hãy liên hệ để được hỗ trợ.'
    //             ], 403);
    //         }

    //         // Trả về thông báo đăng nhập thành công nếu user không bị banned
    //         return response()->json([
    //             'message' => 'Đăng nhập thành công',
    //             'user' => $user
    //         ]);
    //     }

    //     // Trả về thông báo lỗi nếu thông tin đăng nhập không chính xác
    //     return response()->json(['message' => 'Thông tin đăng nhập không chính xác.'], 401);
    // }


    // // Đăng xuất qua API
    // public function logout(Request $request)
    // {
    //     Auth::logout();
    //     $request->session()->invalidate();
    //     $request->session()->regenerateToken();

    //     return response()->json(['message' => 'Đăng xuất thành công'], 200);
    // }


    // Reset Password API
    public function sendResetCode(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $code = rand(10000, 99999);
        PasswordReset::updateOrCreate(['email' => $request->email], ['token' => $code, 'created_at' => Carbon::now()]);

        Mail::send('reset-code', ['code' => $code], function ($message) use ($request) {
            $message->to($request->email);
            $message->subject('Mã khôi phục mật khẩu');
        });

        return response()->json(['message' => 'Mã khôi phục đã được gửi'], 200);
    }
    // 2. Xác minh mã reset
    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:password_resets,email',
            'code' => 'required|numeric|digits:5',
        ]);

        $reset = PasswordReset::where('email', $request->email)
                              ->where('token', $request->code)
                              ->where('created_at', '>=', Carbon::now()->subMinutes(10))
                              ->first();

        if (!$reset) {
            return response()->json(['error' => 'Mã xác thực không đúng hoặc đã hết hạn'], 400);
        }

        return response()->json(['message' => 'Mã xác thực đúng'], 200);
    }

    // 3. Hiển thị form nhập mật khẩu mới
    public function showNewPasswordForm($email)
    {
        return view('new-password', ['email' => $email]);
    }

    // 4. Cập nhật mật khẩu mới
    public function updatePassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        PasswordReset::where('email', $request->email)->delete();

        return response()->json(['message' => 'Mật khẩu đã được cập nhật thành công'], 200);
    }



    // Hiển thị form đăng ký
    public function showRegisterForm()
    {
        return view('register');
    }

    // Hiển thị form xác minh
    public function showVerifyForm()
    {
        return view('verify');
    }

    // public function register(Request $request)
    // {
    //     // Xác thực dữ liệu đầu vào
    //     $data = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|unique:users,email',
    //         'password' => 'required|string|min:8',
    //     ]);

    //     // Tìm role "user"
    //     $role = Role::where('name', 'user')->first();

    //     if (!$role) {
    //         return response()->json(['error' => 'Vai trò "user" không tồn tại'], 400);
    //     }

    //     // Tạo tài khoản mới
    //     $user = User::create([
    //         'name' => $data['name'],
    //         'email' => $data['email'],
    //         'password' => Hash::make($data['password']),
    //         'role_id' => $role->id,
    //         'status' => 'active', // Đặt trạng thái mặc định là active
    //     ]);

    //     return response()->json([
    //         'message' => 'Đăng ký thành công',
    //         'user' => $user,
    //     ], 201);
    // }

    public function sendRegisterCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'name' => 'required',
            'password' => 'required|min:6',
        ]);

        $code = rand(10000, 99999);
        PasswordReset::updateOrCreate(['email' => $request->email], ['token' => $code, 'created_at' => Carbon::now()]);

        Mail::send('register-code', ['code' => $code], function ($message) use ($request) {
            $message->to($request->email);
            $message->subject('Mã xác thực đăng ký tài khoản');
        });

        return response()->json(['message' => 'Mã xác thực đã được gửi'], 200);
    }

    // Xác minh mã xác thực và tạo tài khoản mới
    public function verifyRegisterCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:password_resets,email',
            'code' => 'required|numeric|digits:5',
        ]);

        $reset = PasswordReset::where('email', $request->email)
                            ->where('token', $request->code)
                            ->where('created_at', '>=', Carbon::now()->subMinutes(30))
                            ->first();

        if (!$reset) {
            return response()->json(['error' => 'Mã xác thực không đúng hoặc đã hết hạn'], 400);
        }

        // Tìm role có tên là "user"
        $role = Role::where('name', 'user')->first();

        if ($role) {
            // Tạo người dùng mới với role "user"
            $newUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $role->id, // Gán role_id
            ]);

            // Xóa thông tin đặt lại mật khẩu sau khi tạo tài khoản
            PasswordReset::where('email', $request->email)->delete();

            return response()->json(['message' => 'Tài khoản đã được tạo thành công'], 200);
        } else {
            return response()->json(['error' => 'Vai trò "user" không tồn tại'], 400);
        }
    }



    public function saveGoogleUser(Request $request)
{
    // Validate request data
    $validator = Validator::make($request->all(), [
        'name'  => 'required|string|max:255',
        'email' => 'required|email',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 422);
    }

    // Check if email exists
    $existingUser = User::where('email', $request->email)->first();

    // Nếu email tồn tại
    if ($existingUser) {
        if ($existingUser->status === 'banned') {
            return response()->json([
                'error' => 'Tài khoản của bạn đã bị ban. Xin hãy liên hệ để được hỗ trợ.'
            ], 403);
        }

        // Nếu không bị ban, tạo token cho user hiện tại
        $accessToken = auth('api')->login($existingUser);
        $refreshToken = $this->createRefreshToken();

        return response()->json([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ]);
    }

    // Nếu email không tồn tại, tạo user mới
    $role = Role::where('name', 'user')->first();

    if ($role) {
        $newUser = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make('123456dummy'), // Mật khẩu ngẫu nhiên
            'role_id'  => $role->id,
            'status'   => 'active' // Trạng thái mặc định
        ]);

        // Tự động đăng nhập người dùng mới
        $accessToken = auth('api')->login($newUser);
        $refreshToken = $this->createRefreshToken();

        return response()->json([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ]);
    } else {
        return response()->json(['error' => 'Vai trò "user" không tồn tại'], 400);
    }
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
