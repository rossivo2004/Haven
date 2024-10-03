<style>
    .google-login-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    background-color: #4285f4;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    font-weight: 500;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
}

.google-login-btn img {
    height: 20px;
    margin-right: 10px;
}

.google-login-btn:hover {
    background-color: #357ae8;
}






</style>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">

<form action="{{ route('login') }}" method="POST">
    @csrf
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" class="form-control" value="{{ old('email') }}" required>
        @error('email')
            <div class="alert alert-danger">{{ $message }}</div>
        @enderror
    </div>

    <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input type="password" name="password" id="password" class="form-control" required>
        @error('password')
            <div class="alert alert-danger">{{ $message }}</div>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary">Đăng nhập</button>
    <a href="{{route('logingoogle')}}" class="google-login-btn">
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" />
        <span>Sign in with Google</span>
    </a>
    <a href="{{route('password.forgot')}}" class="">
        <span>Password Forgot</span>
    </a>
    <br>
    <a href="{{route('register')}}" class="">
        <span>Register</span>
    </a>
</form>
