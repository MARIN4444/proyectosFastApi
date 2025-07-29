// Configuración de la API
const API_BASE_URL = '/tasks'; // Cambia esto si tu API está en otro puerto o dominio

// Estado de la aplicación
let tasks = [];
let isLoading = false;

// Elementos del DOM
const elements = {
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    closeError: document.getElementById('close-error'),
    createForm: document.getElementById('create-form'),
    taskTitle: document.getElementById('task-title'),
    taskDescription: document.getElementById('task-description'),
    loading: document.getElementById('loading'),
    emptyState: document.getElementById('empty-state'),
    tasksContainer: document.getElementById('tasks-container'),
    taskCount: document.getElementById('task-count'),
    taskTemplate: document.getElementById('task-template')
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    fetchTasks();
}

function setupEventListeners() {
    // Formulario de crear tarea
    elements.createForm.addEventListener('submit', handleCreateTask);
    
    // Cerrar mensaje de error
    elements.closeError.addEventListener('click', hideError);
    
    // Cerrar error con Enter
    elements.closeError.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') hideError();
    });
}

// Manejo de errores
function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    
    // Auto-ocultar después de 5 segundos
    setTimeout(hideError, 5000);
}

function hideError() {
    elements.errorMessage.classList.add('hidden');
}

// Manejo del loading
function setLoading(loading) {
    isLoading = loading;
    if (loading) {
        elements.loading.classList.remove('hidden');
        elements.emptyState.classList.add('hidden');
        elements.tasksContainer.classList.add('hidden');
    } else {
        elements.loading.classList.add('hidden');
        updateTasksDisplay();
    }
}

// Actualizar visualización de tareas
function updateTasksDisplay() {
    elements.taskCount.textContent = tasks.length;
    
    if (tasks.length === 0) {
        elements.emptyState.classList.remove('hidden');
        elements.tasksContainer.classList.add('hidden');
    } else {
        elements.emptyState.classList.add('hidden');
        elements.tasksContainer.classList.remove('hidden');
        renderTasks();
    }
}

// Renderizar tareas
function renderTasks() {
    elements.tasksContainer.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        elements.tasksContainer.appendChild(taskElement);
    });
}

// Crear elemento de tarea
function createTaskElement(task) {
    const template = elements.taskTemplate.content.cloneNode(true);
    const taskCard = template.querySelector('.task-card');
    
    // Configurar datos
    taskCard.dataset.taskId = task.id;
    
    // Rellenar contenido en modo display
    const taskTitle = template.querySelector('.task-title');
    const taskDescription = template.querySelector('.task-description');
    const taskId = template.querySelector('.task-id');
    
    taskTitle.textContent = task.title;
    taskDescription.textContent = task.description || '';
    taskId.textContent = `ID: ${task.id}`;
    
    // Si no hay descripción, ocultar el párrafo
    if (!task.description) {
        taskDescription.style.display = 'none';
    }
    
    // Rellenar contenido en modo edit
    const editTitle = template.querySelector('.edit-title');
    const editDescription = template.querySelector('.edit-description');
    
    editTitle.value = task.title;
    editDescription.value = task.description || '';
    
    return template;
}

// API Functions
async function fetchTasks() {
    try {
        setLoading(true);
        hideError();
        
        const response = await fetch(API_BASE_URL);
        
        if (response.ok) {
            tasks = await response.json();
        } else {
            throw new Error('Error al cargar las tareas');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showError('Error de conexión al cargar las tareas');
        tasks = [];
    } finally {
        setLoading(false);
    }
}

async function createTask(taskData) {
    try {
        hideError();
        
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (response.ok) {
            const newTask = await response.json();
            tasks.push(newTask);
            updateTasksDisplay();
            return newTask;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al crear la tarea');
        }
    } catch (error) {
        console.error('Error creating task:', error);
        showError(error.message || 'Error de conexión al crear la tarea');
        throw error;
    }
}

async function updateTask(taskId, taskData) {
    try {
        hideError();
        
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (response.ok) {
            const updatedTask = await response.json();
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask;
                updateTasksDisplay();
            }
            return updatedTask;
        } else {
            throw new Error('Error al actualizar la tarea');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showError(error.message || 'Error de conexión al actualizar la tarea');
        throw error;
    }
}

async function deleteTaskById(taskId) {
    try {
        hideError();
        
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            tasks = tasks.filter(task => task.id !== taskId);
            updateTasksDisplay();
            return true;
        } else {
            throw new Error('Error al eliminar la tarea');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showError(error.message || 'Error de conexión al eliminar la tarea');
        throw error;
    }
}

// Event Handlers
async function handleCreateTask(e) {
    e.preventDefault();
    
    const title = elements.taskTitle.value.trim();
    const description = elements.taskDescription.value.trim();
    
    if (!title) {
        showError('El título es requerido');
        elements.taskTitle.focus();
        return;
    }
    
    try {
        await createTask({
            title: title,
            description: description
        });
        
        // Limpiar formulario
        elements.taskTitle.value = '';
        elements.taskDescription.value = '';
        elements.taskTitle.focus();
        
    } catch (error) {
        // Error ya manejado en createTask
    }
}

// Funciones globales para los botones (llamadas desde HTML)
window.editTask = function(button) {
    const taskCard = button.closest('.task-card');
    const taskDisplay = taskCard.querySelector('.task-display');
    const taskEdit = taskCard.querySelector('.task-edit');
    
    taskDisplay.classList.add('hidden');
    taskEdit.classList.remove('hidden');
    
    // Focus en el campo de título
    const editTitle = taskEdit.querySelector('.edit-title');
    editTitle.focus();
    editTitle.select();
};

window.cancelEdit = function(button) {
    const taskCard = button.closest('.task-card');
    const taskDisplay = taskCard.querySelector('.task-display');
    const taskEdit = taskCard.querySelector('.task-edit');
    
    taskEdit.classList.add('hidden');
    taskDisplay.classList.remove('hidden');
    
    // Restaurar valores originales
    const taskId = parseInt(taskCard.dataset.taskId);
    const originalTask = tasks.find(task => task.id === taskId);
    
    if (originalTask) {
        const editTitle = taskEdit.querySelector('.edit-title');
        const editDescription = taskEdit.querySelector('.edit-description');
        
        editTitle.value = originalTask.title;
        editDescription.value = originalTask.description || '';
    }
};

window.saveTask = async function(button) {
    const taskCard = button.closest('.task-card');
    const taskEdit = taskCard.querySelector('.task-edit');
    const editTitle = taskEdit.querySelector('.edit-title');
    const editDescription = taskEdit.querySelector('.edit-description');
    
    const title = editTitle.value.trim();
    const description = editDescription.value.trim();
    
    if (!title) {
        showError('El título es requerido');
        editTitle.focus();
        return;
    }
    
    const taskId = parseInt(taskCard.dataset.taskId);
    
    try {
        // Deshabilitar botón mientras se guarda
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        
        await updateTask(taskId, {
            title: title,
            description: description
        });
        
        // Volver al modo display
        const taskDisplay = taskCard.querySelector('.task-display');
        taskEdit.classList.add('hidden');
        taskDisplay.classList.remove('hidden');
        
    } catch (error) {
        // Error ya manejado en updateTask
    } finally {
        // Restaurar botón
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }
};

window.deleteTask = async function(button) {
    const taskCard = button.closest('.task-card');
    const taskId = parseInt(taskCard.dataset.taskId);
    const taskTitle = taskCard.querySelector('.task-title').textContent;
    
    // Confirmación
    if (!confirm(`¿Estás seguro de que quieres eliminar la tarea "${taskTitle}"?`)) {
        return;
    }
    
    try {
        // Deshabilitar botón mientras se elimina
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        await deleteTaskById(taskId);
        
        // Animar la eliminación
        taskCard.style.opacity = '0';
        taskCard.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            if (taskCard.parentNode) {
                taskCard.parentNode.removeChild(taskCard);
            }
        }, 300);
        
    } catch (error) {
        // Error ya manejado en deleteTaskById
        // Restaurar botón
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-trash"></i>';
    }
};

// Manejo de teclado para mejor UX
document.addEventListener('keydown', function(e) {
    // Escape para cancelar edición
    if (e.key === 'Escape') {
        const editingTask = document.querySelector('.task-edit:not(.hidden)');
        if (editingTask) {
            const cancelBtn = editingTask.querySelector('.btn-cancel');
            if (cancelBtn) cancelBtn.click();
        }
    }
    
    // Ctrl+Enter para guardar en edición
    if (e.ctrlKey && e.key === 'Enter') {
        const editingTask = document.querySelector('.task-edit:not(.hidden)');
        if (editingTask) {
            const saveBtn = editingTask.querySelector('.btn-save');
            if (saveBtn) saveBtn.click();
        }
    }
});

// Auto-resize para textareas
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'TEXTAREA') {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }
});

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
    showError('Ha ocurrido un error inesperado');
});

// Manejo de errores de fetch
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejection:', e.reason);
    showError('Error de conexión');
});

console.log('📝 To-Do List App iniciada correctamente');