import { Button, Input, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as zod from 'zod';
import { sendRegisterData } from '../Services/Registration';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const schema = zod.object({
        name: zod.string().nonempty('Name is Required')
            .min(3, 'Name must be at least 3 characters')
            .max(15, 'Name must be at max 15 characters'),
        email: zod.string().nonempty('Email is Required')
            .email('Invalid Email Format'),
        password: zod.string().nonempty('Password is Required')
            .min(8, 'Password must be at least 8 characters')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
                'Password does not meet complexity requirements'),
        rePassword: zod.string().nonempty('Confirm Password is Required'),
        dateOfBirth: zod.coerce.date().refine((date) => {
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            return age >= 18 && age < 45;
        }, { message: 'Age must be between 18 and 45' }),
        gender: zod.string().nonempty('Gender is Required')
    }).refine((data) => data.password === data.rePassword, {
        path: ['rePassword'],
        message: 'Passwords do not match'
    });

    const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: '', email: '', password: '', rePassword: '', dateOfBirth: '', gender: ''
        },
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    const passwordValue = watch("password", "");

    const passwordRequirements = [
        { text: "At least 8 chars", met: passwordValue.length >= 8 },
        { text: "Uppercase (A-Z)", met: /[A-Z]/.test(passwordValue) },
        { text: "Lowercase (a-z)", met: /[a-z]/.test(passwordValue) },
        { text: "Number (0-9)", met: /\d/.test(passwordValue) },
        { text: "Special (@$!%*?&)", met: /[@$!%*?&]/.test(passwordValue) },
    ];

    async function SignUp(values) {
        setLoading(true);
        setApiError(null); // Reset error before new request
        try {
            const response = await sendRegisterData(values);
            if (response?.error) {
                setApiError(response.error);
            } else {
                navigate('/login');
            }
        } catch (err) {
            setApiError("Something went wrong");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="w-full max-w-md bg-white py-10 px-6 rounded-2xl shadow-xl">
                <h2 className='text-4xl mb-6 font-bold text-center text-gray-800'>Register</h2>

                <form onSubmit={handleSubmit(SignUp)} className='flex flex-col gap-4'>

                    <Input variant='bordered' labelPlacement='outside' label="Name"
                        placeholder='Ahmed Bahnasy'
                        isInvalid={!!errors.name} errorMessage={errors.name?.message}
                        {...register('name')} />

                    <Input variant='bordered' labelPlacement='outside' label="Email"
                        placeholder='user@example.com'
                        isInvalid={!!errors.email} errorMessage={errors.email?.message}
                        {...register('email')} />

                    <div>
                        <Input variant='bordered' labelPlacement='outside' label="Password"
                            type="password" placeholder='********'
                            isInvalid={!!errors.password}
                            errorMessage={errors.password?.message}
                            {...register('password')} />

                        {passwordValue.length > 0 && (
                            <ul className="mt-2 grid grid-cols-2 gap-1 text-xs">
                                {passwordRequirements.map((req, i) => (
                                    <li key={i} className={`${req.met ? "text-green-600" : "text-gray-400"} flex items-center gap-1`}>
                                        {req.met ? "✔" : "○"} {req.text}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <Input variant='bordered' labelPlacement='outside' label="Confirm Password"
                        type="password" placeholder='********'
                        isInvalid={!!errors.rePassword} errorMessage={errors.rePassword?.message}
                        {...register('rePassword')} />

                    <div className='flex gap-3'>
                        <div className="flex-1">
                            <Input variant='bordered' labelPlacement='outside' label="Date of Birth"
                                type="date"
                                isInvalid={!!errors.dateOfBirth} errorMessage={errors.dateOfBirth?.message}
                                {...register('dateOfBirth')} />
                        </div>

                        <div className="flex-1">
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Gender" labelPlacement="outside" variant='bordered'
                                        placeholder="Select"
                                        selectedKeys={field.value ? [field.value] : []}
                                        isInvalid={!!errors.gender} errorMessage={errors.gender?.message}
                                    >
                                        <SelectItem key="male">Male</SelectItem>
                                        <SelectItem key="female">Female</SelectItem>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    {apiError && <div className='p-3 bg-red-100 text-red-700 rounded text-sm text-center'>{apiError}</div>}

                    <Button type='submit' isLoading={loading} color="primary" className='w-full font-semibold'>
                        Create Account
                    </Button>

                    <p className='text-center text-gray-500 text-sm mt-2'>
                        Already have an account? <Link to='/login' className='text-primary hover:underline font-medium'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
