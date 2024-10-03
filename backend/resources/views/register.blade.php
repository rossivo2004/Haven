<!-- register.blade.php -->
<form method="POST" action="{{ route('register.sendCode') }}">
    @csrf
    <input type="text" name="name" placeholder="Tên" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Mật khẩu" required>
    <button type="submit">Nhận mã xác thực</button>
</form>
