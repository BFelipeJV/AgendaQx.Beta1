
import LoginForm from '@/components/auth/login-form';
import { LogoIcon } from '@/components/icons/logo';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4"> {/* Slightly lighter background */}
      <div className="mb-8 flex flex-col items-center text-center">
        <LogoIcon className="mb-4 h-16 w-16 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Bienvenido a {APP_NAME}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ingresa tus credenciales para continuar.
        </p>
      </div>
      <div className="w-full max-w-xs sm:max-w-sm"> {/* Adjusted max-width for a more compact form */}
        <LoginForm />
      </div>
    </div>
  );
}
