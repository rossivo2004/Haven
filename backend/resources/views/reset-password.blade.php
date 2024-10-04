<form action="{{ route('password.reset') }}" method="POST">
    @csrf
    <label>Email Address:</label>
    <input type="email" name="email" required>
    
    <label>Reset Code:</label>
    <input type="text" name="code" required>
    
    <label>New Password:</label>
    <input type="password" name="password" required>
    
    <label>Confirm New Password:</label>
    <input type="password" name="password_confirmation" required>
    
    <button type="submit">Reset Password</button>
    <a href="{{ route('password.forgot') }}">Resend Code</a>
</form>
