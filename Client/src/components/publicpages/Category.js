import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useGetGenreAllActiveQuery } from "../../services/api";
import { useNavigate } from "react-router";
import Loader from "../loader/CircularUnderLoad"

const Category = () => {
  const { data, error, isLoading } = useGetGenreAllActiveQuery();
  const Navigate = useNavigate();

  const HandleCategory = (genreId) => {
    Navigate(`/book/genre/${genreId}`);
  };

  return (
    <Container
      sx={{
        height: "calc(100vh - 68.5px)",
      }}
    >
      {isLoading ? <Loader isLoading={isLoading} /> : null}
      <Grid container spacing={4} sx={{ p: 4 }}>
        {data &&
          data.map((category) => (
            <Grid
              key={category._id}
              item
              sx={{
                background: "#33A1E0",
                height: 200,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "15px",
              }}
              size={{ xs: 12, sm: 6, md: 4 }}
              onClick={() => HandleCategory(category._id)}
            >
              <Typography sx={{ color: "white" }} variant="h5" component="h1">
                {category.name}
              </Typography>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default Category;
