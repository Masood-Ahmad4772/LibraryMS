import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {useState} from "react";
import {Link} from "@mui/material";
import {useNavigate} from "react-router";

// ---------------- NAV CONFIG ----------------
const baseLinks = [{label: "Category", path: "/category"}];

const adminLinks = [{
    label: "UserType", children: [{label: "AddUserType", path: "/addusertype"}, {label: "ViewALLUserType", path: "/viewallusertype"}],
}, {
    label: "ViewAllUser", path: "/viewalluser"
},
    {
        label: "Admin", children: [{label: "Admin", path: "/admin"},
            {
                label: "ViewALL", path: "/viewall",
            }]
    },

    {
        label: "Books",
        children: [
            {label: "AddBook", path: "/addbook"},
            {
                label: "ViewAllBook", path: "/viewallbooks",
            }
        ]
    }
];

const userLinks = [{
    label: "User", children: [{label: "Profile", path: "/profile"}, {label: "Orders", path: "/orders"},],
},];

const settings = [{label: "Profile", action: "profile"}, {
    label: "Change Password",
    action: "changepassword"
}, {label: "Logout", action: "logout"},];

const NavBar = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElDropdown, setAnchorElDropdown] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const Navigate = useNavigate();

    // role + user from localStorage
    const role = localStorage.getItem("role");
    const User = JSON.parse(localStorage.getItem("user"));

    // build nav links based on role
    let navLinksToShow = [...baseLinks];
    if (role === "Admin") navLinksToShow = [...adminLinks, ...navLinksToShow];
    if (role === "User") navLinksToShow = [...navLinksToShow, ...userLinks];

    // handlers
    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);

    const handleOpenDropdown = (event, label) => {
        setAnchorElDropdown(event.currentTarget);
        setActiveDropdown(label);
    };
    const handleCloseDropdown = () => {
        setAnchorElDropdown(null);
        setActiveDropdown(null);
    };

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    // account actions
    const actionHandlers = {
        profile: () => Navigate("/profile"), changepassword: () => Navigate("/changepassword"), logout: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            Navigate("/login");
        },
    };
    const handleMenuItemClick = (action) => {
        handleCloseUserMenu();
        actionHandlers[action]?.();
    };

    // Render a nav item (button or dropdown)
    const renderNavItem = (item, idx) => {
        if (item.children) {
            return (<Box key={idx}>
                <Button
                    color="inherit"
                    onClick={(e) => handleOpenDropdown(e, item.label)}
                    sx={{textTransform: "none"}}
                    endIcon={<ArrowDropDownIcon/>}   // 👈 add arrow here
                >
                    {item.label}
                </Button>
                <Menu
                    anchorEl={anchorElDropdown}
                    open={activeDropdown === item.label}
                    onClose={handleCloseDropdown}
                >
                    {item.children.map((child, cIdx) => (<MenuItem key={cIdx} onClick={handleCloseDropdown}>
                        <Link
                            href={child.path}
                            sx={{textDecoration: "none", color: "inherit"}}
                        >
                            {child.label}
                        </Link>
                    </MenuItem>))}
                </Menu>
            </Box>);
        }

        return (<Button
            key={idx}
            color="inherit"
            href={item.path}
            sx={{textTransform: "none"}}
        >
            {item.label}
        </Button>);
    };

    return (<AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                {/* logo desktop */}
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 2,
                        display: {xs: "none", md: "flex"},
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    Book
                </Typography>

                {/* mobile nav */}
                <Box sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}>
                    <IconButton
                        size="large"
                        aria-label="nav menu"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        anchorEl={anchorElNav}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{display: {xs: "block", md: "none"}}}
                    >
                        {navLinksToShow.map((item, idx) => {
                            if (item.children) {
                                return (<Box key={idx}>
                                    <Typography sx={{px: 2, fontWeight: "bold"}}>
                                        {item.label}
                                    </Typography>
                                    {item.children.map((child, cIdx) => (
                                        <MenuItem key={cIdx} onClick={handleCloseNavMenu}>
                                            <Link
                                                href={child.path}
                                                sx={{textDecoration: "none", color: "inherit"}}
                                            >
                                                {child.label}
                                            </Link>
                                        </MenuItem>))}
                                </Box>);
                            }
                            return (<MenuItem key={idx} onClick={handleCloseNavMenu}>
                                <Link
                                    href={item.path}
                                    sx={{textDecoration: "none", color: "inherit"}}
                                >
                                    {item.label}
                                </Link>
                            </MenuItem>);
                        })}
                    </Menu>
                </Box>

                {/* logo mobile */}
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 2,
                        display: {xs: "flex", md: "none"},
                        flexGrow: 1,
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    Book
                </Typography>

                {/* desktop nav */}
                <Box
                    sx={{
                        flexGrow: 1, display: {xs: "none", md: "flex", gap: "10px"},
                    }}
                >
                    {navLinksToShow.map(renderNavItem)}
                </Box>

                {/* avatar + auth */}
                <Box sx={{display: "flex", alignItems: "center", gap: "10px"}}>
                    {role ? (<>
                        <Typography variant="body1" sx={{color: "white"}}>
                            {User?.userName}
                        </Typography>
                        <Tooltip title="Account Details">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt={User?.userName} src="/static/images/avatar/2.jpg"/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorElUser}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            sx={{mt: "45px"}}
                        >
                            {settings.map((setting, i) => (<MenuItem
                                key={i}
                                onClick={() => handleMenuItemClick(setting.action)}
                                sx={setting.action === "logout" ? {
                                    color: "error.main", "&:hover": {
                                        backgroundColor: "error.light", color: "white",
                                    },
                                } : {}}
                            >
                                {setting.label}
                            </MenuItem>))}
                        </Menu>
                    </>) : (<Box sx={{display: "flex", gap: "10px"}}>
                        <Button href="/login" variant="contained" color="primary">
                            Login
                        </Button>
                        <Button href="/register" variant="contained" color="primary">
                            Register
                        </Button>
                    </Box>)}
                </Box>
            </Toolbar>
        </Container>
    </AppBar>);
};

export default NavBar;
