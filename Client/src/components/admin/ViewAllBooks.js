import React, {useState} from "react";
import {
    Select,
    Box,
    Container,
    InputLabel,
    Typography,
    OutlinedInput,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    MenuItem,
    TextField,
    Pagination,
    IconButton,
    Paper,
} from "@mui/material";
import {styled} from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import Loader from "../loader/CircularUnderLoad"
import {
    useGetAllBooksQuery,
    useGetGenreAllActiveQuery, useUpdateBookMutation,
} from "../../services/api";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {toast} from "react-toastify";
import swal from "sweetalert2";
import Swal from "sweetalert2";

// Config
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// Styled Select
const StyledFormControl = styled(FormControl)({
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
    "& .MuiInputLabel-root": {
        fontSize: "15px",
        fontWeight: 500,
        color: "gray",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "gray",
    },
});

// Styled MenuItem
const StyledMenuItem = styled(MenuItem)(({theme}) => ({
    fontSize: "15px",
    fontWeight: 500,
    borderRadius: "12px",
    margin: "3px 4px",
    color: "black",

    "&:hover": {
        backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: "12px",
    },

    "&.Mui-selected": {
        backgroundColor: "rgba(0,0,0,0.1)",
        fontWeight: 600,
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.2)",
        },
    },
}));

// Styled TextField
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
        .max(new Date().getFullYear(), "Future year not allowed").required("publishedYear Required"),
    genre: Yup.string().required("Genre is required"),
    quantity: Yup.number()
        .min(1, "At least 1 book required")
        .required("Quantity is required"),
    image: Yup.mixed(),
    validFlag: Yup.boolean(),
});


const ViewAllBooks = () => {
    const [personName, setPersonName] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState("All"); // default selected value
    const [page, setPage] = useState(1);
    const limit = 3;
    const type = "User";


    // Books query
    const {data: booksData, isLoading: isBooksLoading, refetch: refetchBooks,} = useGetAllBooksQuery({
        page,
        limit,
        type,
    });

    // Genres query
    const {data: genresData, isLoading: isGenresLoading, refetch: refetchGenres} = useGetGenreAllActiveQuery();



    // update book
   const [preview, setPreview] =  useState()
    const [updateBook,response] = useUpdateBookMutation()


    const onSubmit = async (values) => {
        if (!selectedUser) return;

        const { _id,__v, ...payload } = values;

        const result = await updateBook({
            id: selectedUser._id,
            values: payload,
        });
        console.log("Updated book:", result);
       if (result.error) {
           Swal.fire(
               "Error!",
               result.error?.data || "Update Failed",
               "error"
           );
        } else {
           Swal.fire(
               "Success!",
               "Book Update Successfully",
                refetchBooks()
           )
       }

    };




    const initialValues = {
        title: "",
        author: "",
        description: "",
        publishedYear: "",
        genre: "",
        quantity: 1,
        image: null,
    };


    const handleEdit = (book) => {
        setSelectedUser({
            ...book,
            genre: book.genre?._id || ""   // ensure Formik gets an ID string
        });
        setPreview(book.image)
        setOpen(true)
    }

    const handleChange = (event) => {
        const { target: { value } } = event;

        if (value.includes("All")) {
            setPersonName(genresData?.map((genre) => genre.name) || []);
        } else {
            setPersonName(value);
        }
    };


    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };


    const Filter = ["All", "Active", "deActive"]

    // sweet alert
    const handleToggleUser = (book) => {
        Swal.fire({
            title: book.validFlag ? "Deactivate Book"  :"Active",
            text: book.validFlag
                ? "This will deactivate the Book."
                : "This will activate the user.",
        })
    }


    return (
        <Container
            maxWidth="md"
            sx={{
                height: "calc(100vh - 64px)",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                p: 4,
            }}
        >
            {/* Multi-select filter */}
            <StyledFormControl fullWidth size="small">
                <InputLabel id="all-label">All</InputLabel>
                <Select
                    labelId="all-label"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="All"/>}
                    renderValue={(selected) =>
                        selected.length === 0 ? (
                            <Typography
                                variant="body2"
                                sx={{color: "gray", fontStyle: "italic"}}
                            >
                                Choose users...
                            </Typography>
                        ) : (
                            selected.join(", ")
                        )
                    }
                    MenuProps={MenuProps}
                >
                    {genresData?.map((genre) => (
                        <StyledMenuItem
                            key={genre._id}
                            value={genre.name}
                            selected={personName.includes(genre.name)}
                        >
                            {genre.name}
                        </StyledMenuItem>
                    ))}
                </Select>
            </StyledFormControl>

            {/* Genres dropdown */}
            <TextStyledField
                select
                name="Filter"
                size="small"
                variant="outlined"
                fullWidth
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                {Filter.map((g, idx) => (
                    <MenuItem key={idx} value={g}>
                        {g}
                    </MenuItem>
                ))}
            </TextStyledField>


            {/* Books table */}
            <TableContainer component={Paper} className="rounded-xl shadow-lg">
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{backgroundColor: "#1976d2"}}>
                            <TableCell sx={{color: "white", fontWeight: "bold"}}>
                                ID
                            </TableCell>
                            <TableCell sx={{color: "white", fontWeight: "bold"}}>
                                Title
                            </TableCell>
                            <TableCell sx={{color: "white", fontWeight: "bold"}}>
                                Author
                            </TableCell>
                            <TableCell sx={{color: "white", fontWeight: "bold"}}>
                                Published Year
                            </TableCell>
                            <TableCell
                                sx={{color: "white", fontWeight: "bold"}}
                                align="center"
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isBooksLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Loader/>
                                </TableCell>
                            </TableRow>
                        ) : booksData && booksData.books?.length > 0 ? (
                            booksData.books.map((book) => (
                                <TableRow key={book._id}>
                                    <TableCell sx={{fontSize: "0.8rem"}}>{book._id}</TableCell>
                                    <TableCell sx={{fontSize: "0.8rem"}}>{book.title}</TableCell>
                                    <TableCell sx={{fontSize: "0.8rem"}}>{book.author}</TableCell>
                                    <TableCell sx={{fontSize: "0.8rem"}}>{book.publishedYear}</TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="edit" color="primary"
                                                    onClick={() => handleEdit(book)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton
                                            aria-label={book.validFlag ? "deactivate" : "activate"}
                                            color={book.validFlag ? "error" : "success"}
                                            onClick={() => handleToggleUser(book)}
                                        >
                                            {book.validFlag ? <DeleteIcon/> : <CheckIcon/>}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No books found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box display="flex" justifyContent="center">
                <Pagination
                    count={booksData?.books?.totalPages || 1}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                />
            </Box>


            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <Paper elevation={0} sx={{ p: 4, borderRadius: "12px", minWidth: "60%" }}>
                    <Typography align="center" variant="h5" fontWeight="bold" gutterBottom>
                        Edit Book
                    </Typography>

                    <Formik
                        initialValues={selectedUser || initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        enableReinitialize
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
                                        {genresData?.map((g) => (
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
                                            <strong>{typeof preview === "string" ? preview : preview.name}</strong>
                                        </Typography>
                                    )}
                                </Box>

                                {/* Submit Button */}
                                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                                    update Book
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Dialog>
        </Container>
    );
};

export default ViewAllBooks;
