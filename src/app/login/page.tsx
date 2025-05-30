
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4"> {/* Slightly lighter background */}
      <div className="w-full max-w-xs sm:max-w-sm"> {/* Adjusted max-width for a more compact form */}
        <LoginForm />
      </div>
    </div>
  );
}
