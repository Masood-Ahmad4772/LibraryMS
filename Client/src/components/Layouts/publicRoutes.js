import Home from "../Home";
import BookDetails from "../pages/BookDetails";
import Category from "../publicpages/Category";
import BookListByGenre from "../publicpages/BookListByGenre";

export const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/book/:id",
    element: <BookDetails />,
  },
  {
    path: "/category",
    element: <Category />,
  },
  {
    path: "/book/Genre/:genreId",
    element: <BookListByGenre />,
  },
];
