import { Input } from "antd";
import { Link } from "react-router-dom";
import { ROUTES, URL_REGISTER } from "../../utils/constants";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { VALIDATE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { userAPI } from "../../utils/api";
import Modal from "../../components/Modal";
import { useState } from "react";

const schema = yup.object().shape({
  username: yup
    .string()
    .min(11, "User Name over 10 characters")
    .required("User name should be required"),
  fullname: yup.string().required("Full name should be required"),
  password: yup
    .string()
    .matches(
      VALIDATE.regexPassword,
      "Password over 10 characters and including numbers, uppercase letters."
    )
    .required("Password should be required"),
  confirmpassword: yup
    .string()
    .required("Confirmpassword should be required")
    .oneOf([yup.ref("password")], "Password should match!"),
  email: yup
    .string()
    .required("Email should be required")
    .matches(VALIDATE.regexEmail, "Email should follow the email format"),
});
type FormData = yup.InferType<typeof schema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    const dataToPost = {
      username: data.username,
      fullname: data.fullname,
      password: data.password,
      email: data.email,
    };

    try {
      const res = await userAPI.post(URL_REGISTER, dataToPost);

      navigate(ROUTES.login, { replace: true });
    } catch (error) {
      setOpenModal(true);
      console.log(error);
    }
  };

  return (
    <div className="registerpage app__container">
      <div className="register__section">
        <h1 className="register__title">Sign Up</h1>
        <p className="register__desc">
          Enter your details to create your account
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="register__form">
          <div className="register__wrapinput">
            <label>User Name*</label>
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
            <label>Full Name*</label>
            <Controller
              name="fullname"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="register__input"
                  placeholder="Full name..."
                />
              )}
            />
            <p className="error">{errors.fullname?.message}</p>
          </div>
          <div className="register__wrappassword">
            <div className="register__wrapinput register__password">
              <label>Password*</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    className="register__input"
                    placeholder="Password..."
                    {...field}
                  />
                )}
              />
              <p className="error">{errors.password?.message}</p>
            </div>
            <div className="register__wrapinput register__password">
              <label>Confirm Password*</label>
              <Controller
                name="confirmpassword"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    className="register__input"
                    placeholder="Confirm password..."
                    {...field}
                  />
                )}
              />
              <p className="error">{errors.confirmpassword?.message}</p>
            </div>
          </div>
          <div className="register__wrapinput">
            <label>Email*</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  className="register__input"
                  placeholder="Email..."
                  {...field}
                />
              )}
            />
            <p className="error">{errors.email?.message}</p>
          </div>
          <div className="register__wrapinput register__wrapbtn">
            <Button content="Sign up"></Button>
          </div>
        </form>
        <div className="register__bottom">
          <p className="register__bottomdesc">
            Already have an Account? <Link to={ROUTES.login}> Log In</Link>
          </p>
        </div>
      </div>
      <Modal
        openModal={openModal}
        content="Username or email already exists. Try again"
        onCancel={() => {
          setOpenModal(false);
        }}
      ></Modal>
    </div>
  );
};

export default RegisterPage;
