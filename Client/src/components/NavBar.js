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
import MenuItem from "@mui/material/MenuItem";
import  Button  from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Link } from "@mui/material";
import { useNavigate } from "react-router";

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const Navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // navlinks logic
  const role = localStorage.getItem("role");

  const User = JSON.parse(localStorage.getItem("user"));


  // console.log("UserNavbar", User);
  // console.log("roleNavbar", role);

  let navLinksToShow = ["Category"];

  if (role === "Admin") {
    navLinksToShow = ["AddBook", "AllUser",...navLinksToShow];
  } else if (role === "User") {
    navLinksToShow = [...navLinksToShow, "User"];
  }

  // setting logic

  const settings = [
    { label: "Profile", action: "profile" },

    { label: "ChangePassword", action: "changepassword" },
    { label: "Logout", action: "logout" },
  ];

  // Action handlers
  const actionHandlers = {
    profile: () => Navigate("/profile"),
    changepassword: () => Navigate("/changepassword"),
    logout: () => {
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

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* mobile logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Book
          </Typography>

          {/* mobile  */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {navLinksToShow.map((page, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu}>
                  <Link
                    href={`/${page.toLowerCase()}`}
                    sx={{
                      textAlign: "center",
                      underline: "none",
                      color: "inherit",
                      outline: "none",
                      textDecoration: "none",
                    }}
                  >
                    {page}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* desktop logo */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
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

          {/* desktop linkstag */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex", gap: "10px" },
            }}
          >
            {navLinksToShow.map((page, idx) => (
              <Link
                key={idx}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  underline: "none",
                  color: "inherit",
                  outline: "none",
                  textDecoration: "none",
                }}
                href={`/${page.toLowerCase()}`}
              >
                {page}
              </Link>
            ))}
          </Box>

          {/* avatar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexGrow: 0,
            }}
          >
            {role && (
              <>
                <Typography
                  variant="body1"
                  component={"div"}
                  sx={{ color: "white" }}
                >
                  {User?.userName}
                </Typography>
                <Tooltip title="Account Details">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={User?.userName}
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting, i) => (
                    <MenuItem
                      key={i}
                      onClick={() => handleMenuItemClick(setting.action)}
                      sx={
                        setting.action === "logout"
                          ? {
                              color: "error.main",
                              "&:hover": {
                                backgroundColor: "error.light",
                                color: "white",
                              },
                            }
                          : {}
                      }
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {setting.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            {!role && (
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Button
                  component={Link}
                  href="/login"
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  color="primary"
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
