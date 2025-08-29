import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  useGetBookByGenreQuery,
  useGetGenreAllActiveQuery,
} from "../../services/api";
import { useParams } from "react-router";

const BookListByGenre = () => {
  const { genreId } = useParams();

  console.log("genreId on Booklist", genreId);
  // Only make the API call when genreId is available
  const { data, isLoading } = useGetBookByGenreQuery(genreId);
  const { data: genreData } = useGetGenreAllActiveQuery();
  const currentGenre = genreData?.find((g) => g._id === genreId);

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" display={"flex"} justifyContent={"center"} gap={"10px"}>
        Books in this{" "}
        <Typography variant="h4" component="h1" sx={{ color: "blue" }}>
          {currentGenre.name}
        </Typography>
      </Typography>

      {data && data.length > 0 ? (
        <Grid
          container
          alignItems="stretch"
          spacing={3}
          justifyContent="center"
        >
          {data.map((book) => (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={book._id}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ height: { md: "550px", xs: "100%" } }}
                  image={`http://localhost:5000${book.image}` || "/placeholder-book-cover.jpg"}
                  alt={book.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {book.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    dangerouslySetInnerHTML={{ __html: book.description }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography align="center" variant="h6">
          No books found in this category.
        </Typography>
      )}
    </Container>
  );
};

export default BookListByGenre;
