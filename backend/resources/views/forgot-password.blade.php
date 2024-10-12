<form action="{{ route('password.forgot') }}" method="POST">
    @csrf
    <label>Email Address:</label>
    <input type="email" name="email" required>
    <button type="submit">Send Reset Code</button>
</form>
