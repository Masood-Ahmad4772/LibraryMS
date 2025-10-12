import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { Box, Container, Grid } from "@mui/material";
import {useGetAllActiveBooksQuery, useGetAllBooksQuery} from "../services/api";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Loader from "./loader/CircularUnderLoad";

const Home = () => {
  const [page, setPage] = useState(1);
  const limit = 3;

  const { data, isLoading, error, isFetching, refetch } = useGetAllActiveBooksQuery({
    page,
    limit,
  });
  useEffect(() => {
    if (!data) {
      refetch();
    }
  }, [data, refetch]);

  const Navigate = useNavigate();
  const handleBookDetail = (id) => {
    Navigate(`/book/${id}`);
  };

  const Loading = [isLoading, isFetching].some(Boolean);

  return (
    <Container
      sx={{
        padding: "20px 20px",
        height: "calc(100vh - 64px)",
      }}
    >
      {Loading ? <Loader isLoading={Loading} /> : null}

      {!isLoading && !error && data?.books?.length > 0 && (
        <>
          <Grid container sx={{ alignItems: "stretch" }} spacing={4}>
            {data?.books?.map((book) => (
              <Grid
                onClick={() => handleBookDetail(book._id)}
                key={book._id}
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={book.title}
                    sx={{
                      height: { md: "550px", xs: "100%" },
                      width: "100%",
                      objectFit: "cover",
                    }}
                    image={
                     `http://localhost:5000${book.image}`||
                      "/static/images/cards/contemplative-reptile.jpg"
                    }
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {book.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      dangerouslySetInnerHTML={{ __html: book.description }}
                    />
                  </CardContent>
                  <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination Controls */}
          <Box display="flex" p={4} justifyContent="center" >
            <Pagination
              count={data?.totalPages || 1}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Home;
