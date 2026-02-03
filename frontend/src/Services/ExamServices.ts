export default class ExamServices {
    static async InsertExam(value1: string, value2: string, value3: string) {
        try {
            const response = await fetch(`/api/InsertExam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value1, value2, value3 }),
            });
            return await response.json();
        } catch (error: any) {
            return { error: error.message };
        }
    }

    static async GetAllExams() {
        try {
            const response = await fetch(`/api/GetAllExams`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return await response.json();
        } catch (error: any) {
            return { error: error.message };
        }
    }
}
