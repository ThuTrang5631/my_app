import { useForm, Controller } from "react-hook-form";
import { Input, Checkbox } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES, STORAGE_TOKEN, URL_LOGIN } from "../../utils/constants";
import * as yup from "yup";
import { VALIDATE } from "../../utils/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Button";
import { useState } from "react";
import { userAPI } from "../../utils/api";
import Modal from "../../components/Modal";

const schema = yup.object().shape({
  username: yup
    .string()
    .min(11, "User Name over 10 characters")
    .required("User name should be required"),
  password: yup
    .string()
    .matches(
      VALIDATE.regexPassword,
      "Password over 10 characters and including numbers, uppercase letters."
    )
    .required("Password should be required"),
});
type FormData = yup.InferType<typeof schema>;

const LoginPage = () => {
  const [checkRemember, setCheckRemember] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    let res;

    try {
      res = await userAPI.post(URL_LOGIN, data);

      navigate(ROUTES.dashboard, { replace: true });
    } catch (error) {
      setOpenModal(true);
      console.log(error);
    }

    if (checkRemember === true) {
      localStorage.setItem(STORAGE_TOKEN, res?.data?.accessToken);
    } else {
      sessionStorage.setItem(STORAGE_TOKEN, res?.data?.accessToken);
    }
  };

  return (
    <div className="loginpage app__container registerpage">
      <div className="login__section">
        <h1 className="login__title">Welcome back</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="login__form">
          <div className="register__wrapinput">
            <label>Username*</label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="register__input"
                  placeholder="User name..."
                />
              )}
            />
            <p className="error">{errors.username?.message}</p>
          </div>
          <div className="register__wrapinput">
            <label>Password*</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  className="register__input"
                  placeholder="Password..."
                />
              )}
            />
            <p className="error">{errors.password?.message}</p>
          </div>
          <Checkbox
            onChange={() => setCheckRemember(!checkRemember)}
            className="login__checkbox"
          >
            Remember me
          </Checkbox>
          <div className="login__wrapbtn">
            <Button content="Sign In"></Button>
          </div>
        </form>
        <div className="login__bottom">
          <p className="login__bottomdesc">
            Don't have an account? <Link to={ROUTES.register}>Sign up</Link>
          </p>
        </div>
      </div>
      <Modal
        openModal={openModal}
        content="Username or password failed. Try again"
        onCancel={() => {
          setOpenModal(false);
        }}
      ></Modal>
    </div>
  );
};

export default LoginPage;
