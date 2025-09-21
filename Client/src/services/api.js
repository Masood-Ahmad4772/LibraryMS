import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signup: builder.mutation({
      query: (credentials) => ({
        url: "/Signup",
        method: "POST",
        body: credentials,
      }),
    }),

    addBook: builder.mutation({
      query: (formData) => ({
        url: "/book/Add",
        method: "POST",
        body: formData,
      }),
    }),

    // update

    changeUserPassword: builder.mutation({
      query: (credentials) => ({
        url: "/user/changePassword",
        method: "PUT",
        body: credentials,
      }),
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/Update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deactiveUser : builder.mutation({
      query: (id) => ({
        url:`/user/DeactiveUser/${id}`,
        method:"PATCH",
      })
    }),
    ActiveUser : builder.mutation({
      query: (id) => ({
        url:`/user/ActiveUser/${id}`,
        method:"PATCH",
      })
    }),

    editUser: builder.mutation({
      query: ({id, data}) => ({

        url: `/user/Update/${id}`,
        method:"PUT",
        body:data
      })
    }),
     updateBook: builder.mutation({
         query: ({ id, values }) => ({
             url: `/book/Update/${id}`,
             method:"PUT",
             body:values
         })
     }),


    // get
    getAllBooks: builder.query({
      query: ({ page = 1, limit }) =>
        `/book/GetAllActive?page=${page}&limit=${limit}`,
    }),

    getBookDetailById: builder.query({
      query: (id) => `/book/GetById/${id}`,
    }),

    getGenreAllActive: builder.query({
      query: () => "/genre/getAllActive",
    }),

    getBookByGenre: builder.query({
      query: (genreId) => `/book/GetBooksByGenre/${genreId}`,
    }),

    getUserData: builder.query({
      query: (id) => `/user/getById/${id}`,
    }),

    getAllUser: builder.query({
      query: ({ page, limit,type }) => `/users/getAll?page=${page}&limit=${limit}&type=${type}`,
    }),

  }),
});

export const {
  // Mutation
  useLoginMutation,
  useSignupMutation,
  useChangeUserPasswordMutation,
  useUpdateUserMutation,
  useAddBookMutation,
  useDeactiveUserMutation,
  useActiveUserMutation,
  useEditUserMutation,
  useUpdateBookMutation,

  // QUery
  useGetAllBooksQuery,
  useGetBookDetailByIdQuery,
  useGetGenreAllActiveQuery,
  useGetBookByGenreQuery,
  useGetUserDataQuery,
  useGetAllUserQuery,

} = api;
