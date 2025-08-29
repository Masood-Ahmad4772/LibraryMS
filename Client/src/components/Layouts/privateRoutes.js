import Profile from "../user/Profile";

import Admin from "../admin/AllAdmin";
import ChangePassword from "../user/ChangePassword";
import Alluser from "../admin/Alluser";
import AddBook from "../admin/AddBook"



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
    path:"alluser",
    element:<Alluser />
  },{
    path:"/addbook",
    element:<AddBook />
  }
];
