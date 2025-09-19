import Profile from "../user/Profile";

import Admin from "../admin/AllAdmin";
import ChangePassword from "../user/ChangePassword";
import User from "../admin/user";
import AddBook from "../admin/AddBook"
import ViewAllBooks from "../admin/ViewAllBooks";



export const privateRoutes = [
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path:"/changepassword",
    element:<ChangePassword />
  },{
    path:"user",
    element:<User />
  }, {
        path: "/addbook",
        element: <AddBook/>
    },
    {
        path:"/viewallbooks",
        element: <ViewAllBooks />
    }
];
