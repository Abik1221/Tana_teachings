// ===============================
// 📌 LOGIN MOCK
// ===============================
export const loginUserMock = async (formData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = [
    {
      email: "parent@gmail.com",
      password: "123456",
      token: "mock-parent-token",
      user: {
        id: 101,
        fullName: "John Doe",
        email: "parent@gmail.com",
        phone: "0912345678",
        role: "parent",
        address: "Debre Markos, Ethiopia",
      },
    },
    {
      email: "admin@gmail.com",
      password: "admin123",
      token: "mock-admin-token",
      user: {
        id: 201,
        fullName: "Admin User",
        email: "admin@gmail.com",
        phone: "0900112233",
        role: "admin",
        address: "Bahir Dar, Ethiopia",
      },
    },
    {
      email: "m@gmail.com",
      password: "m12345",
      token: "mock-mentor-token",
      user: {
        id: 301,
        fullName: "Monitor Staff",
        email: "m@gmail.com",
        phone: "0911223344",
        role: "mentor",
        address: "Addis Ababa, Ethiopia",
      },
    },
  ];

  const foundUser = users.find(
    (u) => u.email === formData.email && u.password === formData.password
  );

  if (!foundUser)
    throw { response: { data: { message: "Invalid email or password" } } };

  return {
    data: {
      token: foundUser.token,
      user: foundUser.user,
    },
  };
};

// ===============================
// 📌 PARENT MOCK DATA
// ===============================
export const getParentJobsMock = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: "job1",
            title: "Math Tutoring Needed",
            description: "Looking for a mentor for high school math.",
            status: "approved",
            datePosted: new Date(),
          },
          {
            id: "job2",
            title: "Programming Tutor",
            description: "Need help for my child in Python programming.",
            status: "pending_approval",
            datePosted: new Date(),
          },
        ],
      });
    }, 500);
  });
};

export const postJobMock = (jobData) =>
  new Promise((resolve) => {
    console.log("Job posted (mock):", jobData);
    setTimeout(() => resolve({ success: true }), 1000);
  });

export const getMentorResponsesMock = async (jobId) => {
  const responses = {
    job1: [
      { id: "r1", mentorName: "John Doe", message: "Expert in Algebra." },
      { id: "r2", mentorName: "Jane Smith", message: "I teach geometry." },
    ],
    job2: [
      {
        id: "r3",
        mentorName: "Alice Brown",
        message: "I can help in Python and logic.",
      },
    ],
  };

  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: responses[jobId] || [] }), 500);
  });
};

export const subjectsByClass = {
  1: ["Maths", "General Science"],
  2: ["Maths", "General Science", "English"],
  3: ["Maths", "Science", "English"],
  4: ["Maths", "Physics", "Chemistry", "English"],
  5: ["Maths", "Physics", "Chemistry", "English"],
  6: ["Maths", "Physics", "Chemistry", "English"],
  7: ["Maths", "Physics", "Chemistry", "Biology", "English"],
  8: ["Maths", "Physics", "Chemistry", "Biology", "English"],
};

// ===============================
// 📌 ADMIN MOCK DATA
// ===============================
export const getDashboardOverviewMock = () => {
  return {
    totalParents: 125,
    totalMentors: 48,
    totalJobs: 37,
    pendingApprovals: 5,
  };
};

export const getUsersMock = () => {
  return [
    {
      id: 201,
      name: "Admin User",
      role: "admin",
      status: "active",
      email: "admin@gmail.com",
    },
    {
      id: 101,
      name: "John Doe",
      role: "parent",
      status: "active",
      email: "parent@gmail.com",
    },
    {
      id: 301,
      name: "Monitor Staff",
      role: "mentor",
      status: "pending",
      email: "m@gmail.com",
    },
  ];
};

export const getJobsMock = () => {
  return [
    {
      id: 101,
      title: "Math Tutor",
      parent: "John Doe",
      status: "pending_approval",
      priority: "High",
    },
    {
      id: 102,
      title: "Physics Tutor",
      parent: "Samuel K",
      status: "approved",
      priority: "Medium",
    },
  ];
};

export const getApplicationsMock = () => {
  return [
    {
      id: 501,
      mentor: "Sarah S",
      jobTitle: "Math Tutor",
      status: "pending_vetting",
    },
    {
      id: 502,
      mentor: "Mike B",
      jobTitle: "Physics Tutor",
      status: "rejected",
    },
  ];
};
