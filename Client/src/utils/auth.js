// This function checks if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token"); 
  // Change this if you store token differently
};