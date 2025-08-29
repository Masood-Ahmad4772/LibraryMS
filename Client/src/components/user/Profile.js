import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Divider,
  Container,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

import { useGetUserDataQuery, useUpdateUserMutation } from "../../services/api";

const Profile = () => {
  const User = JSON.parse(localStorage.getItem("user"));
  const id = User?.id;

  const [updateUser, response] = useUpdateUserMutation();
  const { data, isLoading, error, refetch } = useGetUserDataQuery(id);

  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    userName: "",
    email: "",
  });

  const handleOpen = () => {
    if (data) {
      setFormValues({
        name: data?.name,
        userName: data?.userName,
        email: data?.email,
      });
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateUser({ id, data: formValues });
    refetch();
    const localUpdate = { ...User, ...formValues };
    localStorage.setItem("user", JSON.stringify(localUpdate));
    setOpen(false);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundImage: `url("library.avif")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            maxWidth: 420,
            width: "100%",
            p: 4,
            borderRadius: 4,
            boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
            background: "white",
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              margin: "0 auto 16px",
              bgcolor: "primary.main",
              fontSize: "32px",
              fontWeight: 600,
            }}
          >
            {data?.name?.charAt(0) || "U"}
          </Avatar>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              {data?.name || "Name"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Email:</strong> {data?.email || "email@example.com"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Username:</strong> {data?.userName || "username"}
            </Typography>
          </CardContent>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleOpen}
            sx={{
              mt: 3,
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Edit Profile
          </Button>
        </Card>

        {/* Edit Modal */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="UserName"
                name="userName"
                value={formValues.userName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSave}
              disabled={response.isLoading}
              sx={{ borderRadius: 2, px: 3, py: 1, textTransform: "none" }}
            >
              {response.isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Profile;
