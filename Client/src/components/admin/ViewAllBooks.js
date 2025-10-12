import React, {useEffect, useState} from "react";
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
    useActiveBookMutation, useDeactivateBookMutation, useGetAllBooksMutation,
    useGetAllBooksQuery, useGetBookFiltersQuery,
    useGetGenreAllActiveQuery, useUpdateBookMutation,
} from "../../services/api";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button, Dialog} from "@mui/material";

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
        "& .MuiSvgIcon-root": {
            color: "white", // dropdown arrow icon
        },
    },
    "& .MuiInputLabel-root": {
        fontSize: "15px",
        fontWeight: 500,
        color: "white", // Keeping label white for visibility on dark background
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
    },  "& .MuiSvgIcon-root": {
        color: "white", // dropdown arrow icon
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
        color: "black", // ✅ CHANGED TO BLACK for inputs inside the white dialog
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
    },  "& .MuiSvgIcon-root": {
        color: "white", // dropdown arrow icon
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

// Styled TextField for the Filter dropdown *outside* the dialog
const FilterTextField = styled(TextField)({
    "& .MuiInputBase-input": {
        fontSize: "16px",
        fontWeight: 500,
        color: "white", // Keeping white for visibility on dark background
    },  "& .MuiSvgIcon-root": {
        color: "white", // dropdown arrow icon
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
    const [selectedGenres, setSelectedGenres] = useState(["all"]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState("all"); // default selected value
    const [page, setPage] = useState(1);
    const limit = 3;




    // Books query
    const [getAllBooks, { data: booksData, isLoading: isBooksLoading }] = useGetAllBooksMutation();

    useEffect(() => {
        getAllBooks({
            page,
            limit,
            status: filter,
            genres: selectedGenres,
        });
    }, [page, filter, selectedGenres]);

    const refetchBooks = () => {
        getAllBooks({
            page,
            limit,
            status: filter,
            genres: selectedGenres,
        });
    };

    // Genres query
    const {data: genresData, isLoading: isGenresLoading} = useGetGenreAllActiveQuery();

    // update book
    const [preview, setPreview] = useState()
    const [updateBook] = useUpdateBookMutation()
    const onSubmit = async (values) => {
        if (!selectedUser) return;

        const {_id, __v, ...payload} = values;

        const result = await updateBook({
            id: selectedUser._id,
            values: payload,
        });
        handleClose();
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
                "success"
            )
            refetchBooks()
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

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };


    // filter working
    const { data: filterData, isLoading: isFilterLoading } = useGetBookFiltersQuery();

    const statusFilterOptions = filterData?.find(f => f.label === "Status")?.options || [];
    const genreFilterOptions = filterData?.find(f => f.label === "Genre")?.options || [];


    const handleChange = (event) => {
        const { value } = event.target;
        if (value.includes("all") && value.length > 1) {
            const withoutAll = value.filter(val => val !== "all");
            setSelectedGenres(withoutAll);
        }
        else if (!value.includes("all") && selectedGenres.includes("all")) {
            setSelectedGenres(value);
        }
        else if (value.length === 0) {
            setSelectedGenres(["all"]);
        }
        else {
            setSelectedGenres(value);
        }

    };





    // active and deactive book

    const [activeBook] = useActiveBookMutation();
    const [deactivateBook] = useDeactivateBookMutation();


    // sweet alert
    const handleToggleUser = (book) => {
        Swal.fire({
            title: book.validFlag ? "Deactivate Book?" : "Activate Book?",
            text: book.validFlag
                ? "This will deactivate the Book."
                : "This will activate the Book.",
            icon: book.validFlag ? "warning" : "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: book.validFlag ? "Yes, deactivate!" : "Yes, activate!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    if (book.validFlag) {
                        await deactivateBook(book._id).unwrap();
                        Swal.fire("Deactivated!", "Book has been deactivated.", "success");
                    } else {
                        await activeBook(book._id).unwrap();
                        Swal.fire("Activated!", "Book has been activated.", "success");
                    }
                    refetchBooks();
                } catch (err) {
                    console.error("Mutation error:", err);
                    Swal.fire(
                        "Error!",
                        err?.data?.message || "Something went wrong.",
                        "error"
                    );
                }
            }
        });
    };

    const Loading = [isGenresLoading, isBooksLoading].some(Boolean);


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
                flexDirection: "column",
                alignItems: "center",
                justifyContent:"center",
                gap: "15px",
                p: 4,
            }}
        >
            <Typography sx={{color:"white"}} variant="h5" fontWeight="bold" align="center" gutterBottom>
                📚 View All Books
            </Typography>

            {isFilterLoading || Loading ? <Loader isLoading={true} /> : null}
            <Box maxWidth="md"
                 sx={{
                     width:"100%",
                     display: "flex",
                     flexDirection: "column",
                     gap: 2,
                     mb: 3,
                     alignItems: "center",
                 }}
            >
                {/* Status Filter */}
                <FilterTextField
                    sx={{ color: "white" }}
                    select
                    name="filter"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    // InputLabelProps={{ style: { color: "white" }, label:"All" }}
                >
                    {statusFilterOptions.map((option, idx) => (
                        <MenuItem key={idx} value={option.value} >
                            {option.label}
                        </MenuItem>
                    ))}
                </FilterTextField>


                {/* Genre Multi-Select Filter */}
                <StyledFormControl fullWidth size="small">
                    <Select
                        labelId="genre-filter-label"
                        multiple
                        value={selectedGenres}
                        onChange={handleChange}
                        input={<OutlinedInput sx={{ color: "white" }} />}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return (
                                    <Typography variant="body2" sx={{ color: "white", fontStyle: "italic" }}>
                                        Choose genres...
                                    </Typography>
                                );
                            }
                            // Convert values back to labels for display
                            const selectedLabels = selected.map(val => {
                                const option = genreFilterOptions.find(opt => opt.value === val);
                                return option ? option.label : val;
                            });
                            return selectedLabels.join(", ");
                        }}
                        MenuProps={MenuProps}
                    >
                        {genreFilterOptions.map((option, i) => (
                            <StyledMenuItem
                                key={i}
                                value={option.value}  // Store the value
                                selected={selectedGenres.includes(option.value)}  // Compare with value
                            >
                                {option.label}
                            </StyledMenuItem>
                        ))}
                    </Select>
                </StyledFormControl>




                {/* Books table */}
                <TableContainer component={Paper} className="rounded-xl shadow-lg">
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{backgroundColor: "#1976d2"}}>
                                {/* ✅ Table header text changed to black */}
                                <TableCell sx={{color: "black", fontWeight: "bold"}}>
                                    ID
                                </TableCell>
                                <TableCell sx={{color: "black", fontWeight: "bold"}}>
                                    Title
                                </TableCell>
                                <TableCell sx={{color: "black", fontWeight: "bold"}}>
                                    Author
                                </TableCell>
                                <TableCell sx={{color: "black", fontWeight: "bold"}}>
                                    Published Year
                                </TableCell>
                                <TableCell
                                    sx={{color: "black", fontWeight: "bold"}}
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
                        count={booksData?.totalPages || 1}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: 'white',
                            },
                        }}
                    />
                </Box>


                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <Paper elevation={0} sx={{p: 4, borderRadius: "12px", minWidth: "60%"}}>
                        {/* Title text is black by default on white Paper background */}
                        <Typography align="center" variant="h5" fontWeight="bold" gutterBottom>
                            Edit Book
                        </Typography>

                        <Formik
                            initialValues={selectedUser || initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                            enableReinitialize
                        >
                            {({setFieldValue}) => (
                                <Form
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                    }}
                                >
                                    {/* Title & Author - using TextStyledField (with black text) */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: "16px",
                                            flexDirection: {xs: "column", sm: "row"},
                                        }}
                                    >
                                        <Field
                                            as={TextStyledField}
                                            name="title"
                                            label="Title"
                                            size="small"
                                            variant="outlined"
                                            sx={{flex: 1}}
                                            helperText={<ErrorMessage name="title"/>}
                                        />
                                        <Field
                                            as={TextStyledField}
                                            name="author"
                                            label="Author"
                                            size="small"
                                            variant="outlined"
                                            sx={{flex: 1}}
                                            helperText={<ErrorMessage name="author"/>}
                                        />
                                    </Box>

                                    {/* Description - using TextStyledField (with black text) */}
                                    <Field
                                        as={TextStyledField}
                                        name="description"
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        helperText={<ErrorMessage name="description"/>}
                                    />

                                    {/* Published Year, Genre & Quantity - using TextStyledField (with black text) */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: "16px",
                                            flexDirection: {xs: "column", sm: "row"},
                                        }}
                                    >
                                        <Field
                                            as={TextStyledField}
                                            name="publishedYear"
                                            label="Published Year"
                                            type="number"
                                            size="small"
                                            variant="outlined"
                                            sx={{flex: 1}}
                                            helperText={<ErrorMessage name="publishedYear"/>}
                                        />
                                        <Field
                                            as={TextStyledField}
                                            select
                                            name="genre"
                                            label="Genre"
                                            size="small"
                                            variant="outlined"
                                            sx={{flex: 1}}
                                            helperText={<ErrorMessage name="genre"/>}
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
                                            sx={{width: "fitContent"}}
                                            helperText={<ErrorMessage name="quantity"/>}
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
                                                style={{color: "red", fontSize: "14px"}}
                                            />
                                        </Box>
                                        {/* File name text is black by default on white Paper background */}
                                        {preview && (
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{typeof preview === "string" ? preview : preview.name}</strong>
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Submit Button */}
                                    <Button type="submit" variant="contained" sx={{mt: 2}} disable={isBooksLoading}>
                                        {isBooksLoading ? "updatingBook... " : "updateBook"}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Paper>
                </Dialog>
            </Box>
        </Container>
    );
};

export default ViewAllBooks;