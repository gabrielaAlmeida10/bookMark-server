jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: "mockUserId",
    },
    signInWithCustomToken: jest.fn().mockResolvedValue({
      user: {
        uid: "mockUserId",
        email: "test@example.com",
      },
    }),
  })),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn().mockResolvedValue({
    ref: { fullPath: "path/to/file" },
  }),
  getDownloadURL: jest.fn().mockResolvedValue("https://mocked-url.com/image.jpg"),
}));
