import Profile from "../user/Profile";
import ChangePassword from "../user/ChangePassword";
import ViewAllUser from "../admin/ViewAllUser";
import AddBook from "../admin/AddBook"
import ViewAllBooks from "../admin/ViewAllBooks";
import AddUserType from "../admin/AddUserType";
import ViewAllUserType from "../admin/ViewAllUserType";



export const privateRoutes = [
    {
        path: "/profile",
        element: <Profile/>,
    },
    {
        path: "/changepassword",
        element: <ChangePassword/>
    }, {
        path: "viewalluser",
        element: <ViewAllUser/>
    }, {
        path: "/addbook",
        element: <AddBook/>
    },
    {
        path: "/viewallbooks",
        element: <ViewAllBooks/>
    }, {
        path: "/addusertype",
        element: <AddUserType/>
    },
    {
        path: "/viewallusertype",
        element:<ViewAllUserType />
    }
];
