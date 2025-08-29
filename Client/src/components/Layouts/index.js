import { Routes, Route, BrowserRouter } from "react-router";

const index = () => {


  return (
    <BrowserRouter>
      <Routes>
        {authProtectedLayout.map((route, idx) => (
          <Route>
            key={idx}
            path={route.path}
            element={route.element}
          </Route>
        ))}

        {publicLayout.map((route, idx) => (
          <Route>
            key={idx}
            path={route.path}
            element={route.element}
          </Route>
        ))}

        {authLayout.map((route, idx)=> {
          <Route>
            key={idx}
            path={route.path}
            element={route.element}
          </Route>
        })}

        {/* Optional: 404 page */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default index;
