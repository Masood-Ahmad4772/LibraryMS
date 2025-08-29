import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  styled,
  Link,
} from "@mui/material";
import { React, useEffect, useState } from "react";
import { useSignupMutation } from "../../services/api";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";

const TextStyledField = styled(TextField)({
  // input text itself
  "& .MuiInputBase-input": {
    fontSize: "16px",
    fontWeight: 500,
    color: "black",
    "::placeholder": {
      color: "gray",
    },
  },

  // label (the floating "Email" text)
  "& .MuiInputLabel-root": {
    fontSize: "15px",
    fontWeight: 600,
    color: "gray",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "gray", // label color on focus
  },

  // border styles
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
    "& fieldset": {
      borderColor: "gray", // default border
    },
    "&:hover fieldset": {
      borderColor: "gray", // border on hover
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "gray", // border on focus
      borderWidth: "2px", // thicker when focused
    },
  },
});

const Boxstyle = {
  backgroundColor: "#ffffffd4",
  padding: { xs: "15px", sm: "25px" },
  textAlign: "center",
  width: { xs: "80%", sm: "50%" },
  display: "flex",
  flexDirection: " column",
  gap: "2rem",
  borderRadius: "6px",
};

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  userName: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Register = () => {
  const [signup, response] = useSignupMutation();
  console.log("response", response)
 
  localStorage.clear()
  const Navigate = useNavigate()

  useEffect(() => {
    if (response && response?.isSuccess) {
      toast.success("Signup successfully✅");
      
      const token = response?.data?.accessToken;
      const role = response?.data?.userTypeName;
      const user = response?.data?.newUser;

      console.log("token", token)
      console.log("role", role)
      console.log("user", user)



      if (token) {
        localStorage.setItem("token", token);
      }

      if (role) {
        localStorage.setItem("role", role);
      }

        if(user){
        localStorage.setItem("user", JSON.stringify(user))
      }
      Navigate("/")
    }

    if (response && response?.isError) {
      toast.error(response.error.data || "Signup failed ❌");
    }
  }, [response.isSuccess, response]);

  const initialValues = {
    name: "",
    userName: "",
    email: "",
    password: "",
  };
  const onSubmit = (values) => {
    signup(values);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundImage: `url("signupbg.avif")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "calc(100vh - 68.5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={Boxstyle}>
        <Typography variant="h5" component="h2">
          Sign up Form
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <Field
                as={TextStyledField}
                size="small"
                label="Name"
                type="text"
                name="name"
              />
              <ErrorMessage
                name="name"
                component={"Box"}
                style={{ color: "red" }}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <Field
                as={TextStyledField}
                size="small"
                label="Username"
                type="text"
                name="userName"
              />
              <ErrorMessage
                name="userName"
                component={"Box"}
                style={{ color: "red" }}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <Field
                as={TextStyledField}
                size="small"
                label="Email"
                type="email"
                name="email"
              />
              <ErrorMessage
                name="email"
                component="Box"
                style={{ color: "red" }}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <Field
                as={TextStyledField}
                size="small"
                label="Password"
                type="password"
                name="password"
              />
              <ErrorMessage
                name="password"
                component={"Box"}
                style={{ color: "red" }}
              />
            </Box>
            <Typography variant="p" component="p">
              if you have a Account{" "}
              <Link size="small" href="/login">
                Login
              </Link>
            </Typography>
            <Button
              disabled={response.isLoading}
              variant="contained"
              size="small"
              type="submit"
            >
              {response.isLoading ? "Signup.." : "Singup"}
            </Button>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
};

export default Register;
