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
    // public function googlelogin()
    // {
    //     return response()->json(['url' => Socialite::driver('google')->redirect()->getTargetUrl()], 200);
    // }

    // public function googlecallback()
    // {
    //     try {
    //         $googleUser = Socialite::driver('google')->user();
    //         $findUser = User::where('google_id', $googleUser->id)->first();

    //         if ($findUser) {
    //             Auth::login($findUser);
    
    //             session(['user_id' => $findUser->id]);
    
    //             return response()->json([
    //                 'message' => 'Đăng nhập Google thành công',
    //                 'user_id' => $findUser->id,
    //             ], 200);
    //         } else {
    //             // Tìm role có name là 'user'
    //             $role = Role::where('name', 'user')->first();

    //             // Kiểm tra xem role có tồn tại không
    //             if ($role) {
    //                 // Tạo người dùng mới với role_id từ vai trò 'user'
    //                 $newUser = User::create([
    //                     'name' => $googleUser->name,
    //                     'email' => $googleUser->email,
    //                     'google_id'=> $googleUser->id,
    //                     'password' => Hash::make('123456dummy'), // Mật khẩu ngẫu nhiên cho user từ Google
    //                     'role_id' => $role->id, // Đặt role_id bằng id của role có name là 'user'
    //                 ]);

    //                 // Đăng nhập người dùng mới
    //                 Auth::login($newUser);

    //                 // Lưu ID của user vào session
    //                 session(['user_id' => $newUser->id]);

    //                 // Trả về ID và thông tin của user
    //                 return response()->json([
    //                     'message' => 'Người dùng mới được tạo và đăng nhập thành công',
    //                     'user_id' => $newUser->id,
    //                 ], 200);
    //             } else {
    //                 // Xử lý nếu không tìm thấy vai trò 'user'
    //                 return response()->json(['error' => 'Vai trò "user" không tồn tại'], 400);
    //             }
    //         }
    //     } catch (Exception $e) {
    //         return response()->json(['error' => 'Không thể đăng nhập qua Google', 'details' => $e->getMessage()], 500);
    //     }
    // }
    public function googleAuth(Request $request)
    {
        try {
            // Kiểm tra nếu không có 'code', ta sẽ redirect người dùng đến Google để đăng nhập
            if (!$request->has('code')) {
                return response()->json([
                    'url' => Socialite::driver('google')->redirect()->getTargetUrl()
                ], 200);
            }

            // Nếu có 'code', tức là đã callback từ Google và chúng ta lấy thông tin người dùng
            $googleUser = Socialite::driver('google')->user();
            // $findUser = User::where('google_id', $googleUser->id)->first();
            $findUser = User::where('google_id', $googleUser->id)
            ->orWhere('email', $googleUser->email)
            ->first();

            if ($findUser) {
                // Đăng nhập nếu tìm thấy người dùng
                Auth::login($findUser);

                // Lưu ID của user vào session
                session(['user_id' => $findUser->id]);

                return response()->json([
                    'message' => 'Đăng nhập Google thành công',
                    'user_id' => $findUser->id,
                ], 200);
            } else {
                // Tạo người dùng mới với role_id từ vai trò 'user'
                $role = Role::where('name', 'user')->first();

                if ($role) {
                    $newUser = User::create([
                        'name' => $googleUser->name,
                        'email' => $googleUser->email,
                        'google_id' => $googleUser->id,
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
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể đăng nhập qua Google', 'details' => $e->getMessage()], 500);
        }
    }
    





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

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        PasswordReset::where('email', $request->email)->delete();

        return response()->json(['message' => 'Tài khoản đã được tạo thành công'], 200);
    }


}
