/**
 * Mocks the extraction of text from a resume file.
 * @param {File} file - The uploaded resume file.
 * @returns {Promise<string>} - The extracted text.
 */
export const parseResume = async (file) => {
  // In a real app, this would use a library like pdfjs-dist or a backend API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Returning a mock string based on file name or generic text
      const mockText = `
        Experience: 2 years as a Software Engineer.
        Skills: React, JavaScript, HTML, CSS, Tailwind CSS, Node.js, MongoDB.
        Education: B.Tech in Computer Science.
        Projects: E-commerce platform using MERN stack.
      `;
      resolve(mockText);
    }, 1500);
  });
};

export default { parseResume };
