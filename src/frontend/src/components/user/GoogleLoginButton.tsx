import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';

export default function GoogleLoginButton({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (onSuccess) onSuccess(result.user);
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold shadow hover:bg-gray-50 transition-all duration-200 mb-2"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
}
