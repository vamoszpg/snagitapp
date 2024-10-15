const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const getSnags = async () => {
  try {
    const response = await fetch(`${API_URL}/snags`, {
      credentials: 'include'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch snags');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching snags:', error);
    throw error;
  }
};

export const addSnag = async (snag) => {
  try {
    const formData = new FormData();
    formData.append('title', snag.title);
    formData.append('description', snag.description);
    if (snag.image) {
      formData.append('image', snag.image);
    }

    const response = await fetch(`${API_URL}/snags`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add snag');
    }
    return response.json();
  } catch (error) {
    console.error('Error adding snag:', error);
    throw error;
  }
};

export const deleteSnag = async (id) => {
  try {
    const response = await fetch(`${API_URL}/snags/${id}`, { 
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete snag');
    }
  } catch (error) {
    console.error('Error deleting snag:', error);
    throw error;
  }
};
