import PDFParser from "pdf2json";

export const extractTextFromPDF = (
  filePath: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const text = pdfParser.getRawTextContent();

      resolve(text);
    });

    pdfParser.loadPDF(filePath);
  });
};