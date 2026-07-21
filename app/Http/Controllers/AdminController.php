<?php

namespace App\Http\Controllers;

use App\Models\Billing;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(): Response
    {
        $users = User::select(
            'id',
            'name',
            'email',
            'role'
        )->get();

        $chargeMasters = Billing::orderBy('service_name')
            ->get()
            ->map(function (Billing $billing) {
                return [
                    'id' => $billing->billing_id,
                    'service_code' => $billing->service_code,
                    'service_name' => $billing->service_name,
                    'amount' => $billing->amount,
                    'status' => $billing->status,
                ];
            });

        return Inertia::render('admin/index', [
            'users' => $users,
            'chargeMasters' => $chargeMasters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'min:6',
            ],
            'role' => [
                'required',
                'in:admin,receptionist,billing,doctor',
            ],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()
            ->route('admin.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
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

    public function update(
        Request $request,
        User $user
    ): RedirectResponse {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')
                    ->ignore(
                        $user->getKey(),
                        $user->getKeyName()
                    ),
            ],
            'role' => [
                'required',
                'in:admin,receptionist,billing,doctor',
            ],
            'password' => [
                'nullable',
                'string',
                'min:6',
            ],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();

        return redirect()
            ->route('admin.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if (auth()->id() === $user->id) {
            return redirect()
                ->route('admin.index')
                ->with(
                    'error',
                    'You cannot delete your own account.'
                );
        }

        $user->delete();

        return redirect()
            ->route('admin.index')
            ->with('success', 'User deleted successfully.');
    }

    public function editChargeMaster(
        Billing $billing
    ): Response {
        return Inertia::render('admin/chargemasteredit', [
            'chargeMaster' => [
                'id' => $billing->billing_id,
                'service_code' => $billing->service_code,
                'service_name' => $billing->service_name,
                'amount' => $billing->amount,
                'status' => $billing->status,
            ],
        ]);
    }

    public function updateChargeMaster(
        Request $request,
        Billing $billing
    ): RedirectResponse {
        $validated = $request->validate([
            'service_code' => [
                'required',
                'string',
                'max:50',
                Rule::unique(
                    $billing->getTable(),
                    'service_code'
                )->ignore(
                    $billing->getKey(),
                    $billing->getKeyName()
                ),
            ],
            'service_name' => [
                'required',
                'string',
                'max:255',
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0',
            ],
            'status' => [
                'required',
                'in:Active,Inactive',
            ],
        ]);

        $billing->update($validated);

        return redirect()
            ->route('admin.index')
            ->with(
                'success',
                'Charge master record updated successfully.'
            );
    }
}