import React, { useState, useEffect } from "react";
import { app } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import { Code2, Users, Rocket, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";


const auth = getAuth(app);
const GoogleProvider = new GoogleAuthProvider(app);

const Home = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate(`/profile/dashboard`);
        } else {
          navigate("");
        }
      });
  
      return () => unsubscribe();
    }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(`/profile/dashboard`);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, GoogleProvider);
      navigate(`/profile/dashboard`);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGithubLogin = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Share. Code.
                <br/>
                <span className="text-purple-400"> Grow.</span>
              </h1>
              <p className="text-xl text-gray-300">
                Join a community of beginner developers learning and building
                together.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6 space-y-2">
                  <Code2 className="h-8 w-8 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Built-in Editor
                  </h3>
                  <p className="text-gray-300">
                    Code, test, and share your projects directly in the browser.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6 space-y-2">
                  <Users className="h-8 w-8 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Community
                  </h3>
                  <p className="text-gray-300">
                    Connect with fellow developers and learn together.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6 space-y-2">
                  <Rocket className="h-8 w-8 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Projects</h3>
                  <p className="text-gray-300">
                    Showcase your work and get feedback from peers.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6 space-y-2">
                  <Github className="h-8 w-8 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Resources
                  </h3>
                  <p className="text-gray-300">
                    Access curated learning materials and guides.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side Login Form */}
          <div className="lg:pl-12">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <h2 className="text-2xl font-bold text-white text-center">
                  Welcome
                </h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Password</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-purple-400 hover:text-purple-300"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button
                    variant="ghost"
                      type="button"
                      className="text-white"
                      onClick={handleGoogleLogin}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
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

                    <Button
                      variant="ghost"
                      type="button"
                      className="text-white"
                      onClick={handleGithubLogin}
                    >
                      <Github className="h-5 w-5" />
                      GitHub
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
                    Don't have an account?{" "}
                    <Link
                      to="/registration-page"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Sign up
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;