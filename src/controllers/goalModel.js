const { collection, addDoc } = require("firebase/firestore");
const { db } = require("../firebase");

const addGoal = async (goalData, userId) => {
  try {
    const goalRef = await addDoc(collection(db, "goals"), {
      ...goalData,
      userId,
      createdAt: new Date(),
    });
    return { id: goalRef.id, ...goalData };
  } catch (error) {
    throw new Error("Erro ao adicionar meta: " + error.message);
  }
};

module.exports = { addGoal };
