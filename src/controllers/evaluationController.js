const { createEvaluation,updateEvaluation } = require("../models/evaluationModel");

const addEvalutationController = async (req, res) => {
  const { bookId, rating, comments = "" } = req.body; 
  const userId = req.userId;

  try {
    const result = await createEvaluation({ userId, bookId, rating, comments });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateEvaluationController = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const userId = req.userId; 
    const { rating, comments } = req.body;

    if (!evaluationId) {
      return res.status(400).json({ message: "ID da avaliação é obrigatório!" });
    }

    await updateEvaluation(evaluationId, userId, { rating, comments });

    res.status(200).json({ message: "Avaliação atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar a avaliação: " + error.message,
    });
  }
};

module.exports = { addEvalutationController, updateEvaluationController };
