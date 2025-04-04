import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupData } from "../../../shared/schema/schemas";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema)
  });
  const navigate = useNavigate();


  const onSubmit =async (data: SignupData) => {
    try {
      const response = await api.post("/auth/signup", data);
      console.log("Signed up:", response.data);
      navigate("/signin");
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="p-4 rounded shadow border bg-light" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Full Name</label>
            <input className="form-control" {...register("fullName")} />
            {errors.fullName && <div className="text-danger">{errors.fullName.message}</div>}
          </div>

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

          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>

        <div className="mt-3 text-center">
          <p>
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
