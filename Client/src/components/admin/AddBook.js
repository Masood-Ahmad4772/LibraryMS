import React, { useState } from "react";
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
  useAddBookMutation,
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
  validFlag: Yup.boolean(),
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
  "& .MuiInputLabel-root.Mui-focused": {
    color: "gray",
  },
  "& .MuiFormHelperText-root": {
    color: "red",
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

const AddBook = () => {
  const [preview, setPreview] = useState(null);
  const [addBook, response] = useAddBookMutation();
  const { data, error, isLoading } = useGetGenreAllActiveQuery();
  console.log("data", data);
  console.log("error", response?.error);
  console.log("Response", response);
  const initialValues = {
    title: "",
    author: "",
    description: "",
    publishedYear: "",
    genre: "",
    quantity: 1,
    image: null,
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("author", values.author);
    formData.append("description", values.description);
    formData.append("publishedYear", values.publishedYear);
    formData.append("genre", values.genre);
    formData.append("quantity", values.quantity);

    if (values.image) {
      formData.append("image", values.image); // File object
    }

    addBook(formData); // ✅ send FormData not JSON
    resetForm();
    setPreview(null);
    toast.success("Book Added Successfully ✅");
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
      <Paper elevation={0} sx={{ p: 4, borderRadius: "12px", minWidth: "60%" }}>
        <Typography align="center" variant="h5" fontWeight="bold" gutterBottom>
          Add New Book
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue }) => (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {/* Title & Author */}
              <Box
                sx={{
                  display: "flex",
                  gap: "16px",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Field
                  as={TextStyledField}
                  name="title"
                  label="Title"
                  size="small"
                  variant="outlined"
                  sx={{ flex: 1 }}
                  helperText={<ErrorMessage name="title" />}
                />
                <Field
                  as={TextStyledField}
                  name="author"
                  label="Author"
                  size="small"
                  variant="outlined"
                  sx={{ flex: 1 }}
                  helperText={<ErrorMessage name="author" />}
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
                variant="outlined"
                helperText={<ErrorMessage name="description" />}
              />

              {/* Published Year, Genre & Quantity */}
              <Box
                sx={{
                  display: "flex",
                  gap: "16px",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Field
                  as={TextStyledField}
                  name="publishedYear"
                  label="Published Year"
                  type="number"
                  size="small"
                  variant="outlined"
                  sx={{ flex: 1 }}
                  helperText={<ErrorMessage name="publishedYear" />}
                />
                <Field
                  as={TextStyledField}
                  select
                  name="genre"
                  label="Genre"
                  size="small"
                  variant="outlined"
                  sx={{ flex: 1 }}
                  helperText={<ErrorMessage name="genre" />}
                >
                  {data?.map((g) => (
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
                  variant="outlined"
                  sx={{ width: "fitContent" }}
                  helperText={<ErrorMessage name="quantity" />}
                />
              </Box>

              {/* File Upload */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      height: "40px",
                      borderRadius: "20px",
                      borderColor: "blue",
                      backgroundColor: "blue",
                      color: "white",
                      "&:hover": {
                        borderColor: "blue",
                        borderWidth: "2px",
                      },
                    }}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        console.log("file", file);
                        if (file) {
                          setFieldValue("image", file);
                          setPreview(file.name);
                        }
                      }}
                    />
                  </Button>
                  <ErrorMessage
                    name="image"
                    component="div"
                    style={{ color: "red", fontSize: "14px" }}
                  />
                </Box>
                {preview && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>{preview}</strong>
                  </Typography>
                )}
              </Box>

              {/* Submit Button */}
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Add Book
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default AddBook;
