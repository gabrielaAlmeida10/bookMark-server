// Importando as funções diretamente após mockar o modelo
jest.mock("../models/evaluationModel", () => ({
  createEvaluation: jest.fn(),
  updateEvaluation: jest.fn(),
}));

const { addEvalutationController, updateEvaluationController } = require("../controllers/evaluationController");
const { createEvaluation, updateEvaluation } = require("../models/evaluationModel");

// Mock do res
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

describe("Evaluation Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpar mocks antes de cada teste
  });

  test("Should create evaluation successfully", async () => {
    // Criando o mock da requisição (req)
    const req = {
      body: { bookId: "mockBookId", rating: 5, comments: "Excelente livro!" },
      userId: "mockUserId",
    };

    // Mock da função createEvaluation
    createEvaluation.mockResolvedValue({
      id: "mockEvaluationId",
      userId: "mockUserId",
      bookId: "mockBookId",
      rating: 5,
      comments: "Excelente livro!",
      createdAt: expect.any(Date),
    });

    // Chamando o controlador
    await addEvalutationController(req, res);

    // Verificando as respostas
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: "mockEvaluationId",
      userId: "mockUserId",
      bookId: "mockBookId",
      rating: 5,
      comments: "Excelente livro!",
      createdAt: expect.any(Date),
    });
  });

  test("Should return error when missing mandatory fields", async () => {
    // Criando o mock da requisição (req) com campos obrigatórios ausentes
    const req = {
      body: { bookId: "mockBookId", comments: "good book" }, // Falta o campo 'comments'
      userId: "mockUserId",
    };

    // Chamando o controlador
    await addEvalutationController(req, res);

    // Verificando as respostas
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todos os campos obrigatórios devem ser preenchidos.",
    });
  });

  test("Should return error when updating non-existent evaluation", async () => {
    // Criando o mock da requisição (req)
    const req = {
      params: { evaluationId: "invalidEvaluationId" },
      userId: "mockUserId",
      body: { rating: 4, comments: "Comentário atualizado" },
    };

    // Mock da função updateEvaluation para retornar um erro
    updateEvaluation.mockRejectedValue(new Error("Avaliação não encontrada."));

    // Chamando o controlador
    await updateEvaluationController(req, res);

    // Verificando as respostas
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Avaliação não encontrada.",
    });
  });
});
