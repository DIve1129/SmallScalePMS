<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role')->get();

        return Inertia::render('admin/index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,receptionist,billing',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('admin.index');
    }

    public function edit(User $user)
    {
        return Inertia::render('admin/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function update(Request $request, User $user)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => [
            'required',
            'email',
            Rule::unique('users', 'email')->ignore($user->getKey(), $user->getKeyName()),
        ],
        'role' => ['required', 'in:admin,receptionist,billing'],
        'password' => ['nullable', 'min:6'],
    ]);

    $user->name = $validated['name'];
    $user->email = $validated['email'];
    $user->role = $validated['role'];

    if (!empty($validated['password'])) {
        $user->password = bcrypt($validated['password']);
    }

    $user->save();

    return redirect()->route('admin.index');
}
    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
        return redirect()->route('admin.index')
            ->with('error', 'You cannot delete your own account.');
    }

    $user->delete();

    return redirect()->route('admin.index')
        ->with('success', 'User deleted successfully.');
    }
}