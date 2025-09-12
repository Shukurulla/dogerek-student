import { baseApi } from "./baseApi";

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard
    getStudentDashboard: builder.query({
      query: () => "/student/dashboard",
      providesTags: ["Dashboard"],
    }),

    // Clubs
    getAllClubs: builder.query({
      query: (params) => ({
        url: "/student/clubs",
        params,
      }),
      providesTags: ["Club"],
    }),

    getClubDetails: builder.query({
      query: (id) => `/student/club/${id}`,
      providesTags: ["Club"],
    }),

    applyToClub: builder.mutation({
      query: (clubId) => ({
        url: `/student/club/${clubId}/apply`,
        method: "POST",
      }),
      invalidatesTags: ["Application", "Club", "Dashboard"],
    }),

    // Applications
    getMyApplications: builder.query({
      query: () => "/student/applications",
      providesTags: ["Application"],
    }),

    // My Clubs
    getMyClubs: builder.query({
      query: () => "/student/my-clubs",
      providesTags: ["Club"],
    }),

    // External Courses
    getExternalCourses: builder.query({
      query: () => "/student/external-courses",
      providesTags: ["ExternalCourse"],
    }),

    addExternalCourse: builder.mutation({
      query: (data) => ({
        url: "/student/external-course",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ExternalCourse", "Dashboard"],
    }),

    updateExternalCourse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/student/external-course/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ExternalCourse"],
    }),

    deleteExternalCourse: builder.mutation({
      query: (id) => ({
        url: `/student/external-course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExternalCourse", "Dashboard"],
    }),

    // Attendance
    getMyAttendance: builder.query({
      query: (params) => ({
        url: "/student/attendance",
        params,
      }),
      providesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetStudentDashboardQuery,
  useGetAllClubsQuery,
  useGetClubDetailsQuery,
  useApplyToClubMutation,
  useGetMyApplicationsQuery,
  useGetMyClubsQuery,
  useGetExternalCoursesQuery,
  useAddExternalCourseMutation,
  useUpdateExternalCourseMutation,
  useDeleteExternalCourseMutation,
  useGetMyAttendanceQuery,
} = studentApi;
