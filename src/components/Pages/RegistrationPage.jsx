import React, { useState } from "react";
import { app } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const auth = getAuth(app);
const db = getDatabase(app);
const GoogleProvider = new GoogleAuthProvider();

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [registrationForm, setRegistrationForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registrationForm.email,
        registrationForm.password
      );
      const user = userCredential.user;

      await set(ref(db, `users/${registrationForm.username}`), {
        email: registrationForm.email,
        uid: user.uid,
        username: registrationForm.username,
        createdAt: new Date().toISOString(),
      });

      navigate("/profile/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegistration = async () => {
    try {
      const result = await signInWithPopup(auth, GoogleProvider);
      const user = result.user;

      await set(ref(db, `users/${user.displayName}`), {
        email: user.email,
        uid: user.uid,
        username: user.displayName,
        createdAt: new Date().toISOString(),
      });

      navigate("/profile/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <h2 className="text-2xl font-bold text-white text-center">
              Create Your Account
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailRegistration} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Username</label>
                <Input
                  type="text"
                  value={registrationForm.username}
                  onChange={(e) => 
                    setRegistrationForm(prev => ({
                      ...prev, 
                      username: e.target.value
                    }))
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Email</label>
                <Input
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) => 
                    setRegistrationForm(prev => ({
                      ...prev, 
                      email: e.target.value
                    }))
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Password</label>
                <Input
                  type="password"
                  value={registrationForm.password}
                  onChange={(e) => 
                    setRegistrationForm(prev => ({
                      ...prev, 
                      password: e.target.value
                    }))
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className="mt-6 flex justify-center">
                <Button
                  variant="ghost"
                  type="button"
                  className="text-white"
                  onClick={handleGoogleRegistration}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-400 bg-gray-800">Or</span>
                </div>
              </div>

              <div className="text-center text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationPage;