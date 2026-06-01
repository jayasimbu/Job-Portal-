import apiClient from '../../../core/api/apiClient';
import { getCurrentUserId } from '../../../core/auth/session';

/**
 * Extracts text from a resume file by uploading it to the backend parser.
 * @param {File} file - The uploaded resume file.
 * @returns {Promise<string>} - The extracted text.
 */
export const parseResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/jobseeker/resume/extract-text', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data?.text || '';
};

export default { parseResume };
