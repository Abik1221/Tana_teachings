// src/services/mockApi.js

export const loginUserMock = async (formData) => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay

  // Mock users
  const users = [
    {
      email: "parent@gmail.com",
      password: "123456",
      token: "mock-parent-token",
      user: {
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
      token: "mock-monitor-token",
      user: {
        fullName: "Monitor Staff",
        email: "m@gmail.com",
        phone: "0911223344",
        role: "mentor",
        address: "Addis Ababa, Ethiopia",
      },
    },
  ];

  // Check login
  const foundUser = users.find(
    (u) => u.email === formData.email && u.password === formData.password
  );

  if (foundUser) {
    return {
      data: {
        token: foundUser.token,
        user: foundUser.user,
      },
    };
  } else {
    throw { response: { data: { message: "Invalid email or password" } } };
  }
};
// Mock jobs posted by parent
export const getParentJobsMock = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: "job1",
            title: "Math Tutoring Needed",
            description: "Looking for a mentor for high school math.",
            datePosted: new Date(),
          },
          {
            id: "job2",
            title: "Programming Tutor",
            description: "Need help for my child in Python programming.",
            datePosted: new Date(),
          },
        ],
      });
    }, 500);
  });
};

// Mock mentor responses per job
export const getMentorResponsesMock = async (jobId) => {
  const responses = {
    job1: [
      {
        id: "r1",
        mentorName: "John Doe",
        message: "I can help with Algebra and Geometry.",
      },
      {
        id: "r2",
        mentorName: "Jane Smith",
        message: "Experienced in Calculus tutoring.",
      },
    ],
    job2: [
      {
        id: "r3",
        mentorName: "Alice Brown",
        message: "Python expert here, can guide your child.",
      },
    ],
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: responses[jobId] || [] });
    }, 500);
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
export const postJobMock = (jobData) =>
  new Promise((resolve) => {
    console.log("Job posted (mock):", jobData);
    setTimeout(() => resolve({ success: true }), 1000);
  });
