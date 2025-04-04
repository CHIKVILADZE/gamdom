import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninData } from "@shared/schema/schemas";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SigninData>({
    resolver: zodResolver(signinSchema)
  });

  const navigate = useNavigate();

  const onSubmit = async (data: SigninData) => {
    try {
      const response = await api.post("/auth/signin", data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/home"); 
    } catch (error: any) {
      alert(error.response?.data?.message || "Sign in failed");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="p-4 rounded shadow border bg-light" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" {...register("email")} />
            {errors.email && <div className="text-danger">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" {...register("password")} />
            {errors.password && <div className="text-danger">{errors.password.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>

        <div className="mt-3 text-center">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
