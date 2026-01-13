export const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
        // @ts-ignore - pdfjsLib is loaded globally in index.html
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        
        let fullText = '';
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Improved extraction: Filter empty strings and join properly
          const pageText = textContent.items
            .map((item: any) => item.str)
            .filter((str: string) => str.trim().length > 0) // Remove empty items
            .join(' ');

          // Only append if there is actual text
          if (pageText.trim().length > 0) {
            fullText += `[Page ${i}] ${pageText}\n\n`;
          }
        }

        if (fullText.trim().length === 0) {
          reject(new Error("No readable text found in PDF. It might be an image-only scan."));
        } else {
          resolve(fullText);
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};