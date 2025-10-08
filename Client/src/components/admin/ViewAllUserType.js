import React, { useState } from "react";
import {
    Box,
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    styled,
    TextField,
} from "@mui/material";
import {
    useActiveUserTypeMutation,
    useDeactiveUserTypeMutation,
    useGetAllUserTypeQuery,
    useUpdateUserTypeMutation,
} from "../../services/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import Loader from "../loader/CircularUnderLoad";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";

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

const validationSchema = yup.object({
    name: yup
        .string()
        .min(3, "Name must be at least three characters")
        .required("Name is required"),
});

const ViewAllUserType = () => {
    const [selectedUserType, setSelectedUserType] = useState(null);
    const [open, setOpen] = useState(false);
    const [loadingId, setLoadingId] = useState(null);

    // Queries & Mutations
    const { data, isLoading, isFetching, refetch } = useGetAllUserTypeQuery();
    const [updateUserType, { isLoading: isUpdating }] = useUpdateUserTypeMutation();
    const [activeUserType,{error:err}] = useActiveUserTypeMutation();
    const [deactiveUserType] = useDeactiveUserTypeMutation();
    console.log("err",err)

    const handleEdit = (user) => {
        setSelectedUserType(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUserType(null);
    };

    const onSubmit = async (values) => {
        try {
            const result = await updateUserType({
                id: selectedUserType._id,
                data: { name: values.name },
            }).unwrap();

            Swal.fire("Success!", "UserType updated successfully.", "success");
            handleClose();
            refetch();
        } catch (err) {
            Swal.fire("Error!", err?.data?.message || "Update failed", "error");
        }
    };

    const handleToggleUserType = async (user) => {
        console.log("user",user )
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
                    deactiveUserType(user._id)
                        .unwrap()
                        .then(() => {
                            Swal.fire("warning!", `${user.name} has been deactivated.`, "success");
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
                    activeUserType(user._id)
                        .unwrap()
                        .then(() => {
                            Swal.fire("Success!", `${user.name} has been Activated.`, "success");
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

    const initialValues = {
        name: selectedUserType?.name || "",
    };

    const Loading = [isLoading, isFetching].some(Boolean);

    return (
        <Box
            sx={{
                backgroundImage: `url("library.avif")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                py: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Container maxWidth="lg">
                {Loading && <Loader Loading={isLoading} />}
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        backgroundColor: "rgba(255,255,255,0.95)",
                    }}
                >
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#1976d2" }}>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user._id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>
                                            {user.validFlag ? "Active" : "Inactive"}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                aria-label="edit"
                                                color="primary"
                                                onClick={() => handleEdit(user)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label={user.validFlag ? "deactivate" : "activate"}
                                                color={user.validFlag ? "error" : "success"}
                                                onClick={() => handleToggleUserType(user)}
                                                disabled={loadingId === user._id}
                                            >
                                                {loadingId === user._id ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : user.validFlag ? (
                                                    <DeleteIcon />
                                                ) : (
                                                    <CheckIcon />
                                                )}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit Dialog */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <Formik
                        initialValues={selectedUserType || initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        enableReinitialize
                    >
                        <Form>
                            <DialogTitle>Edit UserType</DialogTitle>
                            <DialogContent dividers>
                                <Field
                                    as={TextStyledField}
                                    name="name"
                                    margin="dense"
                                    label="Name"
                                    fullWidth
                                    helperText={<ErrorMessage name="name" />}
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
        </Box>
    );
};

export default ViewAllUserType;
