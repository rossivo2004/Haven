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

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role_id' => 'required|integer',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'status' => 'nullable',
            'image' => 'nullable'
        ]);

        if ($request->hasFile('image')) {
            try {
                $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath())->getSecurePath();
                $data['image'] = $uploadedFileUrl;
            } catch (Exception $e) {
                return response()->json(['error' => 'Failed to upload image to Cloudinary'], 500);
            }
        }

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
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
            'status' => 'required|boolean',
            'image' => 'nullable'
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
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
    
            // Lấy thông tin user sau khi đăng nhập
            $user = Auth::user();
    
            // Lưu ID của user vào session
            session(['user_id' => $user->id]);
    
            // Trả về ID và thông tin của user
            return response()->json([
                'message' => 'Đăng nhập thành công',
                'user_id' => $user->id, // Trả về ID
            ], 200);
        }

        return response()->json(['error' => 'Email hoặc mật khẩu không đúng'], 401);
    }

    // Đăng xuất qua API
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Đăng xuất thành công'], 200);
    }

    // Đăng nhập Google API
    


    // Reset Password API

    // Hiển thị form quên mật khẩu
    public function showForgotForm()
    {
        return view('forgot-password');
    }

    // Gửi mã khôi phục qua email
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

    // Hiển thị form đặt lại mật khẩu
    public function showResetForm()
    {
        return view('reset-password');
    }

    // Đặt lại mật khẩu
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|numeric|digits:5',
            'password' => 'required|confirmed|min:6',
        ]);

        $reset = PasswordReset::where('email', $request->email)
                              ->where('token', $request->code)
                              ->where('created_at', '>=', Carbon::now()->subMinutes(30))
                              ->first();

        if (!$reset) {
            return response()->json(['error' => 'Mã không hợp lệ hoặc đã hết hạn'], 400);
        }

        User::where('email', $request->email)->update(['password' => Hash::make($request->password)]);
        PasswordReset::where('email', $request->email)->delete();

        return response()->json(['message' => 'Mật khẩu đã được đặt lại'], 200);
    }

    // Đăng ký API

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

    // Gửi mã xác thực đăng ký
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
        // Xác thực dữ liệu từ request
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'email'     => 'required|email',
        ]);

        // Kiểm tra nếu có lỗi xác thực
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Kiểm tra xem email đã tồn tại chưa
        $existingUser = User::where('email', $request->email)->first();

        if ($existingUser) {
            // Email đã tồn tại, trả về ID của người dùng hiện có
            return response()->json([
                'user_id' => $existingUser->id,
            ], 200);
        }

        // Nếu email chưa tồn tại, tiếp tục tạo người dùng mới
        $role = Role::where('name', 'user')->first();

        if ($role) {
            $newUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make('123456dummy'), // Mật khẩu ngẫu nhiên
                'role_id' => $role->id,
            ]);

            // Đăng nhập người dùng mới
            Auth::login($newUser);

            // Lưu ID của user vào session
            session(['user_id' => $newUser->id]);

            return response()->json([
                'user_id' => $newUser->id,
            ], 200);
        } else {
            return response()->json(['error' => 'Vai trò "user" không tồn tại'], 400);
        }
    }


}
