import PDFParser from "pdf2json";

export const extractTextFromPDF = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      let extractedText = "";

      pdfData.Pages.forEach((page: any) => {
        page.Texts.forEach((textItem: any) => {
          textItem.R.forEach((run: any) => {
            try {
              extractedText += decodeURIComponent(run.T);
            } catch {
              extractedText += run.T;
            }

            extractedText += " ";
          });
        });
      });

      resolve(extractedText);
    });

    pdfParser.loadPDF(filePath);
  });
};
