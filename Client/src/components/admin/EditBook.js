import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    MenuItem,
    Paper,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    useUpdateBookMutation,
    useGetGenreAllActiveQuery,
} from "../../services/api";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
    title: Yup.string()
        .min(6, "At least 6 characters")
        .max(50, "Max 50 characters")
        .required("Title is required"),
    author: Yup.string()
        .min(6, "At least 6 characters")
        .max(50, "Max 50 characters")
        .required("Author is required"),
    description: Yup.string()
        .max(500, "Max 500 characters")
        .required("Description is required"),
    publishedYear: Yup.number()
        .min(1000, "Enter a valid year")
        .max(new Date().getFullYear(), "Future year not allowed"),
    genre: Yup.string().required("Genre is required"),
    quantity: Yup.number()
        .min(1, "At least 1 book required")
        .required("Quantity is required"),
    image: Yup.mixed(),
});

const TextStyledField = styled(TextField)({
    "& .MuiInputBase-input": {
        fontSize: "16px",
        fontWeight: 500,
        color: "black",
    },
    "& .MuiInputLabel-root": {
        fontSize: "15px",
        fontWeight: 300,
        color: "gray",
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "20px",
    },
});

const EditBook = ({ selectedUser }) => {
    const [preview, setPreview] = useState(null);
    const [updateBook] = useUpdateBookMutation();
    const { data: genres } = useGetGenreAllActiveQuery();

    useEffect(() => {
        if (selectedUser?.image) {
            setPreview(selectedUser.image); // show old image
        }
    }, [selectedUser]);

    const initialValues = {
        title: selectedUser?.title || "",
        author: selectedUser?.author || "",
        description: selectedUser?.description || "",
        publishedYear: selectedUser?.publishedYear || "",
        genre: selectedUser?.genre?._id || "",
        quantity: selectedUser?.quantity || 1,
        image: null,
    };

    const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("author", values.author);
        formData.append("description", values.description);
        formData.append("publishedYear", values.publishedYear);
        formData.append("genre", values.genre);
        formData.append("quantity", values.quantity);

        if (values.image) {
            formData.append("image", values.image);
        }

        try {
            await updateBook({ id: selectedUser._id, values: formData }).unwrap();
            toast.success("Book Updated Successfully ✅");
        } catch (err) {
            toast.error(err?.data?.message || "Update Failed ❌");
        }
    };

    if (!selectedUser) {
        return <Typography align="center">No book selected for edit</Typography>;
    }

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
            <Paper elevation={0} sx={{ p: 4, borderRadius: "12px", minWidth: "60%" }}>
                <Typography align="center" variant="h5" fontWeight="bold" gutterBottom>
                    Edit Book
                </Typography>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize // ✅ important for prefilling after selecting user
                >
                    {({ setFieldValue }) => (
                        <Form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {/* Title & Author */}
                            <Box sx={{ display: "flex", gap: "16px", flexDirection: { xs: "column", sm: "row" } }}>
                                <Field
                                    as={TextStyledField}
                                    name="title"
                                    label="Title"
                                    size="small"
                                    helperText={<ErrorMessage name="title" />}
                                    sx={{ flex: 1 }}
                                />
                                <Field
                                    as={TextStyledField}
                                    name="author"
                                    label="Author"
                                    size="small"
                                    helperText={<ErrorMessage name="author" />}
                                    sx={{ flex: 1 }}
                                />
                            </Box>

                            {/* Description */}
                            <Field
                                as={TextStyledField}
                                name="description"
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                helperText={<ErrorMessage name="description" />}
                            />

                            {/* Published Year, Genre & Quantity */}
                            <Box sx={{ display: "flex", gap: "16px", flexDirection: { xs: "column", sm: "row" } }}>
                                <Field
                                    as={TextStyledField}
                                    name="publishedYear"
                                    label="Published Year"
                                    type="number"
                                    size="small"
                                    helperText={<ErrorMessage name="publishedYear" />}
                                    sx={{ flex: 1 }}
                                />

                                <Field
                                    as={TextStyledField}
                                    select
                                    name="genre"
                                    label="Genre"
                                    size="small"
                                    helperText={<ErrorMessage name="genre" />}
                                    sx={{ flex: 1 }}
                                >
                                    {genres?.map((g) => (
                                        <MenuItem key={g._id} value={g._id}>
                                            {g.name}
                                        </MenuItem>
                                    ))}
                                </Field>

                                <Field
                                    as={TextStyledField}
                                    name="quantity"
                                    label="Quantity"
                                    type="number"
                                    size="small"
                                    helperText={<ErrorMessage name="quantity" />}
                                    sx={{ flex: 1 }}
                                />
                            </Box>

                            {/* File Upload */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{
                                        height: "40px",
                                        borderRadius: "20px",
                                        borderColor: "blue",
                                        backgroundColor: "blue",
                                        color: "white",
                                    }}
                                >
                                    Upload Image
                                    <input
                                        type="file"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.currentTarget.files[0];
                                            if (file) {
                                                setFieldValue("image", file);
                                                setPreview(URL.createObjectURL(file)); // ✅ show preview instantly
                                            }
                                        }}
                                    />
                                </Button>

                                {preview && (
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>{preview}</strong>
                                    </Typography>
                                )}
                            </Box>

                            {/* Submit */}
                            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                                Save Changes
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};

export default EditBook;
