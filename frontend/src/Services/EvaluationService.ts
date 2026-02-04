export default class EvaluationService {
  static async CreateEvaluation(clarte: string, frequence: string, note: number, commentaire: string) {
    try {
      const response = await fetch(`/api/CreateEvaluation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clarte, frequence, note, commentaire }),
      });
      return await response.json();
    } catch (error: any) {
      return { error: error.message || error };
    }
  }
  static async GetEvaluations() {
    try {
      const response = await fetch(`/api/GetEvaluations`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error: any) {
      return { error: error.message || error };
    }
  }
  static async UpdateEvaluationStatus(id: number, statut: string, justification?: string) {
    try {
      const response = await fetch(`/api/UpdateEvaluationStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, statut, justification }),
      });
      return await response.json();
    } catch (error: any) {
      return { error: error.message || error };
    }
  }
}
