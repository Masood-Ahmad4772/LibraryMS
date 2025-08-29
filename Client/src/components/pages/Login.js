import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  styled,
  Link,
} from "@mui/material";
import { useLoginMutation } from "../../services/api";
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
  backgroundColor: "#ffffffaa",
  padding: { xs: "15px", sm: "25px" },
  textAlign: "center",
  width: { xs: "80%", sm: "50%" },
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  borderRadius: "6px",
};

const validationSchema = Yup.object({
  userName: Yup.string().required("UserName is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const Navigate = useNavigate();

  const [login, response] = useLoginMutation();
    console.log("response", response)


  useEffect(() => {
    if (response?.isSuccess && response) {
      toast.success("Signup successfully ✅");

      const token = response?.data?.accessToken;
      const role = response?.data?.userTypeName;
      const user = response?.data?.userDetails;
      console.log("token", token)

      if (token) {
        localStorage.setItem("token", token);
      }

      if (role) {
        localStorage.setItem("role", role);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      Navigate("/");
    }

    if (response?.isError) {
      toast.error(response.error.data || "Signup failed ❌");
    }
  }, [response.isSuccess, response, response.error]);

  const initialValues = {
    userName: "",
    password: "",
  };

  const onSubmit = (values) => {
    login(values);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundImage: `url("library.avif")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "calc(100vh - 68.5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={Boxstyle}>
        <Typography variant="h4" component="h2">
          Login Form
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
                label="Username"
                type="username"
                name="userName"
              />
              <ErrorMessage
                name="userName"
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
                component="Box"
                style={{ color: "red" }}
              />
            </Box>
            <Typography variant="p" component="p">
              if you have a Account{" "}
              <Link size="small" href="/register">
                Sign Up
              </Link>
            </Typography>
            <Button
              disabled={response.isLoading}
              type="submit"
              variant="contained"
              size="small"
            >
              {response.isLoading ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
};
export default Login;
