import React, { useState } from "react";
import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";


import Loader from "../loader/CircularUnderLoad";
import Swal from "sweetalert2";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useGetAllUserQuery,
  useDeactiveUserMutation,
  useActiveUserMutation,
  useEditUserMutation,
} from "../../services/api";


const TextStyledField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontSize: "16px",
    fontWeight: 500,
    color: "black",
    "::placeholder": {
      color: "gray",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "red",
  },
  "& .MuiInputLabel-root": {
    fontSize: "15px",
    fontWeight: 600,
    color: "gray",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "gray",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "gray",
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "gray",
      borderWidth: "2px",
    },
  },
});

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
});

const ViewAllUser = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const type = "User";
  const { data,error, isLoading, refetch } = useGetAllUserQuery({
    page,
    limit,
    type,
  });
  console.log("error", error)
    console.log("data", data)

  const [deactiveUser] = useDeactiveUserMutation();
  const [activeUser] = useActiveUserMutation();
  const [updateUser, {isLoading: isUpdating}] = useEditUserMutation();

  const initialValues = {
    name: "",
    userName: "",
    email: "",
  };

  // dialog state
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const onSubmit = async (values) => {
    const { name, userName, email } = values;

    // Call the mutation
    const result = await updateUser({
      id: selectedUser.id,
      data: { name,userName, email},
    });

    handleClose(); // Call handleClose after the mutation attempt
    // Check the result object for errors
    if (result.error) {
      Swal.fire(
        "Error!",
        result.error?.data || "Update failed",
        "error"
      );
    } else {
      Swal.fire("Success!", "User updated successfully.", "success");
      refetch();
    }
  };

  const handleToggleUser = (user) => {
    Swal.fire({
      title: user.validFlag ? "Deactivate ViewAllUser?" : "Activate ViewAllUser?",
      text: user.validFlag
        ? "This will deactivate the user."
        : "This will activate the user.",
      icon: user.validFlag ? "warning" : "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: user.validFlag ? "Yes, deactivate!" : "Yes, activate!",
    }).then((result) => {
      if (result.isConfirmed) {
        if (user.validFlag) {
          deactiveUser(user.id)
            .unwrap()
            .then(() => {
              Swal.fire("warning!", "ViewAllUser has been deactivated.", "success");
              refetch();
            })
            .catch((err) => {
              Swal.fire(
                "Error!",
                err?.data?.message || "Something went wrong.",
                "error"
              );
            });
        } else {
          activeUser(user.id)
            .unwrap()
            .then(() => {
              Swal.fire("Success!", "ViewAllUser has been activated.", "success");
              refetch();
            })
            .catch((err) => {
              Swal.fire(
                "Error!",
                err?.data?.message || "Something went wrong.",
                "error"
              );
            });
        }
      }
    });
  };



    return (
    <Container
      maxWidth={false}
      disableGutters
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
      {isLoading ? <Loader isLoading={isLoading} /> : null}
      <Box>
        <Typography
          variant="h4"
          component={"h3"}
          sx={{ textAlign: "center", color: "white", fontWeight: 600 }}
        >
          User List
        </Typography>

        {!isLoading && data && data.userNames && (
          <>
            <TableContainer component={Paper} className="rounded-xl shadow-lg">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      UserName
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Email
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold" }}
                      align="center"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.userNames.length > 0 ? (
                    data.userNames.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={() => handleEdit(user)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label={
                              user.validFlag ? "deactivate" : "activate"
                            }
                            color={user.validFlag ? "error" : "success"}
                            onClick={() => handleToggleUser(user)}
                          >
                            {user.validFlag ? <DeleteIcon /> : <CheckIcon />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={6}>
                <Pagination
                  count={data.totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Edit ViewAllUser Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Formik
          initialValues={selectedUser || initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          <Form>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent dividers>
              <Field
                as={TextStyledField}
                name="name"
                margin="dense"
                label="Name"
                fullWidth
                helperText={<ErrorMessage name="name" />}
              />
              <Field
                as={TextStyledField}
                name="userName"
                margin="dense"
                label="UserName"
                fullWidth
                helperText={<ErrorMessage name="userName" />}
              />
              <Field
                as={TextStyledField}
                name="email"
                margin="dense"
                label="Email"
                fullWidth
                helperText={<ErrorMessage name="email" />}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </Container>
  );
};

export default ViewAllUser;
