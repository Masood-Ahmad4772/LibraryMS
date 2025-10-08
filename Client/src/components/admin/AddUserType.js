import React from 'react';
import {Container, TextField, Button, Paper, Typography, Box} from "@mui/material";
import {styled} from "@mui/material/styles";
// Import Formik components
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {useAddUserTypeMutation} from "../../services/api";

// 1. Custom Styled TextField (No changes needed here)
const TextStyledField = styled(TextField)(({theme}) => ({
    width: '100%', // Ensure it takes full width inside the Paper

    "& .MuiInputBase-input": {
        padding: "18px 14px", // Adjusted for a "large" look
        fontSize: "16px", fontWeight: 500, color: 'white',
    }, "& .MuiInputLabel-root": {
        fontSize: "15px", fontWeight: 300, color: "white",
    }, "& .MuiInputLabel-root.Mui-focused": {
        color: "white",
    }, "& .MuiOutlinedInput-root": {
        borderRadius: "20px", "& fieldset": {
            borderColor: "gray",
        }, "&:hover fieldset": {
            borderColor: "gray", borderWidth: "2px",
        }, "&.Mui-focused fieldset": {
            borderColor: "gray", borderWidth: "2px",
        },
    },
}));

const validationSchema = Yup.object({
    name: Yup.string().required("User Type is required")
});


const initialValues = {
    name: '',
};

const AddUserType = () => {
        const [addUserType, response] = useAddUserTypeMutation()
    console.log("response",response)


    const handleSubmit = (values, {resetForm}) => {
        console.log('Form Submitted (No logic executed):', values);
        addUserType(values)
        resetForm()
    };

    return (<Container
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
            p: 2,
        }}
    >
        <Paper
            elevation={10}
            sx={{
                padding: 4, borderRadius: '16px', backgroundColor: 'rgba(0, 0, 0, 0.75)',
            }}
        >
            <Typography variant="h5" sx={{color: 'white', marginBottom: 3, textAlign: 'center'}}>
                Add New User Type
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <Field
                        as={TextStyledField}
                        name="name"
                        label="User Type"
                        variant="outlined"
                        fullWidth
                    />
                    <Box sx={{color: 'red', fontSize: '0.75rem', ml: 2, mt: 0.5, height: 20}}>
                        <ErrorMessage name="name"/>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3, padding: '12px 0', borderRadius: '20px', backgroundColor: '#4CAF50',
                            '&:hover': {
                                backgroundColor: '#388E3C',
                            }
                        }}
                    >
                        Add User Type
                    </Button>
                </Form>
            </Formik>
        </Paper>
    </Container>);
};

export default AddUserType;