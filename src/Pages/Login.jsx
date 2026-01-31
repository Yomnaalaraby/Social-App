import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { sendLoginData } from '../Services/SignIn';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

export default function Login() {
    const { setToken } = useContext(AuthContext);
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const schema = zod.object({

        email: zod.string().nonempty('Email is Required')
            .email('Invalid Email Format'),
        password: zod.string().nonempty('Password is Required')

    });

    const { handleSubmit, register, formState: { errors } } = useForm({
        defaultValues: {
            email: '', password: '',
        },
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    async function SignIn(values) {
        setLoading(true);
        setApiError(null);
        try {
            const response = await sendLoginData(values);

            if (response?.error) {
                setApiError(response.error);
            } else {
                localStorage.setItem('token', response.token)
                setToken(response.token);
                navigate('/');
            }
        } catch (err) {
            setApiError("Something went wrong");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="w-full max-w-md bg-white py-10 px-6 rounded-2xl shadow-xl">
                <h2 className='text-4xl mb-6 font-bold text-center text-gray-800'>Login</h2>

                <form onSubmit={handleSubmit(SignIn)} className='flex flex-col gap-4'>


                    <Input variant='bordered' labelPlacement='outside' label="Email"
                        placeholder='user@example.com'
                        isInvalid={!!errors.email} errorMessage={errors.email?.message}
                        {...register('email')} />

                    <Input variant='bordered' labelPlacement='outside' label="Password"
                        type="password" placeholder='********'
                        isInvalid={!!errors.password}
                        errorMessage={errors.password?.message}
                        {...register('password')} />


                    {apiError && <div className='p-3 bg-red-100 text-red-700 rounded text-sm text-center'>{apiError}</div>}

                    <Button type='submit' isLoading={loading} color="primary" className='w-full font-semibold'>
                        Login
                    </Button>

                    <p className='text-center text-gray-500 text-sm mt-2'>
                        If you Don't have an account? <Link to='/register' className='text-primary hover:underline font-medium'>Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

