import { fetchWithAuth } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

// ==========================================
// CATEGORY SERVICES
// ==========================================

export async function fetchCategories(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.page_size) query.append('page_size', params.page_size);
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.parent_id !== undefined && params.parent_id !== null) {
      query.append('parent_id', params.parent_id);
    }

    const url = `${API_BASE_URL}/accounts/admin/categories/?${query.toString()}`;
    const response = await fetchWithAuth(url);

    if (!response.ok) {
      throw new Error(`Failed to load categories (${response.status})`);
    }

    const data = await response.json();
    return {
      success: true,
      results: data.results || (Array.isArray(data) ? data : []),
      count: data.count || (Array.isArray(data) ? data.length : 0),
      next: data.next,
      previous: data.previous,
    };
  } catch (error) {
    console.error("fetchCategories error:", error);
    return {
      success: false,
      message: error.message || 'Failed to load categories.',
      results: [],
      count: 0
    };
  }
}

export async function fetchAllCategoriesForSelect() {
  try {
    const url = `${API_BASE_URL}/accounts/admin/categories/?page_size=200`;
    const response = await fetchWithAuth(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("fetchAllCategoriesForSelect error:", error);
    return [];
  }
}

export async function fetchCategory(id) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/categories/${id}/`);
    if (!response.ok) {
      throw new Error(`Category not found (${response.status})`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function createCategory(payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/categories/`, {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        parent: payload.parent_id || payload.parent || null,
        description: payload.description,
        sort_order: payload.sort_order !== undefined ? payload.sort_order : 0,
        is_active: payload.is_active !== undefined ? payload.is_active : true,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let message = 'Failed to create category.';
      if (typeof data === 'object' && data !== null) {
        if (data.name) message = Array.isArray(data.name) ? data.name[0] : data.name;
        else if (data.description) message = Array.isArray(data.description) ? data.description[0] : data.description;
        else if (data.parent) message = Array.isArray(data.parent) ? data.parent[0] : data.parent;
        else if (data.detail) message = data.detail;
      }
      return { success: false, message, errors: data };
    }

    return { success: true, data };
  } catch {
    return { success: false, message: 'Network error. Please check server connection.' };
  }
}

export async function updateCategory(id, payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/categories/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: payload.name,
        parent: payload.parent_id !== undefined ? payload.parent_id : payload.parent,
        description: payload.description,
        sort_order: payload.sort_order,
        is_active: payload.is_active,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let message = 'Failed to update category.';
      if (typeof data === 'object' && data !== null) {
        if (data.name) message = Array.isArray(data.name) ? data.name[0] : data.name;
        else if (data.description) message = Array.isArray(data.description) ? data.description[0] : data.description;
        else if (data.parent) message = Array.isArray(data.parent) ? data.parent[0] : data.parent;
        else if (data.detail) message = data.detail;
      }
      return { success: false, message, errors: data };
    }

    return { success: true, data };
  } catch {
    return { success: false, message: 'Network error. Please check server connection.' };
  }
}

export async function updateCategoryStatus(id, isActive) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/categories/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, message: data.detail || 'Failed to update category status.' };
    }
    return { success: true, data };
  } catch {
    return { success: false, message: 'Network error. Please check server connection.' };
  }
}

export async function deleteCategory(id) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/categories/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { success: false, message: data.detail || 'Failed to delete category.' };
    }
    return { success: true };
  } catch {
    return { success: false, message: 'Network error. Please check server connection.' };
  }
}


// ==========================================
// SKILL SERVICES
// ==========================================

export async function fetchSkills(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.page_size) query.append('page_size', params.page_size);
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.category_id !== undefined && params.category_id !== null && params.category_id !== 'all') {
      query.append('category_id', params.category_id);
    }

    const url = `${API_BASE_URL}/accounts/admin/skills/?${query.toString()}`;
    const response = await fetchWithAuth(url);

    if (!response.ok) {
      throw new Error(`Failed to load skills (${response.status})`);
    }

    const data = await response.json();
    return {
      success: true,
      results: data.results || (Array.isArray(data) ? data : []),
      count: data.count || (Array.isArray(data) ? data.length : 0),
      next: data.next,
      previous: data.previous,
    };
  } catch (error) {
    console.error("fetchSkills error:", error);
    return {
      success: false,
      message: error.message || 'Failed to load skills.',
      results: [],
      count: 0
    };
  }
}

export async function fetchSkill(id) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/skills/${id}/`);
    if (!response.ok) {
      throw new Error(`Skill not found (${response.status})`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function createSkill(payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/skills/`, {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        category: payload.category_id || payload.category || null,
        is_active: payload.is_active !== undefined ? payload.is_active : true,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let message = 'Failed to create skill.';
      if (typeof data === 'object' && data !== null) {
        if (data.name) message = Array.isArray(data.name) ? data.name[0] : data.name;
        else if (data.category) message = Array.isArray(data.category) ? data.category[0] : data.category;
        else if (data.detail) message = data.detail;
      }
      return { success: false, message, errors: data };
    }

    return { success: true, data };
  } catch {
    return { success: false, message: 'Network error. Please check server connection.' };
  }
}

export async function updateSkill(id, payload) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/skills/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: payload.name,
        category: payload.category_id !== undefined ? payload.category_id : payload.category,
        is_active: payload.is_active,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let message = 'Failed to update skill.';
      if (typeof data === 'object' && data !== null) {
        if (data.name) message = Array.isArray(data.name) ? data.name[0] : data.name;
        else if (data.category) message = Array.isArray(data.category) ? data.category[0] : data.category;
        else if (data.detail) message = data.detail;
      }
      return { success: false, message, errors: data };
    }

    return { success: true, data };
  } catch {
    return { success: false, message: 'Network error. Please check server connection.' };
  }
}

export async function updateSkillStatus(id, isActive) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/skills/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, message: data.detail || 'Failed to update skill status.' };
    }
    return { success: true, data };
  } catch {
    return { success: false, message: 'Network error. Please check server connection.' };
  }
}

export async function deleteSkill(id) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/accounts/admin/skills/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { success: false, message: data.detail || 'Failed to delete skill.' };
    }
    return { success: true };
  } catch {
    return { success: false, message: 'Network error. Please check server connection.' };
  }
}
