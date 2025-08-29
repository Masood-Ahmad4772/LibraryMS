import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Container,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import { useGetBookDetailByIdQuery } from "../../services/api";

const BookDetails = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetBookDetailByIdQuery(id);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading book</Typography>;
  if (!data) {
    return (
      <Typography variant="h4" component="h1">
        Data Not Found
      </Typography>
    );
  }

  // if API returns array, take first object
  const book = Array.isArray(data) ? data[0] : data;

  return (
    <Container
      sx={{
        height: "calc(100vh - 68.5px)",
      }}
    >
      <Grid container alignItems="stretch" spacing={4} sx={{ p: 4 }}>
        {/* Left Side (Image) */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, height: "100%" }}>
            <CardMedia
              component="img"
              height="auto"
              image={book.image || "https://via.placeholder.com/400"}
              alt={book.title}
              sx={{ objectFit: "cover" }}
            />
          </Card>
        </Grid>

        {/* Right Side (Details) */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {book.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Author: {book.author}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookDetails;
