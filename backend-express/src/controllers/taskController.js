const { pool } = require('../models/database');

const taskController = {
  // Get all tasks
  async getAllTasks(req, res) {
    try {
      const result = await pool.query('SELECT * FROM tasks ORDER BY task_order ASC, created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  // Create new task
  async createTask(req, res) {
    try {
      const { title, description } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // Get the highest order number and add 1
      const orderResult = await pool.query('SELECT COALESCE(MAX(task_order), 0) + 1 as next_order FROM tasks');
      const nextOrder = orderResult.rows[0].next_order;

      const result = await pool.query(
        'INSERT INTO tasks (title, description, task_order) VALUES ($1, $2, $3) RETURNING *',
        [title, description, nextOrder]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  // Update task
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const result = await pool.query(
        'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *',
        [title, description, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  // Delete task
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      
      const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  },

  // Update task order
  async updateTaskOrder(req, res) {
    try {
      const { orders } = req.body; // Array of { id, order }
      
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        for (const item of orders) {
          await client.query(
            'UPDATE tasks SET task_order = $1 WHERE id = $2',
            [item.order, item.id]
          );
        }
        
        await client.query('COMMIT');
        res.json({ message: 'Task order updated successfully' });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error updating task order:', error);
      res.status(500).json({ error: 'Failed to update task order' });
    }
  }
};

module.exports = taskController;