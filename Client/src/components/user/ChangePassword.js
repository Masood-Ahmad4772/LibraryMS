import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  styled,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useChangeUserPasswordMutation } from "../../services/api";
import { toast } from "react-toastify";

const styleInput = styled(TextField)({
  // input text itself

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

const validationSchema = yup.object({
  userName: yup.string().required("userName is Required"),
  oldPassword: yup.string().required("Oldpassword is Required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const ChangePassword = () => {
  const [changeUserPassword, response] = useChangeUserPasswordMutation();
  console.log("response", response);

  const initialValues = {
    userName: "",
    oldPassword: "",
    newPassword: "",
  };

  const onsubmit = (values, { resetForm }) => {
    changeUserPassword(values);
    if (response) {
      toast.success("DataUpdate Succesffuly✅");
    }
    resetForm();
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundImage: `url("library.avif")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          minWidth: "30%",
        }}
      >
        <Typography variant="h5" gutterBottom textAlign={"center"}>
          Change Password
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onsubmit}
        >
          <Form>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {/* UserName*/}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <Field
                  as={styleInput}
                  label="userName"
                  type="text"
                  name="userName"
                  size="small"
                />
                <ErrorMessage
                  name="userName"
                  style={{
                    color: "red",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                  component="Box"
                />
              </Box>

              {/* old Password */}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <Field
                  as={styleInput}
                  label="old Password"
                  type="password"
                  name="oldPassword"
                  size="small"
                />
                <ErrorMessage
                  name="oldPassword"
                  style={{
                    color: "red",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                  component="Box"
                />
              </Box>

              {/* New Password */}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <Field
                  as={styleInput}
                  label="Confirm New Password"
                  type={"password"}
                  name="newPassword"
                  size="small"
                />
                <ErrorMessage
                  name="newPassword"
                  style={{
                    color: "red",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                  component="Box"
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ mt: 3, py: 1.2 }}
              >
                Update Password
              </Button>
            </Box>
          </Form>
        </Formik>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
