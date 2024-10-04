
    <div class="container">
        <h1>Edit User</h1>
        <form action="{{ route('users.update', $user->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" name="name" id="name" class="form-control" value="{{ old('name', $user->name) }}">
                @error('name')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" class="form-control" value="{{ old('email', $user->email) }}">
                @error('email')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" class="form-control">
                @error('password')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror
                <small>Leave empty if you don't want to change the password</small>
            </div>

            <div class="form-group">
                <label for="image">Image URL</label>
                <input type="text" name="image" id="image" class="form-control" value="{{ old('image', $user->image) }}">
            </div>

            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="text" name="phone" id="phone" class="form-control" value="{{ old('phone', $user->phone) }}">
                @error('phone')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="address">Address</label>
                <input type="text" name="address" id="address" class="form-control" value="{{ old('address', $user->address) }}">
                @error('address')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="status">Status</label>
                <select name="status" id="status" class="form-control">
                    <option value="1" {{ old('status', $user->status) == '1' ? 'selected' : '' }}>Active</option>
                    <option value="0" {{ old('status', $user->status) == '0' ? 'selected' : '' }}>Inactive</option>
                </select>
                @error('status')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror
            </div>

            {{-- <div class="form-group">
                <label for="roles">Roles</label>
                <select name="roles[]" id="roles" class="form-control" multiple>
                    @foreach($roles as $role)
                        <option value="{{ $role->id }}" {{ $user->roles->pluck('id')->contains($role->id) ? 'selected' : '' }}>
                            {{ $role->role }}
                        </option>
                    @endforeach
                </select>
                @error('roles')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror
            </div> --}}

            <button type="submit" class="btn btn-primary">Update User</button>
        </form>
    </div>
